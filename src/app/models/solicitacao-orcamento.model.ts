export interface Endereco {
  id?: number;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface SolicitacaoOrcamento {
  id?: number;
  cliente: Cliente;
  tipoEvento: TipoEvento;
  temaFesta?: TemaFesta;
  temas?: TemaFesta[];
  dataEvento: Date | string;
  quantidadeConvidados: number;
  precisaMesasCadeiras?: boolean;
  endereco?: Endereco;
  valorPretendido?: number;
  observacoes?: string;
  statusOrcamento: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'CANCELADO';
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

export interface Cliente {
  id?: number;
  nome: string;
  email?: string;
  telefone?: string;
  usuario?: { id?: number; login?: string };
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
