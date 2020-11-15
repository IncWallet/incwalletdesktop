import { Component, OnInit } from '@angular/core';
import {TransactionEntity} from "../../../entity/transaction.entity";
import {IsResponseError, IsUseless} from "../../../infrastructure/common-helper";
import {LocalDataSource} from "ng2-smart-table";
import {ActivatedRoute} from "@angular/router";
import {NbDialogService} from "@nebular/theme";
import {ToastrService} from "ngx-toastr";
import {PdeClient} from "../../../api-clients/pde.client";

@Component({
  selector: 'ngx-pde-history',
  templateUrl: './pde-history.component.html',
  styleUrls: ['./pde-history.component.scss']
})
export class PdeHistoryComponent implements OnInit {
  pdeHistorySettings: any;
  pdeHistoryResource: LocalDataSource = new LocalDataSource();
  constructor(
    private route: ActivatedRoute,
    protected dialogService: NbDialogService,
    private toast: ToastrService,
    private pdeClient: PdeClient,
  ) { }

  ngOnInit() {
    this.pdeHistorySettings = this.getPdeHistorySettings();
    this.loadPdeHistory();
  }
  onRefreshGrid() {
    this.loadPdeHistory();
  }
  async loadPdeHistory() {
    const res = await this.pdeClient
      .history()
      .toPromise()
      .catch((err) => err);
    if (!IsResponseError(res)) {
      if (!IsUseless(res.Msg)) {
        for (let index = 0; index < res.Msg.length; index++) {
          const element = res.Msg[index];
          element.id = `#${index + 1}`;
        }
      }
      this.pdeHistoryResource.load(res.Msg);
    }
  }
  getPdeHistorySettings(): any {
    const settings = {
      hideSubHeader: false,
      actions: false,
      columns: {
        id: {
          title: '#',
          type: 'string',
          filter: false,
          addable: false,
        },
        LockTime: {
          title: 'Lock Time',
          type: 'string',
          filter: false,
        },
        SendTokenSymbol: {
          title: 'Send ',
          type: 'string',
          filter: false,
        },
        SendAmount: {
          title: 'Send Amount',
          type: 'number',
          filter: false,
        },
        ReceiveTokenSymbol: {
          title: 'Receive',
          type: 'string',
          filter: false,
        },
        ReceiverAmount: {
          title: 'Receiver Amount',
          type: 'number',
          filter: false,
        },
        Status: {
          title: 'Status',
          type: 'string',
          filter: false,
        },
        TraderAddressStr: {
          title: 'TX Trade',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value, row, cell) => {
            return TransactionEntity.toViewToken(value);
          }
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
