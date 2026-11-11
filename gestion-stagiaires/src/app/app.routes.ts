import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { RegisterPage } from './pages/register-page/register-page';
import { AdminPage } from './pages/admin-page/admin-page';
import { StagiaireLayout } from './pages/stagiaire-layout/stagiaire-layout';
import { StagiaireAccueil } from './pages/stagiaire-accueil/stagiaire-accueil';
import { StagiairePage } from './pages/stagiaire-page/stagiaire-page';
import { SujetPage } from './pages/sujet-page/sujet-page';
import { MessageriePage } from './pages/messagerie-page/messagerie-page';
import { AvancementPage } from './pages/avancement-page/avancement-page';
import { EncadrantLayout } from './pages/encadrant-layout/encadrant-layout';
import { EncadrantAccueil } from './pages/encadrant-accueil/encadrant-accueil';
import { EncadrantPage } from './pages/encadrant-page/encadrant-page';
import { EncadrantMessageriePage } from './pages/encadrant-messagerie-page/encadrant-messagerie-page';
import { EncadrantAvancementPage } from './pages/encadrant-avancement-page/encadrant-avancement-page';
import { EncadrantNotificationsPage } from './pages/encadrant-notifications-page/encadrant-notifications-page';
import { RhLayout } from './pages/rh-layout/rh-layout';
import { RhAccueil } from './pages/rh-accueil/rh-accueil';
import { Candidatures } from './components/candidatures/candidatures';
import { ListeStagiaires } from './components/liste-stagiaires/liste-stagiaires';
import { Encadrants } from './components/encadrants/encadrants';
import { CandidaturePage } from './pages/candidature-page/candidature-page';
import { AccueilPage } from './pages/accueil-page/accueil-page';

export const routes: Routes = [
  { path: '', component: AccueilPage },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterPage },
  { path: 'candidature', component: CandidaturePage },
  { path: 'admin', component: AdminPage },
  {
    path: 'stagiaire',
    component: StagiaireLayout,
    children: [
      { path: '', component: StagiaireAccueil },
      { path: 'profil', component: StagiairePage },
      { path: 'sujet', component: SujetPage },
      { path: 'messagerie', component: MessageriePage },
      { path: 'avancement', component: AvancementPage }
    ]
  },
  {
    path: 'encadrant',
    component: EncadrantLayout,
    children: [
      { path: '', component: EncadrantAccueil },
      { path: 'stagiaires', component: EncadrantPage },
      { path: 'avancement', component: EncadrantAvancementPage },
      { path: 'messagerie', component: EncadrantMessageriePage },
      { path: 'notifications', component: EncadrantNotificationsPage }
    ]
  },
  {
    path: 'rh',
    component: RhLayout,
    children: [
      { path: '', component: RhAccueil },
      { path: 'candidatures', component: Candidatures },
      { path: 'stagiaires', component: ListeStagiaires },
      { path: 'encadrants', component: Encadrants }
    ]
  },
  { path: '**', redirectTo: '' }
];