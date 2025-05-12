import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export interface AuthResponse {
	token: string;
	perfil: string; // 'CLIENTE' ou 'GERENTE'
	nome: string;
	// Outros dados do usuário que a API possa retornar
}

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private apiUrl = "/api/auth"; // URL base da API de autenticação (via proxy)

	constructor(private http: HttpClient) {}

	login(credentials: any): Observable<AuthResponse> {
		return this.http
			.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
			.pipe(
				tap((response) => {
					// Simulação de armazenamento de token e perfil
					localStorage.setItem("token", response.token);
					localStorage.setItem("userProfile", response.perfil);
					localStorage.setItem("userName", response.nome);
					console.log("Login successful, token and profile stored", response);
				}),
				catchError((error) => {
					console.error("Login failed", error);
					// Retornar um observable de erro para o componente tratar
					throw error;
				}),
			);
	}

	logout(): void {
		localStorage.removeItem("token");
		localStorage.removeItem("userProfile");
		localStorage.removeItem("userName");
		// Adicionar lógica para notificar o BFF/API sobre o logout, se necessário
	}

	isAuthenticated(): boolean {
		return !!localStorage.getItem("token");
	}

	getUserProfile(): string | null {
		return localStorage.getItem("userProfile");
	}

	getUserName(): string | null {
		return localStorage.getItem("userName");
	}

	// Adicionar método para obter o token, se necessário para interceptors HTTP
	getToken(): string | null {
		return localStorage.getItem("token");
	}
}
