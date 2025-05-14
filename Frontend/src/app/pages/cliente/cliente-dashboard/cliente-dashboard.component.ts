import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-cliente-dashboard',
    templateUrl: './cliente-dashboard.component.html',
    styleUrls: ['./cliente-dashboard.component.scss'],
    imports: [ButtonModule, RouterModule]
})
export class ClienteDashboardComponent implements OnInit {
    userName: string | null = null;
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit(): void {
        this.userName = localStorage.getItem('userName');
    }

    async logout() {
        try {
            await firstValueFrom(this.authService.logout() as any);
        } catch {}
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
