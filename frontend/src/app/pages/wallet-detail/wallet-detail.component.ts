import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { AccountClient } from '../../api-clients/account.client';
import { LocalDataSource } from 'ng2-smart-table';
import { IsUseless, IsResponseError, GetViewableError } from '../../infrastructure/common-helper';
import { DialogCreateAccountComponent } from '../dialog/dialog-create-account/dialog-create-account.component';
import { DialogCreateAccountViewModel } from '../dialog/dialog-create-account/dialog-create-account.vm';
import { DialogPassphraseViewModel, DialogPassphraseEnum } from '../dialog/dialog-passphrase/dialog-passphrase.vm';
import { DialogPassphraseComponent } from '../dialog/dialog-passphrase/dialog-passphrase.component';
import { DialogImportAccountComponent } from '../dialog/dialog-import-account/dialog-import-account.component';
import { DialogImportAccountViewModel } from '../dialog/dialog-import-account/dialog-import-account.vm';
import { SharedService } from '../../infrastructure/_index';
import { StateClient } from '../../api-clients/state.client';
import { DialogAccountDetailComponent } from '../dialog/dialog-account-detail/dialog-account-detail.component';
import { DialogAccountDetailViewModel } from '../dialog/dialog-account-detail/dialog-account-detail.vm';
import { TransactionEntity } from '../../entity/transaction.entity';
import { MashComponent } from '../_shared/mash/mash.component';
import { ClipboardService, IClipboardResponse } from 'ngx-clipboard';

@Component({
  selector: 'ngx-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss']
})
export class WalletDetailComponent implements OnInit {

  accountSettings: any;
  accountSource: LocalDataSource = new LocalDataSource();

  constructor(
    private route: ActivatedRoute,
    protected http: HttpClient,
    protected dialogService: NbDialogService,
    private toast: ToastrService,
    private accountClient: AccountClient,
    private stateClient: StateClient,
    private sharedService: SharedService,
    private clipboard: ClipboardService
  ) { }

