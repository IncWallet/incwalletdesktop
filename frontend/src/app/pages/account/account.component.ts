import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';
import { AccountViewModel } from './account.vm';
import { HttpClient } from '@angular/common/http';
import { NbDialogService } from '@nebular/theme';
import { DialogPassphraseComponent } from '../dialog/dialog-passphrase/dialog-passphrase.component';
import { ToastrService } from 'ngx-toastr';
import { DialogPassphraseViewModel, DialogPassphraseEnum } from '../dialog/dialog-passphrase/dialog-passphrase.vm';
import { DialogCreateAccountComponent } from '../dialog/dialog-create-account/dialog-create-account.component';
import { DialogCreateAccountViewModel } from '../dialog/dialog-create-account/dialog-create-account.vm';
import { DialogImportAccountComponent } from '../dialog/dialog-import-account/dialog-import-account.component';
import { DialogImportAccountViewModel } from '../dialog/dialog-import-account/dialog-import-account.vm';

@Component({
  selector: 'ngx-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  settings = {
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
      },
      PaymentAddress: {
        title: 'Address',
        type: 'string',
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

  vm: AccountViewModel;
  source: LocalDataSource = new LocalDataSource();
  balanceSettings: any;
  balanceSource: LocalDataSource = new LocalDataSource();

  constructor(
    private route: ActivatedRoute,
    protected http: HttpClient,
    protected dialogService: NbDialogService,
    private toast: ToastrService,
    ) {
    const data = this.route.snapshot.data.pageData;
    this.balanceSettings = this.getBalanceSettings();
    this.source.load(data.accList);
    this.balanceSource.load(data.balances);
  }

  ngOnInit(): void {
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

  getBalanceSettings() {
    const settings = {
      actions: {
        add: false,
        delete: false,
        edit: false,
      },
      columns: {
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
          type: 'string',
          filter: false,
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
