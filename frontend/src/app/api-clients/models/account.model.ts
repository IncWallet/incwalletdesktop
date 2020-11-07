import { ApiRes } from './common.model';

export class Account {
  Id: string;
  Name: string;
  PaymentAddress: string;
  PublicKey: string;
  ViewingKey: string;
  MiningKey: string;
}

export class AccountListRes extends ApiRes {
  Msg: [Account];
}

export class AccountInfoRes extends ApiRes {
  Msg: Account;
}
