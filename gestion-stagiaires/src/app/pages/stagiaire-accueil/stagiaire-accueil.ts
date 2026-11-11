import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Stagiaire } from '../../services/stagiaire';
import { Messagerie } from '../../services/messagerie';
import { Avancement } from '../../services/avancement';

@Component({
  selector: 'app-stagiaire-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stagiaire-accueil.html',
  styleUrl: './stagiaire-accueil.css'
})
export class StagiaireAccueil implements OnInit {
  profil: any = null;
  sujet: any = null;
  encadrant: any = null;
  avancement = 0;
  nbDepots = 0;
  chargement = true;

  constructor(
    private stagiaireService: Stagiaire,
    private messagerie: Messagerie,
    private avancementService: Avancement,
    private cdr: ChangeDetectorRef
  ) {}

  get statutLibelle(): string {
    switch (this.profil?.statut_dossier) {
      case 'ACCEPTE': return 'Accepté';
      case 'REFUSE': return 'Refusé';
      default: return 'En attente';
    }
  }

  get prochaineEtape(): { texte: string; lien: string; bouton: string } {
    const statut = this.profil?.statut_dossier;

    if (statut === 'REFUSE') {
      return {
        texte: "Votre demande a été refusée. Contactez le service RH pour plus d'informations.",
        lien: '',
        bouton: ''
      };
    }
    if (statut !== 'ACCEPTE') {
      return {
        texte: 'Complétez votre profil. Le RH validera ensuite votre dossier.',
        lien: '/stagiaire/profil',
        bouton: 'Compléter mon profil'
      };
    }
    if (!this.sujet) {
      return {
        texte: 'Votre dossier est accepté. Le RH va vous attribuer un sujet de stage et un encadrant.',
        lien: '',
        bouton: ''
      };
    }
    if (this.nbDepots === 0) {
      return {
        texte: "Lisez votre cahier des charges, puis déposez votre premier point d'avancement.",
        lien: '/stagiaire/avancement',
        bouton: 'Déposer un avancement'
      };
    }
    return {
      texte: "Continuez votre travail et déposez régulièrement vos points d'avancement.",
      lien: '/stagiaire/avancement',
      bouton: 'Mon avancement'
    };
  }

  ngOnInit(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (!utilisateur) {
      this.chargement = false;
      return;
    }

    this.stagiaireService.getProfil(utilisateur.id).subscribe({
      next: (profil: any) => {
        this.profil = profil;
        this.chargement = false;
        this.cdr.detectChanges();

        if (profil.sujet_id) {
          this.stagiaireService.getSujet(profil.sujet_id).subscribe({
            next: (sujet: any) => {
              this.sujet = sujet;
              this.cdr.detectChanges();
            },
            error: () => {}
          });
        }

        this.messagerie.getEncadrantDuStagiaire(utilisateur.id).subscribe({
          next: (enc: any) => {
            this.encadrant = enc;
            this.cdr.detectChanges();
          },
          error: () => {}
        });

        this.avancementService.getParStagiaire(profil.id).subscribe({
          next: (depots: any) => {
            this.nbDepots = depots.length;
            this.avancement = depots.length > 0 ? depots[0].pourcentage : 0;
            this.cdr.detectChanges();
          },
          error: () => {}
        });
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}