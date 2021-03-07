import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from "rxjs";
import { tap, catchError, map } from  'rxjs/operators';
import { Router } from "@angular/router";
import { LocalStorageHelper } from "./local-storage.helper";

export enum HttpStatus {
  INTERNAL_SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
  SUCCESS = 200,
}

@Injectable()
export class ApiService {
  private _server = "https://gr6.algonics.net";
  private _token = LocalStorageHelper.getToken();

  constructor(private client: HttpClient, private router: Router) {
  }

  public login(email: string, password: string): Observable<any> {
    return this.client.post(`${this._server}/login`, { email, password }).pipe(
      catchError((err) => {
        if (err.status === HttpStatus.UNAUTHORIZED) alert('Access Unauthorized');
        if (err.status === HttpStatus.INTERNAL_SERVER_ERROR) alert('INTERNAL_SERVER_ERROR');
        return of({ token: null });
      }),
      tap((res)=> {
        this._setToken(res.token);
        this.router.navigate(['/']);
      }),
    );
  }

  public register(name: string, email: string, password: string): Observable<any> {
    return this.client.post(`${this._server}/register`, { name, email, password }).pipe(
      catchError((err) => {
        if (err.status === HttpStatus.INTERNAL_SERVER_ERROR) alert('INTERNAL_SERVER_ERROR');
        return of(null);
      }),
      tap(()=> {
        this.router.navigate(['/']);
      }),
    );
  }

  public me(): Observable<any> {
    return this.client.get(`${this._server}/me`, this._getHttpOptions());
  }

  public getStreamingSessionForDevice(deviceName: string): Observable<any> {
    return this.client.post(`${this._server}/createStreamingSession`, { deviceName }, this._getHttpOptions()).pipe(
      map((res: any) => res.body.sessionId ),
    );
  }

  public clearToken(): void {
    LocalStorageHelper.cleanLocalStorage();
    this._token = null;
  }

  private _getHttpOptions(): object {
    return {
      headers: {
        'x-access-token': this._token || '',
      },
      observe: 'response',
    }
  }

  private _setToken(token: string): void {
    this._token = token;
    LocalStorageHelper.storeToken(token);
  }
}