import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service"; // Será criado depois

@Component({
	selector: "app-auth",
	templateUrl: "./auth.component.html",
	styleUrls: ["./auth.component.scss"],
	standalone: false,
})
export class AuthComponent implements OnInit {
	credentials = { email: "", password: "" };
	errorMessage: string = "";

	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	ngOnInit(): void {}

	onSubmit(): void {
		this.authService.login(this.credentials).subscribe({
			next: (response) => {
				// Salvar token/usuário e redirecionar
				// Exemplo: localStorage.setItem('token', response.token);
				// this.router.navigate(['/dashboard']);
				console.log("Login bem-sucedido", response);
				// Simular redirecionamento baseado no perfil (será melhorado com dados reais da API)
				if (this.credentials.email.includes("gerente")) {
					this.router.navigate(["/dashboard/manager"]); // Rota do gerente
				} else {
					this.router.navigate(["/dashboard/client"]); // Rota do cliente
				}
			},
			error: (err) => {
				this.errorMessage = "Falha no login. Verifique suas credenciais.";
				console.error("Erro no login", err);
			},
		});
	}
}
