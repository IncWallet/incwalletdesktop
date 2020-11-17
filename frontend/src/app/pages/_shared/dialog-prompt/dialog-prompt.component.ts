import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { OnDialogAction } from '../../../infrastructure/ui-helper';

@Component({
  selector: 'ngx-dialog-prompt',
  templateUrl: './dialog-prompt.component.html',
  styleUrls: ['./dialog-prompt.component.scss']
})
export class DialogPromptComponent implements OnInit, OnDialogAction {

  messages: string;

  constructor(protected ref: NbDialogRef<DialogPromptComponent>) { }

  ngOnInit(): void {
  }

  onCancel(event: any): void {
    this.ref.close();
  }

  onSubmit(event: any) {
    this.ref.close(true);
  }
}
