import { NgModule } from '@angular/core';
import { NbMenuModule, NbButtonModule, NbDialogModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AccountComponent } from './account/account.component';
import { SendComponent } from './send/send.component';
import { ReceiveComponent } from './receive/receive.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingComponent } from './setting/setting.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NotFoundComponent } from './not-found/not-found.component';
import { PagesSharedModule } from './pages-shared.module';
import { AccountResolver } from './account/account.resolver';
import { DialogPassphraseComponent } from './dialog/dialog-passphrase/dialog-passphrase.component';
import { DialogCreateAccountComponent } from './dialog/dialog-create-account/dialog-create-account.component';
import { DialogImportAccountComponent } from './dialog/dialog-import-account/dialog-import-account.component';
import { DialogWalletComponent } from './dialog/dialog-wallet/dialog-wallet.component';
import { DialogImportWalletComponent } from './dialog/dialog-import-wallet/dialog-import-wallet.component';
import {MinerComponent} from "./miner/miner.component";
import {PdeHistoryComponent} from "./pde/pde-history/pde-history.component";
import {DialogAccountDetailComponent} from "./dialog/dialog-account-detail/dialog-account-detail.component";
import {MashComponent} from "./_shared/mash/mash.component";
import {DialogUnspentCoinComponent} from "./dialog/dialog-unspent-coin/dialog-unspent-coin.component";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    Ng2SmartTableModule,
    NbButtonModule,
    PagesSharedModule,
    NbDialogModule.forRoot(),

  ],
  declarations: [
    PagesComponent,
    AccountComponent,
    SendComponent,
    ReceiveComponent,
    TransactionComponent,
    SettingComponent,
    NotFoundComponent,
    DialogPassphraseComponent,
    DialogCreateAccountComponent,
    DialogImportAccountComponent,
    DialogWalletComponent,
    DialogImportWalletComponent,
    MinerComponent,
    PdeHistoryComponent,
    DialogAccountDetailComponent,
    MashComponent,
    DialogUnspentCoinComponent,

  ],
  providers: [
    AccountResolver,
  ],
  entryComponents: [
    DialogPassphraseComponent,
    DialogCreateAccountComponent,
    DialogImportAccountComponent,
    DialogWalletComponent,
    DialogImportWalletComponent,
  ]
})
export class PagesModule {
}
