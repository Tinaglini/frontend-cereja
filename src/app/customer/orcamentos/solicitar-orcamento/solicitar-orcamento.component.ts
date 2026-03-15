import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { TipoEvento } from '../../../models/tipo-evento.model';
import { TemaFesta } from '../../../models/tema-festa.model';
import { SolicitacaoOrcamentoRequest } from '../../../models/solicitacao-orcamento.model';

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

  solicitacao: Partial<SolicitacaoOrcamentoRequest> = {
    tipoEventoId: 0,
    temaFestaId: undefined,
    dataEvento: '',
    numeroConvidados: 50,
    observacoes: '',
    status: 'PENDENTE'
  };

  clienteId: number = 0;

  constructor(
    private tipoEventoService: TipoEventoService,
    private temaService: TemaFestaService,
    private solicitacaoService: SolicitacaoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUserValue();
    if (user && user.id) {
       this.clienteId = user.id; // Assume que o user.id bate com cliente.id (ou precisa buscar num endpoint de perfil)
       this.solicitacao.clienteId = this.clienteId;
    }

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
    if (this.step === 1 && !this.solicitacao.tipoEventoId) {
      Swal.fire('Atenção', 'Selecione um tipo de evento para continuar.', 'warning');
      return;
    }
    if (this.step === 3 && (!this.solicitacao.dataEvento || !this.solicitacao.numeroConvidados)) {
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
    if(id) this.solicitacao.tipoEventoId = id;
  }

  selecionarTema(id: number | undefined) {
    if(id) {
        if(this.solicitacao.temaFestaId === id) {
            this.solicitacao.temaFestaId = undefined; // desmarca
        } else {
            this.solicitacao.temaFestaId = id;
        }
    }
  }

  getTipoNome(): string {
    const t = this.tiposEvento.find(te => te.id === this.solicitacao.tipoEventoId);
    return t ? t.nome : 'Não selecionado';
  }

  getTemaNome(): string {
    if(!this.solicitacao.temaFestaId) return 'Nenhum / Personalizado';
    const t = this.temas.find(tm => tm.id === this.solicitacao.temaFestaId);
    return t ? t.nome : '';
  }

  enviarSolicitacao() {
    if(!this.clienteId) {
       Swal.fire('Erro', 'Usuário não identificado. Faça login novamente.', 'error');
       return;
    }

    this.submitting = true;
    
    const req = this.solicitacao as SolicitacaoOrcamentoRequest;
    
    this.solicitacaoService.salvar(req).subscribe({
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
