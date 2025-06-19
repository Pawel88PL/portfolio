import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private passwordService: ChangePasswordService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initialeLoginForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
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
      this.toastr.warning('Please enter a valid email address.', 'Invalid email');
      return;
    }

    this.isInForgotPasswordProcess = true;
    this.passwordService.forgotPassword(email).subscribe({
      next: () => {
        this.isInForgotPasswordProcess = false;
        this.toastr.success('Email whith reset link has been sent.', 'Reset password');
      },
      error: (error) => {
        this.isInForgotPasswordProcess = false;
        this.toastr.error(error.error.message, 'Reset password error');
        console.log(error);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.warning('Complete all fields correctly before logging in.', 'Invalid form');
      return;
    }

    if (this.loginForm.valid) {
      this.isInLogginProcess = true;
      const loginData = this.loginForm.value;
      this.authService.login(loginData.username, loginData.password).subscribe({
        next: () => {
          this.errorMessage = null;
          // Redirect handling in AuthService
        },
        error: (message) => {
          this.isInLogginProcess = false;
          this.toastr.error(message, 'Login error');
        }
      });
    }
  }

  togglePasswordVisibility(state: boolean): void {
    this.hidePassword = !state;
  }
}