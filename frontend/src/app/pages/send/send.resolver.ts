import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AccountClient } from '../../api-clients/account.client';

@Injectable()
export class SendResolver implements Resolve<any> {
    constructor(
      private accountClient: AccountClient,
      ) { }

    async resolve(route: ActivatedRouteSnapshot): Promise<any> {
        const [balances] = await Promise.all([
            this.accountClient.getBalance({tokenid: ''}).toPromise(),
        ]);

        if (balances.Msg) {
          balances.Msg = balances.Msg.filter(x => x.Amount && x.Amount > 0);
        }

        return { balances: balances.Msg };
    }
}
