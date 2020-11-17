import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  NbCheckboxModule,
  NbIconModule,
  NbButtonModule,
  NbInputModule,
  NbRadioModule,
  NbCardModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbListModule,
  NbUserModule,
  NbDialogModule,
  NbSelectModule,
} from '@nebular/theme';
import { ValidationMessageComponent } from './_shared/validation-message/validation-message.component';
import { StatusCardComponent } from './_shared/status-card/status-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { DialogPromptComponent } from './_shared/dialog-prompt/dialog-prompt.component';
import { MashComponent } from './_shared/mash/mash.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    ValidationMessageComponent,
    StatusCardComponent,
    DialogPromptComponent,
    MashComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NbCheckboxModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    NbRadioModule,
    NbCardModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbListModule,
    NbUserModule,
    NbSelectModule,
    NbDialogModule.forRoot(),
    TranslateModule,
    QRCodeModule,
    ClipboardModule,

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NbCheckboxModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    NbRadioModule,
    NbCardModule,
    NbTabsetModule,
    NbListModule,
    NbUserModule,
    NbSelectModule,
    TranslateModule,
    QRCodeModule,
    ClipboardModule,

    ValidationMessageComponent,
    StatusCardComponent,
    DialogPromptComponent,
    MashComponent,


  ],
  entryComponents: [
    ValidationMessageComponent,
    StatusCardComponent,
    DialogPromptComponent,
    MashComponent,

  ],
})
export class PagesSharedModule {}
