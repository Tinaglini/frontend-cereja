import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { SolicitacaoOrcamento } from '../../../models/solicitacao-orcamento.model';

@Component({
  selector: 'app-orcamento-resumo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orcamento-resumo.component.html',
  styleUrl: './orcamento-resumo.component.scss'
})
export class OrcamentoResumoComponent implements OnInit {

  solicitacao: SolicitacaoOrcamento | null = null;
  loading = true;
  erro: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitacaoService: SolicitacaoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/meus-orcamentos']);
      return;
    }
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (solicitacao) => {
        this.solicitacao = solicitacao;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 403) {
          this.erro = 'Você não tem permissão para visualizar este orçamento.';
        } else if (err.status === 404) {
          this.erro = 'Orçamento não encontrado.';
        } else {
          this.erro = 'Erro ao carregar o orçamento. Tente novamente.';
        }
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

  voltar(): void {
    this.router.navigate(['/meus-orcamentos']);
  }
}
