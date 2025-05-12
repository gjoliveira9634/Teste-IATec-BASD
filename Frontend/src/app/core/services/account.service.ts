import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export interface Saldo {
	contaId: string;
	saldoAtual: number;
	dataAtualizacao: Date;
}

export interface Movimentacao {
	id: string;
	data: Date;
	tipo: string; // 'DEPOSITO', 'SAQUE', 'TRANSFERENCIA_ENVIADA', 'TRANSFERENCIA_RECEBIDA'
	valor: number;
	descricao?: string;
	contaDestino?: string; // Para transferências
}

export interface Extrato {
	contaId: string;
	movimentacoes: Movimentacao[];
	saldoFinal: number;
}

@Injectable({
	providedIn: "root",
})
export class AccountService {
	private apiUrl = "/api/contas"; // Usando o proxy para o BFF

	constructor(private http: HttpClient) {}

	getSaldo(): Observable<Saldo> {
		// O BFF deve fornecer um endpoint que retorne o saldo da conta do usuário logado
		// Exemplo: GET /api/contas/meu-saldo
		// Por enquanto, mockado:
		console.log("AccountService: getSaldo chamado");
		return of({
			contaId: "mockConta123",
			saldoAtual: 1234.56,
			dataAtualizacao: new Date(),
		}).pipe(
			tap((data) => console.log("Saldo recebido:", data)),
			catchError((err) => {
				console.error("Erro ao buscar saldo", err);
				throw err;
			}),
		);
	}

	getExtratoPorPeriodo(dataInicio: Date, dataFim: Date): Observable<Extrato> {
		// Exemplo: GET /api/contas/meu-extrato?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
		let params = new HttpParams()
			.set("dataInicio", dataInicio.toISOString().split("T")[0])
			.set("dataFim", dataFim.toISOString().split("T")[0]);

		console.log(
			"AccountService: getExtratoPorPeriodo chamado com",
			params.toString(),
		);
		// Mockado:
		const mockMovimentacoes: Movimentacao[] = [
			{
				id: "mov1",
				data: new Date(2025, 4, 10, 10, 0, 0),
				tipo: "DEPOSITO",
				valor: 1000,
				descricao: "Depósito inicial",
			},
			{
				id: "mov2",
				data: new Date(2025, 4, 11, 14, 30, 0),
				tipo: "SAQUE",
				valor: -200,
				descricao: "Saque ATM",
			},
			{
				id: "mov3",
				data: new Date(2025, 4, 12, 9, 15, 0),
				tipo: "TRANSFERENCIA_RECEBIDA",
				valor: 500,
				descricao: "Transferência de Fulano",
				contaDestino: "contaOrigemXYZ",
			},
		];
		return of({
			contaId: "mockConta123",
			movimentacoes: mockMovimentacoes,
			saldoFinal: 1300.0,
		}).pipe(
			tap((data) => console.log("Extrato recebido:", data)),
			catchError((err) => {
				console.error("Erro ao buscar extrato", err);
				throw err;
			}),
		);
	}

	realizarMovimentacao(
		tipo: string,
		valor: number,
		contaDestino?: string,
		descricao?: string,
	): Observable<any> {
		// Exemplo: POST /api/movimentacoes
		const payload = {
			tipoMovimentacao: tipo, // 'DEPOSITO', 'SAQUE', 'TRANSFERENCIA'
			valor: valor,
			idContaDestino: contaDestino, // Opcional, apenas para transferência
			descricao: descricao,
		};
		console.log("AccountService: realizarMovimentacao chamado com", payload);
		// Mockado:
		return of({
			sucesso: true,
			mensagem: "Movimentação realizada com sucesso",
			novoSaldo: 1234.56 - valor,
		}).pipe(
			tap((data) => console.log("Resposta da movimentação:", data)),
			catchError((err) => {
				console.error("Erro ao realizar movimentação", err);
				throw err;
			}),
		);
	}
}
