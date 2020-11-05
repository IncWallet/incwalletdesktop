import {Component} from '@angular/core';

@Component({
  selector: '[id="app"]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  clickMessage = '';

  syncAccount() {
    // @ts-ignore
    window.backend.AccountCtrl.SyncAccount('', '12345').then(result =>
      this.clickMessage = result
    );
  }

  addAccount() {
    // @ts-ignore
    window.backend.AccountCtrl.AddAccount('account4', '12345').then(result =>
      this.clickMessage = result
    );
  }

  importAccount() {
    // @ts-ignore
    window.backend.AccountCtrl.ImportAccount('main pde account', 'empty', '12345').then(result =>
      this.clickMessage = result
    );
  }

  createWallet() {
    // @ts-ignore
    window.backend.WalletCtrl.CreateWallet(256, '12345', 'mainnet').then(result =>
      this.clickMessage = result
    );
  }

  updateTokens() {
    // @ts-ignore
    window.backend.NetworkCtrl.UpdateAllTokens().then(result =>
      this.clickMessage = result
    );
  }

}
