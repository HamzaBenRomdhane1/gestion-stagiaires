import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Notif } from '../../services/notif';
import { Messagerie } from '../../services/messagerie';

@Component({
  selector: 'app-encadrant-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './encadrant-layout.html',
  styleUrl: './encadrant-layout.css'
})
export class EncadrantLayout implements OnInit, OnDestroy {
  utilisateur: any = null;
  messagesNonLus = 0;
  notificationsNonLues = 0;
  private minuteur: any;

  constructor(
    private router: Router,
    private notifService: Notif,
    private messagerie: Messagerie,
    private cdr: ChangeDetectorRef
  ) {
    this.utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
  }

  ngOnInit(): void {
    if (this.utilisateur) {
      this.rafraichir();
      this.minuteur = setInterval(() => this.rafraichir(), 10000);
    }
  }

  ngOnDestroy(): void {
    if (this.minuteur) clearInterval(this.minuteur);
  }

  rafraichir(): void {
    this.notifService.getNotifications(this.utilisateur.id).subscribe({
      next: (data: any) => {
        this.notificationsNonLues = data.filter((n: any) => !n.lu).length;
        this.cdr.detectChanges();
      },
      error: () => {}
    });

    this.messagerie.getNonLus(this.utilisateur.id).subscribe({
      next: (data: any) => {
        this.messagesNonLus = data.reduce((total: number, r: any) => total + Number(r.total), 0);
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  seDeconnecter(): void {
    localStorage.removeItem('utilisateur');
    this.router.navigate(['/login']);
  }
}