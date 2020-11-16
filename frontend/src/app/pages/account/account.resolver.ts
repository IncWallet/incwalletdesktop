import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AccountClient} from '../../api-clients/account.client';
import {IsUseless} from '../../infrastructure/common-helper';

@Injectable()
export class AccountResolver implements Resolve<any> {
  constructor(private accountClient: AccountClient) {
  }

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const [  accList, balance] = await Promise.all([

      this.accountClient.list().toPromise(),
      this.accountClient.getBalance({tokenid: ''}).toPromise(),
    ]);

    if (!Array.isArray(accList.Msg))
      accList.Msg = [];
    if (!Array.isArray(balance.Msg))
      balance.Msg = [];
    if (!IsUseless(accList.Msg)) {
      for (let index = 0; index < accList.Msg.length; index++) {
        const element = accList.Msg[index];
        element.Id = `#${index + 1}`;
      }
    }

    return { accList: accList.Msg, balances: balance.Msg};
  }
}
