import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Movimentacao } from '../../../core/models/movimentacao.model';
import { ContaService } from '../../../core/services/conta.service';

@Component({
    selector: 'app-extrato-conta-cliente',
    templateUrl: './extrato-conta-cliente.component.html',
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, TableModule, ToastModule],
    // styleUrls: ['./extrato-conta-cliente.component.scss'] // Se houver estilos específicos
})
export class ExtratoContaClienteComponent implements OnInit {
    extratoForm!: FormGroup;
    movimentacoes: Movimentacao[] = [];
    loading = false;
    cols: any[];
    contaId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private contaService: ContaService,
        private messageService: MessageService
    ) {
        this.cols = [
            { field: 'data', header: 'Data' },
            { field: 'tipo', header: 'Tipo' },
            { field: 'valor', header: 'Valor' }
        ];
    }

    ngOnInit(): void {
        this.contaId = this.route.snapshot.paramMap.get('id');
        if (!this.contaId) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID da conta não fornecido.' });
            this.router.navigate(['/gerente/dashboard/listar-contas']);
            return;
        }

        this.extratoForm = this.fb.group({
            dataInicio: [null],
            dataFim: [null]
        });
    }

    buscarExtrato(): void {
        if (this.extratoForm.invalid || !this.contaId) {
            return;
        }

        const { dataInicio, dataFim } = this.extratoForm.value;
        if (!dataInicio || !dataFim) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione o período completo.' });
            return;
        }

        this.loading = true;
        this.contaService.getExtratoCliente(this.contaId, dataInicio, dataFim).subscribe({
            next: (data) => {
                this.movimentacoes = data;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar extrato do cliente.' });
                console.error(err);
                this.loading = false;
            }
        });
    }

    voltar(): void {
        this.router.navigate(['/gerente/dashboard/listar-contas']);
    }
}
