import { ApiRes } from '../_index';
export class PdeHistory {
  Id: string;
  TraderAddressStr: string;
  ReceiveTokenIDStr: string;
  ReceiveTokenSymbol: string;
  ReceiveTokenName: string;
  ReceiveTokenDecimal: number;
  ReceiveTokenImage: string;
  ReceiverAmount: number;
  SendTokenIDStr: string;
  SendTokenSymbol: string;
  SendTokenName: string;
  SendTokenDecimal: number;
  SendTokenImage: string;
  SendAmount: number;
  RequestedTxID: string;
  BlockHeight: number;
  LockTime: string;
  ShardID: number;
  Status: string;
}
export class PdeHistoryListLocalRes extends ApiRes {
  Msg: {
    Size: number;
    Detail: [PdeHistory];
  };
}

export class PdeHistoryListRes extends ApiRes {
  Msg: [PdeHistory];
}
