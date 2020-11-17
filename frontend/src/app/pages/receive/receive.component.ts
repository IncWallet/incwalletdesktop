import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogPassphraseComponent } from '../dialog/dialog-passphrase/dialog-passphrase.component';
import { DialogPassphraseViewModel } from '../dialog/dialog-passphrase/dialog-passphrase.vm';
import { GetViewableError, IsResponseError } from '../../infrastructure/common-helper';
import { AccountClient } from '../../api-clients/account.client';
import { NbDialogService } from '@nebular/theme';
import { SharedService } from '../../infrastructure/_index';
import { ClipboardService, IClipboardResponse } from 'ngx-clipboard';

@Component({
  selector: 'ngx-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {

  qrCode: string;
  showQRCode: boolean;
  accountName: string;

  constructor(
    private clipboard: ClipboardService,
    private toast: ToastrService,
    private sharedService: SharedService,
    private dialogService: NbDialogService,
    private accountClient: AccountClient,
    ) { }

  ngOnInit(): void {
    this.getQRCode();
    this.onClipboardCopied();
  }

  copyToClipboard() {
    this.clipboard.copy(this.qrCode);
  }

  onClipboardCopied() {
    this.clipboard.copyResponse$.subscribe((res: IClipboardResponse) => {
      if (res.isSuccess) {
        this.toast.success('Copied to clipboard!');
      }
    });
  }

  saveAsImage(parent) {
    const parentElement = parent.qrcElement.nativeElement.querySelector('img').src;
    const blobData = this.convertBase64ToBlob(parentElement);

    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
      window.navigator.msSaveOrOpenBlob(blobData, 'Qrcode');
    } else { // Chrome
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'QRCode';
      link.click();
    }
  }

  private convertBase64ToBlob(Base64Image: any) {
    const parts = Base64Image.split(';base64,');
    const imageType = parts[0].split(':')[1];
    const decodedData = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: imageType });
  }

  showQR() {
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
          this.getQRCode();
        }
      });
  }

  async getQRCode() {
    this.sharedService.showSpinner();

    const res = await this.accountClient
    .info()
    .toPromise()
    .catch((err) => err);

    this.sharedService.hideSpinner();

    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    } else {
      this.accountName = res.Msg.AccountName;
      this.qrCode = res.Msg.PaymentAddress;
      this.showQRCode = true;
    }
  }
}
