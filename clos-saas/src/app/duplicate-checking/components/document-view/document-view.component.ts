import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { DuplicateCheckingService } from '../../services/duplicate-checking.service';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit {

  docData;
  fileContent:any;
  docPreviewWindow:any;
  loading: boolean = false;
  applicationDetails: any;

  constructor(
    public notifierService: NotifierService,
    public caseManagerService:CLosService,
    public dialogRef: MatDialogRef<DocumentViewComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private duplicateService: DuplicateCheckingService,
    private closService: CLosService,
  ) { }

  ngOnInit(): void {
    this.getDocument();
    this.getDataById(this.data);
  }
  getDataById(id:any) {
    this.caseManagerService.getApplicationDetailsByID(id).subscribe(
      res => {
        this.applicationDetails = res;
        console.log(res)
      }
    )
  }
  getAttachementFileDownload(id: number) {
    this.closService.getAttachmentDetails([id]).subscribe(attachment => {
      if (attachment) {
        let fileName = attachment[0].fileName
        this.closService.getAttachmentDownload(id).subscribe(res => {
          var blob = new Blob([res])
          var url = window.URL.createObjectURL(blob);
          var anchor = document.createElement("a");
          anchor.download = fileName;
          anchor.href = url;
          anchor.click();
        })
      }
    })
  }
  // Document Details
  getDocument() {
    this.loading=true;
    this.closService.getDocumentDetails(this.data).subscribe(
      res => {
        this.loading=false;
        console.log(res)
        this.docData = res;
      },
      error => {
        if (error.status === 404) {
          console.error("API returned 404 error:", error.error);
        } else {
          console.error("API returned an error:", error.error);
        }
        this.loading = false;
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  // previewDocs
  preview(event) {
    const fileType = event.attachmentName.split('.').pop().toLowerCase(); // Convert to lowercase for consistency
  
    this.closService.getDocPreview(event.attachmentId).subscribe(
      (res: any) => {
        let mimeType: string;
        switch (fileType) {
          case 'pdf':
            mimeType = 'application/pdf';
            break;
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'csv':
            mimeType = 'text/csv';
            break;
          case 'xls':
            mimeType = 'application/vnd.ms-excel';
            break;
          default:
            mimeType = 'application/octet-stream';
        }
  
        const blob = new Blob([res], { type: mimeType });
        const fileURL = URL.createObjectURL(blob);
  
        if (mimeType.startsWith('image') || mimeType === 'application/pdf') {
          // For images and PDF, open in a new window
          window.open(fileURL, '_blank', 'height=600,width=1000');
        } else {
          // For other file types, trigger a download
          const anchor = document.createElement('a');
          anchor.download = event.attachmentName;
          anchor.href = fileURL;
          anchor.click();
        }
      },
      (err) => {
        console.log(err);
        if (err.status === 500) {
          this.showNotification('error', 'Please enter the file');
        } else {
          this.showNotification('error', 'Whoops! Something went wrong!.');
        }
      }
    );
  }
}
