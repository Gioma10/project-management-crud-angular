import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ProjectResponse {
  projects: any[]; // O sostituisci 'any' con il tipo specifico se conosci la struttura dei progetti
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(this.apiUrl);
  }

  addProject(project: { title: string; description: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, project);
  }
}
