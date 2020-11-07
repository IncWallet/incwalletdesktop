import { Component, OnInit } from '@angular/core';
import { DialogCreateAccountViewModel } from './dialog-create-account.vm';
import { OnDialogAction } from '../../../infrastructure/ui-helper';
import { SharedService } from '../../../infrastructure/_index';
import { AccountClient } from '../../../api-clients/account.client';
import { NbDialogRef } from '@nebular/theme';
import { IsResponseError, GetViewableError } from '../../../infrastructure/common-helper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-dialog-create-account',
  templateUrl: './dialog-create-account.component.html',
  styleUrls: ['./dialog-create-account.component.scss']
})
export class DialogCreateAccountComponent implements OnInit, OnDialogAction {

  vm: DialogCreateAccountViewModel;

  constructor(
    protected ref: NbDialogRef<DialogCreateAccountComponent>,
    protected accountClient: AccountClient,
    private sharedService: SharedService,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  onCancel(event): void {
    this.ref.close();
  }

  async onSubmit(event) {
    this.sharedService.showSpinner();
    const res = await this.accountClient
    .add(
      {
        name: this.vm.accountName,
        passphrase: this.vm.passphrase,
      }
    )
    .toPromise()
    .catch(err => err);

    this.sharedService.hideSpinner();
    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    }

    this.ref.close(!IsResponseError(res));
  }
}
