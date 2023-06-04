import { Component, Input, ViewEncapsulation } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { NgIf } from '@angular/common';

/**
 * Component to implement a loading spinner.
 */
@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom // keeps component styling separate from globals
    ,
    standalone: true,
    imports: [NgIf]
})
export class SpinnerComponent {
  @Input() message = "";
  
  constructor(public loadingService: LoadingService) {}
}
