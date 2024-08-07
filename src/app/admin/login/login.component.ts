import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../../core/services/login/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginAdminForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginAdminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginAdminForm.invalid) {
      this.showValidationErrors();
      return;
    }

    const formValues = this.loginAdminForm.value;
    this.loginService.loginAdmin(formValues).subscribe({
      next: (response: { token: string }) => {
        const token = response.token;
        const expiresIn = 3600; // 1 hour
        localStorage.setItem('token', token);
        localStorage.setItem(
          'expires_at',
          (new Date().getTime() + expiresIn * 1000).toString()
        );
        this.router.navigate(['admin/dashboard']);
      },
      error: (error: HttpErrorResponse) => this.showError(error),
    });
  }

  private showValidationErrors(): void {
    const { email, password } = this.loginAdminForm.controls;
    if (email.errors?.['required'] || password.errors?.['required']) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
    } else if (email.errors?.['email']) {
      this.toastr.error('El formato del email es inválido', 'Error');
    }
  }

  private showError(error: HttpErrorResponse): void {
    const errorMessage =
      error.error?.error ||
      'Ups ocurrió un error, comuníquese con el administrador';
    this.toastr.error(errorMessage, 'Error');
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginAdminForm.get(field);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
}
