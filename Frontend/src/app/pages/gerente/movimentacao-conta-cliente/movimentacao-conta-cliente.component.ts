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
import { TipoMovimentacao } from '../../../core/models/tipo-movimentacao.enum';
import { ContaService } from '../../../core/services/conta.service';

@Component({
    selector: 'app-movimentacao-conta-cliente',
    templateUrl: './movimentacao-conta-cliente.component.html',
    // styleUrls: ['./movimentacao-conta-cliente.component.scss'],
    standalone: true,
    imports: [ToastModule, ButtonModule, DropdownModule, InputNumberModule, CardModule, ReactiveFormsModule, CommonModule]
})
export class MovimentacaoContaClienteComponent implements OnInit {
    movimentacaoForm!: FormGroup;
    tiposMovimentacao: any[];
    contaId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private contaService: ContaService,
        private messageService: MessageService
    ) {
        this.tiposMovimentacao = Object.keys(TipoMovimentacao).map((key) => ({
            label: key,
            value: TipoMovimentacao[key as keyof typeof TipoMovimentacao]
        }));
    }

    ngOnInit(): void {
        this.contaId = this.route.snapshot.paramMap.get('id');
        if (!this.contaId) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID da conta não fornecido.' });
            this.router.navigate(['/gerente/dashboard/listar-contas']);
            return;
        }

        this.movimentacaoForm = this.fb.group({
            tipo: [null, Validators.required],
            valor: [null, [Validators.required, Validators.min(0.01)]]
            // contaDestinoId: [null] // Para transferências
        });
    }

    onSubmit(): void {
        if (this.movimentacaoForm.invalid || !this.contaId) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Formulário inválido ou ID da conta ausente.' });
            return;
        }

        const movimentacaoData = {
            ...this.movimentacaoForm.value,
            contaId: this.contaId
        };

        // O endpoint de movimentação do gerente pode ser diferente ou o mesmo
        // que o do cliente, mas recebendo o contaId explicitamente.
        // Assumindo que o `realizarMovimentacao` do `ContaService` pode ser usado
        // ou um método específico como `realizarMovimentacaoGerente`.
        this.contaService.realizarMovimentacao(movimentacaoData).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação realizada na conta do cliente!' });
                this.movimentacaoForm.reset();
                this.router.navigate(['/gerente/dashboard/listar-contas']);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao realizar movimentação.' });
                console.error(err);
            }
        });
    }

    voltar(): void {
        this.router.navigate(['/gerente/dashboard/listar-contas']);
    }
}
