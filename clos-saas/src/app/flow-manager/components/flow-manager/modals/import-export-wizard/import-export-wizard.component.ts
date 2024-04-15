import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { UrlService } from 'src/app/services/http/url.service';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { trigger, transition, style, animate } from '@angular/animations';
// import { app_header_height } from 'src/app/app.constants';
import { Workflow, Worksheet } from '../../models/models-v2';
import { WizardserviceService } from './service/wizardservice.service'
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-import-export-wizard',
  templateUrl: './import-export-wizard.component.html',
  styleUrls: ['./import-export-wizard.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]
    ),
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ImportExportWizardComponent implements OnInit {
  //component size
  component_height = 500;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    // this.component_height = window.innerHeight - app_header_height;
  }

  workflows: Workflow[] = [];
  isOpen: boolean;
  //CHECKBOX
  allComplete: boolean = false;
  subTaskComplete: boolean=false ;
  workflowArray = [];
  newArray = [];
  checked:boolean=false;
  

  //loading flags
  loadingWorkflows: boolean = false;
  loadingWorksheets: boolean = false;
  loadingTasks: boolean = false;

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    private wizardService: WizardserviceService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    // private url: UrlService,
    public dialogRef: MatDialogRef<ImportExportWizardComponent>,
  ) { }

  // public updateUrl(): Promise<Object> {
  //   return this.url.getUrl().toPromise();
  // }

  async ngOnInit() {
    // let response = await this.updateUrl();
    // UrlService.API_URL = response.toString();
    // if(UrlService.API_URL.trim().length == 0) {
    //   console.warn('FALLING BACK TO ALTERNATE API URL.');
    //   UrlService.API_URL = UrlService.FALLBACK_API_URL;
    // }
    this.refreshWorkflows();
  }
  refreshWorkflows() {
    this.loadingWorkflows = true;
    this.flowManagerDataService.getWorkflows().subscribe(
      res => {
        this.workflows = res;
        this.loadingWorkflows = false;
      },
      err => {
        this.loadingWorkflows = false;
        console.log(err.error);
      }
    );
  }

  //TO PUSH SELECTED WORKSHEET IN ARRAY
  dataArray(event,checkedWorksheets: Worksheet){
    console.log(event.checked)
    this.allComplete  =  event.checked;
    if(event.checked == true){
      console.log ("worksheet")
      console.log(checkedWorksheets.id);
      this.newArray.push(checkedWorksheets.id);
      console.log(this.newArray);

    }
    else if(event.checked == false){
      var index = this.newArray.indexOf(checkedWorksheets.id);
      console.log(checkedWorksheets.id);
      this.newArray.splice(index,1);
      console.log(this.newArray);
    }
  }

 //TO PUSH SELECTED WORKFLOW IN ARRAY
  setAll(event,checkedWorkflow: Worksheet[]) {
    console.log(event)
    console.log('workflow');
    if(event.checked == true){
      console.log('push')
       for ( let checkedValue of checkedWorkflow){
        console.log(checkedValue.id)
         this.newArray.push(checkedValue.id);  
         
      }  
    }
    else if (event.checked == false){
       console.log('splice')
      for ( let checkedValueSplice of checkedWorkflow){
        console.log(checkedValueSplice.id);
        var index = this.newArray.indexOf(checkedValueSplice.id);
        this.newArray.splice(index,1);
      }
     }
     console.log(this.newArray);
    //  console.log(this.checked)
    //  if(this.checked){
    //    this.newArray=[];
    //  }
  }
  
  selectAll(event){
    if(event.checked==true){
      this.newArray=[];
      for(let i=0;i<this.workflows.length;i++){
         for(let j=0;j<this.workflows[i].worksheets.length;j++){
             this.newArray.push(this.workflows[i].worksheets[j].id);
          }
       }
     }
    else{
      this.newArray=[];
    }
    console.log(this.newArray)
  }
   

 //TO CHECK WHEN WORKSHEET IS SELECTED
  isWorksheetSelected(worksheet : Worksheet) : boolean{
    var index = this.newArray.indexOf(worksheet.id);
    if(index != -1)
      return true;
    else
      return false;

  }
 //TO CHECK WHEN WORKFLOW IS SELECTED 
  isWorkflowSelected(worksheet : Worksheet[]) : boolean{
    var count = 0;
    for(let sheet of worksheet){
    var index = this.newArray.indexOf(sheet.id);
      if(index != -1)
        count++;
    }
    if(count == 0)
        return false;
    else
      return true;
  }


  exportWorksheets(){
    console.log(this.newArray);
    this.wizardService.getExportFiles(this.newArray).subscribe(
      (response:any )=> {
        console.log(response);
            var sJson = JSON.stringify(response);
            var blob = new Blob([sJson], {type: 'text/json'});
            var url = window.URL.createObjectURL(blob);
            var anchor = document.createElement("a");
            anchor.download = `Flows.json`;
            anchor.href = url;
            anchor.click();
           
          },
          err => {
            console.error(err.error);
          }
    )
    
  }

  // FILE UPLOAD ======================================================================================

@ViewChild('file') file;
fileArray: Array<File> = [];
currentFileUpload: File;
uploading: boolean = false;
progress: number = 0;
loadingData: boolean = false;
fileUploadComplete: boolean = false;
fileUploadRef = {};
fileUploadErrorMessage: string = '';

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
  this.wizardService.importFile(this.currentFileUpload).subscribe(
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
          this.dialogRef.close();
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

}
