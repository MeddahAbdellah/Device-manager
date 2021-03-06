import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApiService } from '../services/api-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../app.component.scss',
  ]
})
export class LoginComponent implements OnInit {
  public email;
  public password;
  constructor(private _apiService: ApiService) { }

  ngOnInit() {
  }

  public login() {
    if (this.email && this.password) {
      this._apiService.login(this.email, this.password).pipe(take(1)).subscribe();
    } else {
      alert('you must fill both email and password');
    }
  }
}
