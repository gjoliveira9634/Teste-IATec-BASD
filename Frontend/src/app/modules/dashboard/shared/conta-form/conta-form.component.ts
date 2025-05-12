import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccountManagementService, ContaDetalhes } from '../../../../core/services/account-management.service';

@Component({
	selector: "app-conta-form",
	templateUrl: "./conta-form.component.html",
	styleUrls: ["./conta-form.component.scss"],
      standalone: false
})
export class ContaFormComponent implements OnInit, OnChanges {
	@Input() contaId: string | null = null; // Para carregar dados da conta em modo de edição
	@Output() onSave = new EventEmitter<any>();
	@Output() onCancel = new EventEmitter<void>();

	contaForm!: FormGroup;
	isEditMode: boolean = false;
	statusOptions = [
		{ label: "ATIVA", value: "ATIVA" },
		{ label: "INATIVA", value: "INATIVA" },
	];
	constructor(
		private fb: FormBuilder,
		private accountManagementService: AccountManagementService
	) {}

	ngOnInit(): void {
		this.initForm();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["contaId"] && this.contaId) {
			this.isEditMode = true;
			this.loadContaData(this.contaId);
		} else if (changes["contaId"] && !this.contaId) {
			this.isEditMode = false;
			if (this.contaForm) {
				// Garante que o formulário já foi inicializado
				this.contaForm.reset();
				this.setFormValidators(); // Redefine validadores para modo de criação
			}
		}
	}

	initForm(): void {
		this.contaForm = this.fb.group({
			nomeCliente: ["", Validators.required],
			emailCliente: ["", [Validators.required, Validators.email]],
			senhaCliente: [""], // Validador será adicionado/removido dinamicamente
			saldoInicial: [0, [Validators.required, Validators.min(0)]],
			statusConta: ["ATIVA"], // Padrão para novas contas, visível apenas na edição
		});
		this.setFormValidators();
	}

	setFormValidators(): void {
		const senhaControl = this.contaForm.get("senhaCliente");
		if (this.isEditMode) {
			senhaControl?.clearValidators();
		} else {
			senhaControl?.setValidators([
				Validators.required,
				Validators.minLength(6),
			]);
		}
		senhaControl?.updateValueAndValidity();
	}
	loadContaData(id: string): void {
		console.log("Carregando dados da conta:", id);
		this.accountManagementService.getContaById(id).subscribe({
			next: (conta: ContaDetalhes) => {
				this.contaForm.patchValue({
					nomeCliente: conta.nomeCliente,
					emailCliente: conta.emailCliente,
					saldoInicial: conta.saldo, // Saldo não deve ser editável diretamente na edição
					statusConta: conta.status
				});
				this.setFormValidators(); // Reaplicar validadores após carregar dados
			},
			error: (error) => {
				console.error('Erro ao carregar dados da conta:', error);
				// Adicionar tratamento de erro visual
			}
		});
	}

	podeEditarNome(): boolean {
		// Lógica de permissão: Gerente pode editar nome de cliente?
		return true; // Exemplo
	}

	podeEditarEmail(): boolean {
		// Lógica de permissão: Gerente pode editar email de cliente?
		return true; // Exemplo
	}
	onSubmit(): void {
		if (this.contaForm.valid) {
			const formData = this.contaForm.value;
			console.log("Dados do formulário:", formData);
			
			if (this.isEditMode && this.contaId) {
				// Chamar serviço de atualização
				this.accountManagementService.updateConta(this.contaId, formData).subscribe({
					next: (response) => {
						this.onSave.emit(response);
					},
					error: (error) => {
						console.error('Erro ao atualizar conta:', error);
						// Adicionar tratamento de erro visual
					}
				});
			} else {
				// Chamar serviço de criação
				this.accountManagementService.createConta(formData).subscribe({
					next: (response) => {
						this.onSave.emit(response);
					},
					error: (error) => {
						console.error('Erro ao criar conta:', error);
						// Adicionar tratamento de erro visual
					}
				});
			}
		} else {
			console.error("Formulário inválido");
			// Marcar campos como tocados para exibir erros
			Object.values(this.contaForm.controls).forEach((control) => {
				control.markAsTouched();
			});
		}
	}

	onCancelClick(): void {
		this.onCancel.emit();
	}
}
