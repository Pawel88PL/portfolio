import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  private loginSuccess = new Subject<void>();
  loginSuccess$ = this.loginSuccess.asObservable();
  
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  afterSuccessLogin(token: string): void {
    this.jwtService.setToken(token);
    this.loginSuccess.next();

    const toastId = localStorage.getItem('sessionExpiredToastId')

    if (toastId) {
      localStorage.removeItem('sessionExpiredToastId');
      this.toastr.clear(Number(toastId));
    }

    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  isAdmin(): boolean {
    const roles = this.jwtService.getUserRole();
    return roles.includes('Administrator');
  }

  isLoggedIn(): boolean {
    const token = this.jwtService.getToken();
    return !!token && !this.jwtService.isTokenExpired();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(res => {
        const token = res.token?.result;
        if (token) {
          this.afterSuccessLogin(token);
        } else {
          this.jwtService.clearToken();
          this.toastr.error('Nieprawidłowy token logowania. Spróbuj ponownie.', 'Błąd logowania');
          throw new Error('Token is missing');
        }
      }),
      catchError(error => {
        const errorMessage = error.error?.message || 'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
        return throwError(() => errorMessage);
      })
    );
  }

  logout(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
      localStorage.removeItem('token');
    }
  }
}