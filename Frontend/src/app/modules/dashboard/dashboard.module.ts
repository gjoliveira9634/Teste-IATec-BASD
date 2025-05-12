import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { ClientDashboardComponent } from "./client/client-dashboard.component";
import { DashboardComponent } from "./dashboard.component";
import { ManagerDashboardComponent } from "./manager/manager-dashboard.component";
import { ContaFormComponent } from "./shared/conta-form/conta-form.component"; // Componente de formulário

// PrimeNG Modules
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { TooltipModule } from "primeng/tooltip";

const routes: Routes = [
	{
		path: "",
		component: DashboardComponent, // Componente pai do dashboard
		children: [
			{ path: "client", component: ClientDashboardComponent },
			{ path: "manager", component: ManagerDashboardComponent },
			{ path: "", redirectTo: "client", pathMatch: "full" }, // Rota padrão dentro do dashboard
		],
	},
];

@NgModule({
	declarations: [
		DashboardComponent,
		ClientDashboardComponent,
		ManagerDashboardComponent,
		ContaFormComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		ButtonModule,
		CardModule,
		TableModule,
		TabViewModule,
		DialogModule,
		InputTextModule,
		InputNumberModule,
		DropdownModule,
		TooltipModule,
	],
})
export class DashboardModule {}
