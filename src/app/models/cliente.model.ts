import { Endereco } from './endereco.model';

export interface Cliente {
  id?: number;
  nome: string;
  email?: string;
  telefone: string;
  cpf?: string;
  cnpj?: string;
  status?: 'ATIVO' | 'INATIVO';
  statusCadastro?: 'COMPLETO' | 'INCOMPLETO';
  endereco?: Endereco;
  dataCadastro?: Date;
  solicitacoes?: SolicitacaoResumo[];
}

export interface SolicitacaoResumo {
  id?: number;
  statusOrcamento?: string;
  dataEvento?: Date | string;
}
