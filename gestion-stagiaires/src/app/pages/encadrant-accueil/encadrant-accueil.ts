import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Encadrant } from '../../services/encadrant';
import { Notif } from '../../services/notif';
import { Messagerie } from '../../services/messagerie';

@Component({
  selector: 'app-encadrant-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './encadrant-accueil.html',
  styleUrl: './encadrant-accueil.css'
})
export class EncadrantAccueil implements OnInit {
  utilisateur: any = null;
  prenom = '';
  stagiaires: any[] = [];
  notifications: any[] = [];
  messagesNonLus = 0;
  chargement = true;

  constructor(
    private encadrantService: Encadrant,
    private notifService: Notif,
    private messagerie: Messagerie,
    private cdr: ChangeDetectorRef
  ) {}

  get totalDepots(): number {
    return this.stagiaires.reduce((total, s) => total + Number(s.nb_depots || 0), 0);
  }

  get moyenne(): number {
    if (this.stagiaires.length === 0) return 0;
    const somme = this.stagiaires.reduce((total, s) => total + Number(s.avancement_actuel || 0), 0);
    return Math.round(somme / this.stagiaires.length);
  }

  get dernieresNotifications(): any[] {
    return this.notifications.slice(0, 4);
  }

  get notificationsNonLues(): number {
    return this.notifications.filter((n) => !n.lu).length;
  }

  ngOnInit(): void {
    this.utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (!this.utilisateur) {
      this.chargement = false;
      return;
    }
    const id = this.utilisateur.id;

    this.encadrantService.getMesStagiaires(id).subscribe({
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

    // Prénom de l'encadrant, pour le message de bienvenue
    this.encadrantService.getEncadrants().subscribe({
      next: (data: any) => {
        const moi = data.find((e: any) => e.user_id === id);
        if (moi) this.prenom = moi.prenom;
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    this.notifService.getNotifications(id).subscribe({
      next: (data: any) => {
        this.notifications = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    this.messagerie.getNonLus(id).subscribe({
      next: (data: any) => {
        this.messagesNonLus = data.reduce((total: number, r: any) => total + Number(r.total), 0);
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }
}