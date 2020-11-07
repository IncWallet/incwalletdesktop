import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationError } from './validation-error.model';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
})
export class ValidationMessageComponent {
  @Input('for')
  formControl: FormControl;

  @Input()
  validationError: ValidationError;

  get isInvalid() {
        return this.formControl.invalid && this.formControl.touched;
    }

  get errorMessage() {
      for (const error in this.validationError) {
          if (this.formControl.hasError(error)) {
              return this.validationError[error];
          }
      }

      return 'Unknown Error.';
  }

}
