import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { SolicitacaoOrcamento } from '../../../models/solicitacao-orcamento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitacao-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './solicitacao-list.component.html',
  styleUrl: './solicitacao-list.component.scss'
})
export class SolicitacaoListComponent implements OnInit {
  solicitacoes: SolicitacaoOrcamento[] = [];
  solicitacoesFiltradas: SolicitacaoOrcamento[] = [];
  loading = false;
  
  // Filtros
  termoBusca = '';
  filtroStatus = 'todos';
  ordenacao = 'data-nova';

  constructor(private solicitacaoService: SolicitacaoService) {}

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    this.loading = true;
    this.solicitacaoService.buscarTodas().subscribe({
      next: (dados) => {
        this.solicitacoes = dados;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar solicitações:', erro);
        this.loading = false;

        if (erro.status === 403) {
          Swal.fire({
            icon: 'warning',
            title: 'Sessão desatualizada',
            text: 'Seu token JWT não possui as permissões necessárias. Por favor, faça logout e login novamente para atualizar suas credenciais.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#DB2777'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível carregar as solicitações de orçamento.'
          });
        }
      }
    });
  }

  aplicarFiltros(): void {
    let filtradas = [...this.solicitacoes];

    // Filtro por termo (nome do cliente ou tipo de evento)
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      filtradas = filtradas.filter(s => 
        s.cliente.nome.toLowerCase().includes(termo) || 
        s.tipoEvento.nome.toLowerCase().includes(termo)
      );
    }

    // Filtro por status
    if (this.filtroStatus !== 'todos') {
      filtradas = filtradas.filter(s => s.statusOrcamento === this.filtroStatus);
    }

    // Ordenação
    if (this.ordenacao === 'data-nova') {
      filtradas.sort((a, b) => new Date(b.dataEvento).getTime() - new Date(a.dataEvento).getTime());
    } else if (this.ordenacao === 'data-antiga') {
      filtradas.sort((a, b) => new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime());
    }

    this.solicitacoesFiltradas = filtradas;
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.filtroStatus = 'todos';
    this.ordenacao = 'data-nova';
    this.aplicarFiltros();
  }

  atualizarStatus(solicitacao: SolicitacaoOrcamento, novoStatus: string): void {
    if (!solicitacao.id) return;
    
    this.solicitacaoService.atualizarStatus(solicitacao.id, novoStatus).subscribe({
      next: (atualizada) => {
        const index = this.solicitacoes.findIndex(s => s.id === atualizada.id);
        if (index !== -1) {
          this.solicitacoes[index] = atualizada;
          this.aplicarFiltros();
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Status Atualizado',
          text: `A solicitação foi marcada como ${novoStatus}.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      },
      error: (erro) => {
        console.error('Erro ao atualizar status:', erro);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível atualizar o status da solicitação.'
        });
      }
    });
  }

  excluir(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Isso removerá esta solicitação de orçamento permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.solicitacaoService.excluir(id).subscribe({
          next: () => {
            this.carregarSolicitacoes();
            Swal.fire(
              'Excluído!',
              'A solicitação foi excluída com sucesso.',
              'success'
            );
          },
          error: (erro) => {
            console.error('Erro ao excluir solicitação:', erro);
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Houve um problema ao excluir a solicitação.'
            });
          }
        });
      }
    });
  }
}
