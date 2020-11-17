import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { AccountClient } from '../../api-clients/account.client';
import { MinerClient } from '../../api-clients/miner.client';
import { Miner } from '../../api-clients/models/miner.model';
import { StateClient } from '../../api-clients/state.client';
import { TransactionEntity } from '../../entity/transaction.entity';
import {
  GetViewableError,
  IsResponseError,
  IsUseless,
} from '../../infrastructure/common-helper';
import { SharedService } from '../../infrastructure/_index';
import { MashComponent } from '../_shared/mash/mash.component';

@Component({
  selector: 'ngx-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.scss'],
})
export class MinerComponent implements OnInit {
  minerSettings: any;
  minerResource: LocalDataSource = new LocalDataSource();
  constructor(
    private route: ActivatedRoute,
    protected http: HttpClient,
    protected dialogService: NbDialogService,
    private toast: ToastrService,
    private minerClient: MinerClient
  ) {}

  ngOnInit() {
    this.minerSettings = this.getMinerSettings();
    this.loadMiner();
  }
  onRefreshGrid() {
    this.loadMiner();
  }

  async loadMiner() {
    const res = await this.minerClient
      .info()
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
          type: 'custom',
          filter: false,
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
