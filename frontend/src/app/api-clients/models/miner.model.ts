import { ApiRes } from '../_index';

export class Miner {
  Id: string;
  PaymentAddress: string;
  MiningKey: string;
  BeaconHeight: number;
  Epoch: number;
  Reward: number;
  Status: string;
  SharId: number;
  Index: number;
}
export class MinertListRes extends ApiRes {
  Msg: [Miner];
}
