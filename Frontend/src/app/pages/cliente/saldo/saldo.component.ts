import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Conta } from '../../../core/models/conta.model';
import { ContaService } from '../../../core/services/conta.service';

@Component({
    selector: 'app-saldo',
    templateUrl: './saldo.component.html',
    // styleUrls: ['./saldo.component.scss'] // Se houver estilos específicos
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, TableModule, ToastModule]
})
export class SaldoComponent implements OnInit {
    saldo?: number;
    loading = true;

    constructor(
        private contaService: ContaService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.contaService.getSaldo().subscribe({
            next: (conta: Conta) => {
                this.saldo = conta.saldo;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar o saldo.' });
                console.error(err);
                this.loading = false;
            }
        });
    }
}
