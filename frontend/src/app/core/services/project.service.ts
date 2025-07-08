import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectFormModel } from '../models/project-form-model';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private apiUrl = `${environment.apiUrl}/project`;

  constructor(
    private http: HttpClient
  ) { }

  addProject(dto: ProjectFormModel): Observable<{ projectId: number }> {
    return this.http.post<{ projectId: number }>(`${this.apiUrl}/projects`, dto);
  }

  uploadImages(projectId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post(`${this.apiUrl}/projects/${projectId}/images`, formData);
  }
}