import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowbarSearch } from '../rowbar-search/rowbar-search';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-profilo-e-ordini',
  standalone: true,
  imports: [CommonModule, RowbarSearch],
  templateUrl: './profilo-e-ordini.html',
  styleUrls: ['./profilo-e-ordini.css']
})
export class ProfiloEOrdini implements OnInit {
  ordini: Evento[] = [];
  username = 'andrea';

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.loadOrdini();
  }

  private loadOrdini(): void {
    this.eventoService.getOrdini(this.username).subscribe({
      next: (ordini) => {
        this.ordini = ordini;
        console.log('Ordini dell\'utente:', this.ordini);
      },
      error: (err) => console.error('Errore caricamento ordini', err)
    });
  }
}
