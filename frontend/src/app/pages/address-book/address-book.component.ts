import { Component, OnInit } from '@angular/core';
import { AddressBookClient } from '../../api-clients/address-book.client';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AddressBookViewModel } from './address-book.vm';
import { LocalDataSource } from 'ng2-smart-table';
import { SharedService } from '../../infrastructure/_index';
import { AddressBooksReq } from '../../api-clients/models/address-book.model';
import { IsResponseError, GetViewableError, IsUseless } from '../../infrastructure/common-helper';
import { DialogPromptComponent } from '../_shared/dialog-prompt/dialog-prompt.component';
import { TransactionEntity } from '../../entity/transaction.entity';
import { ClipboardService, IClipboardResponse } from 'ngx-clipboard';

@Component({
  selector: 'ngx-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit {

  vm: AddressBookViewModel;
  addressBookSettings: any;
  addressBookResource: LocalDataSource = new LocalDataSource();

  constructor(
    private route: ActivatedRoute,
    protected http: HttpClient,
    protected dialogService: NbDialogService,
    private toast: ToastrService,
    private addressClient: AddressBookClient,
    private sharedService: SharedService,
    private clipboard: ClipboardService
  ) {
    const data = this.route.snapshot.data.pageData;
    this.addressBookSettings = this.getAddressBookSettings();
    this.addressBookResource.load(data.addresses);
  }

  ngOnInit(): void {
    this.onClipboardCopied();
  }

  async onAddConfirm(event) {
    this.sharedService.showSpinner();
    const model = this.getInlineAddressModel(event.newData);
    const res = await this.addressClient
    .add(model)
    .toPromise()
    .catch(err => err);

    this.sharedService.hideSpinner();
    if (IsResponseError(res)) {
      this.toast.error(GetViewableError(res));
    } else {
      this.toast.success('The address has been added successfully.');
    }

    this.loadAddressBook();
  }

  async onDeleteConfirm(event) {
    this.dialogService
      .open(DialogPromptComponent, {
        context: {
          messages: 'The selected item will be deleted. Do you want to continue?',
        },
        hasScroll: true,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe(async (confirm) => {
        if (confirm) {
          this.sharedService.showSpinner();
          const model = this.getInlineAddressModel(event.data);
          const res = await this.addressClient
          .remove(model)
          .toPromise()
          .catch(err => err);

          this.sharedService.hideSpinner();
          if (IsResponseError(res)) {
            this.toast.error(GetViewableError(res));
          } else {
            this.toast.success('The address has been deleted.');
          }

          this.loadAddressBook();
        }
      });
  }

  getInlineAddressModel(data: any): AddressBooksReq {
    const model = new AddressBooksReq();
    model.name = data.name;
    model.paymentaddress = data.paymentaddress;
    model.chainname = data.chainname;
    model.chaintype = data.chaintype;

    return model;
  }

  async loadAddressBook() {
    const res = await this.addressClient
    .getAll()
    .toPromise()
    .catch(err => err);

    if (!IsResponseError(res)) {
      if (!IsUseless(res.Msg)) {
        for (let index = 0; index < res.Msg.length; index++) {
          const element = res.Msg[index];
          element.id = `#${index + 1}`;
        }
      }
      this.addressBookResource.load(res.Msg);
    }
  }

  onCustomAction(event): void {
    switch (event.action) {
      case 'CopyToken':
        this.copyToken(event.data);
        break;
    }
  }

  copyToken(data: any) {
    this.clipboard.copy(data.paymentaddress);
  }

  onClipboardCopied() {
    this.clipboard.copyResponse$.subscribe((res: IClipboardResponse) => {
      if (res.isSuccess) {
        this.toast.success('Copied to clipboard!');
      }
    });
  }

  getAddressBookSettings(): any {
    const settings = {
      hideSubHeader: false,
      add: {
        confirmCreate: true,
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        confirmDelete: true,
        deleteButtonContent: '<i class="nb-trash"></i>',
      },
      actions: {
        add: true,
        delete: true,
        edit: false,
        custom: [
          {
            name: 'CopyToken',
            title: '<i class="nb-square-outline" title="Copy payment address"></i>',
          },
        ],
        position: 'right'
      },
      columns: {
        id: {
          title: '#',
          type: 'string',
          filter: false,
          addable: false,
        },
        name: {
          title: 'Name',
          type: 'string',
          filter: false,
        },
        paymentaddress: {
          title: 'Payment address',
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
          filter: false,
          type: 'html',
          editor: {
            type: 'list',
            config: {
              list: [
                { value: 'mainnet', title: 'mainnet' },
                { value: 'testnet', title: 'testnet' },
                { value: 'local', title: 'local' },
              ]
            }
          }
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
