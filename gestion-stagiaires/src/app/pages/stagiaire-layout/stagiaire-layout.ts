import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Messagerie } from '../../services/messagerie';

@Component({
  selector: 'app-stagiaire-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './stagiaire-layout.html',
  styleUrl: './stagiaire-layout.css'
})
export class StagiaireLayout implements OnInit, OnDestroy {
  utilisateur: any = null;
  messagesNonLus = 0;
  private minuteur: any;

  constructor(
    private router: Router,
    private messagerie: Messagerie,
    private cdr: ChangeDetectorRef
  ) {
    this.utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
  }

  ngOnInit(): void {
    if (this.utilisateur) {
      this.chargerMessages();
      this.minuteur = setInterval(() => this.chargerMessages(), 10000);
    }
  }

  ngOnDestroy(): void {
    if (this.minuteur) clearInterval(this.minuteur);
  }

  chargerMessages(): void {
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