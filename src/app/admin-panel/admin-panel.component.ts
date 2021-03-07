import { Component, OnInit } from '@angular/core';
import { StreamingService } from '../services/streaming.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  public isStreamConnected: boolean = false;
  public signal: string;

  constructor(public _streamingService: StreamingService) { 
    this._streamingService.startStreaming('test1').subscribe((isStreaming) => {
      this.isStreamConnected = isStreaming;
    })
  }

  ngOnInit() {
  }

  public send(): void {
    if (this.isStreamConnected) this._streamingService.sendSignal(this.signal);
  }
}
