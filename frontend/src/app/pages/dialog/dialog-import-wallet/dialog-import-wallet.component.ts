import { Component, OnInit } from '@angular/core';
import { DialogImportWalletViewModel } from './dialog-import-wallet.vm';
import { WalletClient } from '../../../api-clients/wallet.client';
import { SharedService } from '../../../infrastructure/_index';
import { NbDialogRef } from '@nebular/theme';
import { OnDialogAction } from '../../../infrastructure/ui-helper';
import { DropDownItem } from '../../../api-clients/_index';
import { IsResponseError, GetViewableError } from '../../../infrastructure/common-helper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-dialog-import-wallet',
  templateUrl: './dialog-import-wallet.component.html',
  styleUrls: ['./dialog-import-wallet.component.scss']
})
export class DialogImportWalletComponent implements OnInit, OnDialogAction {

  vm: DialogImportWalletViewModel;

  constructor(
    protected ref: NbDialogRef<DialogImportWalletComponent>,
    protected walletClient: WalletClient,
    protected sharedService: SharedService,
    protected toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vm.networks.push(new DropDownItem('testnet', 'testnet'));
    this.vm.networks.push(new DropDownItem('mainnet', 'mainnet'));
    this.vm.networks.push(new DropDownItem('local', 'local'));
  }

  onCancel(event: any): void {
    this.ref.close();
  }

  async onSubmit(event: any) {
    this.sharedService.showSpinner();
    const res = await this.walletClient
    .import(
      {
        mnemonic: this.vm.mnemonic,
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
