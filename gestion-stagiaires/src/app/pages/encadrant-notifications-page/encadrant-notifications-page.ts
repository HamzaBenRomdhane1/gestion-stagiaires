import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notif } from '../../services/notif';

@Component({
  selector: 'app-encadrant-notifications-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encadrant-notifications-page.html',
  styleUrl: './encadrant-notifications-page.css'
})
export class EncadrantNotificationsPage implements OnInit, OnDestroy {
  utilisateur: any = null;
  notifications: any[] = [];
  chargement = true;
  private minuteur: any;

  constructor(
    private notifService: Notif,
    private cdr: ChangeDetectorRef
  ) {}

  get nonLues(): number {
    return this.notifications.filter((n) => !n.lu).length;
  }

  ngOnInit(): void {
    this.utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (!this.utilisateur) {
      this.chargement = false;
      return;
    }
    this.charger();
    this.minuteur = setInterval(() => this.charger(), 10000);
  }

  ngOnDestroy(): void {
    if (this.minuteur) clearInterval(this.minuteur);
  }

  charger(): void {
    this.notifService.getNotifications(this.utilisateur.id).subscribe({
      next: (data: any) => {
        this.notifications = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  lire(n: any): void {
    if (n.lu) return;
    this.notifService.marquerLue(n.id).subscribe({
      next: () => {
        n.lu = 1;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }

  toutLire(): void {
    this.notifService.toutMarquerLu(this.utilisateur.id).subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.lu = 1));
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur:', err)
    });
  }
}