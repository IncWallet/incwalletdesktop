import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PdeClient } from '../../../api-clients/pde.client';
import { IsUseless } from '../../../infrastructure/common-helper';

@Injectable()
export class PdeHistoyResolver implements Resolve<any> {
  constructor(private pdeClient: PdeClient) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const [pdeHistoryList] = await Promise.all([
      this.pdeClient.history().toPromise(),
    ]);
    if (!IsUseless(pdeHistoryList.Msg)) {
      for (let index = 0; index < pdeHistoryList.Msg.length; index++) {
        const element = pdeHistoryList.Msg[index];
        element.Id = `#${index + 1}`;
      }
    }
    return { miner: pdeHistoryList.Msg };
  }
}
