import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [ButtonComponent, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {

  @Input() initialValue: string = '';


  @Output() save = new EventEmitter<{ name: string }>();
  @Output() cancel = new EventEmitter<void>();

  taskName: string = ' ';

  ngOnInit(): void {
    this.taskName = this.initialValue || '';
  }

  onSave(event: Event) {
    event.preventDefault();
    if (this.taskName.trim()) {
      this.save.emit({ name: this.taskName });
      console.log('savedddd');
      this.taskName = '';
    }
  }

  onCancel() {
    this.cancel.emit();
    this.taskName = ' ';
  }
}
