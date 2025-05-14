import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PerfilAcesso } from './core/models/perfil-acesso.enum';
import { AcessoNegadoComponent } from './pages/acesso-negado/acesso-negado.component';

export const appRoutes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule)
    },
    {
        path: 'cliente',
        loadChildren: () => import('./pages/cliente/cliente.module').then((m) => m.ClienteModule),
        canActivate: [AuthGuard],
        data: { perfis: [PerfilAcesso.CLIENTE] }
    },
    {
        path: 'gerente',
        loadChildren: () => import('./pages/gerente/gerente.module').then((m) => m.GerenteModule),
        canActivate: [AuthGuard],
        data: { perfis: [PerfilAcesso.GERENTE] }
    },
    {
        path: 'acesso-negado',
        component: AcessoNegadoComponent
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' } // Pode ser alterado para uma página 404 dedicada no futuro
];
