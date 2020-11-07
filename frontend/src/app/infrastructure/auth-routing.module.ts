import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthWrapperComponent } from './auth-wrapper/auth-wrapper.component';
import { WalletComponent } from '../pages/wallet/wallet.component';
import { WalletResolver } from '../pages/wallet/wallet.resolver';

export const routes: Routes = [
  {},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}
