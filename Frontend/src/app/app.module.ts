import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";

// Módulos da Aplicação
// AuthModule e DashboardModule são carregados via lazy loading nas rotas

const routes: Routes = [
	{
		path: "login",
		loadChildren: () =>
			import("./modules/auth/auth.module").then((m) => m.AuthModule),
	},
	{
		path: "dashboard",
		loadChildren: () =>
			import("./modules/dashboard/dashboard.module").then(
				(m) => m.DashboardModule,
			),
	}, // Rota do dashboard adicionada
	{ path: "", redirectTo: "/login", pathMatch: "full" },
	{ path: "**", redirectTo: "/login" },
];

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		RouterModule.forRoot(routes),
		// AuthModule e DashboardModule não são importados diretamente aqui devido ao lazy loading
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
