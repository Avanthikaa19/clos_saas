import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTexttypeValidation]'
})
export class TexttypeValidationDirective {
  private regex: RegExp = /^[a-zA-Z]*$/;
  private regexPattern = /^[a-zA-Z\s]*$/;

  constructor(
    private eRef: ElementRef,
  ) { }


  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    const matches = inputValue.match(this.regexPattern);
    if (!matches) {
      // If the input doesn't match the pattern, remove the invalid characters
      input.value = inputValue.replace(/[^a-zA-Z\s]/g, '');
    }
  }

}
