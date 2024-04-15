import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventSpace]'
})
export class PreventSpaceDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const inputValue = this.el.nativeElement.value;

    // Check if the pressed key is the spacebar and if it's the first character
    if (event.key === ' ' && inputValue.trim() === '' && inputValue.length === 0) {
      event.preventDefault();
    }
  }
}