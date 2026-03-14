import { Routes } from '@angular/router';
import { TemaListComponent } from '../components/tema/tema-list/tema-list.component';

// Vamos reaproveitar o TemaListComponent mas injetaremos metadata via data
export const viewerTemaRoutes: Routes = [
  { path: '', component: TemaListComponent, data: { isReadOnlyRole: true } }
];
