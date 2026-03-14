import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TipoEventoService } from '../../../services/tipo-evento.service';
import { TipoEvento } from '../../../models/tipo-evento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-evento-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tipo-evento-list.component.html',
  styleUrl: './tipo-evento-list.component.scss'
})
export class TipoEventoListComponent implements OnInit {
  tiposEvento: TipoEvento[] = [];
  tiposFiltrados: TipoEvento[] = [];
  loading = false;
  
  // Filtros
  termoBusca = '';
  filtroStatus = 'todos';
  ordenacao = 'nome';
  isReadOnly = false;

  constructor(
    private tipoEventoService: TipoEventoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isReadOnly = !!data['isReadOnlyRole'];
    });

    this.carregarTiposEvento();
  }

  carregarTiposEvento(): void {
    this.loading = true;
    this.tipoEventoService.buscarTodos().subscribe({
      next: (dados) => {
        this.tiposEvento = dados;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar tipos de evento:', erro);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar os tipos de evento.'
        });
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.tiposEvento];

    // Filtro por termo de busca
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase().trim();
      filtrados = filtrados.filter(t => 
        t.nome.toLowerCase().includes(termo) || 
        (t.descricao && t.descricao.toLowerCase().includes(termo))
      );
    }

    // Filtro por status
    if (this.filtroStatus === 'ativo') {
      filtrados = filtrados.filter(t => t.ativo);
    } else if (this.filtroStatus === 'inativo') {
      filtrados = filtrados.filter(t => !t.ativo);
    }

    // Ordenação
    if (this.ordenacao === 'nome') {
      filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    this.tiposFiltrados = filtrados;
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.filtroStatus = 'todos';
    this.ordenacao = 'nome';
    this.aplicarFiltros();
  }

  toggleStatus(tipo: TipoEvento): void {
    if (!tipo.id) return;
    
    const novoStatus = !tipo.ativo;
    // Tipamos como 'any' pois TypeScript às vezes reclama de exclusão de campos opicionais no spread
    const atualizacao = { ...tipo, ativo: novoStatus };
    delete atualizacao.id;

    this.tipoEventoService.atualizar(tipo.id, atualizacao as any).subscribe({
      next: (atualizado) => {
        const index = this.tiposEvento.findIndex(t => t.id === atualizado.id);
        if (index !== -1) {
          this.tiposEvento[index] = atualizado;
          this.aplicarFiltros();
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Status Atualizado',
          text: `O tipo de evento agora está ${atualizado.ativo ? 'ativo' : 'inativo'}.`,
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
          text: 'Não foi possível atualizar o status do tipo de evento.'
        });
      }
    });
  }

  excluirTipo(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Esta ação não pode ser desfeita e pode afetar solicitações existentes!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.tipoEventoService.excluir(id).subscribe({
          next: () => {
            this.carregarTiposEvento();
            Swal.fire(
              'Excluído!',
              'O tipo de evento foi excluído com sucesso.',
              'success'
            );
          },
          error: (erro) => {
            console.error('Erro ao excluir tipo de evento:', erro);
            this.loading = false;
            
            // Tratamento de erro comum de chave estrangeira
            const isConstraintViolation = erro.status === 409 || 
                                         (erro.error && erro.error.message && erro.error.message.includes('constraint'));
            
            if (isConstraintViolation) {
              Swal.fire({
                icon: 'error',
                title: 'Não é possível excluir',
                text: 'Este tipo de evento está vinculado a solicitações de orçamento. Sugerimos inativá-lo em vez de excluí-lo.'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Houve um problema ao excluir o tipo de evento.'
              });
            }
          }
        });
      }
    });
  }
}
