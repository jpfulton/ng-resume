import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-error",
  templateUrl: "./error-view.component.html",
  styleUrls: ["./error-view.component.scss"],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class ErrorViewComponent {}
