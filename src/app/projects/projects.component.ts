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
  imports: [CommonModule, ButtonComponent, FormComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  projects: any[] = [];
  showForm = false; // Variabile per controllare il form

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((data: ProjectResponse) => {
      // console.log(data);
      this.projects = data.projects;
    });
  }

  // Metodo per alternare la visibilità del form
  toggleForm(): void {
    this.showForm = !this.showForm;
    console.log(this.showForm);
    
  }

  // Metodo per aggiungere un progetto
  addProject(project: { name: string, description: string }) {
    const newProject = {
      title: project.name,
      description: project.description
    };
  
    this.projectService.addProject(newProject).subscribe({
      next: (savedProject) => {
        this.projects.push(savedProject); // Aggiungilo all’elenco locale
        this.toggleForm(); // Nascondi il form
      },
      error: (err) => {
        console.error('Errore nel salvataggio:', err);
      }
    });
  }

  // Metodo per annullare il form
  cancelForm() {
    this.showForm = false;
  }
}
