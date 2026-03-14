import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TipoEventoService } from '../../../services/tipo-evento.service';
import { TipoEvento, TipoEventoRequest } from '../../../models/tipo-evento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-evento-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tipo-evento-form.component.html',
  styleUrl: './tipo-evento-form.component.scss'
})
export class TipoEventoFormComponent implements OnInit {
  tipoEvento: TipoEvento = {
    nome: '',
    descricao: '',
    capacidadeMinima: 10,
    capacidadeMaxima: 50,
    duracaoMedia: 4,
    ativo: true
  };
  
  isEdit = false;
  loading = false;
  id: number | null = null;

  constructor(
    private tipoEventoService: TipoEventoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.id = +idParam;
        this.carregarTipoEvento(this.id);
      }
    });
  }

  carregarTipoEvento(id: number): void {
    this.loading = true;
    this.tipoEventoService.buscarPorId(id).subscribe({
      next: (dados) => {
        this.tipoEvento = dados;
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar tipo de evento:', erro);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível carregar os dados deste tipo de evento.'
        }).then(() => {
          this.router.navigate(['/tipos-evento']);
        });
      }
    });
  }

  salvar(): void {
    this.loading = true;
    
    // Preparar objeto para envio
    const payload: TipoEventoRequest = {
      nome: this.tipoEvento.nome,
      descricao: this.tipoEvento.descricao,
      capacidadeMinima: this.tipoEvento.capacidadeMinima,
      capacidadeMaxima: this.tipoEvento.capacidadeMaxima,
      duracaoMedia: this.tipoEvento.duracaoMedia,
      ativo: this.tipoEvento.ativo
    };

    const operacao = this.isEdit && this.id 
      ? this.tipoEventoService.atualizar(this.id, payload)
      : this.tipoEventoService.salvar(payload);

    operacao.subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Tipo de evento ${this.isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/tipos-evento']);
        });
      },
      error: (erro) => {
        console.error('Erro ao salvar tipo de evento:', erro);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocorreu um erro ao salvar o tipo de evento. Tente novamente.'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/tipos-evento']);
  }
}
