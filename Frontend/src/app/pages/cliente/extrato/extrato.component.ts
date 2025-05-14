import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Movimentacao } from '../../../core/models/movimentacao.model';
import { ContaService } from '../../../core/services/conta.service';

@Component({
    selector: 'app-extrato',
    templateUrl: './extrato.component.html',
    styleUrls: ['./extrato.component.scss'],
    imports: [ButtonModule, CardModule, TableModule, ToastModule]
})
export class ExtratoComponent implements OnInit {
    extratoForm!: FormGroup;
    movimentacoes: Movimentacao[] = [];
    loading = false;
    cols: any[];

    constructor(
        private fb: FormBuilder,
        private contaService: ContaService,
        private messageService: MessageService
    ) {
        this.cols = [
            { field: 'data', header: 'Data' },
            { field: 'tipo', header: 'Tipo' },
            { field: 'valor', header: 'Valor' }
            // Adicionar mais colunas se necessário, ex: descrição
        ];
    }

    ngOnInit(): void {
        this.extratoForm = this.fb.group({
            dataInicio: [null],
            dataFim: [null]
        });
        // Carregar extrato inicial ou deixar para o usuário filtrar
    }

    buscarExtrato(): void {
        if (this.extratoForm.invalid) {
            // Pode não ser necessário se os campos não forem obrigatórios
            return;
        }

        const { dataInicio, dataFim } = this.extratoForm.value;

        if (!dataInicio || !dataFim) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione o período completo.' });
            return;
        }

        this.loading = true;
        this.contaService.getExtrato(dataInicio, dataFim).subscribe({
            next: (data) => {
                this.movimentacoes = data;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar extrato.' });
                console.error(err);
                this.loading = false;
            }
        });
    }
}
