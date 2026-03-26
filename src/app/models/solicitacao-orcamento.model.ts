import { Endereco } from './endereco.model';
import { StatusOrcamento } from '../shared/utils/status.utils';

export interface SolicitacaoOrcamento {
  id?: number;
  cliente: SolicitacaoCliente;
  tipoEvento: SolicitacaoTipoEvento;
  temaFesta?: SolicitacaoTemaFesta;
  temas?: SolicitacaoTemaFesta[];
  dataEvento: Date | string;
  quantidadeConvidados: number;
  precisaMesasCadeiras?: boolean;
  endereco?: Endereco;
  valorPretendido?: number;
  observacoes?: string;
  statusOrcamento: StatusOrcamento;
  valorEstimado?: number;
  dataCriacao?: Date | string;
}

export interface SolicitacaoOrcamentoRequest {
  clienteId?: number;
  tipoEventoId?: number;
  temaFestaId?: number;
  dataEvento: Date | string;
  numeroConvidados?: number;
  observacoes?: string;
  status?: string;
}

export interface SolicitacaoCliente {
  id?: number;
  nome: string;
  email?: string;
  telefone?: string;
  usuario?: { id?: number; login?: string };
}

export interface SolicitacaoTipoEvento {
  id?: number;
  nome: string;
  descricao?: string;
  capacidadeMinima?: number;
  capacidadeMaxima?: number;
}

export interface SolicitacaoTemaFesta {
  id?: number;
  nome: string;
  descricao?: string;
  precoBase?: number;
  ativo: boolean;
}
