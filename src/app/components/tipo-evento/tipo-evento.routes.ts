import { Routes } from '@angular/router';
import { TipoEventoListComponent } from './tipo-evento-list/tipo-evento-list.component';
import { TipoEventoFormComponent } from './tipo-evento-form/tipo-evento-form.component';

export const tipoEventoRoutes: Routes = [
  {
    path: '',
    component: TipoEventoListComponent
  },
  {
    path: 'novo',
    component: TipoEventoFormComponent
  },
  {
    path: 'editar/:id',
    component: TipoEventoFormComponent
  }
];
