import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../core/services/auth.service";
import { ManagerService, ClienteInfo } from '../../../core/services/manager.service';

@Component({
	selector: "app-manager-dashboard",
	templateUrl: "./manager-dashboard.component.html",
    styleUrls: ["./manager-dashboard.component.scss"],
    standalone: false
})
export class ManagerDashboardComponent implements OnInit {
	userName: string | null = null;	clientes: ClienteInfo[] = []; // Tipado com ClienteInfo
	displayModal: boolean = false;
	modalTitle: string = "Nova Conta";
	selectedContaId: string | null = null; // Para edição
	loading: boolean = false;

	constructor(
		private authService: AuthService,
		private managerService: ManagerService
	) {}

	ngOnInit(): void {
		this.userName = this.authService.getUserName();
		this.loadClientes();
	}
	loadClientes(): void {
		this.loading = true;
		this.managerService.getClientes().subscribe({
			next: (data) => {
				this.clientes = data;
				this.loading = false;
			},
			error: (error) => {
				console.error('Erro ao carregar clientes:', error);
				this.loading = false;
				// Adicionar tratamento de erro visual, como mensagem toast
			}
		});
	}

	abrirModalNovaConta(): void {
		this.selectedContaId = null;
		this.modalTitle = "Criar Nova Conta";
		this.displayModal = true;
	}

	verDetalhesCliente(cliente: any): void {
		console.log("Ver detalhes", cliente);
		// Implementar navegação para uma view de detalhes ou expandir dados na tabela
	}

	editarCliente(cliente: any): void {
		this.selectedContaId = cliente.id; // Ou o ID da conta associada ao cliente
		this.modalTitle = `Editar Conta de ${cliente.nome}`;
		this.displayModal = true;
		console.log("Editar cliente", cliente);
	}
	inativarConta(cliente: ClienteInfo): void {
		console.log("Inativar conta", cliente);
		this.loading = true;
		this.managerService.inativarConta(cliente.contaId).subscribe({
			next: () => {
				// Atualiza o cliente na lista
				const index = this.clientes.findIndex((c) => c.id === cliente.id);
				if (index !== -1) {
					this.clientes[index].status = "INATIVA";
					this.clientes = [...this.clientes]; // Forçar detecção de mudança
				}
				this.loading = false;
			},
			error: (error) => {
				console.error('Erro ao inativar conta:', error);
				this.loading = false;
				// Adicionar tratamento de erro visual
			}
		});
	}

	ativarConta(cliente: ClienteInfo): void {
		console.log("Ativar conta", cliente);
		this.loading = true;
		this.managerService.ativarConta(cliente.contaId).subscribe({
			next: () => {
				// Atualiza o cliente na lista
				const index = this.clientes.findIndex((c) => c.id === cliente.id);
				if (index !== -1) {
					this.clientes[index].status = "ATIVA";
					this.clientes = [...this.clientes]; // Forçar detecção de mudança
				}
				this.loading = false;
			},
			error: (error) => {
				console.error('Erro ao ativar conta:', error);
				this.loading = false;
				// Adicionar tratamento de erro visual
			}
		});
	}

	handleContaSave(event: any): void {
		console.log("Conta salva", event);
		this.displayModal = false;
		this.loadClientes(); // Recarregar lista após salvar
	}
}
