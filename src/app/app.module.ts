import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api-service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { FormsModule } from '@angular/forms';
import { DmInputComponent } from './dm-input/dm-input.component';
import { DmButtonComponent } from './dm-button/dm-button.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StreamingService } from './services/streaming.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminPanelComponent,
    DmInputComponent,
    DmButtonComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    ApiService,
    StreamingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
