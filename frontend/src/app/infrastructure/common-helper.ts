import { FormGroup, FormControl } from '@angular/forms';

export const IsNullOrUndefined = (value: any) => {
  return value === null || value === undefined;
};

export const IsNullOrWhiteSpace = (value: any) => {
  return value === null || (value && value.toString().trim() === '');
};

export const IsNullOrEmpty = (value: any) => {
  return value === null || value === '';
};

export const IsUseless = (value: any) => {
  return IsNullOrUndefined(value) || IsNullOrEmpty(value) || IsNullOrWhiteSpace(value);
};

/*
 * Http helper
 */
export const IsResponseError = (res: any) => {
  return (res && typeof res === 'string' && res.includes('Error:')) ||   // 'Error: bad request'
  (res && res.ok === false && res.error.Error) ||                        // fail res
  (res && res.Error);                                                    // success res and contain error
};

export const GetViewableError = (res: any) => {
  return (res && typeof res === 'string' && res.includes('Error:') && res) || // 'Error: bad request'
  (res && res.ok === false && res.error.Msg.split('.')[0]) ||                 // fail res
  (res && res.Error && res.Msg && res.Msg.split('.')[0]);                     // success res and contain error
};

/*
 * Auth helper
 */
export class Auth {
  static IsLoggedInWallet = (res: any) => {
    return !IsUseless(res && res.Msg && res.Msg.WalletID) ||
          // In case no wallet: Error: {Code: 0, Msg: "cannot show info, import or add account first"}, Msg: ""
          ((res && res.Error && res.Error.Code) !== 0);
  }
}

/*
 * Storage
 */
export class LocalStorage {
  static getValue(key: string) {
    const value = JSON.parse(localStorage.getItem(key));
    return value;
  }

  static setValue(key: string, value: any) {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(value));
  }

  static removeKey(key: string) {
    localStorage.removeItem(key);
  }

  static hasKey(key: string) {
    return localStorage.getItem(key) !== null;
  }
}

export class FormValidator {
  static validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  static validateField(controlName: string, form: FormGroup) {
    if (controlName && form.get(controlName)) {
      const control = form.get(controlName);
      control.updateValueAndValidity();
      control.markAsTouched();
    }
  }
}
