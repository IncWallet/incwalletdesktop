import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WalletClient {
    constructor() {
    }

    create(model: {security: number, passphrase: string, network: string}): Observable<any> {
        return from(new Promise((resolve, reject) => {
            // @ts-ignore
            window.backend.WalletCtrl.CreateWallet(model.security, model.passphrase, model.network).then(res => {
              resolve(JSON.parse(res));
            }).catch(err => reject(JSON.parse(err)));
          }));
    }

    import(model: {mnemonic: string, passphrase: string, network: string}): Observable<any> {
        return from(new Promise((resolve, reject) => {
            // @ts-ignore
            window.backend.WalletCtrl.ImportWallet(model.mnemonic, model.passphrase, model.network).then(res => {
              resolve(JSON.parse(res));
            }).catch(err => reject(JSON.parse(err)));
          }));
    }
}
