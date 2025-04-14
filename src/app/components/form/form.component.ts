import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnChanges {

  @Input() project: any = null; // Se presente, usato per l'edit
  @Output() save = new EventEmitter<{ id?: string, name: string, description: string }>();
  @Output() cancel = new EventEmitter<void>();

  projectName: string = '';
  projectDescription: string = '';

  // Quando l'input cambia (ad esempio, quando si clicca "Edit"), aggiorna il form
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project) {
      this.projectName = this.project.title || '';
      this.projectDescription = this.project.description || '';
    }
  }

  // Metodo per salvare (Submit del form)
  onSave(event: Event) {
    event.preventDefault(); // Previene il comportamento predefinito del form

    if (this.projectName && this.projectDescription) {
      // Emette l'oggetto; include id se stiamo modificando un progetto esistente
      this.save.emit({
        id: this.project ? this.project.id : undefined,
        name: this.projectName,
        description: this.projectDescription
      });

      // Reset del form (questo potrebbe essere gestito dal componente padre se desiderato)
      this.projectName = '';
      this.projectDescription = '';
    }
  }

  // Metodo per annullare il form
  onCancel() {
    this.cancel.emit();
    // Reset dei campi del form
    this.projectName = '';
    this.projectDescription = '';
  }
}
