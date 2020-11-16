import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbWindowModule,
  NbTabsetModule,
} from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { PagesSharedModule } from './pages/pages-shared.module';
import { GlobalErrorHandler } from './infrastructure/global-error-handler';
import { HttpErrorInterceptor } from './infrastructure/http-error-interceptor';
import { ToastrModule } from 'ngx-toastr';
import { SharedService } from './infrastructure/service/shared.service';
import { AuthGuard } from './infrastructure/auth.guard';
import { APP_BASE_HREF } from '@angular/common';
import { NgxAuthModule } from './infrastructure/auth.module';
import { PagesModule } from './pages/pages.module';
import { WalletDetailComponent } from './pages/wallet-detail/wallet-detail.component';
import {Ng2SmartTableModule} from "ng2-smart-table";

@NgModule({
  declarations: [
    AppComponent,
    WalletDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    PagesSharedModule,
    NbTabsetModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      autoDismiss: true,
    }),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NgxAuthModule,
    PagesModule,
    Ng2SmartTableModule,

  ],
  providers: [
    [
      SharedService,
    ],
    AuthGuard,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor,
        multi: true,
    },
    {provide: APP_BASE_HREF, useValue : '/' }
  ],
  entryComponents: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
