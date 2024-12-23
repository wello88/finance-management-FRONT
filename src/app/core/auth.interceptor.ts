// import { Injectable } from '@angular/core';
// import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
// import { Observable } from 'rxjs';

import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  return next(req);
};