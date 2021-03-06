import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountClient {
    constructor() {
    }

    list(): Observable<any> {
      return from(new Promise((resolve, reject) => {
        // @ts-ignore
        window.backend.AccountCtrl.ListAccount().then(res => {
          resolve(JSON.parse(res));
        }).catch(err => reject(JSON.parse(err)));
      }));
    }

    add(model: { name: string, passphrase: string}): Observable<any> {
      return from(new Promise((resolve, reject) => {
        // @ts-ignore
        window.backend.AccountCtrl.AddAccount(model.name, model.passphrase).then(res => {
          resolve(JSON.parse(res));
        }).catch(err => reject(JSON.parse(err)));
      }));
    }

    import(model: { name: string, passphrase: string, privatekey: string}): Observable<any> {
      return from(new Promise((resolve, reject) => {
        // @ts-ignore
        window.backend.AccountCtrl.ImportAccount(model.name, model.privatekey, model.passphrase).then(res => {
          resolve(JSON.parse(res));
        }).catch(err => reject(JSON.parse(err)));
      }));
    }

    switch(model: { name: string, passphrase: string}): Observable<any> {
      return from(new Promise((resolve, reject) => {
        // @ts-ignore
        window.backend.AccountCtrl.SwitchAccount(model.name, model.passphrase).then(res => {
          resolve(JSON.parse(res));
        }).catch(err => reject(JSON.parse(err)));
      }));
    }

    getBalance(model: { tokenid: string }): Observable<any> {
      return from(new Promise((resolve, reject) => {
        // @ts-ignore
        window.backend.AccountCtrl.GetBalance(model.tokenid).then(res => {
          resolve(JSON.parse(res));
        }).catch(err => reject(JSON.parse(err)));
      }));
    }
}
