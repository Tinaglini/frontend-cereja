import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnderecoService } from '../../../services/endereco.service';
import { Endereco } from '../../../models/endereco.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-endereco-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './endereco-list.component.html',
  styleUrl: './endereco-list.component.scss'
})
export class EnderecoListComponent implements OnInit {
  enderecos: Endereco[] = [];
  enderecosFiltrados: Endereco[] = [];
  termoBusca = '';
  loading = false;

  constructor(private enderecoService: EnderecoService) { }

  ngOnInit() {
    this.carregarEnderecos();
  }

  carregarEnderecos() {
    this.loading = true;
    this.enderecoService.buscarTodos().subscribe({
      next: (enderecos) => {
        this.enderecos = enderecos;
        this.enderecosFiltrados = enderecos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar endereços:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar endereços',
          text: 'Não foi possível conectar ao backend. Verifique se o servidor está rodando.'
        });
      }
    });
  }

  filtrarEnderecos() {
    if (!this.termoBusca.trim()) {
      this.enderecosFiltrados = this.enderecos;
      return;
    }

    this.enderecosFiltrados = this.enderecos.filter(endereco =>
      endereco.rua.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
      endereco.cidade.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
      endereco.bairro.toLowerCase().includes(this.termoBusca.toLowerCase())
    );
  }

  excluirEndereco(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.enderecoService.excluir(id).subscribe({
          next: () => {
            Swal.fire('Excluído!', 'Endereço excluído com sucesso.', 'success');
            this.carregarEnderecos();
          },
          error: (error) => {
            console.error('Erro ao excluir endereço:', error);
            Swal.fire('Erro!', 'Não foi possível excluir o endereço.', 'error');
          }
        });
      }
    });
  }

  formatarEndereco(endereco: Endereco): string {
    return `${endereco.rua}, ${endereco.numero}${endereco.complemento ? ', ' + endereco.complemento : ''} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado} - CEP: ${endereco.cep}`;
  }
}
