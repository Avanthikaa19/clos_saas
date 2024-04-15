import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierService } from 'angular-notifier';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {ConfigService} from '../../components/services/config.service'

@Component({
  selector: 'app-rules-import-export',
  templateUrl: './rules-import-export.component.html',
  styleUrls: ['./rules-import-export.component.scss']
})
export class RulesImportExportComponent implements OnInit {
  rules:any;
  //CHECKBOX
  newArray = [];
  checked:boolean=false;

  loadingItems: boolean = false;
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalRecords: number = 1;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  nameSearch: string = '';
  orderBy='name';
  sortingOrder='asc';

  //File Upload 
  @ViewChild('file') file;
  fileArray: Array<File> = [];
  currentFileUpload: File;
  uploading: boolean = false;
  progress: number = 0;
  loadingData: boolean = false;
  fileUploadComplete: boolean = false;
  fileUploadRef = {};
  fileUploadErrorMessage: string = '';

  constructor(
    private url: UrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RulesImportExportComponent>,
    private configService: ConfigService,
    private notifierService: NotifierService,
    private snackBar: MatSnackBar,
  ) {
    this.rules = data;
    if(this.rules.length != 0){
      this.loadingData = false;
    }else{
      this.loadingData = true;
    }
    console.log('rules', this.rules);
   }
   public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
  }
  
  //TO CHECK WHEN RULES IS SELECTED 
  isRulesSelected(rule : any[]) : boolean{
    var count = 0;
    for(let rep of rule){
    var index = this.newArray.indexOf(rep.id);
      if(index != -1)
        count++;
    }
    if(count == 0)
        return false;
    else
      return true;
  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  //TO PUSH SELECTED RULES IN ARRAY
  setAll(event,checked) {
    if(event.checked == true){
         this.newArray.push(checked);  
    }
    else if (event.checked == false){
        var index = this.newArray.indexOf(checked);
        this.newArray.splice(index,1);
     }
  }
  
  selectAll(event){
    if(event.checked==true){
      this.newArray=[];
      for(let i=0;i<this.rules.length;i++){
             this.newArray.push(this.rules[i].id);
          }
       }
    else{
      this.newArray=[];
    }
  }
  exportRules(){
    this.configService.exportRuels(this.newArray).subscribe(
      (response:any )=> {
            var sJson = JSON.stringify(response);
            var blob = new Blob([sJson], {type: 'text/json'});
            var url = window.URL.createObjectURL(blob);
            var anchor = document.createElement("a");
            anchor.download = `Rules.json`;
            anchor.href = url;
            anchor.click();
           
          },
          err => {
            console.error(err.error);
          }
    )
    
  }
   // FILE UPLOAD ======================================================================================

selectFile(event) {
  this.fileUploadRef = {};
  //console.log(event.target.files[0].name);
  if (event.target.files[0].name.toLowerCase().endsWith('.json')) {
    this.fileArray = Array.from(event.target.files);
  } else {
    let errorMessage = 'Only .json format files are accepted.';
    this.openSnackBar(errorMessage, '');
  }
}
upload() {
  this.uploading = true;
  this.currentFileUpload = this.fileArray[0];
  // this.selectedFiles.item(0);
  this.configService.importRules(this.currentFileUpload).subscribe(
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
          // this.dialogRef.close();
          break;
        case HttpEventType.Response:
          this.progress = 0;
          this.fileUploadRef = event.body;
          this.fileArray = [];
          this.fileUploadComplete = true;
          this.uploading = false;
      }
      this.openSnackBar('Uploaded Successfully', 'success');
      this.dialogRef.close();
    },
    error => {
      this.fileUploadErrorMessage = error.error;
      this.openSnackBar(this.fileUploadErrorMessage, '');
      this.fileUploadRef = '';
      this.fileUploadComplete = false;
      this.uploading = false;
    });
}

//open snack bar
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 2000,
  });
}
close(){
  this.dialogRef.close();
}

}
