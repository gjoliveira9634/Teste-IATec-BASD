import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ExtratoContaClienteComponent } from './extrato-conta-cliente/extrato-conta-cliente.component';
import { GerenciarContaComponent } from './gerenciar-conta/gerenciar-conta.component';
import { GerenteDashboardComponent } from './gerente-dashboard/gerente-dashboard.component';
import { ListarContasComponent } from './listar-contas/listar-contas.component';

// PrimeNG Modules
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MovimentacaoContaClienteComponent } from './movimentacao-conta-cliente/movimentacao-conta-cliente.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: GerenteDashboardComponent,
        children: [
            { path: '', redirectTo: 'listar-contas', pathMatch: 'full' },
            { path: 'listar-contas', component: ListarContasComponent },
            { path: 'gerenciar-conta', component: GerenciarContaComponent }, // Para nova conta
            { path: 'gerenciar-conta/:id', component: GerenciarContaComponent }, // Para editar/visualizar conta existente
            { path: 'movimentacao-conta-cliente/:id', component: MovimentacaoContaClienteComponent },
            { path: 'extrato-conta-cliente/:id', component: ExtratoContaClienteComponent }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        ConfirmDialogModule,
        DialogModule,
        DropdownModule,
        InputNumberModule,
        InputTextModule,
        PanelModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        GerenteDashboardComponent,
        ListarContasComponent,
        GerenciarContaComponent,
        ExtratoContaClienteComponent
    ],
    providers: [MessageService, ConfirmationService]
})
export class GerenteModule {}
