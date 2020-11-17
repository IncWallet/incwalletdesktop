import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { IsUseless } from '../../infrastructure/common-helper';
import { AddressBookClient } from '../../api-clients/address-book.client';

@Injectable()
export class AddressBookResolver implements Resolve<any> {
    constructor(private addressClient: AddressBookClient) { }

    async resolve(route: ActivatedRouteSnapshot): Promise<any> {
        const [addressesRes] = await Promise.all([
            this.addressClient.getAll().toPromise(),
        ]);

        if (!IsUseless(addressesRes.Msg)) {
          for (let index = 0; index < addressesRes.Msg.length; index++) {
            const element = addressesRes.Msg[index];
            element.id = `#${index + 1}`;
          }
        }

        return { addresses: addressesRes.Msg };
    }
}
