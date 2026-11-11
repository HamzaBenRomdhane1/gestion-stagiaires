import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Chat } from '../../components/chat/chat';
import { Messagerie } from '../../services/messagerie';

@Component({
  selector: 'app-messagerie-page',
  standalone: true,
  imports: [CommonModule,Chat],
  templateUrl: './messagerie-page.html',
  styleUrl: './messagerie-page.css'
})
export class MessageriePage implements OnInit {
  utilisateur: any = null;
  encadrant: any = null;
  chargement = true;

  constructor(
    private messagerie: Messagerie,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.utilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null');
    if (!this.utilisateur) {
      this.chargement = false;
      return;
    }

    this.messagerie.getEncadrantDuStagiaire(this.utilisateur.id).subscribe({
      next: (data: any) => {
        this.encadrant = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.encadrant = null;
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}