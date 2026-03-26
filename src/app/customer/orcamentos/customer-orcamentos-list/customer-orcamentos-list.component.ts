import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { AuthService } from '../../../services/auth.service';
import { SolicitacaoOrcamento } from '../../../models/solicitacao-orcamento.model';
import { getStatusClass, getStatusIcon } from '../../../shared/utils/status.utils';

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

  getStatusClass = getStatusClass;
  getStatusIcon = getStatusIcon;

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

    this.solicitacaoService.buscarTodas().subscribe({
      next: (res: SolicitacaoOrcamento[]) => {
        if (user?.email) {
          this.orcamentos = res.filter(s => s.cliente?.usuario?.login === user.email);
        } else {
          this.orcamentos = [];
        }

        this.orcamentos.sort((a, b) => (b.id || 0) - (a.id || 0));
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao buscar meus orcamentos', err);
        this.loading = false;
      }
    });
  }
}
