import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MashComponent } from '../_shared/mash/mash.component';
import { SharedService } from '../../infrastructure/_index';
import { ClipboardService, IClipboardResponse } from 'ngx-clipboard';
import { TransactionClient } from '../../api-clients/transaction.client';

@Component({
  selector: 'ngx-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {

  settings: any;
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private domSanitizer: DomSanitizer,
    private toast: ToastrService,
    private clipboard: ClipboardService,
    private sharedService: SharedService,
    private transactionClient: TransactionClient,
  ) { }

  ngOnInit(): void {
    this.settings = this.getSettings();
    this.loadTransactions();
    this.onClipboardCopied();
    this.sharedService.onMashModeChanged().subscribe((res) => {
      this.onRefreshGrid();
    });
  }

  async loadTransactions() {
    const histories = await this.transactionClient.history(200, 1).toPromise().catch(err => err);
    this.source.load((histories.Msg && histories.Msg.Detail) || []);
  }

  onRefreshGrid() {
    this.source.setPage(1);
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'ViewToken':
        window.open(`https://mainnet.incognito.org/tx/${event.data.TxHash}`, '_blank');
        break;
      case 'CopyToken':
        this.copyToken(event.data);
        break;
    }
  }

  copyToken(data: any) {
    this.clipboard.copy(data.TokenID);
  }

  onClipboardCopied() {
    this.clipboard.copyResponse$.subscribe((res: IClipboardResponse) => {
      if (res.isSuccess) {
        this.toast.success('Copied to clipboard!');
      }
    });
  }

  getSettings(): any {
    const settings = {
      hideSubHeader: true,
      actions: {
        columnTitle: 'Tx Detail',
        add: false,
        delete: false,
        edit: false,
        custom: [
          {
            name: 'ViewToken',
            title: '<i class="nb-chevron-right-outline" title="View token"></i>',
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
        LockTime: {
          title: 'Locktime',
          type: 'string',
          filter: false,
        },
        Type: {
          title: 'Type',
          type: 'string',
          filter: false,
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
        Fee: {
          title: 'Fee (Nano)',
          type: 'custom',
          filter: false,
          renderComponent: MashComponent,
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
        perPage: 50,
      },
    };

    return settings;
  }

}
