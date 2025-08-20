import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectModel } from '../models/project-form-model';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private apiUrl = `${environment.apiUrl}/project`;

  constructor(
    private http: HttpClient
  ) { }

  addProject(dto: ProjectModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, dto);
  }

  changeVisibility(id: number, isVisible: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/visibility`, { isVisible });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<ProjectModel> {
    return this.http.get<ProjectModel>(`${this.apiUrl}/${id}`);
  }

  getOnlyVisibleProjects(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.apiUrl}/visible`);
  }

  update(id: number, dto: ProjectModel): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
  }
}