import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conta } from '../models/conta.model';
import { Movimentacao } from '../models/movimentacao.model';

@Injectable({
    providedIn: 'root'
})
export class ContaService {
    private apiUrl = `${environment.apiUrl}/contas`;

    constructor(private http: HttpClient) {}

    getSaldo(): Observable<Conta> {
        // Assumindo que há um endpoint para saldo do cliente logado
        return this.http.get<Conta>(`${this.apiUrl}/saldo`);
    }

    getExtrato(periodoDe: Date, periodoAte: Date): Observable<Movimentacao[]> {
        let params = new HttpParams();
        params = params.append('de', periodoDe.toISOString());
        params = params.append('ate', periodoAte.toISOString());
        return this.http.get<Movimentacao[]>(`${this.apiUrl}/extrato`, { params });
    }

    realizarMovimentacao(movimentacao: Partial<Movimentacao>): Observable<any> {
        return this.http.post(`${this.apiUrl}/movimentacoes`, movimentacao);
    }

    // Métodos para Gerente
    getClientesContas(): Observable<Conta[]> {
        return this.http.get<Conta[]>(`${this.apiUrl}/gerente/clientes`);
    }

    getExtratoCliente(contaId: string, periodoDe: Date, periodoAte: Date): Observable<Movimentacao[]> {
        let params = new HttpParams();
        params = params.append('de', periodoDe.toISOString());
        params = params.append('ate', periodoAte.toISOString());
        return this.http.get<Movimentacao[]>(`${this.apiUrl}/gerente/extrato/${contaId}`, { params });
    }

    criarConta(conta: Partial<Conta>): Observable<Conta> {
        return this.http.post<Conta>(`${this.apiUrl}/gerente/criar`, conta);
    }

    inativarConta(contaId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/gerente/inativar/${contaId}`, {});
    }

    excluirConta(contaId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/gerente/excluir/${contaId}`);
    }
}
