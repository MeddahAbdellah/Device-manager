import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api-service';

@Component({
  selector: 'dm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private _router: Router,
    private _apiService: ApiService,
    ) {
  }

  public logout(): void {
    this._apiService.clearToken();
    this._router.navigate(['/login'])
  }

  ngOnInit() {
  }

}
