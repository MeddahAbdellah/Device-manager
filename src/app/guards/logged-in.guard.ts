import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService, HttpStatus } from '../services/api-service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private _apiService: ApiService, private router: Router) {}
  canActivate(): Observable<boolean | UrlTree> {
      return this._apiService.me().pipe(
        catchError((err) => {
          return of({ status: err.status });
        }),
        map((res) => {
          if (res.status === HttpStatus.SUCCESS) {
            return true;
          }
          return this.router.parseUrl('/login');
        }));
  }
  
}
