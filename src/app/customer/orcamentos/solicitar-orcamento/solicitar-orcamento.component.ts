import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { TipoEvento } from '../../../models/tipo-evento.model';
import { TemaFesta } from '../../../models/tema-festa.model';

import { TipoEventoService } from '../../../services/tipo-evento.service';
import { TemaFestaService } from '../../../services/tema-festa.service';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-solicitar-orcamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-orcamento.component.html',
  styleUrl: './solicitar-orcamento.component.scss'
})
export class SolicitarOrcamentoComponent implements OnInit {
  
  step = 1;
  maxSteps = 4;
  loadingData = true;
  submitting = false;

  tiposEvento: TipoEvento[] = [];
  temas: TemaFesta[] = [];

  // Campos do formulário
  tipoEventoId: number = 0;
  temaFestaId: number | undefined = undefined;
  dataEvento: string = '';
  numeroConvidados: number = 50;
  observacoes: string = '';

  // ID do usuário logado (extraído do JWT)
  usuarioId: number | null = null;

  constructor(
    private tipoEventoService: TipoEventoService,
    private temaService: TemaFestaService,
    private solicitacaoService: SolicitacaoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.authService.getUserId();
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    this.tipoEventoService.buscarAtivos().subscribe((res: TipoEvento[]) => {
      this.tiposEvento = res;
      this.temaService.buscarTodos().subscribe((resTemas: any[]) => {
         this.temas = resTemas.filter((t: any) => t.ativo);
         this.loadingData = false;
      });
    });
  }

  nextStep() {
    if (this.step === 1 && !this.tipoEventoId) {
      Swal.fire('Atenção', 'Selecione um tipo de evento para continuar.', 'warning');
      return;
    }
    if (this.step === 2 && (!this.dataEvento || !this.numeroConvidados)) {
      Swal.fire('Atenção', 'Informe a data do evento e o número de convidados.', 'warning');
      return;
    }
    
    if (this.step < this.maxSteps) {
      this.step++;
      window.scrollTo(0, 0);
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
      window.scrollTo(0, 0);
    }
  }

  selecionarTipo(id: number | undefined) {
    if (id) this.tipoEventoId = id;
  }

  selecionarTema(id: number | undefined) {
    if (id) {
      this.temaFestaId = (this.temaFestaId === id) ? undefined : id;
    }
  }

  // Getter para compatibilidade com o template HTML existente
  get solicitacao() {
    return {
      tipoEventoId: this.tipoEventoId,
      temaFestaId: this.temaFestaId,
      dataEvento: this.dataEvento,
      numeroConvidados: this.numeroConvidados,
      observacoes: this.observacoes
    };
  }

  getTipoNome(): string {
    const t = this.tiposEvento.find(te => te.id === this.tipoEventoId);
    return t ? t.nome : 'Não selecionado';
  }

  getTemaNome(): string {
    if (!this.temaFestaId) return 'Nenhum / Personalizado';
    const t = this.temas.find(tm => tm.id === this.temaFestaId);
    return t ? t.nome : '';
  }

  enviarSolicitacao() {
    this.submitting = true;
    
    // Body no formato que o backend espera (objetos aninhados)
    const body: any = {
      dataEvento: this.dataEvento,
      quantidadeConvidados: this.numeroConvidados,
      tipoEvento: { id: this.tipoEventoId },
      temas: this.temaFestaId ? [{ id: this.temaFestaId }] : []
    };

    if (this.observacoes) {
      body.observacoes = this.observacoes;
    }

    // Inclui o cliente com ID do usuário logado se disponível
    if (this.usuarioId) {
      body.cliente = { id: this.usuarioId };
    }

    this.solicitacaoService.salvar(body).subscribe({
      next: () => {
        this.submitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Solicitação Criada!',
          text: 'Entraremos em contato com o orçamento em breve.',
          confirmButtonColor: '#DB2777'
        }).then(() => {
          this.router.navigate(['/meus-orcamentos']);
        });
      },
      error: (err: any) => {
        console.error(err);
        this.submitting = false;
        Swal.fire('Ops!', 'Ocorreu um erro ao enviar sua solicitação. Tente novamente.', 'error');
      }
    });
  }
}
