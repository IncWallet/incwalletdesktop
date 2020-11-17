import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {AccountClient} from '../../api-clients/account.client';
import {IsUseless} from '../../infrastructure/common-helper';

@Injectable()
export class AccountResolver implements Resolve<any> {
  constructor(private accountClient: AccountClient) {
  }

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const [ accInfo, balance] = await Promise.all([
      this.accountClient.info( {publicKey: "", passphrase: "" }).toPromise(),

      this.accountClient.getBalance({tokenid: ''}).toPromise(),
    ]);

    if (!Array.isArray(balance.Msg))
      balance.Msg = [];


    return { accInfo: accInfo.Msg, balances: balance.Msg};
  }
}
