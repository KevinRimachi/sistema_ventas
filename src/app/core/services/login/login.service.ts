import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Trabajador } from '../../../interface/trabajador.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly appUrl: string;
  private readonly apiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.appUrl = environment.endpoint;
    this.apiUrl = 'api/admin';
  }

  loginAdmin(trabajador: Trabajador): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.appUrl}${this.apiUrl}/login-trabajador`, trabajador)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('expires_at');
    return expiresAt ? new Date().getTime() > parseInt(expiresAt, 10) : true;
  }

  handleTokenExpiration(): void {
    if (this.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('expires_at');
      this.router.navigate(['admin']);
    }
  }
}
