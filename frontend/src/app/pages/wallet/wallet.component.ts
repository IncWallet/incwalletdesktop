import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogImportWalletComponent } from '../dialog/dialog-import-wallet/dialog-import-wallet.component';
import { DialogImportWalletViewModel } from '../dialog/dialog-import-wallet/dialog-import-wallet.vm';
import { DialogWalletComponent } from '../dialog/dialog-wallet/dialog-wallet.component';
import { DialogWalletViewModel } from '../dialog/dialog-wallet/dialog-wallet.vm';
import { StateClient } from '../../api-clients/state.client';
import { Auth } from '../../infrastructure/common-helper';

@Component({
  selector: 'ngx-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  state: any;
  constructor(
    protected dialogService: NbDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private stateClient: StateClient,
  ) {
    const data = this.route.snapshot.data.pageData;
    this.state = data.state;
   }

  ngOnInit(): void {
    if (Auth.IsLoggedInWallet(this.state)) {
      this.router.navigate(['pages/account']);
    }
  }

  onCreateWallet(event) {
    const vm = new DialogWalletViewModel();
    this.dialogService
      .open(DialogWalletComponent, {
        context: {
          vm: vm,
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      });
  }

  onImportWallet(event) {
    const vm = new DialogImportWalletViewModel();
    this.dialogService
      .open(DialogImportWalletComponent, {
        context: {
          vm: vm,
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (success) => {
        if (success) {
          this.router.navigate(['pages/account']);
         }
      });
  }
}
