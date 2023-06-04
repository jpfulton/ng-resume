import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found-view.component.html',
    styleUrls: ['./not-found-view.component.scss'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class NotFoundViewComponent {

}
