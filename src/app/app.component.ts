import { Route } from '@angular/compiler/src/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageHelper } from './services/local-storage.helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'LinaAdminApp';
}
