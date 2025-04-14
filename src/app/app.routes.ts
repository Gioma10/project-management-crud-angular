import { Routes } from '@angular/router';
import path from 'node:path';
import { ProjectsComponent } from './projects/projects.component';
import { HomeComponent } from './home/home.component';
import { ProjectDetailComponent } from './detail/detail.component';


export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'projects', component: ProjectsComponent},
    {path: 'projects/:id', component: ProjectDetailComponent}
];
