import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { SolicitacaoOrcamento } from '../../../models/solicitacao-orcamento.model';
import { getStatusClass, getStatusIcon } from '../../../shared/utils/status.utils';

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

  getStatusClass = getStatusClass;
  getStatusIcon = getStatusIcon;

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
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 403) {
          this.erro = 'Voce nao tem permissao para visualizar este orcamento.';
        } else if (err.status === 404) {
          this.erro = 'Orcamento nao encontrado.';
        } else {
          this.erro = 'Erro ao carregar o orcamento. Tente novamente.';
        }
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/meus-orcamentos']);
  }
}
