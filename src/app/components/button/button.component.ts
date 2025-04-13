import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() title: string = '';
  @Input() route: string = '';

  constructor(private router: Router) {}

  navigate() {
    if(this.route){
      this.router.navigate([this.route])
    }
  }
}
