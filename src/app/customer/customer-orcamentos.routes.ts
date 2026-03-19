import { Routes } from '@angular/router';
import { CustomerOrcamentosListComponent } from './orcamentos/customer-orcamentos-list/customer-orcamentos-list.component';
import { OrcamentoResumoComponent } from './orcamentos/orcamento-resumo/orcamento-resumo.component';

export const customerOrcamentosRoutes: Routes = [
  { path: '', component: CustomerOrcamentosListComponent },
  { path: ':id/resumo', component: OrcamentoResumoComponent }
];
