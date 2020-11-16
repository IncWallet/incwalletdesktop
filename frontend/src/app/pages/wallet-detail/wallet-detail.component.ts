import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NbDialogService} from "@nebular/theme";
import {ToastrService} from "ngx-toastr";
import {LocalDataSource} from "ng2-smart-table";
import {DialogPassphraseEnum, DialogPassphraseViewModel} from "../dialog/dialog-passphrase/dialog-passphrase.vm";
import {DialogPassphraseComponent} from "../dialog/dialog-passphrase/dialog-passphrase.component";
import {DialogCreateAccountComponent} from "../dialog/dialog-create-account/dialog-create-account.component";
import {DialogCreateAccountViewModel} from "../dialog/dialog-create-account/dialog-create-account.vm";
import {DialogImportAccountComponent} from "../dialog/dialog-import-account/dialog-import-account.component";
import {DialogImportAccountViewModel} from "../dialog/dialog-import-account/dialog-import-account.vm";
import {GetViewableError, IsResponseError, IsUseless} from "../../infrastructure/common-helper";
import {AccountClient} from "../../api-clients/account.client";
import {TransactionEntity} from "../../entity/transaction.entity";
import {SharedService} from "../../infrastructure/service/shared.service";
import {DialogAccountDetailComponent} from "../dialog/dialog-account-detail/dialog-account-detail.component";
import {DialogAccountDetailViewModel} from "../dialog/dialog-account-detail/dialog-account-detail.vm";

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
    private sharedService: SharedService,
  ) {
    // const data = this.route.snapshot.data.pageData;
    // this.accountSource.load(data.accList);
  }

  ngOnInit() {
    this.accountSettings = this.getAccountSettings();
    this.loadAccounts();
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
        // this.onCopyPaymentAddress(event.data);
        break;
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
        this.toast.success('The account has been switched successfully.');
      }
    });
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
      .info({passPhrase: passPhrase, publickey: data.PublicKey})
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
  async onRefreshGrid(grid) {
    switch (grid) {
      case 'accounts':
        this.loadAccounts();
        break;
    }
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
        addButtonContent: '<i class="nb-plus"></i>',
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
          type: 'numer',
          filter: false,
          // renderComponent: MashComponent,
        },
        ValueUSDT: {
          title: 'Value in USDT',
          type: 'number',
          filter: false,
          // renderComponent: MashComponent,
        },
        ValueBTC: {
          title: 'Value in BTC',
          type: 'number',
          filter: false,
          // renderComponent: MashComponent,
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
