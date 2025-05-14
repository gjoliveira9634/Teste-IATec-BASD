import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Ajuste o caminho conforme necessário
import { AuthResponse } from '../models/auth-response.model';
import { Login } from '../models/login.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`; // Certifique-se que environment.apiUrl está configurado

    constructor(private http: HttpClient) {}

    login(credenciais: Login): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciais);
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout`, {});
    }

    // Adicionar método para refresh token, etc., se necessário
}
