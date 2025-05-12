import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./modules/auth/auth.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";

// PrimeNG Modules - Adicionar conforme necessário
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";

const routes: Routes = [
	{ path: "login", component: AuthComponent },
	{ path: "dashboard", component: DashboardComponent },
	{ path: "**", redirectTo: "login" },
];

@NgModule({
	declarations: [AppComponent, AuthComponent, DashboardComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot(routes),
		ButtonModule, // Exemplo PrimeNG
		InputTextModule, // Exemplo PrimeNG
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
