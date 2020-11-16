import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';
import { AccountViewModel } from './account.vm';
import { HttpClient } from '@angular/common/http';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import {DomSanitizer} from "@angular/platform-browser";
import {MashComponent} from "../_shared/mash/mash.component";
import {DialogUnspentCoinViewModel} from "../dialog/dialog-unspent-coin/dialog-unspent-coin.vm";
import {DialogUnspentCoinComponent} from "../dialog/dialog-unspent-coin/dialog-unspent-coin.component";
import {DialogPassphraseEnum, DialogPassphraseViewModel} from "../dialog/dialog-passphrase/dialog-passphrase.vm";
import {DialogPassphraseComponent} from "../dialog/dialog-passphrase/dialog-passphrase.component";
import {IsUseless} from "../../infrastructure/common-helper";
import {AccountClient} from "../../api-clients/account.client";
import {SharedService} from "../../infrastructure/service/shared.service";

@Component({
  selector: 'ngx-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  vm: AccountViewModel;
  balanceSettings: any;
  source: LocalDataSource = new LocalDataSource();
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
    this.vm = Object.assign(new AccountViewModel(), data.balances);
  }

  ngOnInit(): void {
    this.sharedService.onMashModeChanged().subscribe((res) => {
      this.balanceSource.refresh();
    });
  }
  isHideDataMash() {
    return this.sharedService.hideDataMash;
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
  async onRefreshGrid(grid) {
    switch (grid) {
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
          type: 'number',
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
