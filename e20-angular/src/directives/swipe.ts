// swipe.directive.ts
import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective {
  @Output() swipeLeft = new EventEmitter();
  @Output() swipeRight = new EventEmitter();

  private startX = 0;
  private scrollLeft = 0;

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.cursor = 'grab';
    this.setupEvents();
  }

  private setupEvents() {
    const element = this.el.nativeElement;

    element.addEventListener('touchstart', (e: TouchEvent) => {
      this.startX = e.touches[0].pageX;
      this.scrollLeft = element.scrollLeft;
    });

    element.addEventListener('touchmove', (e: TouchEvent) => {
      const touch = e.touches[0].pageX;
      const diff = this.startX - touch;
      element.scrollLeft = this.scrollLeft + diff;
    });
  }
}
