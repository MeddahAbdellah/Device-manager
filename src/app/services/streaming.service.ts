import { Injectable } from "@angular/core";
import { ApiService } from "./api-service";
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
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
    this._setupSignalListner();
  }

  public startStreaming(deviceName: string): Observable<any> {
    return this._apiService.getStreamingSessionForDevice(deviceName).pipe(
      tap((sessionId) => this._setSessionId(sessionId)),
    );
  }
  
  public sendSignal(type: string, data: any): void {
    console.log('sendSignal', data);
    this._session.emit('sendSignal', { sender: 'user', sessionId: this._sessionId,  type, data });
  }

  private _setSessionId(sessionId: string): void {
    this._sessionId = sessionId;
    this._session.emit('connectToSession', { sessionId });
  }

  private _setupSignalListner(): void {
    this._session.off();
    this._session.on('listenSignal', (signalData) => {
    if( signalData.sessionId !== this._sessionId) return;
    console.log('listenSignal', signalData.sender, signalData.data);
      switch(signalData.type) { 
        case "rtcSignal": 
            try {
              this._rtcPeer.signal(signalData.data);
            } catch (err) {}
           break; 
        case "initCall": 
            this._initCall();
           break; 
        default: 
           break; 
     }
    });
  }

  private _initCall(): void {
    const config = {
        iceServers: [
            { "urls": "stun:stun.l.google.com:19302" },
            { "urls": "stun:stun2.l.google.com:19302" },
            { 
              urls: "stun:13.36.31.88:3478",
                credential: 'benchabane',
                username: 'lina',
            },
            
            // public turn server from https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
            // set your own servers here
            {
              urls: 'turn:13.36.31.88:3478',
              credential: 'benchabane',
              username: 'lina'
            }
        ]
    }
    this._rtcPeer = new SimplePeer({
      initiator: true,
      trinkle: false,
      config,
    });
    this._rtcPeer.removeAllListeners('signal');
    this._rtcPeer.removeAllListeners('error');
    this._rtcPeer.removeAllListeners('stream');
    this._rtcPeer.removeAllListeners('close');
    
    this._rtcPeer.on('signal', (data) => {
        this.sendSignal('rtcSignal', data)
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