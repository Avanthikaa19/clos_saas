import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationDetails, ExtensionOfLoanDetails} from 'src/app/c-los/models/clos';
import { Attachment, PageData } from 'src/app/c-los/models/clos-table';
import { CLosService } from 'src/app/c-los/service/c-los.service';

@Component({
  selector: 'app-extension-of-loan-popup',
  templateUrl: './extension-of-loan-popup.component.html',
  styleUrls: ['./extension-of-loan-popup.component.scss']
})
export class ExtensionOfLoanPopupComponent implements OnInit {

  extensionofloandetails: ExtensionOfLoanDetails;
  correspondingId: any;
  correspondingButton: any;
  files: File[] = [];
  dataLoaded: boolean = false;
  loanDetails:ApplicationDetails = new ApplicationDetails;
  constructor(
    public dialogRef: MatDialogRef<ExtensionOfLoanPopupComponent>,
    private closServices: CLosService,
    public closService:CLosService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.correspondingId = data.fsIds;
    this.correspondingButton = data.buttonName;
    this.extensionofloandetails = new ExtensionOfLoanDetails(this.correspondingId); 
  }

  ngOnInit(): void {
    this.getExtensionofloanDetails(this.correspondingId);
    this.getApplicationDetailsById(this.correspondingId);
  }

  onCloseClick (){
    this.dialogRef.close();
  }

  getApplicationDetailsById(id: number){
    this.closService.getApplicationDetailsByID(this.correspondingId).subscribe( res => {
      this.loanDetails= res;
    },
    err => {
      console.log("Failed to fetch application details..")
    }
    )
  }

  saveExtensioOfLoanDetails(){
    this.closServices.saveextensionOfLoanDetails(this.extensionofloandetails).subscribe(
      res => {
        console.log(res);
      }
    )
    this.onCloseClick();
  }

  getExtensionofloanDetails(appId:number){
    this.closServices.getextensionOfLoanDetails(appId,1,10).subscribe(
      res => {
        console.log(res);
        if (res.data && res.data.length > 0) {
          this.extensionofloandetails = res.data[0];
          this.dataLoaded = true;
        }
      }
    )
  }

  onFilesSelected(event: any, field: string) {
    this.files = event.target.files;
    this.uploadAttachments(field)
  }

  formFileResponseData(attachementName: string, attachmentId: number) {
    let attachmentResponse = new Attachment()
    attachmentResponse.attachmentId = attachmentId;
    attachmentResponse.attachmentName = attachementName;
    return attachmentResponse
  }
  
  uploadAttachments(field: string) {
    for (let i = 0; i < this.files.length; i++) {
      this.closService.uploadAttachment(this.files[i]).subscribe(
        res => {
          if (field == 'newLoanAgreement') {
            if (!this.extensionofloandetails.newLoanAgreement) {
              this.extensionofloandetails.newLoanAgreement = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.extensionofloandetails.newLoanAgreement.push(response)
            this.cdr.detectChanges();
          }
        }
      )
    }
  }
  removeAttachment(type: string, index: number,) {
    if (type == 'newLoanAgreement') {
      this.extensionofloandetails.newLoanAgreement.splice(index, 1)
    }
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
}