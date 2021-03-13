import { Injectable } from "@angular/core";
import { ApiService } from "./api-service";
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import * as mime from 'mime-types';

@Injectable()
export class FileSharingService {
  private _socketServer = "https://gr6.algonics.net";
  private _socketManager = new io.Manager(this._socketServer);
  private _session = null;
  private _sessionId = null;
  public dataBuffer: ArrayBuffer = new ArrayBuffer(0);
  public doneDownloading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public fileList$: BehaviorSubject<any> = new BehaviorSubject([]);
  
  constructor(private _apiService: ApiService) {
    this._session = this._socketManager.socket(`/files`);
    this._session.connect();
    this._setupSignalListner();
  }

  public startFileSharing(deviceName: string): Observable<any> {
    return this._apiService.getFileSharingSessionForDevice(deviceName).pipe(
      tap((sessionId) => this._setSessionId(sessionId)),
    );
  }
  
  public sendSignal(type: string, data: any): void {
    console.log('sendData', data);
    this._session.emit('sendData', { sender: 'user', sessionId: this._sessionId,  type, data });
  }

  private _setSessionId(sessionId: string): void {
    this._sessionId = sessionId;
    this._session.emit('connectToSession', { sessionId });
  }

  private _setupSignalListner(): void {
    this._session.off();
    this._session.on('listenData', (channelData) => {
    if( channelData.sessionId !== this._sessionId) return;
    console.log('listenData', channelData.sender, channelData.data);
      switch(channelData.type) { 
        case "fileList": 
          console.log('fileList', channelData.data);
          const fileList = channelData.data.map((file) => ({mime: mime.lookup(channelData.data.fileName), ...file}));
          this.sendSignal('fileListReceived', {});
          this.fileList$.next(fileList);
           break; 
        case "chunk": 
            this.dataBuffer = this._appendBuffer(this.dataBuffer, channelData.data);
           break; 
        case "fileEnd": 
            this.doneDownloading$.next(true);
          break; 
        default: 
           break; 
     }
    });
  }
  public getFile(fileName:string): BehaviorSubject<any> {
    this.doneDownloading$.next(false);
    this.dataBuffer = new ArrayBuffer(0);
    this.sendSignal('getFile', { fileName });
    return this.doneDownloading$;
  }

  private _appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  };

  public previewCurrentFile(fileName: string): void{
    const unit8Data = new Uint8Array(this.dataBuffer);
    const type = mime.lookup(fileName);
    var blob = new Blob( [ unit8Data ], { type });
    var objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl, "_blank");
  }

  public downloadCurrentFile(fileName: string): void {
    var a = document.createElement("a") as HTMLAnchorElement;
    document.body.appendChild(a);
    const unit8Data = new Uint8Array(this.dataBuffer);
    const type = mime.lookup(fileName);
    var blob = new Blob( [ unit8Data ], { type });
    var objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(objectUrl);
  }
}