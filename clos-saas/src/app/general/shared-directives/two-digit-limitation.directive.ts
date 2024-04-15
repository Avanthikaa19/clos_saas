import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTwoDigitLimitation]'
})
export class TwoDigitLimitationDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement) {
    const maxLength = 2;
    const regex = new RegExp(`^\\d{0,${maxLength}}$`);
    const value = input.value;
    if (!regex.test(value)) {
      input.value = value.slice(0, maxLength);
    }
  }
}
