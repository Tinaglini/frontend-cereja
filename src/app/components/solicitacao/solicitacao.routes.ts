import { Routes } from '@angular/router';
import { SolicitacaoListComponent } from './solicitacao-list/solicitacao-list.component';
import { SolicitacaoFormComponent } from './solicitacao-form/solicitacao-form.component';

export const solicitacaoRoutes: Routes = [
  {
    path: '',
    component: SolicitacaoListComponent
  },
  {
    path: 'nova',
    component: SolicitacaoFormComponent
  },
  {
    path: 'editar/:id',
    component: SolicitacaoFormComponent
  }
];
