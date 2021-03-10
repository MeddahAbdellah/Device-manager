import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api-service';
import { StreamingService } from '../services/streaming.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  public isStreamConnected: boolean = false;
  public selectedDeviceName: string;
  public videoSrc: any= null;
  public userDevices$: Observable<any>;
  private _loadDevices$: BehaviorSubject<void> = new BehaviorSubject(null);
  public isLoaderShowing: boolean = false;

  @ViewChild('video',{ static: true }) public videoElement: ElementRef<HTMLVideoElement>;

  constructor(public _apiService: ApiService, public _streamingService: StreamingService) { 
    this.userDevices$ = this._loadDevices$.pipe(switchMap(() => this._apiService.getDevices()));
  }

  ngOnInit() {
    this._streamingService.videoSrc$.subscribe((src) => {
      if (!src) return;
      this.videoElement.nativeElement.srcObject = src;
    })
  }

  public startStreaming(deviceName: string): void{
    this.isLoaderShowing = true;
    this._streamingService.startStreaming(deviceName).subscribe((isStreaming) => {
      this.isStreamConnected = isStreaming;
    })
  }

  public play(): void {
    this.videoElement.nativeElement.play();
  }

  public refreshDevice(): void {
    this._streamingService.sendSignal('refresh', {});
  }

  public hideLoader(): void {
    this.isLoaderShowing = false;
  }
  
  public addDevice(): void {
    let deviceName = prompt('Insert Device name');
    if(!!deviceName) this._apiService.addDevice(deviceName).subscribe(() =>  this._loadDevices$.next(null));
  }
}
