import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Futuramente, importaremos os componentes de login, dashboard do cliente e dashboard do gerente aqui.
// Exemplo:
// import { LoginComponent } from './modules/auth/login/login.component';
// import { ClientDashboardComponent } from './modules/client-dashboard/client-dashboard.component';
// import { ManagerDashboardComponent } from './modules/manager-dashboard/manager-dashboard.component';

const routes: Routes = [
  // Exemplo de rotas (serão implementadas depois):
  // { path: 'login', component: LoginComponent },
  // { path: 'cliente/dashboard', component: ClientDashboardComponent }, // Adicionar AuthGuard depois
  // { path: 'gerente/dashboard', component: ManagerDashboardComponent }, // Adicionar AuthGuard depois
  // { path: '', redirectTo: '/login', pathMatch: 'full' }, // Rota padrão
  // { path: '**', redirectTo: '/login' } // Rota wildcard para páginas não encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
