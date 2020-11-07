import { DropDownItem } from '../../../api-clients/_index';

export class DialogImportWalletViewModel {
  constructor() {
    this.networks = new Array();
  }

  mnemonic: string;

  network: string;
  passphrase: string;

  selectedNetwork: string;
  networks: DropDownItem[];
}
