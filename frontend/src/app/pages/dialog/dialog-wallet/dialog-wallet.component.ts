import { Component, OnInit } from '@angular/core';
import { DialogWalletViewModel } from './dialog-wallet.vm';
import { NbDialogRef } from '@nebular/theme';
import { WalletClient } from '../../../api-clients/wallet.client';
import { SharedService } from '../../../infrastructure/_index';
import { OnDialogAction } from '../../../infrastructure/ui-helper';
import { IsResponseError, GetViewableError } from '../../../infrastructure/common-helper';
import { DropDownItem } from '../../../api-clients/_index';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-dialog-wallet',
  templateUrl: './dialog-wallet.component.html',
  styleUrls: ['./dialog-wallet.component.scss']
})
export class DialogWalletComponent implements OnInit, OnDialogAction {
  vm: DialogWalletViewModel;

  constructor(
    protected ref: NbDialogRef<DialogWalletComponent>,
    protected walletClient: WalletClient,
    protected sharedService: SharedService,
    protected toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vm.networks.push(new DropDownItem('testnet', 'testnet'));
    this.vm.networks.push(new DropDownItem('mainnet', 'mainnet'));
    this.vm.networks.push(new DropDownItem('local', 'local'));

    this.vm.securities.push(new DropDownItem('256', '256'));
    this.vm.securities.push(new DropDownItem('128', '128'));
  }

  onCancel(event: any): void {
    this.ref.close();
  }

  async onSubmit(event: any) {
    this.sharedService.showSpinner();
    const res = await this.walletClient
    .create(
      {
        security: parseInt(this.vm.selectedSecurity, 10) || 0,
        network: this.vm.selectedNetwork,
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
