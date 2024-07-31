import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ErrorHandler, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router)
  const _errorServices = inject(ErrorHandler)

  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401){
        _errorServices.handleError(error)
        router.navigate(['admin'])
      }
      return throwError(() => new Error('Error'))
    })
  );
};
