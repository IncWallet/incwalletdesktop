import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../infrastructure/_index';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode [nbSpinner]="loading" nbSpinnerStatus="success" nbSpinnerSize="large">
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements OnInit {
  loading: boolean;

  constructor(
    private sharedService: SharedService,
    ) {
  }

  ngOnInit(): void {
    this.sharedService.onSpinnerChanged().subscribe((data) => this.loading = data.loading);
  }
}
