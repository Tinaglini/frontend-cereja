export interface Endereco {
  id?: number;
  rua?: string;
  logradouro?: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  clienteId?: number;
  cliente?: { id?: number };
}

export interface EnderecoRequest {
  rua?: string;
  logradouro?: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  clienteId?: number;
}
