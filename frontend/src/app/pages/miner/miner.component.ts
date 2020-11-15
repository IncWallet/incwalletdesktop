import { Component, OnInit } from '@angular/core';
import {IsResponseError, IsUseless} from "../../infrastructure/common-helper";
import {LocalDataSource} from "ng2-smart-table";
import {MinerClient} from "../../api-clients/miner.client";
import {TransactionEntity} from "../../entity/transaction.entity";

@Component({
  selector: 'ngx-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.scss']
})
export class MinerComponent implements OnInit {
  minerSettings: any;
  minerResource: LocalDataSource = new LocalDataSource();
  constructor(
    private minerClient: MinerClient
  ) { }

  ngOnInit() {
    this.minerSettings = this.getMinerSettings();
    this.loadMiner();
  }
  onRefreshGrid() {
    this.loadMiner();
    this.minerResource.setPage(1);
  }
  async loadMiner() {
    const res = await this.minerClient
      .allinfo()
      .toPromise()
      .catch((err) => err);
    if (!IsResponseError(res)) {
      if (!IsUseless(res.Msg)) {
        for (let index = 0; index < res.Msg.length; index++) {
          const element = res.Msg[index];
          element.id = `#${index + 1}`;
        }
      }
      this.minerResource.load(res.Msg);
    }
    // this.minerResource.setPaging(2,1,true);
  }
  getMinerSettings(): any {
    const settings = {
      hideSubHeader: true,
      actions: false,
      columns: {
        id: {
          title: '#',
          type: 'string',
          filter: false,
          addable: false,
        },
        PaymentAddress: {
          title: 'Payment address',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value, row, cell) => {
            return TransactionEntity.toViewToken(value);
          }
        },
        MiningKey: {
          title: 'MiningKey',
          type: 'string',
          filter: false,
        },
        Status: {
          title: 'Status',
          type: 'string',
          filter: false,
        },
        ShardID: {
          title: 'ShardId',
          type: 'number',
          filter: false,
        },
        Index: {
          title: 'Index',
          type: 'number',
          filter: false,
        },
        Reward: {
          title: 'Reward',
          type: 'number',
          filter: false,
        },
      },
      attr: {
        class: 'table table-bordered',
      },
      pager: {
        perPage: 1,
      },
    };

    return settings;
  }
}
