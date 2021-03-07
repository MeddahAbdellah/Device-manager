import { Injectable } from "@angular/core";
import { ApiService } from "./api-service";
import * as io from 'socket.io-client';
import { BehaviorSubject, from, Observable, of, bindCallback } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import SimplePeer from "simple-peer";
@Injectable()
export class StreamingService {
  private _socketServer = "https://gr6.algonics.net";
  private _socketManager = new io.Manager(this._socketServer);
  private _session = null;
  private _sessionId = null;
  private _rtcPeer = null;
  public videoSrc$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private _apiService: ApiService) {
    this._session = this._socketManager.socket(`/signaling`);
    this._session.connect();
  }

  public startStreaming(deviceName: string): Observable<any> {
    return this._apiService.getStreamingSessionForDevice(deviceName).pipe(
      tap((sessionId) => this._setSessionId(sessionId)),
      tap(() => this._setupSignalListner()),
      tap(() => this._initCall()),
    );
  }
  
  public sendSignal(type: string, data: any): void {
    console.log('sendSignal', data);
    this._session.emit('sendSignal', { sessionId: this._sessionId, ...{ type, data } });
  }

  private _setSessionId(sessionId: string): void {
    this._sessionId = sessionId;
    this._session.emit('connectToSession', { sessionId });
  }

  private _setupSignalListner(): void {
    this._session.off();
    this._session.on('listenSignal', (signalData) => {
    console.log('listenSignal', signalData);
      switch(signalData.type) { 
        case "answer": 
            try {
              this._rtcPeer.signal(signalData.data);
            } catch (err) {}
           break; 
        case "candidate": 
           break; 
        default: 
           break; 
     }
    });
  }

  private _initCall(): void {
    this._rtcPeer = new SimplePeer({
      initiator: true,
      trinkle: false,
    });
    this._rtcPeer.removeAllListeners('signal');
    this._rtcPeer.removeAllListeners('error');
    this._rtcPeer.removeAllListeners('stream');
    this._rtcPeer.removeAllListeners('close');
    
    this._rtcPeer.on('signal', (data) => {
        this.sendSignal(data.type, data)
    });
    this._rtcPeer.on('stream',(stream) => {
      console.log('stream', stream);
      this.videoSrc$.next(stream);
    });
    this._rtcPeer.on('error', (err) => {
      console.log("err", err);
      this._rtcPeer = null;
    });
    this._rtcPeer.on('close', () => {
      this._rtcPeer = null;
    });
  }
}