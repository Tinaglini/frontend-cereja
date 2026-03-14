import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CustomerGuard } from './guards/customer.guard';
import { CustomerLayoutComponent } from './customer/layout/customer-layout.component';

export const routes: Routes = [
  // Rota de login (pública)
  {
    path: 'login',
    component: LoginComponent
  },
  // Rotas da Área Administrativa
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'clientes',
        loadChildren: () => import('./components/cliente/cliente.routes').then(m => m.clienteRoutes)
      },
      {
        path: 'enderecos',
        loadChildren: () => import('./components/endereco/endereco.routes').then(m => m.enderecoRoutes)
      },
      {
        path: 'temas',
        loadChildren: () => import('./components/tema/tema.routes').then(m => m.temaRoutes)
      },
      {
        path: 'solicitacoes',
        loadChildren: () => import('./components/solicitacao/solicitacao.routes').then(m => m.solicitacaoRoutes)
      },
      {
        path: 'tipos-evento',
        loadChildren: () => import('./components/tipo-evento/tipo-evento.routes').then(m => m.tipoEventoRoutes)
      }
    ]
  },
  // Rotas da Área de Cliente
  {
    path: '',
    component: CustomerLayoutComponent, // Este componente será criado a seguir
    canActivate: [CustomerGuard],
    children: [
      {
        path: 'meus-orcamentos',
        loadChildren: () => import('./customer/customer-orcamentos.routes').then(m => m.customerOrcamentosRoutes) // TODO
      },
      {
        path: 'solicitar-orcamento',
        loadChildren: () => import('./customer/solicitar-orcamento.routes').then(m => m.solicitarOrcamentosRoutes) // TODO
      },
      {
        path: 'cliente/temas',
        loadChildren: () => import('./customer/viewer-tema.routes').then(m => m.viewerTemaRoutes) // TODO
      },
      {
        path: 'cliente/tipos-evento',
        loadChildren: () => import('./customer/viewer-tipo.routes').then(m => m.viewerTipoRoutes) // TODO
      },
      {
        path: 'meu-perfil',
        loadChildren: () => import('./customer/perfil.routes').then(m => m.meuPerfilRoutes) // TODO
      }
    ]
  },
  // Redirecionamento padrão para login
  {
    path: '**',
    redirectTo: '/login'
  }
];
