import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Trabajador } from '../../interface/trabajador.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/admin';
  }

  loginAdmin(trabajador: Trabajador): Observable<{token:string}> {
    return this.http.post<{token:string}>(
      `${this.myAppUrl}${this.myApiUrl}/login-trabajador`,
      trabajador
    );
  }
}
