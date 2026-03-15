
import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import Swal from 'sweetalert2';

declare const bootstrap: any;

@Component({
  selector: 'app-cliente-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;

  // Filtros
  filtroNome = '';
  filtroTelefone = '';
  filtroStatus = '';

  // Modal Novo Cliente
  @ViewChild('modalNovoClienteEl') modalNovoClienteEl!: ElementRef;
  novoClienteForm = { nome: '', email: '', senha: '' };
  salvandoCliente = false;
  emailJaCadastrado = false;
  private modalNovoClienteInstance: any;

  private clienteService = inject(ClienteService);
  private router = inject(Router);

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.loading = true;
    this.clienteService.buscarTodos().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.loading = false;
        console.log('Clientes carregados:', clientes);
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao carregar clientes:', error);

        let mensagemErro = 'Erro desconhecido';

        if (error.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else if (error.status === 404) {
          mensagemErro = 'Endpoint não encontrado. Verifique a configuração da API.';
        } else if (error.status === 500) {
          mensagemErro = 'Erro interno do servidor.';
        } else if (error.error) {
          mensagemErro = error.error;
        }

        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar clientes',
          text: mensagemErro,
          footer: `Status: ${error.status || 'N/A'}`
        });
      }
    });
  }

  aplicarFiltros() {
    this.loading = true;

    if (this.filtroNome) {
      this.clienteService.buscarPorNome(this.filtroNome).subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro ao buscar clientes',
            text: error.error || 'Erro desconhecido'
          });
        }
      });
    } else if (this.filtroTelefone) {
      this.clienteService.buscarPorTelefone(this.filtroTelefone).subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro ao buscar clientes',
            text: error.error || 'Erro desconhecido'
          });
        }
      });
    } else if (this.filtroStatus) {
      this.clienteService.buscarPorStatus(this.filtroStatus).subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro ao buscar clientes',
            text: error.error || 'Erro desconhecido'
          });
        }
      });
    } else {
      this.carregarClientes();
    }
  }

  novoCliente() {
    this.emailJaCadastrado = false;
    this.novoClienteForm = { nome: '', email: '', senha: '' };
    if (!this.modalNovoClienteInstance) {
      this.modalNovoClienteInstance = new bootstrap.Modal(this.modalNovoClienteEl.nativeElement);
    }
    this.modalNovoClienteInstance.show();
  }

  fecharModalNovoCliente() {
    this.modalNovoClienteInstance?.hide();
  }

  salvarNovoCliente(form: NgForm) {
    if (form.invalid) return;

    this.salvandoCliente = true;
    this.emailJaCadastrado = false;

    this.clienteService.criarClienteAdmin(this.novoClienteForm).subscribe({
      next: () => {
        this.salvandoCliente = false;
        this.fecharModalNovoCliente();
        Swal.fire({
          icon: 'success',
          title: 'Cliente criado!',
          text: `O cliente ${this.novoClienteForm.nome} foi cadastrado com sucesso.`,
          timer: 2500,
          showConfirmButton: false
        });
        this.carregarClientes();
      },
      error: (error) => {
        this.salvandoCliente = false;
        const msg: string = error.error?.erro || error.error || '';

        if (error.status === 400 && msg.toLowerCase().includes('já existente')) {
          this.emailJaCadastrado = true;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao criar cliente',
            text: msg || 'Ocorreu um erro inesperado. Tente novamente.'
          });
        }
      }
    });
  }

  editarCliente(cliente: Cliente) {
    this.router.navigate(['/clientes/editar', cliente.id]);
  }

  excluirCliente(cliente: Cliente) {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente excluir o cliente ${cliente.nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deletar(cliente.id!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cliente excluído!',
              text: 'O cliente foi excluído com sucesso.'
            });
            this.carregarClientes();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao excluir cliente',
              text: error.error || 'Erro desconhecido'
            });
          }
        });
      }
    });
  }

  trackByCliente(index: number, cliente: Cliente): number {
    return cliente.id || index;
  }
}
