import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PerfilAcesso } from '../models/perfil-acesso.enum';
import { AuthService } from '../services/auth.service'; // Ajuste o caminho

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Lógica para verificar se o usuário está logado
        // const isLoggedIn = this.authService.isLoggedIn(); // Você precisará implementar isso no AuthService
        const token = localStorage.getItem('authToken'); // Exemplo simples
        const isLoggedIn = !!token;

        if (!isLoggedIn) {
            this.router.navigate(['/login']);
            return false;
        }

        // Verificar perfil de acesso se necessário
        const perfisPermitidos = route.data['perfis'] as Array<PerfilAcesso>;
        if (perfisPermitidos) {
            // const perfilUsuario = this.authService.getPerfilUsuario(); // Você precisará implementar isso
            // Exemplo simplificado, assumindo que o perfil está no localStorage após o login
            const perfilUsuario = localStorage.getItem('userPerfil') as PerfilAcesso;
            if (!perfisPermitidos.includes(perfilUsuario)) {
                this.router.navigate(['/acesso-negado']); // Ou para uma página de erro apropriada
                return false;
            }
        }

        return true;
    }
}
