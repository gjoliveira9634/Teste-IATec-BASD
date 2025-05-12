import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./modules/auth/auth.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";

const routes: Routes = [
	{ path: "login", component: AuthComponent },
	{ path: "dashboard", component: DashboardComponent },
	{ path: "**", redirectTo: "login" },
];

@NgModule({
	declarations: [AppComponent, AuthComponent, DashboardComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		RouterModule.forRoot(routes),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
