export interface TipoEvento {
  id?: number;
  nome: string;
  descricao?: string;
  capacidadeMinima: number;
  capacidadeMaxima: number;
  duracaoMedia: number; // em horas
  ativo: boolean;
}

export interface TipoEventoRequest {
  nome: string;
  descricao?: string;
  capacidadeMinima: number;
  capacidadeMaxima: number;
  duracaoMedia: number;
  ativo: boolean;
}