import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NbAuthModule } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbSpinnerModule,
  NbCardModule,
  NbLayoutModule
} from '@nebular/theme';
import { AuthWrapperComponent } from './auth-wrapper/auth-wrapper.component';
import { PagesSharedModule } from '../pages/pages-shared.module';
import { SharedService } from './_index';
import { WalletComponent } from '../pages/wallet/wallet.component';
import { ThemeModule } from '../@theme/theme.module';
import { WalletResolver } from '../pages/wallet/wallet.resolver';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbAuthModule,
    PagesSharedModule,
    NbCardModule,
    NbSpinnerModule,
    NbLayoutModule,
    ThemeModule.forRoot(),
  ],
  providers: [
    [
        SharedService,
        WalletResolver,
    ]
  ],
  declarations: [
    WalletComponent,
    AuthWrapperComponent,
  ]
})
export class NgxAuthModule {
}
