import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    MatToolbarModule, 
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("darkModeToggle") darkModeToggle!: MatSlideToggle;
  isHandset = false;

  private breakpointSubscription: Subscription | undefined;

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointSubscription = this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      if (result.matches) {
        this.isHandset = true;
      }
      else {
        this.isHandset = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }
}
