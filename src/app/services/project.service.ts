import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaccia per un singolo progetto
export interface Project {
  id?: string;
  title: string;
  description: string;
  createdAt?: string;
}

// Interfaccia per la risposta della chiamata GET che restituisce una lista di progetti
export interface ProjectResponse {
  projects: Project[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  // Recupera l'elenco dei progetti
  getProjects(): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(this.apiUrl);
  }

  // Aggiunge un nuovo progetto (POST)
  addProject(project: { title: string; description: string }): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  // Elimina un progetto dato il suo ID (DELETE)
  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}`);
  }

  // Recupera i dettagli di un singolo progetto per ID (GET)
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  // Aggiorna un progetto esistente (PUT)
  updateProject(projectId: string, projectData: { title: string; description: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${projectId}`, projectData);
  }

  //Aggiungi task
  addTask(projectId: string, task: any) {
    return this.http.post(`${this.apiUrl}/${projectId}/tasks`, task);
  }
}
