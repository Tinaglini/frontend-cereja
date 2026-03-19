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
  maxSteps = 5;
  loadingData = true;
  submitting = false;

  tiposEvento: TipoEvento[] = [];
  temas: TemaFesta[] = [];

  // Passo 1 — Tipo de Evento
  tipoEventoId: number = 0;

  // Passo 2 — Data e Público
  dataEvento: string = '';
  numeroConvidados: number = 50;

  // Passo 3 — Endereço do Evento
  endereco = {
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  };

  // Passo 4 — Temas e Detalhes
  temasSelecionados: TemaFesta[] = [];
  mostrarInputCustom = false;
  nomeCustom = '';
  sugerindoTema = false;
  observacoes: string = '';

  // ID do usuário logado
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
      this.temaService.buscarAtivos().subscribe((resTemas: TemaFesta[]) => {
        this.temas = resTemas;
        this.loadingData = false;
      });
    });
  }

  nextStep() {
    if (this.step === 1 && !this.tipoEventoId) {
      Swal.fire('Atenção', 'Selecione um tipo de evento para continuar.', 'warning');
      return;
    }
    if (this.step === 2 && (!this.dataEvento?.trim() || this.numeroConvidados == null || this.numeroConvidados < 1)) {
      Swal.fire('Atenção', 'Informe a data do evento e o número de convidados.', 'warning');
      return;
    }
    if (this.step === 3) {
      const end = this.endereco;
      if (!end.rua?.trim() || !end.numero?.trim() || !end.bairro?.trim() ||
          !end.cidade?.trim() || !end.estado?.trim() || !end.cep?.trim()) {
        Swal.fire('Atenção', 'Preencha todos os campos obrigatórios do endereço (Rua, Número, Bairro, Cidade, Estado e CEP).', 'warning');
        return;
      }
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

  temaSelecionado(id: number | undefined): boolean {
    return !!id && this.temasSelecionados.some(t => t.id === id);
  }

  toggleTema(tema: TemaFesta) {
    const idx = this.temasSelecionados.findIndex(t => t.id === tema.id);
    if (idx >= 0) {
      this.temasSelecionados.splice(idx, 1);
    } else {
      this.temasSelecionados.push(tema);
    }
  }

  removerTema(id: number | undefined) {
    if (id) this.temasSelecionados = this.temasSelecionados.filter(t => t.id !== id);
  }

  sugerirTemaCustom() {
    if (!this.nomeCustom.trim()) return;
    this.sugerindoTema = true;
    this.temaService.sugerirTema({ nome: this.nomeCustom.trim() }).subscribe({
      next: (temaCriado) => {
        this.sugerindoTema = false;
        this.temasSelecionados.push(temaCriado);
        this.nomeCustom = '';
        this.mostrarInputCustom = false;
      },
      error: () => {
        this.sugerindoTema = false;
        Swal.fire('Ops!', 'Não foi possível sugerir o tema. Tente novamente.', 'error');
      }
    });
  }

  getTipoNome(): string {
    const t = this.tiposEvento.find(te => te.id === this.tipoEventoId);
    return t ? t.nome : 'Não selecionado';
  }

  getTemasNomes(): string {
    if (this.temasSelecionados.length === 0) return 'Nenhum / Personalizado';
    return this.temasSelecionados.map(t => t.nome).join(', ');
  }

  getEnderecoResumido(): string {
    const e = this.endereco;
    if (!e.rua) return 'Não informado';
    return `${e.rua}, ${e.numero}${e.complemento ? ' ' + e.complemento : ''} — ${e.bairro}, ${e.cidade}/${e.estado}`;
  }

  enviarSolicitacao() {
    this.submitting = true;

    const body: any = {
      dataEvento: this.dataEvento,
      quantidadeConvidados: this.numeroConvidados,
      tipoEvento: { id: this.tipoEventoId },
      temas: this.temasSelecionados.map(t => ({ id: t.id })),
      endereco: { ...this.endereco }
    };

    if (this.observacoes?.trim()) {
      body.observacoes = this.observacoes;
    }

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
        console.error('Erro ao salvar solicitação:', err);
        console.error('Detalhes:', err.error);
        this.submitting = false;
        const msg = err.error?.erro || err.error?.message || 'Ocorreu um erro ao enviar sua solicitação. Tente novamente.';
        Swal.fire('Ops!', msg, 'error');
      }
    });
  }
}
