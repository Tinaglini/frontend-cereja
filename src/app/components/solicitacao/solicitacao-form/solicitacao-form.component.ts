import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { ClienteService } from '../../../services/cliente.service';
import { TipoEventoService } from '../../../services/tipo-evento.service';
import { TemaFestaService } from '../../../services/tema-festa.service';
import { SolicitacaoOrcamento, SolicitacaoOrcamentoRequest } from '../../../models/solicitacao-orcamento.model';
import { Cliente } from '../../../models/cliente.model';
import { TipoEvento } from '../../../models/tipo-evento.model';
import { TemaFesta } from '../../../models/tema-festa.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './solicitacao-form.component.html',
  styleUrl: './solicitacao-form.component.scss'
})
export class SolicitacaoFormComponent implements OnInit {
  // Dados de domínio para selects
  clientes: Cliente[] = [];
  tiposEvento: TipoEvento[] = [];
  temas: TemaFesta[] = [];

  // Model para o formulário - usamos a request simplificada
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
  
  // Apenas para edição carregar os dados originais se necessário logica avançada
  solicitacaoOriginal?: SolicitacaoOrcamento;

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
    
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.id = +idParam;
        this.carregarSolicitacao(this.id);
      }
    });
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
          numeroConvidados: dados.numeroConvidados,
          observacoes: dados.observacoes,
          status: dados.status
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

    // Converte a data string volta para formato compatível se necessário,
    // garantindo timezone correto (opcional dependendo do backend).

    const operacao = this.isEdit && this.id 
      ? this.solicitacaoService.atualizar(this.id, this.solicitacaoReq)
      : this.solicitacaoService.salvar(this.solicitacaoReq);

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
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocorreu um erro ao salvar o orçamento. Tente novamente.'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/solicitacoes']);
  }
}
