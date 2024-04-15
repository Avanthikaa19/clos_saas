import { HttpEvent } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-file-upload-step',
  templateUrl: './file-upload-step.component.html',
  styleUrls: ['./file-upload-step.component.scss']
})
export class FileUploadStepComponent implements OnInit {

  fileData: any;
  currentURL: string;
  fileName: string = '';
  uploadProgress: number = 0;
  @ViewChild('fileInput') fileInput: any;
  listFieldName: ColumnList = new ColumnList();
  uploadZipFile: any;
  activeStepperStatus:boolean=false;
  activeStepperUpdateStatus:boolean=false;
  createEditOption:string;
  private subscription: Subscription;
  entryOption: string;
  fileContent:any;
  loading: boolean = false;

  docData;
  docPreviewWindow:any;
  editID:number
  idAfterSave:number


  constructor(
    private loanService: LoanServiceService,
    private dataEntrySharedService: DataEntrySharedService,
    public router: Router,
    private duplicateService: DuplicateCheckingService,
    public notifierService: NotifierService,
  ) {
    this.currentURL = this.router.url;
    this.createEditOption=this.dataEntrySharedService.getMatSelectOption();
    this.idAfterSave=this.dataEntrySharedService.getSubmitId()
    console.log("id after submit", this.idAfterSave)

    
    this.dataEntrySharedService.createEditSelect.subscribe(data => {
      this.createEditOption = data;
    });
    this.editID=this.dataEntrySharedService.getId()
    this.listFieldName = this.dataEntrySharedService.getInputValue();
  
  }

  ngOnInit(): void {
    if(this.editID){
      this.fileName=this.listFieldName['fileName']
    }

  }
  // getAttachment(event) {
  //   this.fileData = event.target.files[0];

  // }
  // onSubmit(files) {
  //   this.loanService.attachZipFile(files).subscribe((event: HttpEvent<any>) => {
  //     let url = this.currentURL;
  //     url = url.substring(0, url.lastIndexOf("/"));
  //     this.router.navigateByUrl(url + "/" + 'application-info');
  //     this.activeStepperStatus = true;
  //     this.dataEntrySharedService.sendFileUploadData(this.activeStepperStatus);
  //   });
  // }

  handleFileUpload() {
    this.fileInput.nativeElement.click();
  }
  handleFileChange(event: any) {
    const file = event.target.files[0];
    this.uploadZipFile=file
    this.fileName = file ? file.name : '';
    this.uploadProgress = 0; 
    this.uploadFile(file);
    console.log('Uploaded file:', this.fileName);
  }
  uploadFile(file: File) {
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      }
    },200);
    this.loanService.attachZipFile(this.uploadZipFile).subscribe((event: HttpEvent<any>) => {
      console.log( event, "response data")
    });
  }
  deleteFile() {
    console.log("normal delete")
    this.loanService.deleteUpdatedFile(this.idAfterSave).subscribe(res=>{
      console.log("deletedfiled", res)
    },
        (error: any) => {
        }
      )
    this.fileName = '';
    this.fileInput.nativeElement.value = '';
    this.uploadProgress = 0; 
  }
  deleteEditFile(){
    console.log("edit delete")
    this.loanService.deleteUpdatedFile(this.editID).subscribe(res=>{
      console.log("deletedfiled", res)
    },
        (error: any) => {
        }
      )
    this.fileName = '';
    this.fileInput.nativeElement.value = '';
    this.uploadProgress = 0;
  }

  onSubmit(){
    let url = this.currentURL;
      url = url.substring(0, url.lastIndexOf("/"));
      this.router.navigateByUrl(url + "/" + 'application-info');
      this.activeStepperStatus = true;
      this.dataEntrySharedService.sendFileUploadData(this.activeStepperStatus);
      this.dataEntrySharedService.sendFileUploadUpdateData(this.activeStepperUpdateStatus);
      this.dataEntrySharedService.resetConditionCheckForUpdate()
    this.dataEntrySharedService.resetId()
    this.dataEntrySharedService.resetInputValue();
    this.dataEntrySharedService.resetSubmitId()
    this.dataEntrySharedService.resetErrorBorderColor()
  }
  updateClick(){
    let url = this.currentURL;
      url = url.substring(0, url.lastIndexOf("/"));
      this.router.navigateByUrl(url + "/" + 'application-info');
      this.activeStepperStatus = true;
      this.dataEntrySharedService.sendFileUploadData(this.activeStepperStatus);
      this.dataEntrySharedService.sendFileUploadUpdateData(this.activeStepperUpdateStatus);
      this.dataEntrySharedService.resetConditionCheckForUpdate()
    this.dataEntrySharedService.resetId()
    this.dataEntrySharedService.resetInputValue();
    this.dataEntrySharedService.resetSubmitId()
    this.dataEntrySharedService.resetErrorBorderColor()
  }

}
