import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { StateClient } from '../../api-clients/state.client';

@Injectable()
export class WalletResolver implements Resolve<any> {
    constructor(private stateClient: StateClient) { }

    async resolve(route: ActivatedRouteSnapshot): Promise<any> {
        const [state] = await Promise.all([
            this.stateClient.info().toPromise(),
        ]);

        return { state };
    }
}
