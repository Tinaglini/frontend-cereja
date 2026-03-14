export interface TemaFesta {
  id?: number;
  nome: string;
  descricao?: string;
  corPrincipal: string;
  corSecundaria?: string;
  ativo: boolean;
  precoBase?: number;
}

export interface TemaFestaRequest {
  nome: string;
  descricao?: string;
  corPrincipal: string;
  corSecundaria?: string;
  ativo: boolean;
  precoBase?: number;
}