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
  solicitacoes?: any[];
}

export interface Endereco {
  id?: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  cliente?: Cliente;
}
