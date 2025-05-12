import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
	standalone: false,
})
export class DashboardComponent implements OnInit {
	userName: string | null = null;
	userProfile: string | null = null;

	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.userName = this.authService.getUserName();
		this.userProfile = this.authService.getUserProfile();

		// Redirecionar para o dashboard específico (cliente ou gerente)
		// Esta lógica pode ser mais robusta, talvez com um guard ou resolver
		if (this.userProfile === "GERENTE") {
			this.router.navigate(["/dashboard/manager"]);
		} else if (this.userProfile === "CLIENTE") {
			this.router.navigate(["/dashboard/client"]);
		} else {
			// Se não tiver perfil, ou perfil desconhecido, volta para login
			this.router.navigate(["/login"]);
		}
	}

	logout(): void {
		this.authService.logout();
		this.router.navigate(["/login"]);
	}
}
