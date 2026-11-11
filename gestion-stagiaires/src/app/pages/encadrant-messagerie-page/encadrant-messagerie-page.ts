import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Chat } from '../../components/chat/chat';
import { Encadrant } from '../../services/encadrant';
import { Messagerie } from '../../services/messagerie';

@Component({
  selector: 'app-encadrant-messagerie-page',
  standalone: true,
  imports: [CommonModule,Chat],
  templateUrl: './encadrant-messagerie-page.html',
  styleUrl: './encadrant-messagerie-page.css'
})
export class EncadrantMessageriePage implements OnInit, OnDestroy {
  utilisateur: any = null;
  stagiaires: any[] = [];
  selection: any = null;
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
        if (data.length > 0) this.selection = data[0];
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
        // La conversation ouverte est lue en direct : pas de pastille dessus
        if (this.selection) compteur[this.selection.user_id] = 0;
        this.nonLus = compteur;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur non lus:', err)
    });
  }

  choisir(stagiaire: any): void {
    this.selection = stagiaire;
    this.nonLus[stagiaire.user_id] = 0;
    this.cdr.detectChanges();
  }
}