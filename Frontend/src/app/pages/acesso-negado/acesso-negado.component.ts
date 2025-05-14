import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-acesso-negado',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `
        <div class="flex flex-column align-items-center justify-content-center" style="min-height: 80vh;">
            <i class="pi pi-ban" style="font-size: 5rem; color: var(--red-500);"></i>
            <h1 class="mt-3">Acesso Negado</h1>
            <p class="mt-2 text-center">Você não tem permissão para acessar esta página.</p>
            <p-button label="Voltar para Login" routerLink="/login" styleClass="mt-4"></p-button>
        </div>
    `
})
export class AcessoNegadoComponent {}
