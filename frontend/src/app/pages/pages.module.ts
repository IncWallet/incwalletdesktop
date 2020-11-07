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
