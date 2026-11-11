import { Component } from '@angular/core';
import { ListeStagiaires } from '../../components/liste-stagiaires/liste-stagiaires';
import { Encadrants } from '../../components/encadrants/encadrants';
import { Stages } from '../../components/stages/stages';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [ListeStagiaires, Encadrants, Stages],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css'
})
export class AdminPage {}