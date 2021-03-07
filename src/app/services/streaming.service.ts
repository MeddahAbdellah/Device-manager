import { Injectable } from "@angular/core";
import { ApiService } from "./api-service";
import * as io from 'socket.io-client';
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class StreamingService {
  private _socketServer = "https://gr6.algonics.net";
  private _socketManager = new io.Manager(this._socketServer);
  private _session = null;
  private _sessionId = null;
  constructor(private _apiService: ApiService) {
    this._session = this._socketManager.socket(`/signaling`);
    this._session.connect();
  }

  public startStreaming(deviceName: string): Observable<any> {
    return this._apiService.getStreamingSessionForDevice(deviceName).pipe(
      switchMap((sessionId) => {
        console.log('sessionId', sessionId);
        this._sessionId = sessionId;
        this._session.emit('connectToSession', { sessionId });
        return of(true);
      }),
    );
  }
  
  public sendSignal(signal: string): void {
    console.log('signal', signal);
    this._session.emit('sendSignal', { sessionId: this._sessionId, signal });
  }
}