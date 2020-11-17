import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[digitNumeric]'
})
export class NumericDirective {
  @Input('decimals') decimals: number = 0;
  @Input('negative') negative: number = 0;
  @Input('separator') separator: string = '.';

  private checkAllowNegative(value: string) {
    if (this.decimals <= 0) {
      return String(value).match(new RegExp(/^-?\d+$/));
    } else {
      const regExpString =
        '^-?\\s*((\\d+(\\' + this.separator + '\\d{0,' +
        this.decimals +
        '})?)|((\\d*(\\' + this.separator + '\\d{1,' +
        this.decimals +
        '}))))\\s*$';
      return String(value).match(new RegExp(regExpString));
    }
  }

  private check(value: string) {
    if (this.decimals <= 0) {
      return String(value).match(new RegExp(/^\d+$/));
    } else {
      const regExpString =
        '^\\s*((\\d+(\\' + this.separator + '\\d{0,' +
        this.decimals +
        '})?)|((\\d*(\\' + this.separator + '\\d{1,' +
        this.decimals +
        '}))))\\s*$';
      return String(value).match(new RegExp(regExpString));
    }
  }

  private run(oldValue) {
    setTimeout(() => {
      const currentValue: string = this.el.nativeElement.value;
      const allowNegative = this.negative > 0 ? true : false;

      if (allowNegative) {
        if (
          !['', '-'].includes(currentValue) &&
          !this.checkAllowNegative(currentValue)
        ) {
          this.el.nativeElement.value = oldValue;
        }
      } else {
        if (currentValue !== '' && !this.check(currentValue)) {
          this.el.nativeElement.value = oldValue;
        }
      }
    });
  }

  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    this.run(this.el.nativeElement.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    this.run(this.el.nativeElement.value);
  }
}
