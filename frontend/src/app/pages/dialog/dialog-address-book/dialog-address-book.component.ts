import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AddressBookClient } from '../../../api-clients/address-book.client';
import { NbDialogRef } from '@nebular/theme';
import { SharedService } from '../../../infrastructure/_index';
import { ToastrService } from 'ngx-toastr';
import { DialogAddressBookViewModel } from './dialog-address-book.vm';
import { LocalDataSource } from 'ng2-smart-table';
import { IsResponseError, GetViewableError } from '../../../infrastructure/common-helper';
import { OnDialogAction } from '../../../infrastructure/ui-helper';
import { TransactionEntity } from '../../../entity/transaction.entity';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngx-dialog-address-book',
  templateUrl: './dialog-address-book.component.html',
  styleUrls: ['./dialog-address-book.component.scss']
})
export class DialogAddressBookComponent implements OnInit, AfterViewInit, OnDialogAction {

  vm: DialogAddressBookViewModel;
  addressSettings: any;
  addressSource: LocalDataSource;

  constructor(
    protected ref: NbDialogRef<DialogAddressBookComponent>,
    protected addressBookClient: AddressBookClient,
    private sharedService: SharedService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.addressSettings = this.getSettings();
    setTimeout(() => {
      this.loadAddressBook();
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  async loadAddressBook() {
    this.sharedService.showSpinner();
    const res = await this.addressBookClient
    .getAll()
    .toPromise()
    .catch(err => err);

    this.sharedService.hideSpinner();
    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    } else {
      this.addressSource = new LocalDataSource(res.Msg);
    }
  }

  onCustomAction(event) {
    if (event.action === 'select') {
      this.ref.close(event.data.paymentaddress);
    }
  }

  onCancel(event: any): void {
    this.ref.close();
  }

  onSubmit(event: any) {
  }

  getSettings(): any {
    const settings = {
      hideSubHeader: true,
      actions: {
        add: false,
        delete: false,
        edit: false,
        custom: [
          {
            name: 'select',
            title: '<i class="nb-checkmark-circle" title="Click to select"></i>',
          },
        ],
        position: 'right'
      },
      columns: {
        name: {
          title: 'Name',
          type: 'string',
          filter: false,
        },
        paymentaddress: {
          title: 'Address',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value, row, cell) => {
            return TransactionEntity.toViewToken(value);
           }
        },
        chainname: {
          title: 'Chain name',
          type: 'string',
          filter: false,
        },
        chaintype: {
          title: 'Chain type',
          type: 'string',
          filter: false,
        },
      },
      attr: {
        class: 'table table-bordered',
      },
      pager: {
        perPage: 1000,
      },
    };

    return settings;
  }

}
