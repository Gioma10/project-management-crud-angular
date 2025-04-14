import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
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
}
