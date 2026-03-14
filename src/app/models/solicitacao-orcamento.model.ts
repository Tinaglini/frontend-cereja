export interface SolicitacaoOrcamento {
  id?: number;
  cliente: Cliente;
  tipoEvento: TipoEvento;
  temaFesta?: TemaFesta;
  dataEvento: Date;
  numeroConvidados: number;
  observacoes?: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'CANCELADO';
  valorEstimado?: number;
  dataSolicitacao?: Date;
}

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
}

export interface TipoEvento {
  id?: number;
  nome: string;
  descricao?: string;
  capacidadeMinima?: number;
  capacidadeMaxima?: number;
}

export interface TemaFesta {
  id?: number;
  nome: string;
  descricao?: string;
  precoBase?: number;
  ativo: boolean;
}
