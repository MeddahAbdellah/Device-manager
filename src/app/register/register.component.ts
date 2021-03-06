import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ApiService } from '../services/api-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public name;
  public email;
  public password;
  constructor(private _apiService: ApiService) { }

  ngOnInit() {
  }

  public register() {
    if (this.name && this.email && this.password) {
      this._apiService.register(this.name, this.email, this.password).pipe(take(1)).subscribe();
    } else {
      alert('you must fill all fields');
    }
  }
}