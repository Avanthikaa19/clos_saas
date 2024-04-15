import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appInputseperatecomma]'
})
export class InputseperatecommaDirective {

  constructor(private el: ElementRef, private renderer: Renderer2, private ngModel: NgModel) {
    if (ngModel && ngModel.control) {
      ngModel.control.setValue(0);
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.applyFormatting();
    }, 0);
  }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let inputValue = inputElement.value;
    inputValue = inputValue.replace(/[^\d.]/g, '');
    const dotIndex = inputValue.indexOf('.');
    if (dotIndex !== -1) {
      inputValue = inputValue.slice(0, dotIndex + 1) + inputValue.slice(dotIndex + 1).replace(/\./g, '');
    }
    const parts = inputValue.split('.');
    if (parts[1] && parts[1].length > 4) {
      inputValue = parts[0] + '.' + parts[1].slice(0, 4);
    }

    const formattedValue = this.formatWithCommas(inputValue);
    const numericFormattedValue = this.parseFormattedValue(inputValue);

    this.ngModel.control.setValue(numericFormattedValue);
    this.renderer.setProperty(inputElement, 'value', formattedValue);
  }

  @HostListener('focus', ['$event.target']) onFocus(target: HTMLInputElement): void {
    const numericValue = target.value.replace(/,/g, '');

    // If the numeric value is zero, show an empty string to avoid displaying "0.0000"
    const formattedValue = parseFloat(numericValue) === 0 ? '' : numericValue;
    this.renderer.setProperty(target, 'value', formattedValue);
  }

  @HostListener('blur', ['$event.target']) onBlur(target: HTMLInputElement): void {
    this.applyFormatting();
  }

  private applyFormatting() {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const numericValue = parseFloat(inputElement.value.replace(/,/g, ''));
    const formattedValue = isNaN(numericValue) || numericValue === 0 ? 0 : this.formatWithCommas(numericValue.toFixed(4));
    this.renderer.setProperty(inputElement, 'value', formattedValue);
  }

  private formatWithCommas(value: string | number): string {
    if (!value && value !== 0) {
      return '';
    }

    const stringValue = typeof value === 'number' ? value.toFixed(4) : value;
    const parts = stringValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  private parseFormattedValue(value: string): number {
    if (!value) {
      return null; // Change this line to return null when the input is empty
    }

    const numericValue = value.replace(/[^0-9.-]/g, '');
    return parseFloat(numericValue);
  }
}
