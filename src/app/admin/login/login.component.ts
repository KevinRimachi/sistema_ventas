import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../../core/services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  loginAdminForm!: FormGroup;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _trabajadorService: LoginService,
    private router: Router
  ) {
    this.loginAdminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    const { email, password } = this.loginAdminForm.controls;

    if (this.loginAdminForm.invalid) {
      if (email.errors?.['required'] || password.errors?.['required']) {
        this.toastr.error('Todos los campos son obligatorios', 'Error');
      } else if (email.errors?.['email']) {
        this.toastr.error('El formato del email es inválido', 'Error');
      }
      return;
    }

    // Si el formulario es válido, realiza la solicitud de login.
    const formValues = this.loginAdminForm.value;
    this._trabajadorService.loginAdmin(formValues).subscribe({
      next: (response: {token: string}) => {
        const token = response.token
        this.router.navigate(['admin/dashboard']);
        localStorage.setItem('token', token);
        console.log(token)
      },
      error: (e: HttpErrorResponse) => {
        this.msjError(e);
      },
      complete: () => console.info('complete'),
    });
  }

  msjError(e: HttpErrorResponse) {
    if (e.error.error) {
      this.toastr.error(e.error.error, 'Error');
    } else {
      this.toastr.error(
        'Ups ocurrio un error, comuniquese con el administrador',
        'Error'
      );
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginAdminForm.get(field);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
}
