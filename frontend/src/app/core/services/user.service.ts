import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  getLoggedUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logged-user`);
  }
}