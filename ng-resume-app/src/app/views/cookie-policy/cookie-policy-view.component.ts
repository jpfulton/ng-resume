import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-cookie-policy",
  templateUrl: "./cookie-policy-view.component.html",
  styleUrls: ["./cookie-policy-view.component.scss"],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class CookiePolicyViewComponent {}
