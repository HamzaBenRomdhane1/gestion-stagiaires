const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base :', err);
    return;
  }
  console.log('Connecté à la base de données');
});

// =====================================================
// STAGIAIRES
// =====================================================

// Route GET - récupérer tous les stagiaires (avec sujet et encadrant)
app.get('/api/stagiaires', (req, res) => {
  const sql = `
    SELECT s.*, su.titre AS sujet_titre,
           CONCAT(e.nom, ' ', e.prenom) AS encadrant_nom
    FROM stagiaires s
    LEFT JOIN sujets su ON s.sujet_id = su.id
    LEFT JOIN encadrants e ON s.encadrant_id = e.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// -----------------------------------------------------
// Outils : création d'un compte de connexion
// L'identifiant de connexion est l'email de la personne.
// -----------------------------------------------------
function creerCompte(role, email, motDePasse, res, suite) {
  if (!email || email.length > 50) {
    return res.status(400).json({ error: "L'email est obligatoire (50 caractères maximum)" });
  }
  if (!motDePasse || motDePasse.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  db.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [email, motDePasse, role],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Cet email est déjà utilisé par un autre compte' });
        }
        return res.status(500).json({ error: err.message });
      }
      suite(result.insertId);
    }
  );
}

// Supprime le compte qu'on vient de créer si la fiche n'a pas pu être enregistrée
function annulerCompte(userId) {
  db.query('DELETE FROM users WHERE id = ?', [userId], () => {});
}

// Route POST - ajouter un stagiaire (crée aussi son compte de connexion)
app.post('/api/stagiaires', (req, res) => {
  const { nom, prenom, email, telephone, password } = req.body;
  if (!nom || !nom.trim() || !prenom || !prenom.trim()) {
    return res.status(400).json({ error: 'Le nom et le prénom sont obligatoires' });
  }

  creerCompte('STAGIAIRE', email, password, res, (userId) => {
    const sql = 'INSERT INTO stagiaires (user_id, nom, prenom, email, telephone) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, nom.trim(), prenom.trim(), email, telephone || null], (err, result) => {
      if (err) {
        annulerCompte(userId);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Un stagiaire avec cet email existe déjà' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, user_id: userId });
    });
  });
});

// Route PUT - modifier un stagiaire
app.put('/api/stagiaires/:id', (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, telephone } = req.body;
  const sql = 'UPDATE stagiaires SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE id = ?';
  db.query(sql, [nom, prenom, email, telephone, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, nom, prenom, email, telephone });
  });
});

// Route DELETE - supprimer un stagiaire et son compte de connexion
app.delete('/api/stagiaires/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT user_id FROM stagiaires WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'Stagiaire introuvable' });
    const userId = rows[0].user_id;

    db.query('DELETE FROM stagiaires WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Le compte est supprimé seulement s'il est de rôle STAGIAIRE
      // et qu'aucune autre fiche stagiaire ne l'utilise
      const sql = `
        DELETE FROM users
        WHERE id = ? AND role = 'STAGIAIRE'
          AND NOT EXISTS (SELECT 1 FROM stagiaires WHERE user_id = ?)
      `;
      db.query(sql, [userId, userId], () => {
        res.json({ message: 'Stagiaire supprimé' });
      });
    });
  });
});

// Récupérer le profil d'un stagiaire par son user_id
app.get('/api/stagiaires/profil/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.query('SELECT * FROM stagiaires WHERE user_id = ?', [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Profil non trouvé' });
    res.json(results[0]);
  });
});

// Mettre à jour le profil complet d'un stagiaire
app.put('/api/stagiaires/profil/:id', (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, telephone, date_naissance, adresse, etablissement, filiere, niveau_etude } = req.body;
  const sql = `UPDATE stagiaires SET nom=?, prenom=?, email=?, telephone=?, date_naissance=?, adresse=?, etablissement=?, filiere=?, niveau_etude=? WHERE id=?`;
  db.query(sql, [nom, prenom, email, telephone, date_naissance, adresse, etablissement, filiere, niveau_etude, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Profil mis à jour' });
  });
});

// Mettre à jour le statut du dossier (RH)
app.put('/api/stagiaires/statut/:id', (req, res) => {
  const { id } = req.params;
  const { statut_dossier } = req.body;
  db.query('UPDATE stagiaires SET statut_dossier = ? WHERE id = ?', [statut_dossier, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Statut mis à jour' });
  });
});

// Mettre à jour le dossier complet (CV, CIN, etc.) - stagiaire
app.put('/api/stagiaires/dossier/:id', (req, res) => {
  const { id } = req.params;
  const { cv, cin, departement, lettre_depot, duree_stage, date_debut_stage, date_fin_stage } = req.body;
  const sql = `UPDATE stagiaires SET cv=?, cin=?, departement=?, lettre_depot=?, duree_stage=?, date_debut_stage=?, date_fin_stage=? WHERE id=?`;
  db.query(sql, [cv, cin, departement, lettre_depot, duree_stage, date_debut_stage, date_fin_stage, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Dossier mis à jour' });
  });
});

// Tirage au sort d'un sujet pour un stagiaire (RH)
app.post('/api/stagiaires/:id/tirer-sujet', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM sujets ORDER BY RAND() LIMIT 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Aucun sujet disponible' });
    const sujet = results[0];
    db.query('UPDATE stagiaires SET sujet_id = ? WHERE id = ?', [sujet.id, id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(sujet);
    });
  });
});

// Affecter un encadrant à un stagiaire (RH) + notification pour l'encadrant
app.put('/api/stagiaires/:id/encadrant', (req, res) => {
  const { id } = req.params;
  const { encadrant_id } = req.body;

  db.query('UPDATE stagiaires SET encadrant_id = ? WHERE id = ?', [encadrant_id || null, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Aucun encadrant choisi : rien à notifier
    if (!encadrant_id) return res.json({ message: 'Encadrant retiré' });

    // On retrouve le stagiaire et le compte (user_id) de l'encadrant
    const sql = `
      SELECT s.nom, s.prenom, e.user_id AS encadrant_user_id
      FROM stagiaires s, encadrants e
      WHERE s.id = ? AND e.id = ?
    `;
    db.query(sql, [id, encadrant_id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (rows.length === 0) return res.json({ message: 'Encadrant affecté' });

      const r = rows[0];
      const message = `Nouveau stagiaire affecté : ${r.nom} ${r.prenom}`;
      db.query(
        'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
        [r.encadrant_user_id, message],
        (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: 'Encadrant affecté et notification envoyée' });
        }
      );
    });
  });
});

// =====================================================
// AUTHENTIFICATION
// =====================================================

// Route POST - connexion
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    const user = results[0];
    res.json({ id: user.id, username: user.username, role: user.role });
  });
});

// Route POST - inscription (création de compte)
app.post('/api/register', (req, res) => {
  const { nom, prenom, email, telephone, password } = req.body;
  const sqlUser = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  db.query(sqlUser, [email, password, 'STAGIAIRE'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const userId = result.insertId;
    const sqlStagiaire = 'INSERT INTO stagiaires (user_id, nom, prenom, email, telephone) VALUES (?, ?, ?, ?, ?)';
    db.query(sqlStagiaire, [userId, nom, prenom, email, telephone], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json({ message: 'Compte créé avec succès' });
    });
  });
});

// =====================================================
// ENCADRANTS
// =====================================================

app.get('/api/encadrants', (req, res) => {
  const sql = `
    SELECT e.*, u.username AS identifiant
    FROM encadrants e
    LEFT JOIN users u ON e.user_id = u.id
    ORDER BY e.nom
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/encadrants', (req, res) => {
  const { nom, prenom, email, telephone, departement, specialite, password } = req.body;
  if (!nom || !nom.trim() || !prenom || !prenom.trim()) {
    return res.status(400).json({ error: 'Le nom et le prénom sont obligatoires' });
  }

  creerCompte('ENCADRANT', email, password, res, (userId) => {
    const sql = `
      INSERT INTO encadrants (user_id, nom, prenom, email, telephone, departement, specialite)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const valeurs = [userId, nom.trim(), prenom.trim(), email, telephone || null, departement || null, specialite || null];
    db.query(sql, valeurs, (err, result) => {
      if (err) {
        annulerCompte(userId);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Un encadrant avec cet email existe déjà' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, user_id: userId });
    });
  });
});

app.put('/api/encadrants/:id', (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, telephone, departement, specialite } = req.body;
  const sql = `
    UPDATE encadrants
    SET nom = ?, prenom = ?, email = ?, telephone = ?, departement = ?, specialite = ?
    WHERE id = ?
  `;
  db.query(sql, [nom, prenom, email, telephone || null, departement || null, specialite || null, id], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Un encadrant avec cet email existe déjà' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, nom, prenom, email });
  });
});

app.delete('/api/encadrants/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT user_id FROM encadrants WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'Encadrant introuvable' });
    const userId = rows[0].user_id;

    // Ses stagiaires restent dans l'application, sans encadrant
    db.query('UPDATE stagiaires SET encadrant_id = NULL WHERE encadrant_id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      db.query('DELETE FROM encadrants WHERE id = ?', [id], (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });

        // Le compte est supprimé seulement s'il est de rôle ENCADRANT
        // et qu'aucune autre fiche encadrant ne l'utilise
        const sql = `
          DELETE FROM users
          WHERE id = ? AND role = 'ENCADRANT'
            AND NOT EXISTS (SELECT 1 FROM encadrants WHERE user_id = ?)
        `;
        db.query(sql, [userId, userId], () => {
          res.json({ message: 'Encadrant supprimé' });
        });
      });
    });
  });
});

// Stagiaires affectés à un encadrant (on part du user_id de son compte de connexion)
app.get('/api/encadrants/utilisateur/:user_id/stagiaires', (req, res) => {
  const sql = `
    SELECT s.*, su.titre AS sujet_titre,
      (SELECT a.pourcentage FROM avancements a
        WHERE a.stagiaire_id = s.id
        ORDER BY a.date_depot DESC, a.id DESC LIMIT 1) AS avancement_actuel,
      (SELECT COUNT(*) FROM avancements a WHERE a.stagiaire_id = s.id) AS nb_depots
    FROM stagiaires s
    JOIN encadrants e ON s.encadrant_id = e.id
    LEFT JOIN sujets su ON s.sujet_id = su.id
    WHERE e.user_id = ?
    ORDER BY s.nom
  `;
  db.query(sql, [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// =====================================================
// STAGES
// =====================================================

app.get('/api/stages', (req, res) => {
  db.query('SELECT * FROM stages', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/stages', (req, res) => {
  const { stagiaire_id, encadrant_id, titre, date_debut, date_fin, statut } = req.body;
  const sql = 'INSERT INTO stages (stagiaire_id, encadrant_id, titre, date_debut, date_fin, statut) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [stagiaire_id, encadrant_id, titre, date_debut, date_fin, statut || 'EN_ATTENTE'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, stagiaire_id, encadrant_id, titre, date_debut, date_fin, statut });
  });
});

app.put('/api/stages/:id', (req, res) => {
  const { id } = req.params;
  const { titre, date_debut, date_fin, statut } = req.body;
  const sql = 'UPDATE stages SET titre = ?, date_debut = ?, date_fin = ?, statut = ? WHERE id = ?';
  db.query(sql, [titre, date_debut, date_fin, statut, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, titre, date_debut, date_fin, statut });
  });
});

app.delete('/api/stages/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM stages WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Stage supprimé' });
  });
});

// =====================================================
// CANDIDATURES
// =====================================================

app.get('/api/candidatures', (req, res) => {
  db.query('SELECT * FROM candidatures', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/candidatures', (req, res) => {
  const { nom, prenom, email, telephone, sujet } = req.body;
  const sql = 'INSERT INTO candidatures (nom, prenom, email, telephone, sujet) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nom, prenom, email, telephone, sujet], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nom, prenom, email, telephone, sujet, statut: 'EN_ATTENTE' });
  });
});

app.put('/api/candidatures/:id', (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  db.query('UPDATE candidatures SET statut = ? WHERE id = ?', [statut, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, statut });
  });
});

app.delete('/api/candidatures/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM candidatures WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Candidature supprimée' });
  });
});

// =====================================================
// SUJETS
// =====================================================

// Liste de tous les sujets
app.get('/api/sujets', (req, res) => {
  db.query('SELECT * FROM sujets', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Un sujet précis (pour la page du stagiaire)
app.get('/api/sujets/:id', (req, res) => {
  db.query('SELECT * FROM sujets WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Sujet non trouvé' });
    res.json(results[0]);
  });
});

// =====================================================
// AVANCEMENT DU STAGE (dépôts du stagiaire)
// =====================================================

// Déposer un avancement (stagiaire) + notification pour son encadrant
app.post('/api/avancements', (req, res) => {
  const { stagiaire_id, titre, description, fichier, pourcentage } = req.body;

  if (!titre || !titre.trim()) {
    return res.status(400).json({ error: 'Le titre est obligatoire' });
  }
  const pct = Math.max(0, Math.min(100, parseInt(pourcentage, 10) || 0));

  const sql = 'INSERT INTO avancements (stagiaire_id, titre, description, fichier, pourcentage) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [stagiaire_id, titre.trim(), description || null, fichier || null, pct], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // On cherche l'encadrant du stagiaire pour le prévenir
    const infos = `
      SELECT s.nom, s.prenom, e.user_id AS encadrant_user_id
      FROM stagiaires s
      LEFT JOIN encadrants e ON s.encadrant_id = e.id
      WHERE s.id = ?
    `;
    db.query(infos, [stagiaire_id], (err2, rows) => {
      // Pas d'encadrant affecté : le dépôt est quand même enregistré
      if (err2 || rows.length === 0 || !rows[0].encadrant_user_id) {
        return res.status(201).json({ id: result.insertId });
      }

      const r = rows[0];
      const message = `Nouveau dépôt d'avancement de ${r.nom} ${r.prenom} : ${titre.trim()}`.substring(0, 250);
      db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [r.encadrant_user_id, message], () => {
        res.status(201).json({ id: result.insertId });
      });
    });
  });
});

