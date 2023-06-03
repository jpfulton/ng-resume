import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-cookie-policy',
    templateUrl: './cookie-policy.component.html',
    styleUrls: ['./cookie-policy.component.scss'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class CookiePolicyComponent {

}
