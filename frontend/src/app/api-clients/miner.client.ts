
import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import {MinertListRes} from "./models/miner.model";


@Injectable({ providedIn: 'root' })
export class MinerClient {


  constructor() {
  }
  allinfo(): Observable<MinertListRes>{
    // @ts-ignore
    return  from (new Promise((resolve,reject) => {
      // @ts-ignore
      window.backend.MinerCtrl.GetAllMinerInfo().then(res => {
        resolve(JSON.parse(res));
      }).catch(err => reject(JSON.parse(err)));
    }));
  }
}
