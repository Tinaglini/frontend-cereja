import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent implements OnInit {
  cliente: Cliente = {
    nome: '',
    telefone: '',
    statusCadastro: 'COMPLETO'
  };
  
  loading = false;
  isEditando = false;

  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditando = true;
      this.carregarCliente(Number(id));
    }
  }

  carregarCliente(id: number) {
    this.loading = true;
    this.clienteService.buscarPorId(id).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar cliente',
          text: error.error || 'Erro desconhecido'
        });
      }
    });
  }

  salvar() {
    this.loading = true;
    
    const operacao = this.isEditando 
      ? this.clienteService.atualizar(this.cliente.id!, this.cliente)
      : this.clienteService.salvar(this.cliente);

    operacao.subscribe({
      next: (clienteSalvo) => {
        this.loading = false;
        console.log('Cliente salvo com sucesso:', clienteSalvo);
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Cliente ${this.isEditando ? 'atualizado' : 'criado'} com sucesso!`
        }).then(() => {
          this.router.navigate(['/clientes']);
        });
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao salvar cliente:', error);
        
        let mensagemErro = 'Erro desconhecido';
        
        if (error.error) {
          if (typeof error.error === 'string') {
            mensagemErro = error.error;
          } else if (error.error.message) {
            mensagemErro = error.error.message;
          } else if (error.error.error) {
            mensagemErro = error.error.error;
          }
        } else if (error.message) {
          mensagemErro = error.message;
        } else if (error.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else if (error.status === 404) {
          mensagemErro = 'Endpoint não encontrado. Verifique a configuração da API.';
        } else if (error.status === 500) {
          mensagemErro = 'Erro interno do servidor.';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Erro ao salvar cliente',
          text: mensagemErro,
          footer: `Status: ${error.status || 'N/A'}`
        });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}
