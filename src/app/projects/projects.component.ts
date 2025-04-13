import { Component } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ButtonComponent } from "../components/button/button.component";
import { CommonModule } from '@angular/common';

interface ProjectResponse {
  projects: any[]; // O sostituisci 'any' con il tipo specifico se conosci la struttura dei progetti
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  projects: any[] = [];

  constructor(private projectService: ProjectService) {}
  

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((data: ProjectResponse) => {
      console.log(data);
      this.projects = data.projects;
    });
  }
}
