import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AccountClient } from '../../../api-clients/account.client';
import { DialogPassphraseViewModel, DialogPassphraseEnum } from './dialog-passphrase.vm';
import { SharedService } from '../../../infrastructure/service/shared.service';
import { IsResponseError } from '../../../infrastructure/common-helper';

@Component({
  selector: 'ngx-dialog-passphrase',
  templateUrl: './dialog-passphrase.component.html',
  styleUrls: ['./dialog-passphrase.component.scss']
})
export class DialogPassphraseComponent implements OnInit {

  vm: DialogPassphraseViewModel;

  constructor(protected ref: NbDialogRef<DialogPassphraseComponent>,
    protected accountClient: AccountClient,
    protected sharedService: SharedService) { }

  ngOnInit(): void {
  }

  async onSubmit(event) {
    let res;
    switch (this.vm.target) {
      case DialogPassphraseEnum.switchAccount:
        this.sharedService.showSpinner();
        res = await this.accountClient
        .switch(
          {
            name: this.vm.data.name,
            passphrase: this.vm.passphrase,
          }
        )
        .toPromise()
        .catch(err => err);

        this.sharedService.hideSpinner();
        break;
      case DialogPassphraseEnum.addAccount:
        this.sharedService.showSpinner();
        res = await this.accountClient
        .add(
          {
            name: this.vm.data.name,
            passphrase: this.vm.passphrase,
          }
        )
        .toPromise()
        .catch(err => err);

        this.sharedService.hideSpinner();
        break;
      default:
        this.ref.close(this.vm.passphrase);
        return;
    }

    this.ref.close(!IsResponseError(res));
  }

  onCancel(event) {
    this.ref.close();
  }
}
