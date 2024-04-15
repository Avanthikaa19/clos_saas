import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDecimalPlaces]'
})
export class DecimalPlacesDirective {

  private allowedDecimals: number = 4;

  constructor(private el: ElementRef) {}

  @HostListener('input')
  onInput(): void {
    const value = this.el.nativeElement.value;
    const regex = new RegExp(`^\\d+(?:\\.\\d{0,${this.allowedDecimals}})?$`);
    if (!regex.test(value)) {
      this.el.nativeElement.value = value.slice(0, -1);
    }
  }

}
