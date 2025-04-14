import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Output() save = new EventEmitter<{ name: string, description: string }>();
  @Output() cancel = new EventEmitter<void>();

  projectName: string = '';
  projectDescription: string = '';

  // Metodo per salvare
  onSave(event: Event) {
    event.preventDefault(); // Previene il comportamento di submit del form

    if (this.projectName && this.projectDescription) {
      // Emette i dati del form
      this.save.emit({
        name: this.projectName,
        description: this.projectDescription
      });

      // Reset dei campi del form
      this.projectName = '';
      this.projectDescription = '';
    }
  }

  // Metodo per cancellare
  onCancel() {
    this.cancel.emit();
    this.projectName = '';
    this.projectDescription = '';
  }
}
