import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stagiaire } from '../../services/stagiaire';
import { Encadrant } from '../../services/encadrant';

@Component({
  selector: 'app-liste-stagiaires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-stagiaires.html',
  styleUrl: './liste-stagiaires.css'
})
export class ListeStagiaires implements OnInit {
  stagiaires: any[] = [];
  encadrants: any[] = [];

  nouveauStagiaire = { nom: '', prenom: '', email: '', telephone: '', password: '' };
  messageAjout = '';
  erreurAjout = '';

  stagiaireEnEdition: any = null;
  stagiaireAffiche: any = null;

  constructor(
    private stagiaireService: Stagiaire,
    private encadrantService: Encadrant,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerStagiaires();
    this.chargerEncadrants();
  }

  chargerStagiaires(): void {
    this.stagiaireService.getStagiaires().subscribe({
      next: (data: any) => {
        this.stagiaires = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  chargerEncadrants(): void {
    this.encadrantService.getEncadrants().subscribe({
      next: (data: any) => {
        this.encadrants = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  ajouterStagiaire(): void {
    this.messageAjout = '';
    this.erreurAjout = '';

    const s = this.nouveauStagiaire;
    if (!s.nom.trim() || !s.prenom.trim() || !s.email.trim()) {
      this.erreurAjout = 'Le nom, le prénom et l\'email sont obligatoires.';
      return;
    }
    if (s.password.length < 6) {
      this.erreurAjout = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    const identifiant = s.email;
    this.stagiaireService.addStagiaire(s).subscribe({
      next: () => {
        this.messageAjout = `Stagiaire créé. Identifiant de connexion : ${identifiant}`;
        this.nouveauStagiaire = { nom: '', prenom: '', email: '', telephone: '', password: '' };
        this.chargerStagiaires();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.erreurAjout = err.error?.error || 'Impossible de créer le stagiaire.';
        this.cdr.detectChanges();
      }
    });
  }

  commencerEdition(stagiaire: any): void {
    this.stagiaireEnEdition = { ...stagiaire };
    this.cdr.detectChanges();
  }

  annulerEdition(): void {
    this.stagiaireEnEdition = null;
    this.cdr.detectChanges();
  }

  sauvegarderEdition(): void {
    this.stagiaireService.updateStagiaire(this.stagiaireEnEdition.id, this.stagiaireEnEdition).subscribe({
      next: () => {
        this.stagiaireEnEdition = null;
        this.chargerStagiaires();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  supprimerStagiaire(id: number): void {
    if (confirm('Supprimer ce stagiaire et son compte de connexion ?')) {
      this.stagiaireService.deleteStagiaire(id).subscribe({
        next: () => this.chargerStagiaires(),
        error: (err: any) => console.error('Erreur:', err)
      });
    }
  }

  accepterDossier(id: number): void {
    this.stagiaireService.updateStatutDossier(id, 'ACCEPTE').subscribe({
      next: () => this.chargerStagiaires(),
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  refuserDossier(id: number): void {
    this.stagiaireService.updateStatutDossier(id, 'REFUSE').subscribe({
      next: () => this.chargerStagiaires(),
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  voirFiche(stagiaire: any): void {
    this.stagiaireAffiche = this.stagiaireAffiche?.id === stagiaire.id ? null : stagiaire;
    this.cdr.detectChanges();
  }

  tirerSujet(id: number): void {
    this.stagiaireService.tirerSujet(id).subscribe({
      next: () => this.chargerStagiaires(),
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  affecterEncadrant(stagiaireId: number, valeur: string): void {
    const encadrantId = valeur ? Number(valeur) : null;
    this.stagiaireService.affecterEncadrant(stagiaireId, encadrantId).subscribe({
      next: () => this.chargerStagiaires(),
      error: (err: any) => console.error('Erreur:', err)
    });
  }
}