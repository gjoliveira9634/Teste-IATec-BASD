import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-gerente-dashboard',
    templateUrl: './gerente-dashboard.component.html',
    styleUrls: ['./gerente-dashboard.component.scss'],
    imports: [ButtonModule, RouterModule]
})
export class GerenteDashboardComponent implements OnInit {
    userName: string | null = null;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.userName = localStorage.getItem('userName');
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userPerfil');
        localStorage.removeItem('userName');
        this.router.navigate(['/login']);
    }
}
