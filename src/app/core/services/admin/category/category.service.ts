import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Categoria } from '../../../../interface/categoria.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/admin/categoria';
  }

  getCategory(): Observable<Categoria[]> {
    // const token = localStorage.getItem('token')
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    // return this.http.get<Categoria[]>(`${this.myAppUrl}${this.myApiUrl}/obtener-categoria`, {headers: headers})
    return this.http
      .get<{ categorias: Categoria[] }>(
        `${this.myAppUrl}${this.myApiUrl}/obtener-categoria`
      )
      .pipe(map((response) => response.categorias));
  }

  createCategory(categoria: Categoria): Observable<any> {
    return this.http.post(
      `${this.myAppUrl}${this.myApiUrl}/registrar-categoria`,
      categoria
    );
  }

  updateCategory(id: number, categoria: Categoria): Observable<any> {
    return this.http.put(
      `${this.myAppUrl}${this.myApiUrl}/actualizar-categoria/${id}`,
      categoria
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(
      `${this.myAppUrl}${this.myApiUrl}/eliminar-categoria/${id}`
    );
  }
}
