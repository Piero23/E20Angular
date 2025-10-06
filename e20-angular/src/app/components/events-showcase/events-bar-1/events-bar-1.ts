import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-events-bar-1',
  imports: [
  ],
  templateUrl: './events-bar-1.html',
  styleUrl: './events-bar-1.css'
})
export class EventsBar1 implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('cardContainer') cardContainer!: ElementRef<HTMLDivElement>;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  private startTouch = 0;
  private scrollStart = 0;

  ngOnInit(): void {

  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit() {
    // Component initialized
  }

  // Touch events
  onTouchStart(event: TouchEvent) {
    this.startTouch = event.touches[0].pageX;
    this.scrollStart = this.cardContainer.nativeElement.scrollLeft;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.startTouch) return;

    const touch = event.touches[0].pageX;
    const diff = this.startTouch - touch;
    this.cardContainer.nativeElement.scrollLeft = this.scrollStart + diff;
  }

  onTouchEnd() {
    this.startTouch = 0;
    this.scrollStart = 0;
  }

  // Mouse events
  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    this.cardContainer.nativeElement.classList.add('grabbing');
    this.startX = event.pageX - this.cardContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.cardContainer.nativeElement.scrollLeft;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return;
    event.preventDefault();
    const x = event.pageX - this.cardContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    this.cardContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp() {
    this.isDown = false;
    this.cardContainer.nativeElement.classList.remove('grabbing');
  }
}