// Dépôts d'un stagiaire (du plus récent au plus ancien)
app.get('/api/avancements/stagiaire/:stagiaire_id', (req, res) => {
  const sql = 'SELECT * FROM avancements WHERE stagiaire_id = ? ORDER BY date_depot DESC, id DESC';
  db.query(sql, [req.params.stagiaire_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// =====================================================
// MESSAGERIE (stagiaire <-> encadrant)
// =====================================================

// Encadrant d'un stagiaire, à partir du user_id du compte du stagiaire
app.get('/api/stagiaires/utilisateur/:user_id/encadrant', (req, res) => {
  const sql = `
    SELECT e.user_id, e.nom, e.prenom
    FROM stagiaires s
    JOIN encadrants e ON s.encadrant_id = e.id
    WHERE s.user_id = ?
  `;
  db.query(sql, [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Aucun encadrant affecté' });
    res.json(results[0]);
  });
});

// Conversation entre deux comptes (du plus ancien au plus récent)
app.get('/api/messages/conversation/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  const sql = `
    SELECT * FROM messages
    WHERE (expediteur_id = ? AND destinataire_id = ?)
       OR (expediteur_id = ? AND destinataire_id = ?)
    ORDER BY date_envoi ASC, id ASC
  `;
  db.query(sql, [user1, user2, user2, user1], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Envoyer un message
app.post('/api/messages', (req, res) => {
  const { expediteur_id, destinataire_id, contenu } = req.body;
  if (!contenu || !contenu.trim()) {
    return res.status(400).json({ error: 'Le message est vide' });
  }
  const sql = 'INSERT INTO messages (expediteur_id, destinataire_id, contenu) VALUES (?, ?, ?)';
  db.query(sql, [expediteur_id, destinataire_id, contenu.trim()], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

// Marquer comme lus les messages reçus de la part d'un contact
app.put('/api/messages/lire/:user_id/:contact_id', (req, res) => {
  const { user_id, contact_id } = req.params;
  const sql = 'UPDATE messages SET lu = TRUE WHERE destinataire_id = ? AND expediteur_id = ?';
  db.query(sql, [user_id, contact_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Messages lus' });
  });
});

// Nombre de messages non lus reçus par un utilisateur, par expéditeur
app.get('/api/messages/non-lus/:user_id', (req, res) => {
  const sql = `
    SELECT expediteur_id, COUNT(*) AS total
    FROM messages
    WHERE destinataire_id = ? AND lu = FALSE
    GROUP BY expediteur_id
  `;
  db.query(sql, [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// =====================================================
// NOTIFICATIONS
// =====================================================

// Notifications d'un utilisateur (les plus récentes d'abord)
app.get('/api/notifications/:user_id', (req, res) => {
  const sql = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY date_creation DESC, id DESC';
  db.query(sql, [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Marquer une notification comme lue
app.put('/api/notifications/:id/lu', (req, res) => {
  db.query('UPDATE notifications SET lu = TRUE WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Notification lue' });
  });
});

// Marquer toutes les notifications d'un utilisateur comme lues
app.put('/api/notifications/utilisateur/:user_id/lire-tout', (req, res) => {
  db.query('UPDATE notifications SET lu = TRUE WHERE user_id = ?', [req.params.user_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Toutes les notifications sont lues' });
  });
});

// =====================================================
// UPLOAD DE FICHIERS
// =====================================================

// Route d'upload de fichier (CV, lettre d'affectation, etc.)
app.post('/api/upload', upload.single('fichier'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier envoyé' });
  res.json({ chemin: `/uploads/${req.file.filename}` });
});

// =====================================================
// DÉMARRAGE DU SERVEUR (toujours à la fin du fichier)
// =====================================================

app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});