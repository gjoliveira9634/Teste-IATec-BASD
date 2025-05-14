import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { StatusConta } from '../../../core/models/status-conta.enum';
import { ContaService } from '../../../core/services/conta.service';

@Component({
    selector: 'app-gerenciar-conta',
    templateUrl: './gerenciar-conta.component.html',
    // styleUrls: ['./gerenciar-conta.component.scss'],
    standalone: true,
    providers: [MessageService],
    imports: [CardModule, ButtonModule, DropdownModule, InputNumberModule, ToastModule, ReactiveFormsModule, CommonModule]
})
export class GerenciarContaComponent implements OnInit {
    contaForm!: FormGroup;
    isEditMode = false;
    contaId: string | null = null;
    statusOptions: any[];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private contaService: ContaService,
        private messageService: MessageService
    ) {
        this.statusOptions = Object.keys(StatusConta).map((key) => ({
            label: key,
            value: StatusConta[key as keyof typeof StatusConta]
        }));
    }

    ngOnInit(): void {
        this.contaId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.contaId;

        this.contaForm = this.fb.group({
            // Adicionar campos para o formulário de conta, ex: clienteId, tipoConta etc.
            // Se for criação, o saldo inicial pode ser 0 ou um valor definido.
            // Se for edição, o saldo geralmente não é editável diretamente aqui.
            // clienteId: [null, Validators.required], // Exemplo
            saldoInicial: [0, [Validators.required, Validators.min(0)]], // Apenas para criação
            status: [StatusConta.ATIVA, Validators.required] // Default para ATIVA em criação
        });

        if (this.isEditMode && this.contaId) {
            // Carregar dados da conta para edição
            // O campo saldoInicial não faria sentido aqui, ajuste o form
            this.contaForm.removeControl('saldoInicial'); // Ou apenas desabilite

            this.contaService.getClientesContas().subscribe((contas) => {
                const conta = contas.find((c) => c.id === this.contaId);
                if (conta) {
                    this.contaForm.patchValue({
                        status: conta.status
                        // Patch outros campos necessários
                    });
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Conta não encontrada.' });
                    this.router.navigate(['/gerente/dashboard/listar-contas']);
                }
            });
        }
    }

    onSubmit(): void {
        if (this.contaForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Formulário inválido.' });
            return;
        }

        const contaData = this.contaForm.value;

        if (this.isEditMode && this.contaId) {
            // Lógica de atualização (PUT/PATCH)
            // O backend precisaria de um endpoint para atualizar status ou outros dados da conta.
            // Exemplo: this.contaService.atualizarConta(this.contaId, { status: contaData.status })
            // Por ora, o mais comum é inativar pela lista.
            this.messageService.add({ severity: 'info', summary: 'Informação', detail: 'Funcionalidade de edição de status via formulário não implementada. Use a opção "Inativar" na listagem.' });
        } else {
            // Lógica de criação (POST)
            this.contaService.criarConta({ saldo: contaData.saldoInicial /*, outros campos */ }).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta criada!' });
                    this.router.navigate(['/gerente/dashboard/listar-contas']);
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar conta.' });
                    console.error(err);
                }
            });
        }
    }

    voltar(): void {
        this.router.navigate(['/gerente/dashboard/listar-contas']);
    }
}
