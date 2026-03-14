import { Routes } from '@angular/router';
import { TipoEventoListComponent } from '../components/tipo-evento/tipo-evento-list/tipo-evento-list.component';

export const viewerTipoRoutes: Routes = [
  { path: '', component: TipoEventoListComponent, data: { isReadOnlyRole: true } }
];
