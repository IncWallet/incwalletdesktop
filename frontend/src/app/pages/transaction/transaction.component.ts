import { Component, OnInit } from '@angular/core';
import {SharedService} from "../../infrastructure/service/shared.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {LocalDataSource} from "ng2-smart-table";
import {environment} from "../../../environments/environment";
import {TransactionClient} from "../../api-clients/transaction.client";
// import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'ngx-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private transactionClient: TransactionClient,
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    // private clipboard: Clipboard,
    private toast: ToastrService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.settings = this.getSettings();
    this.loadTransactions();
  }
  async loadTransactions() {
    const res = await  this.transactionClient.history(1,500).toPromise().catch((err)=>err);
    this.source = res.Msg.Detail;
    console.log(res.Msg.Detail)

  }
  onRefreshGrid() {
    this.source.setPage(1);
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
          // renderComponent: MashComponent,
      },
        Amount: {
          title: 'Amount',
          type: 'custom',
          filter: false,
          valuePrepareFunction: (value, row, cell) => {
            return parseInt(value, 10) / (10 ** parseInt(row.TokenDecimal, 10));
          },
          // renderComponent: MashComponent,
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
