import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AccountComponent } from './account/account.component';
import { SendComponent } from './send/send.component';
import { ReceiveComponent } from './receive/receive.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingComponent } from './setting/setting.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccountResolver } from './account/account.resolver';

const routes: Routes = [{
  path: '',
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
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
