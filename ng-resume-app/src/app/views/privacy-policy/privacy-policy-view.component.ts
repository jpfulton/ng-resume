import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy-view.component.html',
    styleUrls: ['./privacy-policy-view.component.scss'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class PrivacyPolicyViewComponent {

}
