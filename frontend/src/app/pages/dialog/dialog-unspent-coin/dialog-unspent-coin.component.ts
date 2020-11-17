import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { AccountClient } from '../../../api-clients/account.client';
import { SharedService } from '../../../infrastructure/_index';
import { NbDialogRef } from '@nebular/theme';
import { IsResponseError, GetViewableError } from '../../../infrastructure/common-helper';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogUnspentCoinViewModel } from './dialog-unspent-coin.vm';
import { ToastrService } from 'ngx-toastr';
import { MashComponent } from '../../_shared/mash/mash.component';

@Component({
  selector: 'ngx-dialog-unspent-coin',
  templateUrl: './dialog-unspent-coin.component.html',
  styleUrls: ['./dialog-unspent-coin.component.scss']
})
export class DialogUnspentCoinComponent implements OnInit {
  unspentSettings: any;
  unspentSource: LocalDataSource;
  vm: DialogUnspentCoinViewModel;

  constructor(
    protected ref: NbDialogRef<DialogUnspentCoinComponent>,
    protected accountClient: AccountClient,
    private sharedService: SharedService,
    private toast: ToastrService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.unspentSettings = this.getSettings();
    setTimeout(() => {
      this.loadUnspentCoin();
    });
  }

  async loadUnspentCoin() {
    this.sharedService.showSpinner();
    const res = await this.accountClient
    .getUnspent({tokenid: this.vm.TokenID})
    .toPromise()
    .catch(err => err);

    this.sharedService.hideSpinner();
    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    } else {
      this.unspentSource = new LocalDataSource(res.Msg);
    }
  }

  onCancel(event: any): void {
    this.ref.close();
  }

  onSubmit(event: any) {
  }

  getSettings() {
    const settings = {
      selectMode: 'single',
      hideSubHeader: true,
      actions: {
        add: false,
        delete: false,
        edit: false,
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
        Value: {
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
