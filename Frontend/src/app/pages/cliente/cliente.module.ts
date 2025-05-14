import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ClienteDashboardComponent } from './cliente-dashboard/cliente-dashboard.component';
import { ExtratoComponent } from './extrato/extrato.component';
import { MovimentacaoComponent } from './movimentacao/movimentacao.component';
import { SaldoComponent } from './saldo/saldo.component';

// PrimeNG Modules
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

const routes: Routes = [
    {
        path: 'dashboard',
        component: ClienteDashboardComponent,
        children: [
            { path: '', redirectTo: 'saldo', pathMatch: 'full' },
            { path: 'saldo', component: SaldoComponent },
            { path: 'movimentacao', component: MovimentacaoComponent },
            { path: 'extrato', component: ExtratoComponent }
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
        CardModule,
        ButtonModule,
        InputTextModule,
        CalendarModule,
        TableModule,
        DropdownModule,
        InputNumberModule,
        ToastModule,
        PanelModule,
        ClienteDashboardComponent,
        MovimentacaoComponent,
        SaldoComponent,
        ExtratoComponent
    ],
    providers: [MessageService]
})
export class ClienteModule {}
