import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-cliente-dashboard',
    templateUrl: './cliente-dashboard.component.html',
    styleUrls: ['./cliente-dashboard.component.scss'],
    imports: [ButtonModule, RouterModule]
})
export class ClienteDashboardComponent implements OnInit {
    userName: string | null = null;

    constructor() {}

    ngOnInit(): void {
        this.userName = localStorage.getItem('userName');
    }

    // Adicionar método de logout se necessário
    logout() {
        localStorage.clear();
        //redirecionar para login
    }
}
