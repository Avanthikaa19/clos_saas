import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhonenumberValidation]'
})
export class PhonenumberValidationDirective {

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('input')
  validatePhoneNumber() {
    const inputValue = this.el.nativeElement.value;
    const cleanedValue = inputValue.replace(/[^0-9+]/g, '');
    this.el.nativeElement.value = cleanedValue;
  }

}
