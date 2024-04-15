import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appCommaSeparatedInput]'
})
export class CommaSeparatedInputDirective {

  constructor(private el: ElementRef, private renderer: Renderer2, private ngModel: NgModel) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
  const inputElement = this.el.nativeElement as HTMLInputElement;
  const inputValue = inputElement.value;
  const numericValue = inputValue.replace(/[^0-9]/g, '');
 
  const formattedValue = this.formatWithCommas(numericValue);
  this.ngModel.control.setValue(formattedValue);
 
  // UPDATE THE INPUT VALUE WITH FORMATTED VALUE
  this.renderer.setProperty(inputElement, 'value', formattedValue);
  }
 
  private formatWithCommas(value: string): string {
  if (!value) {
  return '';
  }
 
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{15})+(?!\d))/g, ',');
  return parts.join('.');
  }
 
 }
