import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component';

// PrimeNG Modules
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, CardModule, ToastModule, LoginComponent],
    providers: [MessageService]
})
export class LoginModule {}
