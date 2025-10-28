import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventoDto, EventoService} from '../../services/evento-service';
import {Subject, takeUntil} from 'rxjs';
import {Router} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {UtenteService} from '../../services/utente-service';
import {AuthService} from '../../services/auth-service';
import {PreferitiService} from '../../services/preferiti-service';

interface EventCard extends EventoDto {
  imageUrl?: string;
}

@Component({
  selector: 'app-event-cards',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './event-cards.html',
  styleUrl: './event-cards.css'
})
export class EventCards implements OnInit, OnDestroy {
  events: EventCard[] = [];
  followingEvents: EventCard[] = [];

  // While loading...
  isLoadingFollowing = true;
  isLoadingTrending = true;
  trendingPlaceholders = Array.from({ length: 3 });

  // Trending events state
  isDraggingTrending = false;
  startXTrending = 0;
  scrollLeftTrending = 0;

  // Following events state
  isDraggingFollowing = false;
  startXFollowing = 0;
  scrollLeftFollowing = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private utenteService: UtenteService,
    private authService: AuthService,
    private preferitiService: PreferitiService
  ) {
  }

  ngOnInit(): void {
    this.loadTrendingEvents();
    this.loadFollowingEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTrendingEvents(): void {
    this.isLoadingTrending = true;
    this.eventoService.getAllElementsPaginated(0, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const shuffled = response.content.sort(() => 0.5 - Math.random());
          this.events = shuffled
            .map(event => ({
              ...event,
              imageUrl: `${this.eventoService.getApiUrl()}/${event.id}/image`,
            }));
          this.isLoadingTrending = false;
        },
        error: (error) => {
          console.error('Error loading trending events:', error);
          this.isLoadingTrending = false;
        }
      });
  }

  loadFollowing(): void {
  }

  // Mouse events
  onMouseDownTrending(e: MouseEvent, carousel: HTMLElement): void {
    this.isDraggingTrending = true;
    carousel.classList.add('dragging');
    this.startXTrending = e.pageX - carousel.offsetLeft;
    this.scrollLeftTrending = carousel.scrollLeft;
  }

  onMouseLeaveTrending(carousel: HTMLElement): void {
    this.isDraggingTrending = false;
    carousel.classList.remove('dragging');
  }

  onMouseUpTrending(carousel: HTMLElement): void {
    this.isDraggingTrending = false;
    carousel.classList.remove('dragging');
  }

  onMouseMoveTrending(e: MouseEvent, carousel: HTMLElement): void {
    if (!this.isDraggingTrending) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - this.startXTrending) * 3;
    carousel.scrollLeft = this.scrollLeftTrending - walk;
  }

  onMouseDownFollowing(e: MouseEvent, carousel: HTMLElement): void {
    this.isDraggingFollowing = true;
    carousel.classList.add('dragging');
    this.startXFollowing = e.pageX - carousel.offsetLeft;
    this.scrollLeftFollowing = carousel.scrollLeft;
  }

  onMouseLeaveFollowing(carousel: HTMLElement): void {
    this.isDraggingFollowing = false;
    carousel.classList.remove('dragging');
  }

  onMouseUpFollowing(carousel: HTMLElement): void {
    this.isDraggingFollowing = false;
    carousel.classList.remove('dragging');
  }

  onMouseMoveFollowing(e: MouseEvent, carousel: HTMLElement): void {
    if (!this.isDraggingFollowing) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - this.startXFollowing) * 2;
    carousel.scrollLeft = this.scrollLeftFollowing - walk;
  }

  // Touch events
  onTouchStartTrending(e: TouchEvent, carousel: HTMLElement): void {
    this.isDraggingTrending = true;
    carousel.classList.add('dragging');
    this.startXTrending = e.touches[0].pageX - carousel.offsetLeft;
    this.scrollLeftTrending = carousel.scrollLeft;
  }

  onTouchMoveTrending(e: TouchEvent, carousel: HTMLElement): void {
    if (!this.isDraggingTrending) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - this.startXTrending) * 2;
    carousel.scrollLeft = this.scrollLeftTrending - walk;
  }

  onTouchEndTrending(carousel: HTMLElement): void {
    this.isDraggingTrending = false;
    carousel.classList.remove('dragging');
  }

  onTouchStartFollowing(e: TouchEvent, carousel: HTMLElement): void {
    this.isDraggingFollowing = true;
    carousel.classList.add('dragging');
    this.startXFollowing = e.touches[0].pageX - carousel.offsetLeft;
    this.scrollLeftFollowing = carousel.scrollLeft;
  }

  onTouchMoveFollowing(e: TouchEvent, carousel: HTMLElement): void {
    if (!this.isDraggingFollowing) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - this.startXFollowing) * 2;
    carousel.scrollLeft = this.scrollLeftFollowing - walk;
  }

  onTouchEndFollowing(carousel: HTMLElement): void {
    this.isDraggingFollowing = false;
    carousel.classList.remove('dragging');
  }

  // Navigation
  scrollLeft(carousel: HTMLElement): void {
    carousel.scrollBy({ left: -400, behavior: 'smooth' });
  }

  scrollRight(carousel: HTMLElement): void {
    carousel.scrollBy({ left: 400, behavior: 'smooth' });
  }

  goToEventDetails(eventId: number | undefined): void {
    console.log(eventId)
    if (eventId) {
      this.router.navigate(['/evento', eventId]);
    }
  }

  onImageError(event: any): void {
    event.target.src = '/assets/event_placeholder.jpg';
  }

  getImageUrl(id: number | null): string {
    return id ? `${this.eventoService.getApiUrl()}/${id}/image` : '/assets/event_placeholder.jpg';
  }


  private loadFollowingEvents(): void {
    this.isLoadingFollowing = true;
    console.log('Load Following Events');

    this.utenteService.getSeguiti(this.authService.token).subscribe({
      next: (utenti) => {
        console.log('Lista utenti:', utenti);
        utenti.forEach(amico =>{
          this.preferitiService.getFavorites(amico.username,this.authService.token).subscribe({
              next: (preferiti) => {
                console.log('Lista eventi preferiti da: ' + amico.username , preferiti);
                preferiti.forEach(evento => {
                  this.followingEvents.push(evento);
                })
              }
            }
          )
        })
        this.isLoadingFollowing = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento amici:', err);
        this.isLoadingFollowing = false;
      }
    });
  }
}
