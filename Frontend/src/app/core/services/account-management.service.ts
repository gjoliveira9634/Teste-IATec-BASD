import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

// Interface para dados de um cliente (pode ser expandida)
export interface ClienteInfo {
	id: string; // ID do usuário/cliente
	nome: string;
	email: string;
	contaId: string;
	saldoConta: number;
	statusConta: "ATIVA" | "INATIVA";
}

// Interface para detalhes de uma conta para o formulário
export interface ContaDetalhes {
	id: string; // ID da Conta
	clienteId: string;
	nomeCliente: string;
	emailCliente: string;
	saldo: number;
	status: "ATIVA" | "INATIVA";
	// Outros campos relevantes para o formulário de conta
}

@Injectable({
	providedIn: "root",
})
export class AccountManagementService {
	private apiUrlContas = "/api/contas"; // API para gerenciamento de contas (BFF)
	private apiUrlUsuarios = "/api/usuarios"; // API para gerenciamento de usuários/pessoas (BFF)

	constructor(private http: HttpClient) {}

	getContaById(contaId: string): Observable<ContaDetalhes> {
		// Simulação: O BFF precisaria de um endpoint que combine dados do cliente e da conta
		// GET /api/contas/{contaId}/detalhes-completos
		console.log(
			`AccountManagementService: getContaById chamado para conta ${contaId}`,
		);
		// Mock:
		if (contaId === "1") {
			return of({
				id: "1",
				clienteId: "user1",
				nomeCliente: "Cliente Exemplo 1 (Detalhes)",
				emailCliente: "cliente1@email.com",
				saldo: 580.5,
				status: "ATIVA" as "ATIVA" | "INATIVA", // Correção aqui
			}).pipe(
				tap((data) => console.log("Detalhes da conta recebidos:", data)),
				catchError((err) => {
					console.error("Erro ao buscar detalhes da conta", err);
					throw err;
				}),
			);
		}
		// Mock para outro ID, se necessário para testes
		return of({
			id: contaId,
			clienteId: `user-${contaId}`,
			nomeCliente: `Cliente Mock Edit ${contaId}`,
			emailCliente: `editmock${contaId}@email.com`,
			saldo: 1500.75, // Saldo não é diretamente editável no form, mas pode ser exibido
			status: "ATIVA" as "ATIVA" | "INATIVA", // Correção aqui
		}).pipe(
			tap((data) => console.log("Detalhes da conta mock recebidos:", data)),
		);
	}

	createConta(dadosConta: any): Observable<any> {
		// O BFF lidaria com a criação do usuário (se novo) e da conta associada
		// POST /api/contas (ou um endpoint específico no BFF que orquestre isso)
		console.log(
			"AccountManagementService: createConta chamado com",
			dadosConta,
		);
		// Mock:
		const novaContaId = `novaConta-${Math.random().toString(36).substr(2, 9)}`;
		return of({
			sucesso: true,
			mensagem: "Conta criada com sucesso!",
			contaId: novaContaId,
			clienteId: `user-${novaContaId}`,
			...dadosConta,
		}).pipe(
			tap((data) => console.log("Resposta da criação de conta:", data)),
			catchError((err) => {
				console.error("Erro ao criar conta", err);
				throw err;
			}),
		);
	}

	updateConta(contaId: string, dadosConta: any): Observable<any> {
		// PUT /api/contas/{contaId}
		// O BFF pode precisar dividir isso em chamadas para User.API e Account.API
		console.log(
			`AccountManagementService: updateConta chamado para conta ${contaId} com`,
			dadosConta,
		);
		// Mock:
		return of({
			sucesso: true,
			mensagem: "Conta atualizada com sucesso!",
			...dadosConta,
		}).pipe(
			tap((data) => console.log("Resposta da atualização de conta:", data)),
			catchError((err) => {
				console.error("Erro ao atualizar conta", err);
				throw err;
			}),
		);
	}

	// Métodos para inativar/ativar conta podem estar aqui ou no ManagerService
	inativarConta(contaId: string): Observable<any> {
		// POST /api/contas/{contaId}/inativar
		console.log(
			`AccountManagementService: inativarConta chamado para ${contaId}`,
		);
		return of({ sucesso: true, mensagem: "Conta inativada com sucesso" }).pipe(
			tap((data) => console.log("Resposta inativarConta:", data)),
			catchError((err) => {
				console.error("Erro ao inativar conta", err);
				throw err;
			}),
		);
	}

	ativarConta(contaId: string): Observable<any> {
		// POST /api/contas/{contaId}/ativar
		console.log(
			`AccountManagementService: ativarConta chamado para ${contaId}`,
		);
		return of({ sucesso: true, mensagem: "Conta ativada com sucesso" }).pipe(
			tap((data) => console.log("Resposta ativarConta:", data)),
			catchError((err) => {
				console.error("Erro ao ativar conta", err);
				throw err;
			}),
		);
	}
}
