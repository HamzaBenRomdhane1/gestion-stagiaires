import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stagiaire } from '../../services/stagiaire';

@Component({
  selector: 'app-stagiaire-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stagiaire-page.html',
  styleUrl: './stagiaire-page.css'
})
export class StagiairePage implements OnInit {
  profil: any = null;
  message = '';
  erreur = false;
  private minuteur: any = null;

  constructor(
    private stagiaireService: Stagiaire,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (utilisateur) {
      this.stagiaireService.getProfil(utilisateur.id).subscribe({
        next: (data: any) => {
          this.profil = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Erreur:', err)
      });
    }
  }

  // Affiche un message flottant pendant 4 secondes
  private afficher(texte: string, erreur = false): void {
    this.message = texte;
    this.erreur = erreur;
    this.cdr.detectChanges();

    if (this.minuteur) clearTimeout(this.minuteur);
    this.minuteur = setTimeout(() => {
      this.message = '';
      this.cdr.detectChanges();
    }, 4000);
  }

  enregistrer(): void {
    this.stagiaireService.updateProfil(this.profil.id, this.profil).subscribe({
      next: () => this.afficher('Profil mis à jour avec succès !'),
      error: () => this.afficher('Erreur lors de la mise à jour', true)
    });
  }

  onCvSelectionne(event: any): void {
    const fichier = event.target.files[0];
    if (fichier) {
      this.stagiaireService.uploadFichier(fichier).subscribe({
        next: (res: any) => {
          this.profil.cv = res.chemin;
          this.afficher('CV téléchargé avec succès');
        },
        error: () => this.afficher("Erreur lors de l'envoi du CV", true)
      });
    }
  }

  onLettreSelectionnee(event: any): void {
    const fichier = event.target.files[0];
    if (fichier) {
      this.stagiaireService.uploadFichier(fichier).subscribe({
        next: (res: any) => {
          this.profil.lettre_depot = res.chemin;
          this.afficher('Lettre téléchargée avec succès');
        },
        error: () => this.afficher("Erreur lors de l'envoi de la lettre", true)
      });
    }
  }

  enregistrerDossier(): void {
    this.stagiaireService.updateDossier(this.profil.id, this.profil).subscribe({
      next: () => this.afficher('Dossier soumis avec succès ! Envoyé au RH pour validation.'),
      error: () => this.afficher('Erreur lors de la soumission', true)
    });
  }
}