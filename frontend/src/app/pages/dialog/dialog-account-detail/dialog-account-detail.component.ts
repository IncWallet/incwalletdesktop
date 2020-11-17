import { Component, OnInit } from '@angular/core';
import { DialogAccountDetailViewModel } from './dialog-account-detail.vm';
import { OnDialogAction } from '../../../infrastructure/ui-helper';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-account-detail',
  templateUrl: './dialog-account-detail.component.html',
  styleUrls: ['./dialog-account-detail.component.scss']
})
export class DialogAccountDetailComponent implements OnInit, OnDialogAction {

  vm: DialogAccountDetailViewModel;
  constructor(
    protected ref: NbDialogRef<DialogAccountDetailComponent>,
  ) { }

  ngOnInit(): void {
  }

  toggleFlipped() {
    this.vm.Flipped = !this.vm.Flipped;
  }

  showQRCode(event) {
    switch (event.currentTarget.id) {
      case 'paymentAddress-QR':
        this.vm.QRCode = this.vm.PaymentAddress;
        this.vm.QRField = 'Your Incognito Address';
        break;
      case 'privateKey-QR':
        this.vm.QRCode = this.vm.PrivateKey;
        this.vm.QRField = 'Private Key';
        break;
      case 'publicKey-QR':
        this.vm.QRCode = this.vm.PublicKey;
        this.vm.QRField = 'Public Key';
        break;
      case 'viewingKey-QR':
        this.vm.QRCode = this.vm.ViewingKey;
        this.vm.QRField = 'Readonly Key';
        break;
      case 'miningKey-QR':
        this.vm.QRCode = this.vm.MiningKey;
        this.vm.QRField = 'Validators Key';
        break;
      default:
        this.vm.QRCode = '';
        this.vm.QRField = '';
        break;
    }

    if (this.vm.QRCode)
      this.toggleFlipped();
  }

  onCancel(event: any): void {
    this.ref.close();
  }

  onSubmit(event: any) {
  }

}
