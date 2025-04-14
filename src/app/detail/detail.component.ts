import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from "../components/button/button.component";
import { TaskFormComponent } from "../components/task-form/task-form.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  imports: [MatIconModule, ButtonComponent, TaskFormComponent, CommonModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  showForm:boolean = false;
  projectId: string | null = '';
  tasks: any[] = []; // Array per le task (senza modello separato)
  project: any = {};  // Per memorizzare i dati del progetto
  editingTask: any = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Ottieni l'ID del progetto dalla rotta
    this.projectId = this.route.snapshot.paramMap.get('id');
    
    if (this.projectId) {
      this.getProjectDetails(this.projectId); // Recupera i dettagli del progetto
      this.loadTasks(); // Carica le task relative al progetto
    }
  }

  getProjectDetails(id: string): void {
    this.projectService.getProjectById(id).subscribe(
      (data) => {
        this.project = data;
        console.log('Dati progetto:', this.project);
      },
      (error) => {
        console.error('Errore nel recupero del progetto', error);
      }
    );
  }

  // Carica le task del progetto
  loadTasks(): void {
    if (this.projectId) {
      this.projectService.getTasksForProject(this.projectId).subscribe(
        (response) => {
          // Accedi all'array di task all'interno della risposta
          if (Array.isArray(response.tasks)) {
            this.tasks = response.tasks;  // Assegna l'array di task al nostro array
            console.log('Task caricate:', this.tasks);
          } else {
            console.error('Errore: la proprietà "tasks" non è un array', response);
            this.tasks = [];  // Imposta un array vuoto come fallback
          }
        },
        (error) => {
          console.error('Errore nel recupero delle task:', error);
        }
      );
    }
  }
  

  

  createTask(taskData: { name: string }) {
    const task = {
      title: taskData.name
    };

    if (!this.projectId) {
      console.error('Project ID mancante!');
      return;
    }
  
    this.projectService.addTask(this.projectId, task).subscribe({
      next: (res) => {
        console.log('Task salvata:', res);
        this.showForm = false;
        this.loadTasks();
      },
      error: (err) => console.error('Errore nel salvataggio task:', err)
    });
  }
  editTask(task: any): void {
    this.editingTask = task;
    this.showForm = true;
  }

  updateTask(taskData: { name: string }): void {
    if (!this.projectId || !this.editingTask) {
      console.error('Project ID o Task mancante!');
      return;
    }
  
    const updatedTask = {
      ...this.editingTask,
      title: taskData.name
    };
  
    this.projectService.updateTask(this.projectId, this.editingTask.id, updatedTask).subscribe({
      next: () => {
        console.log('Task aggiornata');
        this.loadTasks();
        this.showForm = false;
        this.editingTask = null;
      },
      error: (err) => console.error('Errore aggiornamento task:', err)
    });
  }

  // Funzione per eliminare una task
  deleteTask(taskId: string): void {
    if (!this.projectId) {
      console.error('Project ID mancante!');
      return;
    }

    this.projectService.deleteTask(this.projectId, taskId).subscribe({
      next: () => {
        console.log('Task eliminata');
        // Rimuovi la task dalla lista
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      },
      error: (err) => console.error('Errore nell\'eliminazione della task:', err)
    });
  }

  // Alterna la visibilità del form e resetta il progetto selezionato se necessario
  toggleForm(): void {
    this.showForm = !this.showForm;
    
    console.log('showForm:', this.showForm);
  }

  cancelForm() {
    this.showForm = false;
  }

  completedTask(task:any): void {
    task.completed = !task.completed
    console.log(task.completed);
    
  }
}
