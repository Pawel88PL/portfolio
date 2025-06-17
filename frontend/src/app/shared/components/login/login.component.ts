import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ChangePasswordService } from '../../../core/services/change-password.service';
import { ToastrService } from 'ngx-toastr';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,

    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {

  errorMessage: string | null = null;
  hidePassword: boolean = true;
  isInLogginProcess: boolean = false;
  isInForgotPasswordProcess: boolean = false;
  loginForm!: FormGroup;

  // Referencja do pola input dla userName
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private passwordService: ChangePasswordService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initialeLoginForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    });
  }

  getQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['newUser']) {
        this.welcomeAlert();
      }
    });
  }

  initialeLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onForgotPassword(): void {
    const email = this.loginForm.get('username')?.value;
    if (!email || !this.loginForm.get('username')?.valid) {
      this.toastr.warning('Wprowadź poprawny adres e-mail przed resetem hasła.', 'Nieprawidłowy adres e-mail');
      return;
    }

    this.isInForgotPasswordProcess = true;
    this.passwordService.forgotPassword(email).subscribe({
      next: () => {
        this.isInForgotPasswordProcess = false;
        this.toastr.success('E-mail z instrukcją resetowania hasła został wysłany.', 'Resetowanie hasła');
      },
      error: (error) => {
        this.isInForgotPasswordProcess = false;
        this.toastr.error(error.error.message, 'Błąd resetowania hasła');
        console.log(error);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.warning('Wypełnij wszystkie pola formularza.', 'Błąd logowania');
      return;
    }

    if (this.loginForm.valid) {
      this.isInLogginProcess = true;
      const loginData = this.loginForm.value;
      this.authService.login(loginData.username, loginData.password).subscribe({
        next: () => {
          this.errorMessage = null;
          // Przekierowanie obsługiwane w serwisie
        },
        error: (message) => {
          this.isInLogginProcess = false;
          this.toastr.error(message, 'Błąd logowania');
        }
      });
    }
  }

  togglePasswordVisibility(state: boolean): void {
    this.hidePassword = !state;
  }

  welcomeAlert(): void {
    this.toastr.success(
      `Aby zalogować się do aplikacji użyj swojego adresu email.<br>
      Jednorazowe hasło zostało wysłane na numer telefonu podany podczas rejestracji.`,
      'Witaj nowy użytkowniku!', {
      timeOut: 30000,
      extendedTimeOut: 2000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      enableHtml: true,
      positionClass: 'toast-top-right',
    });
  }
}