import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('video',{ static: true }) public videoElement: ElementRef<HTMLVideoElement>;

  constructor(public _streamingService: StreamingService) { 

  }

  ngOnInit() {
    this._streamingService.videoSrc$.subscribe((src) => {
      if (!src) return;
      this.videoElement.nativeElement.srcObject = src;
    })
  }

  public startStreaming(deviceName: string): void{
    this._streamingService.startStreaming(this.selectedDeviceName).subscribe((isStreaming) => {
      this.isStreamConnected = isStreaming;
    })
  }

  public play(): void {
    this.videoElement.nativeElement.play();
  }

  public refreshDevice(): void {
    this._streamingService.sendSignal('refresh', {});
  }
}
