import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Candidature } from '../../services/candidature';

@Component({
  selector: 'app-rh-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './rh-layout.html',
  styleUrl: './rh-layout.css'
})
export class RhLayout implements OnInit, OnDestroy {
  utilisateur: any = null;
  enAttente = 0;
  private minuteur: any;

  constructor(
    private router: Router,
    private candidatureService: Candidature,
    private cdr: ChangeDetectorRef
  ) {
    this.utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
  }

  ngOnInit(): void {
    this.chargerCompteur();
    this.minuteur = setInterval(() => this.chargerCompteur(), 15000);
  }

  ngOnDestroy(): void {
    if (this.minuteur) clearInterval(this.minuteur);
  }

  chargerCompteur(): void {
    this.candidatureService.getCandidatures().subscribe({
      next: (data: any) => {
        this.enAttente = data.filter((c: any) => c.statut === 'EN_ATTENTE').length;
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