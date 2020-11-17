import { ValidatorFn, AbstractControl } from '@angular/forms';
import { IsNullOrUndefined } from './common-helper';
import { TranslateService } from '@ngx-translate/core';
import { ValidationError } from '../pages/_shared/validation-message/validation-error.model';
import { DropDownItem } from '../api-clients/_index';

export class CommonValidators {
  static minMax(min?: number, max?: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        !IsNullOrUndefined(control.value) &&
        (isNaN(control.value) || (!IsNullOrUndefined(min) && control.value < min))
      ) {
        return { underMin: true };
      }

      if (!IsNullOrUndefined(control.value) && !IsNullOrUndefined(max) && control.value > max) {
        return { overMax: true };
      }
      return null;
    };
  }

  static dropdownItemValid(options: DropDownItem[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        IsNullOrUndefined(control.value) ||
        (!options.find(x => x.value.toString() === control.value.toString()))
      ) {
        return { itemNotFound: true };
      }
      return null;
    };
  }
}

export class CommonMsg {
  private translate: TranslateService;

  constructor(translate: TranslateService) {
    this.translate = translate;
  }

  dropDownItemNotFound(): ValidationError {
    return { itemNotFound: this.translate.instant('MESSAGES.ITEM_NOT_FOUND') };
  }

  fieldRequired(field: string): ValidationError {
    return {
      required: this.translate.instant('MESSAGES.FIELD_IS_REQUIRED', {
        field: field,
      })
    };
  }

  mustBeGreaterThanOrEquals(fieldLangKey: string, min: number): ValidationError {
    return { underMin: this.translate.instant('MESSAGES.FIELD_MUST_BE_GREATER_THAN_OR_EQUALS', {
      field: this.translate.instant(fieldLangKey),
      val: min
    }) };
  }
}
