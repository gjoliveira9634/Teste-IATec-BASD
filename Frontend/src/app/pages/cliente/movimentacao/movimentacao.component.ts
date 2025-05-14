import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TipoMovimentacao } from '../../../core/models/tipo-movimentacao.enum';
import { ContaService } from '../../../core/services/conta.service';

@Component({
    selector: 'app-movimentacao',
    templateUrl: './movimentacao.component.html',
    // styleUrls: ['./movimentacao.component.scss']
    imports: [CommonModule, ButtonModule, InputNumberModule, CardModule, ToastModule, DropdownModule, ReactiveFormsModule]
})
export class MovimentacaoComponent implements OnInit {
    movimentacaoForm!: FormGroup;
    tiposMovimentacao: any[];

    constructor(
        private fb: FormBuilder,
        private contaService: ContaService,
        private messageService: MessageService
    ) {
        this.tiposMovimentacao = Object.keys(TipoMovimentacao).map((key) => ({
            label: key,
            value: TipoMovimentacao[key as keyof typeof TipoMovimentacao]
        }));
    }

    ngOnInit(): void {
        this.movimentacaoForm = this.fb.group({
            tipo: [null, Validators.required],
            valor: [null, [Validators.required, Validators.min(0.01)]]
            // contaDestinoId: [null] // Adicionar se o tipo for TRANSFERENCIA
        });

        // this.movimentacaoForm.get('tipo')?.valueChanges.subscribe(tipo => {
        //   const contaDestinoControl = this.movimentacaoForm.get('contaDestinoId');
        //   if (tipo === TipoMovimentacao.TRANSFERENCIA) {
        //     contaDestinoControl?.setValidators(Validators.required);
        //   } else {
        //     contaDestinoControl?.clearValidators();
        //   }
        //   contaDestinoControl?.updateValueAndValidity();
        // });
    }

    onSubmit(): void {
        if (this.movimentacaoForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha o formulário corretamente.' });
            return;
        }

        const movimentacaoData = {
            ...this.movimentacaoForm.value
            // contaId: 'string' // O backend deve pegar o ID da conta do usuário logado
        };

        this.contaService.realizarMovimentacao(movimentacaoData).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação realizada!' });
                this.movimentacaoForm.reset();
                // Adicionar lógica para atualizar saldo ou redirecionar
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao realizar movimentação.' });
                console.error(err);
            }
        });
    }
}
