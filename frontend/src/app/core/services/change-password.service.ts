import { Injectable } from '@angular/core';
import { ChangePasswordRequest, ResetPasswordModel } from '../models/change-password-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class ChangePasswordService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
  ) { }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, request);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(resetPassword: ResetPasswordModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, resetPassword);
  }
}