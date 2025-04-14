import { Cancel } from './../../../backend/node_modules/axios/index.d';
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
  project: any = {};  // Per memorizzare i dati del progetto

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Ottieni l'ID del progetto dalla rotta
    this.projectId = this.route.snapshot.paramMap.get('id');
    
    if (this.projectId) {
      this.getProjectDetails(this.projectId); // Recupera i dettagli del progetto
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
        // Se hai una funzione che ricarica la lista delle task, chiamala qui
        // this.loadTasks();
      },
      error: (err) => console.error('Errore nel salvataggio task:', err)
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
}
