import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { AuthService } from '../../../services/auth.service';
import { SolicitacaoOrcamento } from '../../../models/solicitacao-orcamento.model';

@Component({
  selector: 'app-customer-orcamentos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-orcamentos-list.component.html',
  styleUrl: './customer-orcamentos-list.component.scss'
})
export class CustomerOrcamentosListComponent implements OnInit {
  
  orcamentos: SolicitacaoOrcamento[] = [];
  loading = true;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos() {
    this.loading = true;
    const user = this.authService.getCurrentUserValue();
    // Idealmente, o backend deve prover uma rota '/api/solicitacoes/meus' que traz os 
    // orçamentos baseados no JWT, mas como workaround (caso a api retorne tudo ou filtre pelo admin),
    // vamos buscar todos e filtrar os que pertencem ao e-mail/cliente deste usuário no frontend:
    
    this.solicitacaoService.buscarTodas().subscribe({
      next: (res: any[]) => {
        // Filtra orçamentos do cliente logado se não for endpoint espedífico "meus":
        // (Ajustar de acordo com a API real. Supondo que filtra por email do cliente)
        if(user && user.email) {
            this.orcamentos = res.filter((s: any) => s.cliente?.email === user.email);
        } else {
            this.orcamentos = [];
        }
        
        // Ordena do mais recente (maior ID ou data de criacao) pro mais antigo
        this.orcamentos.sort((a,b) => (b.id || 0) - (a.id || 0));
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar meus orçamentos', err);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDENTE': return 'bg-warning text-dark';
      case 'APROVADO': return 'bg-success text-white';
      case 'REJEITADO': return 'bg-danger text-white';
      case 'CANCELADO': return 'bg-secondary text-white';
      default: return 'bg-light text-dark';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDENTE': return 'fas fa-clock';
      case 'APROVADO': return 'fas fa-check-circle';
      case 'REJEITADO': return 'fas fa-times-circle';
      case 'CANCELADO': return 'fas fa-ban';
      default: return 'fas fa-info-circle';
    }
  }
}
