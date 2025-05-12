import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AuthComponent } from "./auth.component";

// PrimeNG Modules
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";

@NgModule({
	declarations: [AuthComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild([
			{ path: "", component: AuthComponent }, // Rota filha para /login
		]),
		ButtonModule,
		InputTextModule,
		CardModule,
		MessageModule,
		MessagesModule,
	],
	exports: [AuthComponent],
})
export class AuthModule {}
