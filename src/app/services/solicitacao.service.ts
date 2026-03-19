import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitacaoOrcamento, SolicitacaoOrcamentoRequest } from '../models/solicitacao-orcamento.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  API = environment.SERVIDOR + '/api/solicitacoes';

  constructor(private http: HttpClient) { }

  buscarTodas(): Observable<SolicitacaoOrcamento[]> {
    return this.http.get<SolicitacaoOrcamento[]>(this.API);
  }

  buscarPorId(id: number): Observable<SolicitacaoOrcamento> {
    return this.http.get<SolicitacaoOrcamento>(this.API + '/' + id);
  }

  salvar(solicitacao: SolicitacaoOrcamentoRequest): Observable<SolicitacaoOrcamento> {
    return this.http.post<SolicitacaoOrcamento>(this.API, solicitacao);
  }

  atualizar(id: number, solicitacao: any): Observable<SolicitacaoOrcamento> {
    return this.http.put<SolicitacaoOrcamento>(this.API + '/' + id, solicitacao);
  }

  atualizarStatus(id: number, status: string): Observable<SolicitacaoOrcamento> {
    return this.http.patch<SolicitacaoOrcamento>(this.API + '/' + id + '/status', { status });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(this.API + '/' + id);
  }
}
