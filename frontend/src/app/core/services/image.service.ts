import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ImageService {

  private apiUrl = `${environment.apiUrl}/project-images`;

  constructor(
    private http: HttpClient
  ) { }

  uploadImages(projectId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post(`${this.apiUrl}/${projectId}`, formData);
  }
}
