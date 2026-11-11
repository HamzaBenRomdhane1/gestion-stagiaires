import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Encadrant } from '../../services/encadrant';
import { Messagerie } from '../../services/messagerie';
import { Chat } from '../chat/chat';

@Component({
  selector: 'app-mes-stagiaires',
  standalone: true,
  imports: [CommonModule, Chat],
  templateUrl: './mes-stagiaires.html',
  styleUrl: './mes-stagiaires.css'
})
export class MesStagiaires implements OnInit, OnDestroy {
  utilisateur: any = null;
  stagiaires: any[] = [];
  stagiaireAffiche: any = null;
  stagiaireChat: any = null;
  nonLus: { [userId: number]: number } = {};
  chargement = true;
  private minuteur: any = null;

  constructor(
    private encadrantService: Encadrant,
    private messagerie: Messagerie,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (!this.utilisateur) {
      this.chargement = false;
      return;
    }

    this.encadrantService.getMesStagiaires(this.utilisateur.id).subscribe({
      next: (data: any) => {
        this.stagiaires = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });

    this.chargerNonLus();
    this.minuteur = setInterval(() => this.chargerNonLus(), 10000);
  }

  ngOnDestroy(): void {
    if (this.minuteur) clearInterval(this.minuteur);
  }

  chargerNonLus(): void {
    this.messagerie.getNonLus(this.utilisateur.id).subscribe({
      next: (data: any) => {
        const compteur: { [userId: number]: number } = {};
        data.forEach((r: any) => (compteur[r.expediteur_id] = Number(r.total)));
        this.nonLus = compteur;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur non lus:', err)
    });
  }

  voirFiche(stagiaire: any): void {
    this.stagiaireAffiche = this.stagiaireAffiche?.id === stagiaire.id ? null : stagiaire;
    this.cdr.detectChanges();
  }

  ouvrirChat(stagiaire: any): void {
    if (this.stagiaireChat?.id === stagiaire.id) {
      this.stagiaireChat = null;
    } else {
      this.stagiaireChat = stagiaire;
      this.nonLus[stagiaire.user_id] = 0;
    }
    this.cdr.detectChanges();
  }
}