import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { PerfilAcesso } from '../../core/models/perfil-acesso.enum';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ButtonModule, CardModule, ToastModule]
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos corretamente.' });
            return;
        }

        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userPerfil', response.usuario.perfil);
                localStorage.setItem('userName', response.usuario.nome); // Guardar nome para exibição

                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado!' });

                if (response.usuario.perfil === PerfilAcesso.CLIENTE) {
                    this.router.navigate(['/cliente/dashboard']);
                } else if (response.usuario.perfil === PerfilAcesso.GERENTE) {
                    this.router.navigate(['/gerente/dashboard']);
                }
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Email ou senha inválidos.' });
                console.error(err);
            }
        });
    }
}
