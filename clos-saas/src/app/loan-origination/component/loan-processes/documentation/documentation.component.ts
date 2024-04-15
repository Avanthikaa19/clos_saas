import { JSONParser } from '@amcharts/amcharts5';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { ServiceService } from 'src/app/loan-origination/service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { Documentation, documentList, DocumentList, MultiSort } from '../model';
import { LoanServiceService } from '../service/loan-service.service';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss', '../loan-processes.component.scss']
})
export class DocumentationComponent implements OnInit {
  private notifierDisplayed = false;
  headers = ['Document Name', 'Document Type', 'Required', 'Stage', 'Document Status', 'Data Capture', 'Days in Status','Preview', 'View Attachments', 'Upload'];
  appId: any;
  docList: DocumentList[] = [];
  loadingDocs: boolean = false;
  formData = new FormData();
  docID: number;
  percentDone: number;
  uploadSuccess: boolean;
  filter: documentList = new documentList('',null,'','','','','',null,'','','');
  sort: MultiSort = new MultiSort('id','ASC');
  docs:Documentation =  new Documentation(this.filter,[this.sort]);
  pageNo: number = 0;
  pageSize: number = 10;
  count: number;
  fileContent:any;
  docPreviewWindow:any;
  page: number=1;


  constructor(public dateAdapter: DateAdapter<Date>,
    public notifierService: NotifierService,
    public loanService: ServiceService,
    public dialog: MatDialog,
    public ac: AccessControlData,
    public encryptDecryptService: EncryptDecryptService,
    public dataEntryService: LoanServiceService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {
    this.ac.items = this.encryptDecryptService.getACItemsFromSession()
    this.ac.super = this.encryptDecryptService.getACSuperFromSession();
    dateAdapter.setLocale("en-in");
  }

  async ngOnInit() {
    await this.getSessionStorageAppId();
    // await this.getApplicantDocuments();
  }

  // Gets Application Id from session storage
  getSessionStorageAppId() {
    let appID: any = sessionStorage.getItem('CURR_APPLICATION_ID');
    console.log(appID)
    if (appID) {
      let encryptAppID = this.encryptDecryptService.decryptData(appID) //CONVERT ENCRYPTED DATA INTO ORIGIAL DATA USING DECRYPT METHOD
      this.appId = encryptAppID;
    }
    this.dataEntryService.getDocuments(this.appId,this.page,this.pageSize).subscribe(
      res => {
        console.log(res);
        let temp = res['data'];
        this.docList = temp;
        this.count = res['count'];
      })
  }

  // Fetches all the document names to be uploaded by the applicant
  // getApplicantDocuments() {
  //   this.loadingDocs = true;
  //   this.dataEntryService.getDocuments(this.appId).subscribe(
  //     res => {
  //       this.loadingDocs = false
  //       this.docList = res['data'];
  //     },
  //     err => {
  //       this.loadingDocs = false
  //     }
  //   )
  // }


  //  Captures the file as binary to set into FormDate 
  fileClick(event) {
    let files: File = event.target.files[0];
    this.uploadApplicantDocs(files);
  }

  // Import the attachment with respective to Application ID
  uploadApplicantDocs(files: File) {
    this.formData.set('fileUploaded', files);
    this.dataEntryService.uploadDocument(this.appId, this.formData,this.docID).subscribe(
      res => {
        if (!this.notifierDisplayed) {
        this.notifierService.notify('success', 'Sucess! File has been imported.')
        console.log(res)
        this.notifierDisplayed = true;
        setTimeout(() => {
          this.notifierDisplayed = false;
        }, 3000);
        }
      },
      err => {
        if (!this.notifierDisplayed) {
        this.notifierService.notify('error', 'Oops! Something Went Wrong.')
        this.notifierDisplayed = true;
        setTimeout(() => {
          this.notifierDisplayed = false;
        }, 3000);
        }
      }
    )

  }

  // Upload Document
  uploadAndProgress(files: File) {
    this.formData.set('fileUploaded', files);
    this.dataEntryService.uploadDocument(this.appId, this.formData,this.docID).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentDone = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.uploadSuccess = true;
      }
    });
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  document(event) {
    this.docID = event.documentId;
  }

  // Download Document
  downloadFile(event) {
    this.dataEntryService.downloadDocument(this.appId,event.documentId).subscribe(
      res =>{
        console.log(res);
        var blob = new Blob([res], {
            type: "text/"
        });
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = `DocumentID:`+event.documentId;
        anchor.href = url;
        anchor.click();
        this.cdr.detectChanges();
        this.showNotification('success', 'Document downloaded successfully');
      },
      err =>{
        console.log(err);
        if(err.status == 500){
          this.showNotification('error', 'Please enter the file');
        }else{
        this.showNotification('error', 'Whoops! Something went wrong!.');
        }
      }
    )
  }

  previewFile(event) {
    console.log(event)
    this.dataEntryService.previewDocument(this.appId,event.documentId).subscribe(
      (res:any) =>{
        // console.log(res);
        // var blob = new Blob([res], {
        //     type: "text/"
        // });
        // var url = window.URL.createObjectURL(blob);
        // var anchor = document.createElement("a");
        // anchor.download = `DocumentID:`+event.documentId;
        // anchor.href = url;
        // anchor.click();
        // this.cdr.detectChanges();
        // this.showNotification('success', 'Document downloaded successfully');\
        let fileType: any
        // let exportType = event.fileName.substr(event.fileName.lastIndexOf('.') + 1).trim(); 
        this.fileContent = new Blob([res], {
          type: 'application/pdf' 
      });
      // console.log(fileType,exportType,'test')
        this.docPreviewWindow=URL.createObjectURL(this.fileContent);
        console.log(this.docPreviewWindow)
        window.open(this.docPreviewWindow,'_blank',"height=600,width=1000");

      },
      err =>{
        console.log(err);
        if(err.status == 500){
          this.showNotification('error', 'Please enter the file');
        }else{
        this.showNotification('error', 'Whoops! Something went wrong!.');
        }
      }
    )
  }

  // Submit 
  submit() {
    this.dataEntryService.getSubmit(this.appId).subscribe(
      res =>{
        console.log(res)
        this.router.navigateByUrl('/loan-org/loan/main-app-list');
        this.showNotification('success', res);
      },
      err =>{
        let parse:JSON
        parse = JSON.parse(err['error'])
        console.log(err)
        console.log(parse)
        this.showNotification('error',parse['error'])
        this.router.navigateByUrl('/loan-org/loan/main-app-list');
      }
    )
  }

