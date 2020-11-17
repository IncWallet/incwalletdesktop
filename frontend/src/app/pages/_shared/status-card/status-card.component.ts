import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card [ngClass]="{'off': !on}">
      <div (click)="on = !on" class="icon-container">
        <div class="icon status-{{ type }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title h6">{{ title }}</div>
        <div *ngIf="!mash; else mashView">{{ description }}</div>
        <ng-template #mashView>
          <ngx-mash [value]="description"></ngx-mash>
        </ng-template>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() description: string;
  @Input() mash: boolean;
  @Input() type: string;
  @Input() on = true;
}
