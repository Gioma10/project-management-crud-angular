import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ButtonComponent } from "../components/button/button.component";
import { CommonModule } from '@angular/common';
import { FormComponent } from '../components/form/form.component';

interface ProjectResponse {
  projects: any[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormComponent, MatIconModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  projects: any[] = [];
  showForm = false; // Controlla la visibilità del form
  selectedProject: any = null; // Progetto da modificare

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((data: ProjectResponse) => {
      this.projects = data.projects;
    });
  }

  // Metodo per eliminare un progetto
  deleteProject(projectId: string): void {
    this.projectService.deleteProject(projectId).subscribe(
      (response) => {
        this.projects = this.projects.filter(project => project.id !== projectId);
        console.log('Progetto eliminato con successo', response);
      },
      (error) => {
        console.error('Errore nell\'eliminazione del progetto', error);
      }
    );
  }

  // Alterna la visibilità del form e resetta il progetto selezionato se necessario
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.selectedProject = null;
    }
    console.log('showForm:', this.showForm);
  }

  // Funzione per gestire il salvataggio (sia per aggiunta che per aggiornamento)
  saveProject(project: { id?: string, name: string, description: string }) {
    if (project.id) {
      // Caso update: invia una richiesta PUT al backend
      this.projectService.updateProject(project.id, {
        title: project.name,
        description: project.description
      }).subscribe({
        next: (response) => {
          // Aggiorna l'array locale
          const index = this.projects.findIndex(p => p.id === project.id);
          if (index !== -1) {
            // Qui puoi decidere se sostituire l'intero oggetto o solo aggiornare le proprietà che ti interessano
            this.projects[index] = { ...this.projects[index], title: project.name, description: project.description };
          }
          console.log('Progetto aggiornato con successo', response);
          this.toggleForm();
        },
        error: (err) => {
          console.error('Errore nell\'aggiornamento del progetto:', err);
        }
      });
    } else {
      // Caso add: invia una richiesta POST al backend
      const newProject = {
        title: project.name,
        description: project.description
      };
  
      this.projectService.addProject(newProject).subscribe({
        next: (savedProject) => {
          this.projects.push(savedProject);
          console.log('Progetto aggiunto con successo', savedProject);
          this.toggleForm();
        },
        error: (err) => {
          console.error('Errore nel salvataggio del progetto:', err);
        }
      });
    }
  }

  // Metodo per annullare il form
  cancelForm() {
    this.showForm = false;
    this.selectedProject = null;
  }

  // Metodo per selezionare un progetto da modificare e mostrare il form
  editProject(project: any) {
    this.selectedProject = project;
    if (!this.showForm) {
      this.toggleForm();
    }
  }
}
