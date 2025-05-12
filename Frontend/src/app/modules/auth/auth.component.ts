import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-auth",
	template: `
		<h2>Login</h2>
		<form (ngSubmit)="login()">
			<label
				>Email:
				<input
					[(ngModel)]="email"
					name="email" /></label
			><br />
			<label
				>Senha:
				<input
					type="password"
					[(ngModel)]="senha"
					name="senha" /></label
			><br />
			<button type="submit">Entrar</button>
		</form>
		<p *ngIf="erro">Credenciais inválidas</p>
	`,
})
export class AuthComponent {
	email = "";
	senha = "";
	erro = false;
	constructor(private http: HttpClient, private router: Router) {}
	login() {
		this.http
			.post("/api/auth/login", { email: this.email, senha: this.senha })
			.subscribe({
				next: () => this.router.navigate(["/dashboard"]),
				error: () => (this.erro = true),
			});
	}
}
