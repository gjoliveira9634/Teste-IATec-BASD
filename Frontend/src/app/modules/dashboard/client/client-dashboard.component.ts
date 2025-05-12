import { Component, OnInit } from "@angular/core";
import {
	AccountService,
	Extrato,
	Movimentacao,
	Saldo,
} from "../../../core/services/account.service"; // Movimentacao adicionada se não estiver lá
import { AuthService } from "../../../core/services/auth.service";

@Component({
	selector: "app-client-dashboard",
	templateUrl: "./client-dashboard.component.html",
	styleUrls: ["./client-dashboard.component.scss"],
	standalone: false,
})
export class ClientDashboardComponent implements OnInit {
	userName: string | null = null;
	saldo: number = 0;
	extrato: Movimentacao[] = []; // Usar o tipo Movimentacao
	dataExtratoInicio: Date = new Date();
	dataExtratoFim: Date = new Date();

	constructor(
		private authService: AuthService,
		private accountService: AccountService,
	) {}

	ngOnInit(): void {
		this.userName = this.authService.getUserName();
		this.loadSaldo();

		const hoje = new Date();
		this.dataExtratoFim = new Date(); // Data final é hoje
		// Define a data de início para 30 dias atrás
		const dataInicioCalculada = new Date();
		dataInicioCalculada.setDate(hoje.getDate() - 30);
		this.dataExtratoInicio = dataInicioCalculada;

		this.loadExtrato(); // Agora o método deve estar definido
	}

	loadSaldo(): void {
		this.accountService.getSaldo().subscribe({
			next: (data: Saldo) => {
				this.saldo = data.saldoAtual;
			},
			error: (err) => {
				console.error("Erro ao carregar saldo", err);
				// Adicionar feedback para o usuário, ex: Toast
			},
		});
	}

	// Adicionar o método loadExtrato que estava faltando
	loadExtrato(): void {
		this.accountService
			.getExtratoPorPeriodo(this.dataExtratoInicio, this.dataExtratoFim)
			.subscribe({
				next: (data: Extrato) => {
					this.extrato = data.movimentacoes;
				},
				error: (err: any) => {
					console.error("Erro ao carregar extrato", err);
					// Adicionar feedback para o usuário, ex: Toast
				},
			});
	}

	// Método para o botão verExtrato que estava causando erro no template
	verExtrato(): void {
		this.loadExtrato();
	}

	formatarData(data: Date): string {
		// Formatar a data para o formato desejado (ex: dd/MM/yyyy)
		const dia = String(data.getDate()).padStart(2, "0");
		const mes = String(data.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
		const ano = data.getFullYear();
		return `${dia}/${mes}/${ano}`;
	}

	// Métodos para realizar movimentações podem ser adicionados aqui
	// Exemplo:
	// realizarDeposito(valor: number): void {
	//   this.accountService.realizarMovimentacao('DEPOSITO', valor).subscribe({
	//     next: (response) => {
	//       console.log('Depósito realizado com sucesso', response);
	//       this.loadSaldo();
	//       this.loadExtrato();
	//       // Adicionar feedback de sucesso para o usuário
	//     },
	//     error: (err) => {
	//       console.error('Falha ao realizar depósito', err);
	//       // Adicionar feedback de erro para o usuário
	//     }
	//   });
	// }
}
