import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Conta } from '../../../core/models/conta.model';
import { StatusConta } from '../../../core/models/status-conta.enum';
import { ContaService } from '../../../core/services/conta.service';

@Component({
    selector: 'app-listar-contas',
    templateUrl: './listar-contas.component.html',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [ConfirmDialogModule, ToastModule, ButtonModule, TableModule, TagModule, ToolbarModule, CardModule, PaginatorModule, CommonModule]
})
export class ListarContasComponent implements OnInit {
    contas: Conta[] = [];
    loading = true;
    cols: any[];

    constructor(
        private contaService: ContaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {
        this.cols = [
            { field: 'id', header: 'ID da Conta' },
            // { field: 'nomeCliente', header: 'Cliente' }, // Adicionar se disponível no DTO
            { field: 'saldo', header: 'Saldo' },
            { field: 'status', header: 'Status' },
            { field: 'actions', header: 'Ações' }
        ];
    }

    ngOnInit(): void {
        this.carregarContas();
    }

    carregarContas(): void {
        this.loading = true;
        this.contaService.getClientesContas().subscribe({
            next: (data) => {
                this.contas = data;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar contas.' });
                console.error(err);
                this.loading = false;
            }
        });
    }

    novaConta(): void {
        this.router.navigate(['/gerente/dashboard/gerenciar-conta']);
    }

    editarConta(conta: Conta): void {
        this.router.navigate(['/gerente/dashboard/gerenciar-conta', conta.id]);
    }

    realizarMovimentacao(conta: Conta): void {
        this.router.navigate(['/gerente/dashboard/movimentacao-conta-cliente', conta.id]);
    }

    verExtrato(conta: Conta): void {
        this.router.navigate(['/gerente/dashboard/extrato-conta-cliente', conta.id]);
    }

    inativarConta(conta: Conta): void {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja inativar a conta ${conta.id}?`,
            header: 'Confirmar Inativação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.contaService.inativarConta(conta.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta inativada!' });
                        this.carregarContas(); // Recarregar a lista
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao inativar conta.' });
                        console.error(err);
                    }
                });
            }
        });
    }

    excluirConta(conta: Conta): void {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja EXCLUIR a conta ${conta.id}? Esta ação não pode ser desfeita.`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-trash',
            acceptLabel: 'Sim, Excluir',
            rejectLabel: 'Não',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.contaService.excluirConta(conta.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta excluída!' });
                        this.carregarContas(); // Recarregar a lista
                    },
                    error: (err) => {
                        // Assumindo que o backend retorna um erro específico se a conta não pode ser excluída (ex: tem movimentações)
                        const detail = err.error?.message || 'Falha ao excluir conta. Verifique se ela não possui movimentações.';
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
                        console.error(err);
                    }
                });
            }
        });
    }

    getStatusSeverity(status: StatusConta): string {
        switch (status) {
            case StatusConta.ATIVA:
                return 'success';
            case StatusConta.INATIVA:
                return 'warning';
            default:
                return 'info';
        }
    }
}
