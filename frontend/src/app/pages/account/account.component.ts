import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';
import { AccountViewModel } from './account.vm';
import { HttpClient } from '@angular/common/http';
import { NbDialogService } from '@nebular/theme';
import { DialogPassphraseComponent } from '../dialog/dialog-passphrase/dialog-passphrase.component';
import { ToastrService } from 'ngx-toastr';
import { DialogPassphraseViewModel, DialogPassphraseEnum } from '../dialog/dialog-passphrase/dialog-passphrase.vm';
import { AccountClient } from '../../api-clients/account.client';
import { DialogCreateAccountComponent } from '../dialog/dialog-create-account/dialog-create-account.component';
import { DialogCreateAccountViewModel } from '../dialog/dialog-create-account/dialog-create-account.vm';
import { DialogImportAccountComponent } from '../dialog/dialog-import-account/dialog-import-account.component';
import { DialogImportAccountViewModel } from '../dialog/dialog-import-account/dialog-import-account.vm';
import { IsUseless } from '../../infrastructure/common-helper';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogUnspentCoinComponent } from '../dialog/dialog-unspent-coin/dialog-unspent-coin.component';
import { DialogUnspentCoinViewModel } from '../dialog/dialog-unspent-coin/dialog-unspent-coin.vm';
import { MashComponent } from '../_shared/mash/mash.component';
import { SharedService } from '../../infrastructure/_index';

@Component({
  selector: 'ngx-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  settings = this.getAccountSetting();

  vm: AccountViewModel;
  source: LocalDataSource = new LocalDataSource();
  balanceSettings: any;
  balanceSource: LocalDataSource = new LocalDataSource();

  constructor(
    private route: ActivatedRoute,
    protected http: HttpClient,
    protected dialogService: NbDialogService,
    private toast: ToastrService,
    private accountClient: AccountClient,
    private domSanitizer: DomSanitizer,
    private sharedService: SharedService,
    ) {
    const data = this.route.snapshot.data.pageData;
    this.balanceSettings = this.getBalanceSettings();
    this.source.load(data.accList);
    this.balanceSource.load(data.balances);
    this.vm = Object.assign(new AccountViewModel(), data.accInfo);
  }

  isHideDataMash() {
    return this.sharedService.hideDataMash;
  }

  ngOnInit(): void {
    this.sharedService.onMashModeChanged().subscribe((res) => {
      this.balanceSource.refresh();
    });
  }

  onAddConfirm(event): void {
    const req = {
      target: DialogPassphraseEnum.addAccount,
      data: {
        name: event.newData.Name,
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
          this.toast.success('The account has been created successfully.');
        }
      });
  }

  onEditConfirm(event): void {
    this.toast.warning('This method will be coming soon!');
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'switchAcc':
        this.switchAccount(event.data);
        break;
      case 'UTXO':
        this.showUnspentCoin(event.data);
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
          this.toast.success('The account has been switched successfully.');
          this.onRefreshGrid('balance');
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

  async onRefreshGrid(grid) {
    switch (grid) {
      case 'accounts':
        const accounts = await this.accountClient.list().toPromise().catch(err => err);
        if (!IsUseless(accounts.Msg)) {
          for (let index = 0; index < accounts.Msg.length; index++) {
            const element = accounts.Msg[index];
            element.Id = `#${index + 1}`;
          }
        }
        this.source.load(accounts.Msg);
        break;
      case 'balance':
        const balances = await this.accountClient.getBalance({tokenid: ''}).toPromise().catch(err => err);
        this.balanceSource.load(balances.Msg);
        break;
    }
  }

  showUnspentCoin(data: any) {
    const vm = new DialogUnspentCoinViewModel();
    vm.TokenID = data.TokenID;
    this.dialogService
      .open(DialogUnspentCoinComponent, {
        context: {
          vm: vm,
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (res) => {
      });
  }

  getAccountSetting() {
    const settings = {
      hideSubHeader: true,
      actions: {
        add: false,
        delete: false,
        edit: false,
        custom: [
          {
            name: 'switchAcc',
            title: '<i class="nb-shuffle" title="Switch account"></i>',
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
        Id: {
          title: '',
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
          title: 'Address',
          type: 'string',
          filter: false,
          editable: false,
          addable: false,
        },
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

  getBalanceSettings() {
    const settings = {
      selectMode: 'single',
      hideSubHeader: true,
      actions: {
        columnTitle: 'UTXO',
        add: false,
        delete: false,
        edit: false,
        custom: [
          {
            name: 'UTXO',
            title: '<i class="nb-menu" title="UTXO"></i>',
          },
        ],
        position: 'right'
      },
      columns: {
        TokenImage: {
          title: '',
          type: 'html',
          filter: false,
          valuePrepareFunction: (value, row, cell) => {
            const url = value ? value : 'assets/images/no_pic.png';
            return this.domSanitizer.bypassSecurityTrustHtml(`<div class="d-flex justify-content-center align-items-center">
            <img src="${url}" height="30" width="30"></div>`);
           }
        },
        TokenName: {
          title: 'Token name',
          type: 'string',
          filter: false,
        },
        TokenSymbol: {
          title: 'Token symbol',
          type: 'string',
          filter: false,
        },
        Amount: {
          title: 'Amount',
          type: 'custom',
          filter: false,
          valuePrepareFunction: (value, row, cell) => {
            return parseInt(value, 10) / (10 ** parseInt(row.TokenDecimal, 10));
           },
          renderComponent: MashComponent,
        },
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