  ngOnInit(): void {
    this.accountSettings = this.getAccountSettings();
    this.loadAccounts();
    this.onAccountDataSourceChanged();
    this.onClipboardCopied();
    this.sharedService.onMashModeChanged().subscribe((res) => {
      this.accountSource.refresh();
    });
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'switchAcc':
        this.switchAccount(event.data);
        break;
      case 'viewDetail':
        this.onViewAccount(event.data);
        break;
      case 'syncAcc':
        this.onSyncAccount(event.data);
        break;
      case 'copyPaymentAddress':
        this.onCopyPaymentAddress(event.data);
        break;
    }
  }

  switchAccount(data: any) {
    const req = {
      target: DialogPassphraseEnum.switchAccount,
      data: {
        name: data.Name,
      }
    };
    const vm = Object.assign(new DialogPassphraseViewModel(), req);
    this.dialogService
      .open(DialogPassphraseComponent, {
        context: {
          vm: vm,
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (success) => {
        if (success) {
          this.loadAccounts();
          this.toast.success('The account has been switched.');
        }
      });
  }

  onViewAccount(data: any) {
    this.dialogService
      .open(DialogPassphraseComponent, {
        context: {
          vm: new DialogPassphraseViewModel(),
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (passPhrase) => {
        if (passPhrase) {
          this.viewAccount(passPhrase, data);
        }
      });
  }

  async viewAccount(passPhrase: string, data: any) {
    this.sharedService.showSpinner();

    const res = await this.accountClient
        .info({passphrase: passPhrase, publicKey: data.PublicKey})
        .toPromise()
        .catch((err) => err);

    this.sharedService.hideSpinner();

    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    } else {
      this.dialogService
      .open(DialogAccountDetailComponent, {
        context: {
          vm: new DialogAccountDetailViewModel(res.Msg),
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (success) => {
      });
    }
  }

  onCreateAccount(event) {
    this.dialogService
      .open(DialogCreateAccountComponent, {
        context: {
          vm: new DialogCreateAccountViewModel(),
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (success) => {
        if (success) {
          this.toast.success('The account has been added successfully.');
          this.onRefreshGrid('accounts');
        }
      });
  }

  onImportAccount(event) {
    this.dialogService
      .open(DialogImportAccountComponent, {
        context: {
          vm: new DialogImportAccountViewModel(),
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (success) => {
        if (success) {
          this.toast.success('The account has been imported successfully.');
          this.onRefreshGrid('accounts');
        }
      });
  }

  onSyncAllAccount(event) {
    this.dialogService
      .open(DialogPassphraseComponent, {
        context: {
          vm: new DialogPassphraseViewModel(),
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (passphrase) => {
        if (passphrase) {
          this.syncAllAccount(passphrase);
        }
      });
  }

  async syncAllAccount(passphrase) {
    this.sharedService.showSpinner();

    const res = await this.accountClient
        .syncAll({passphrase: passphrase})
        .toPromise()
        .catch((err) => err);

    this.sharedService.hideSpinner();

    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    } else {
      this.onRefreshGrid('accounts');
      this.toast.success('Accounts synced!');
    }
  }

  onSyncAccount(data: any) {
    this.dialogService
      .open(DialogPassphraseComponent, {
        context: {
          vm: new DialogPassphraseViewModel(),
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (passphrase) => {
        if (passphrase) {
          this.syncAccount(passphrase, data.PublicKey);
        }
      });
  }

  async syncAccount(passphrase, publicKey) {
    this.sharedService.showSpinner();

    const res = await this.accountClient
        .sync({publickey: publicKey, passphrase: passphrase})
        .toPromise()
        .catch((err) => err);

    this.sharedService.hideSpinner();

    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    } else {
      this.onRefreshGrid('accounts');
      this.toast.success('Account synced!');
    }
  }

  onCopyPaymentAddress(data: any) {
    this.clipboard.copy(data.PaymentAddress);
  }

  onClipboardCopied() {
    this.clipboard.copyResponse$.subscribe((res: IClipboardResponse) => {
      if (res.isSuccess) {
        this.toast.success('Copied to clipboard!');
      }
    });
  }

  async onRefreshGrid(grid) {
    switch (grid) {
      case 'accounts':
        this.loadAccounts();
        break;
    }
  }

  async loadAccounts() {
    const accounts = await this.accountClient.list().toPromise().catch(err => err);
    if (!IsUseless(accounts.Msg)) {
      for (let index = 0; index < accounts.Msg.length; index++) {
        const element = accounts.Msg[index];
        element.Id = `#${index + 1}`;
      }
    }
    this.accountSource.load(accounts.Msg);
  }

  onAccountDataSourceChanged() {
    this.accountSource.onChanged().subscribe(async data => {
      if (data.elements && data.elements.length > 0) {
        const stateRes = await this.stateClient.info().toPromise().catch(err => err);
        if (!IsUseless(stateRes && stateRes.Msg && stateRes.Msg.AccountID)) {
          const activeAccount = data.elements.find(x => x.PublicKey === stateRes.Msg.AccountID);
          if (activeAccount) {
            activeAccount.selected = true;
          }
        }
      }
    });
  }

  getAccountSettings() {
    const settings = {
      hideSubHeader: true,
      actions: {
        add: false,
        delete: false,
        edit: false,
        custom: [
          {
            name: 'viewDetail',
            title: '<i class="nb-menu" title="View detail"></i>',
          },
          {
            name: 'switchAcc',
            title: '<i class="nb-shuffle" title="Switch account"></i>',
          },
          {
            name: 'syncAcc',
            title: '<i class="nb-loop" title="Sync account"></i>',
          },
          {
            name: 'copyPaymentAddress',
            title: '<i class="nb-square-outline" title="Copy payment address"></i>',
          },
        ],
        position: 'right'
      },
      add: {
        addButtonContent: '<i class="nb-plus"></>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true
      },
      columns: {
        Hidden_PublicKey: {
          title: 'Hidden',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value, row, cell) => {
            return row.PublicKey;
           }
        },
        Id: {
          title: '#',
          type: 'string',
          filter: false,
          editable: false,
          addable: false,
        },
        Name: {
          title: 'Account Name',
          type: 'string',
          filter: false,
        },
        PaymentAddress: {
          title: 'Payment address',
          type: 'string',
          filter: false,
          editable: false,
          addable: false,
          valuePrepareFunction: (value, row, cell) => {
            return TransactionEntity.toViewToken(row.PaymentAddress);
           }
        },
        ValuePRV: {
          title: 'Value in PRV',
          type: 'custom',
          filter: false,
          renderComponent: MashComponent,
        },
        ValueUSDT: {
          title: 'Value in USDT',
          type: 'custom',
          filter: false,
          renderComponent: MashComponent,
        },
        ValueBTC: {
          title: 'Value in BTC',
          type: 'custom',
          filter: false,
          renderComponent: MashComponent,
        },
      },
      rowClassFunction: (row) => {
        return row.data.selected ? 'select' : 'non-select';
      },
      attr: {
        class: 'table table-bordered',
      },
      pager: {
        perPage: 1000,
      },
    };

    return settings;
  }
}
