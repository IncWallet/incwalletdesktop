import { DropDownItem } from '../../../api-clients/_index';

export class DialogWalletViewModel {
  constructor() {
    this.networks = new Array();
    this.securities = new Array();
  }

  security: string;

  network: string;
  passphrase: string;

  selectedNetwork: string;
  networks: DropDownItem[];

  selectedSecurity: string;
  securities: DropDownItem[];
}
