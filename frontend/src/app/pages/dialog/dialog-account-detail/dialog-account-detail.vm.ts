export class DialogAccountDetailViewModel {
  constructor(data: any) {
    this.AccountName = data.AccountName;
    this.PrivateKey = data.PrivateKey;
    this.PaymentAddress = data.PaymentAddress;
    this.PublicKey = data.PublicKey;
    this.ViewingKey = data.ViewingKey;
    this.MiningKey = data.MiningKey;
    this.Network = data.Network;
    this.ValuePRV = data.ValuePRV;
    this.ValueUSDT = data.ValueUSDT;
    this.ValueBTC = data.ValueBTC;
  }

  AccountName: string;
  PrivateKey: string;
  PaymentAddress: string;
  PublicKey: string;
  ViewingKey: string;
  MiningKey: string;
  Network: string;
  ValuePRV: number;
  ValueUSDT: number;
  ValueBTC: number;

  Flipped: boolean;
  QRCode: string;
  QRField: string;
}
