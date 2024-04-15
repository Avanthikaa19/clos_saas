import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessControlData } from 'src/app/app.access';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-file-watcher-actions',
  templateUrl: './file-watcher-actions.component.html',
  styleUrls: ['./file-watcher-actions.component.scss']
})
export class FileWatcherActionsComponent implements OnInit {

  overwrite: boolean = true;
  uploadFilePath: string = '/apps/app_tmr/dfm';

  @Input()
  get filePath() {
    return this.uploadFilePath;
  }
  set filePath(val) {
    this.uploadFilePath = val;
  }

  // FILE UPLOAD ======================================================================================

  @ViewChild('file') file;
  fileArray: Array<File> = [];
  currentFileUpload: File;
  uploading: boolean = false;
  progress: number = 0;
  loading: boolean = false;
  fileUploadComplete: boolean = false;
  fileUploadRef = {};
  fileUploadErrorMessage: string = '';

  selectedFileName: string = '';

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    private snackBar: MatSnackBar,
    public ac: AccessControlData
  ) { 
    if(this.filePath == undefined || this.filePath == null) {
      this.filePath = '/apps/app_tmr/dfm';
    }
  }

  ngOnInit(): void {
  }

  selectFile(event) {
    this.fileUploadRef = {};
    this.fileArray = Array.from(event.target.files);
    this.selectedFileName = event.target.files[0].name;
    //console.log(event.target.files[0].name);
  }

  upload() {
    this.uploading = true;
    this.currentFileUpload = this.fileArray[0];
    // this.selectedFiles.item(0);
    this.flowManagerDataService.uploadFile(this.currentFileUpload, this.uploadFilePath, this.overwrite).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            // console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            // console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            this.progress = 0;
            this.fileUploadRef = event.body;
            this.fileArray = [];
            this.fileUploadComplete = true;
            this.uploading = false;
        }
      },
      error => {
        this.fileUploadErrorMessage = error.error;
        this.fileUploadRef = '';
        this.fileUploadComplete = false;
        this.uploading = false;
      }
    );
  }

  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
