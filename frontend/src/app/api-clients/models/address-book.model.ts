import { ApiRes, ApiReq } from '../_index';

export class AddressBook {
  id: string;
  name: string;
  paymentaddress: string;
  chainname: string;
  chaintype: string;
}

export class AddressBooksReq extends ApiReq {
  name: string;
  paymentaddress: string;
  chainname: string;
  chaintype: string;
}

export class AddressBooksRes extends ApiRes {
  Msg: [AddressBook];
}
