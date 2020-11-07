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

@NgModule({
  declarations: [
    ValidationMessageComponent,
    StatusCardComponent,
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

    ValidationMessageComponent,
    StatusCardComponent,
  ],
  entryComponents: [
    ValidationMessageComponent,
    StatusCardComponent,
  ],
})
export class PagesSharedModule {}
