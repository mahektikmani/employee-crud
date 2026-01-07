import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log(` AuthInterceptor: Requesting ${req.url}`);

  if (token) {
    console.log(' AuthInterceptor: Adding token to request'); 
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn(' AuthInterceptor: No token found in localStorage'); }

  return next(req);
};
