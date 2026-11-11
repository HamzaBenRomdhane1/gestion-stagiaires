import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Notif } from '../../services/notif';
import { Messagerie } from '../../services/messagerie';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  @Input() role: string = '';

  utilisateur: any = null;
  notifications: any[] = [];
  messagesNonLus = 0;
  panneauOuvert = false;
  private minuteur: any;

  constructor(
    private router: Router,
    private notifService: Notif,
    private messagerie: Messagerie,
    private cdr: ChangeDetectorRef
  ) {
    this.utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
  }

  // La cloche et le compteur de messages n'apparaissent que pour l'encadrant
  get afficheNotifications(): boolean {
    return this.role === 'Encadrant' && !!this.utilisateur;
  }

  get nonLues(): number {
    return this.notifications.filter((n) => !n.lu).length;
  }

  ngOnInit(): void {
    if (this.afficheNotifications) {
      this.rafraichir();
      this.minuteur = setInterval(() => this.rafraichir(), 10000);
    }
  }

  ngOnDestroy(): void {
    if (this.minuteur) clearInterval(this.minuteur);
  }

  rafraichir(): void {
    this.charger();
    this.chargerMessages();
  }

  charger(): void {
    this.notifService.getNotifications(this.utilisateur.id).subscribe({
      next: (data: any) => {
        this.notifications = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur notifications:', err)
    });
  }

  chargerMessages(): void {
    this.messagerie.getNonLus(this.utilisateur.id).subscribe({
      next: (data: any) => {
        this.messagesNonLus = data.reduce((total: number, r: any) => total + Number(r.total), 0);
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur messages:', err)
    });
  }

  basculerPanneau(): void {
    this.panneauOuvert = !this.panneauOuvert;
    this.cdr.detectChanges();
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

  seDeconnecter(): void {
    localStorage.removeItem('utilisateur');
    this.router.navigate(['/login']);
  }
}