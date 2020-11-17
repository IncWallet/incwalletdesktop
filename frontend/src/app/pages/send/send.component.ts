import { Component, OnInit, Renderer2 } from '@angular/core';
import { SendViewModel, SendViewModelResolver } from './send.vm';
import { TransactionClient } from '../../api-clients/transaction.client';
import { SharedService } from '../../infrastructure/_index';
import {
  IsResponseError,
  GetViewableError,
  IsNullOrUndefined,
  FormValidator,
} from '../../infrastructure/common-helper';
import { ToastrService } from 'ngx-toastr';
import { Transaction } from '../../api-clients/models/transaction.model';
import { NbDialogService } from '@nebular/theme';
import { DialogPassphraseComponent } from '../dialog/dialog-passphrase/dialog-passphrase.component';
import { DialogPassphraseViewModel } from '../dialog/dialog-passphrase/dialog-passphrase.vm';
import { ActivatedRoute } from '@angular/router';
import { TransactionEntity } from '../../entity/transaction.entity';
import { DialogAddressBookViewModel } from '../dialog/dialog-address-book/dialog-address-book.vm';
import { DialogAddressBookComponent } from '../dialog/dialog-address-book/dialog-address-book.component';
import { CommonValidators, CommonMsg } from '../../infrastructure/common-validators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationError } from '../_shared/validation-message/validation-error.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
  vm: SendViewModel;
  sendForm: FormGroup;

  feeMsg(min: number): ValidationError {
    const messages = new CommonMsg(this.translate);
    return {
      ...messages.mustBeGreaterThanOrEquals('TERMINOLOGY.FEE', min),
    };
  }

  constructor(
    private transactionClient: TransactionClient,
    private sharedService: SharedService,
    private toast: ToastrService,
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ) {
    const data = this.route.snapshot.data.pageData;
    this.vm = new SendViewModel();
    this.vm.rawTokens = data.balances;
  }

  ngOnInit(): void {
    SendViewModelResolver.prepData(this.vm);
    this.buildForm();
  }

  buildForm() {
    this.sendForm = this.formBuilder.group({
      fee: [
        this.vm.fee,
        [CommonValidators.minMax(5)],
      ],
    });
  }

  onClear(event): void {
    SendViewModelResolver.clear(this.vm);
    this.renderer.selectRootElement('#token', true).blur();
    this.renderer.selectRootElement('#toAddress', true).focus();
  }

  onSelectAddressBook(event) {
    this.dialogService
      .open(DialogAddressBookComponent, {
        context: {
          vm: new DialogAddressBookViewModel(),
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (paymentAddress) => {
        if (paymentAddress) {
          this.vm.toAddress = paymentAddress;
        }
      });
  }

  onSend(event): void {
    if (this.sendForm.invalid) {
      FormValidator.validateAllFields(this.sendForm);
      return;
    }

    this.dialogService
      .open(DialogPassphraseComponent, {
        context: {
          vm: new DialogPassphraseViewModel(),
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (passPhrase) => {
        if (passPhrase) {
          this.createTransaction(passPhrase);
        }
      });
  }

  async createTransaction(passPhrase: any) {
    const model = new Transaction();
    model.receivers = {};
    model.receivers[`"${this.vm.toAddress}"`] = this.viewAmountToRaw(
      this.vm.amount,
      this.vm.rawTokens.filter((x) => x.TokenID === this.vm.selectedToken)
    );
    model.tokenid = this.vm.selectedToken;
    model.fee = this.vm.fee;
    model.info = this.vm.memo;
    model.passphrase = passPhrase;

    let res;
    this.sharedService.showSpinner();

    if (TransactionEntity.isPRV(this.vm.selectedToken)) {
      res = await this.transactionClient
        .create(model)
        .toPromise()
        .catch((err) => err);
    } else {
      res = await this.transactionClient
        .createToken(model)
        .toPromise()
        .catch((err) => err);
    }

    this.sharedService.hideSpinner();

    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    } else {
      this.toast.success('Send token successfully.');
    }
  }

  viewAmountToRaw(amount: number, tokens: any[]): any {
    const decimal = !IsNullOrUndefined(tokens && tokens.length > 0 && tokens[0].TokenDecimal) ? tokens[0].TokenDecimal : -1;
    return decimal >= 0 ? Number(amount * (10 ** decimal)) : amount;
  }

  onTokenChanged(event) {
    setTimeout(() => {
      this.vm.autoTokens$ = SendViewModelResolver.filterToken(
        this.vm.selectedToken,
        this.vm
      );
    });
  }

}
