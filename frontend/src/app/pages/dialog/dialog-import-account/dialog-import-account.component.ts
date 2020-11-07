import { Component, OnInit } from '@angular/core';
import { DialogImportAccountViewModel } from './dialog-import-account.vm';
import { OnDialogAction } from '../../../infrastructure/ui-helper';
import { NbDialogRef } from '@nebular/theme';
import { AccountClient } from '../../../api-clients/account.client';
import { SharedService } from '../../../infrastructure/_index';
import { IsResponseError, GetViewableError } from '../../../infrastructure/common-helper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-dialog-import-account',
  templateUrl: './dialog-import-account.component.html',
  styleUrls: ['./dialog-import-account.component.scss']
})
export class DialogImportAccountComponent implements OnInit, OnDialogAction {

  vm: DialogImportAccountViewModel;

  constructor(
    protected ref: NbDialogRef<DialogImportAccountComponent>,
    protected accountClient: AccountClient,
    protected sharedService: SharedService,
    protected toast: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  onCancel(event: any): void {
    this.ref.close();
  }

  async onSubmit(event: any) {
    this.sharedService.showSpinner();
    const res = await this.accountClient
    .import(
      {
        name: this.vm.accountName,
        passphrase: this.vm.passphrase,
        privatekey: this.vm.privatekey,
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
