import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'] // Correzione: 'styleUrls' dovrebbe essere al plurale
})
export class ButtonComponent {
  @Input() title: string = ''; // Titolo del bottone
  @Input() route: string = ''; // Per la navigazione

  @Output() clicked= new EventEmitter<void>()

  constructor(private router: Router) {}

  // Metodo per navigare alla rotta specificata
  navigate() {
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }

  // Gestione dell'evento click
  onClick() {
    if (this.route) {
      this.router.navigate([this.route]);
    }

    this.clicked.emit();
  }
}
