import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [ButtonComponent, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {

  @Output() save = new EventEmitter<{ name: string }>();
  @Output() cancel = new EventEmitter<void>();

  taskName: string = ' ';

  onSave(event: Event) {
    event.preventDefault()
      if (this.taskName) {
      // Emette l'oggetto; include id se stiamo modificando un progetto esistente
      this.save.emit({
        name: this.taskName,
      });
      console.log('savedddd');
    
    }
  }

  onCancel() {
    this.cancel.emit();
    this.taskName = ' ';
  }
}
