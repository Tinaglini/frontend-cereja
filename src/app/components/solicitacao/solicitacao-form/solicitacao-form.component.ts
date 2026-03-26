import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { ClienteService } from '../../../services/cliente.service';
import { TipoEventoService } from '../../../services/tipo-evento.service';
import { TemaFestaService } from '../../../services/tema-festa.service';
import { SolicitacaoOrcamento, SolicitacaoOrcamentoRequest } from '../../../models/solicitacao-orcamento.model';
import { Cliente } from '../../../models/cliente.model';
import { TipoEvento } from '../../../models/tipo-evento.model';
import { TemaFesta } from '../../../models/tema-festa.model';
import Swal from 'sweetalert2';

interface SolicitacaoPutPayload {
  dataEvento: Date | string;
  quantidadeConvidados?: number;
  tipoEvento: { id: number };
  endereco: { id: number } | null;
  statusOrcamento?: string;
  observacoes?: string;
  temas?: { id: number }[];
}

@Component({
  selector: 'app-solicitacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './solicitacao-form.component.html',
  styleUrl: './solicitacao-form.component.scss'
})
export class SolicitacaoFormComponent implements OnInit, OnDestroy {
  clientes: Cliente[] = [];
  tiposEvento: TipoEvento[] = [];
  temas: TemaFesta[] = [];

  solicitacaoReq: SolicitacaoOrcamentoRequest = {
    clienteId: 0,
    tipoEventoId: 0,
    temaFestaId: undefined,
    dataEvento: '',
    numeroConvidados: 50,
    observacoes: '',
    status: 'PENDENTE'
  };

  isEdit = false;
  loading = false;
  id: number | null = null;
  solicitacaoOriginal?: SolicitacaoOrcamento;

  private destroy$ = new Subject<void>();

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
    private tipoEventoService: TipoEventoService,
    private temaService: TemaFestaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDominios();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.id = +idParam;
        this.carregarSolicitacao(this.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarDominios(): void {
    this.clienteService.buscarTodos().subscribe(res => this.clientes = res);
    this.tipoEventoService.buscarTodos().subscribe(res => this.tiposEvento = res.filter(t => t.ativo));
    this.temaService.buscarTodos().subscribe(res => this.temas = res.filter(t => t.ativo));
  }

  carregarSolicitacao(id: number): void {
    this.loading = true;
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (dados) => {
        this.solicitacaoOriginal = dados;
        // Transformar Date em string (YYYY-MM-DD para usar no type="date")
        let dataStr = '';
        if(dados.dataEvento) {
           const d = new Date(dados.dataEvento);
           dataStr = d.toISOString().split('T')[0];
        }

        this.solicitacaoReq = {
          clienteId: dados.cliente.id!,
          tipoEventoId: dados.tipoEvento.id!,
          temaFestaId: dados.temaFesta?.id,
          dataEvento: dataStr,
          numeroConvidados: dados.quantidadeConvidados,
          observacoes: dados.observacoes,
          status: dados.statusOrcamento
        };
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar solicitação:', erro);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível carregar os dados deste orçamento.'
        }).then(() => {
          this.router.navigate(['/solicitacoes']);
        });
      }
    });
  }

  salvar(): void {
    if (!this.solicitacaoReq.clienteId || !this.solicitacaoReq.tipoEventoId || !this.solicitacaoReq.dataEvento) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Preencha todos os campos obrigatórios.'
      });
      return;
    }

    this.loading = true;

    let operacao;

    if (this.isEdit && this.id) {
      // O PUT exige objetos aninhados { id } em vez de IDs planos
      const putPayload: SolicitacaoPutPayload = {
        dataEvento: this.solicitacaoReq.dataEvento,
        quantidadeConvidados: this.solicitacaoReq.numeroConvidados,
        tipoEvento: { id: this.solicitacaoReq.tipoEventoId! },
        endereco: this.solicitacaoOriginal?.endereco?.id
          ? { id: this.solicitacaoOriginal.endereco.id }
          : null,
        statusOrcamento: this.solicitacaoReq.status,
        observacoes: this.solicitacaoReq.observacoes,
      };
      if (this.solicitacaoReq.temaFestaId) {
        putPayload.temas = [{ id: this.solicitacaoReq.temaFestaId }];
      }
      operacao = this.solicitacaoService.atualizar(this.id, putPayload);
    } else {
      operacao = this.solicitacaoService.salvar(this.solicitacaoReq);
    }

    operacao.subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: `Orçamento ${this.isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/solicitacoes']);
        });
      },
      error: (erro) => {
        console.error('Erro ao salvar:', erro);
        console.error('Detalhes do erro:', erro.error);
        this.loading = false;
        const campos = erro.error?.campos;
        const detalhe = campos
          ? Object.entries(campos).map(([k, v]) => `${k}: ${v}`).join('\n')
          : (erro.error?.erro || 'Ocorreu um erro ao salvar o orçamento. Tente novamente.');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: detalhe
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/solicitacoes']);
  }
}
