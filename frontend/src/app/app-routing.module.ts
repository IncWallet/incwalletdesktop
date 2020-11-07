import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthWrapperComponent } from './infrastructure/auth-wrapper/auth-wrapper.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { WalletResolver } from './pages/wallet/wallet.resolver';
import { AuthGuard } from './infrastructure/auth.guard';
import { PagesComponent } from './pages/pages.component';
import { AccountComponent } from './pages/account/account.component';
import { SendComponent } from './pages/send/send.component';
import { ReceiveComponent } from './pages/receive/receive.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { SettingComponent } from './pages/setting/setting.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AccountResolver } from './pages/account/account.resolver';

export const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard],
    component: PagesComponent,
    children: [
      {
        path: 'account',
        component: AccountComponent,
        resolve: { pageData: AccountResolver },
      },
      {
        path: 'send',
        component: SendComponent,
      },
      {
        path: 'receive',
        component: ReceiveComponent,
      },
      {
        path: 'transaction',
        component: TransactionComponent,
      },
      {
        path: 'setting',
        component: SettingComponent,
      },
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
  {
    path: 'wallet',
    component: AuthWrapperComponent,
    children: [
        {
          path: 'login',
          component: WalletComponent,
          resolve: { pageData: WalletResolver },
        },
        {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full',
        },
      ],
  },
  { path: '', redirectTo: 'wallet', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
