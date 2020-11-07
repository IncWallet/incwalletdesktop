export class DialogPassphraseViewModel {
  constructor() {
    this.passphrase = '';
  }

  target: DialogPassphraseEnum;
  data: any;

  passphrase: string;
}

export enum DialogPassphraseEnum {
  switchAccount,
  addAccount
}
