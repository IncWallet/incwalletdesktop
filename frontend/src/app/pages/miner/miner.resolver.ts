import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { MinerClient } from '../../api-clients/miner.client';
import { IsUseless } from '../../infrastructure/common-helper';

@Injectable()
export class MinerResolver implements Resolve<any> {
  constructor(private minerClient: MinerClient) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const [minerList] = await Promise.all([this.minerClient.info().toPromise()]);
    if (!IsUseless(minerList.Msg)) {
        for (let index = 0; index < minerList.Msg.length; index++) {
          const element = minerList.Msg[index];
          element.Id = `#${index + 1}`;
        }
      }
    return { miner: minerList.Msg };
  }
}
