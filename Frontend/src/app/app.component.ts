import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	standalone: false, // Adicionado explicitamente
})
export class AppComponent {
	title = "Banco IATEC";
}