// Page Navigation
documents(pageNav?: PageEvent) {
  if (pageNav) {
    this.pageSize = pageNav.pageSize;
    this.page = pageNav.pageIndex;
  }
  this.dataEntryService.docFilter(this.pageSize,this.page+1,this.docs,this.appId).subscribe(
    res => {
      console.log(res['count'],res['data'])
      this.docList = res['data']
      this.count = res['count'];
    }
  )
}

// Sorting as Ascending and Descending Order
sortAscDsc(sort: Sort) {
  if (sort.direction == 'asc') {
    this.docs.sort[0].sortingOrder = 'ASC';
  } else if (sort.direction == 'desc') {
    this.docs.sort[0].sortingOrder = 'DESC';
  } else {
    this.docs.sort[0].sortingOrder = '';
  }
  switch (sort.active) {
    case 'Document Name': this.docs.sort[0].orderBy = 'documentName'; break;
    case 'Document Type': this.docs.sort[0].orderBy = 'documentType'; break;
    case 'Required':  this.docs.sort[0].orderBy = 'required'; break;
    case 'Stage': this.docs.sort[0].orderBy = 'stage'; break;
    case 'Document Status': this.docs.sort[0].orderBy = 'documentStatus'; break;
    case 'Data Capture': this.docs.sort[0].orderBy = 'dataCapture'; break;
    case 'Days in Status': this.docs.sort[0].orderBy = 'daysInStatus' ;break;
    }
  this.documents();
}

}
