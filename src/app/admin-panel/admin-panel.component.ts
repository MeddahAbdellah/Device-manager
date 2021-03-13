import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api-service';
import { FileSharingService } from '../services/fileStream.service';
import { StreamingService } from '../services/streaming.service';
enum AdminPage {
  VIDEO_STREAMING = 'video_streaming',
  FILE_LIST = 'file_list',
  VIDEO_VIZ = 'video_viz',
}
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
  public currentPage: AdminPage = AdminPage.VIDEO_STREAMING;
  public adminPage: typeof AdminPage = AdminPage;
  public fileList = null;
  public fileDownloadingName: string = '';
  public fileDownloadedName: string = '';

  @ViewChild('video',{ static: true }) public videoElement: ElementRef<HTMLVideoElement>;

  constructor(public _apiService: ApiService,
    public _streamingService: StreamingService,
    public _fileSharingService: FileSharingService) { 
    this.userDevices$ = this._loadDevices$.pipe(switchMap(() => this._apiService.getDevices()));
  }

  ngOnInit() {
    this._streamingService.videoSrc$.subscribe((src) => {
      if (!src) return;
      this.videoElement.nativeElement.srcObject = src;
    });

  }

  public startStreaming(deviceName: string): void{
    this.currentPage = AdminPage.VIDEO_STREAMING;
    this.isLoaderShowing = true;
    this._streamingService.startStreaming(deviceName).subscribe((isStreaming) => {
      this.isStreamConnected = isStreaming;
    })
  }
  
  public startFileSharing(deviceName: string): void{
    this.currentPage = AdminPage.FILE_LIST;
    this.isLoaderShowing = true;
    this._fileSharingService.startFileSharing(deviceName).subscribe();
    this._fileSharingService.fileList$.subscribe((fileList) => {
      this.fileList = fileList;
    }); 
  }

  public getFile(fileName: string): void {
    this.fileDownloadedName = '';
    this.fileDownloadingName = fileName;
    this._fileSharingService.getFile(fileName).subscribe((done) => {
      if(done) {
        this.fileDownloadingName = '';
        this.fileDownloadedName = fileName;
      }
    })
  }

  public previewFile(fileName: string):void {
    this._fileSharingService.previewCurrentFile(fileName);
  }

  public downloadFile(fileName: string):void {
    this._fileSharingService.downloadCurrentFile(fileName);
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
