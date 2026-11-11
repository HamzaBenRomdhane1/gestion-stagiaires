import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Messagerie } from '../../services/messagerie';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnChanges, OnDestroy {
  @Input() moiId!: number;
  @Input() contactId!: number;
  @Input() contactNom = '';

  @ViewChild('fil') fil?: ElementRef<HTMLDivElement>;

  messages: any[] = [];
  texte = '';
  private minuteur: any = null;

  constructor(
    private messagerie: Messagerie,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['moiId'] || changes['contactId']) {
      this.arreter();
      this.messages = [];
      if (this.moiId && this.contactId) {
        this.charger(true);
        this.minuteur = setInterval(() => this.charger(false), 5000);
      }
    }
  }

  ngOnDestroy(): void {
    this.arreter();
  }

  private arreter(): void {
    if (this.minuteur) {
      clearInterval(this.minuteur);
      this.minuteur = null;
    }
  }

  charger(descendre: boolean): void {
    this.messagerie.getConversation(this.moiId, this.contactId).subscribe({
      next: (data: any) => {
        const nouveau = data.length !== this.messages.length;
        this.messages = data;
        this.cdr.detectChanges();
        if (descendre || nouveau) this.descendre();

        // Les messages reçus sont marqués comme lus
        if (data.some((m: any) => m.destinataire_id === this.moiId && !m.lu)) {
          this.messagerie.marquerLus(this.moiId, this.contactId).subscribe();
        }
      },
      error: (err: any) => console.error('Erreur messagerie:', err)
    });
  }

  envoyer(): void {
    const contenu = this.texte.trim();
    if (!contenu) return;

    this.messagerie.envoyer(this.moiId, this.contactId, contenu).subscribe({
      next: () => {
        this.texte = '';
        this.charger(true);
      },
      error: (err: any) => console.error('Erreur envoi:', err)
    });
  }

  private descendre(): void {
    setTimeout(() => {
      const el = this.fil?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}