import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolloverDetails } from 'src/app/c-los/models/clos';
import { Attachment, PageData } from 'src/app/c-los/models/clos-table';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { ApplicationDetails } from 'src/app/c-los/models/clos';

@Component({
  selector: 'app-rollover-application-popup',
  templateUrl: './rollover-application-popup.component.html',
  styleUrls: ['./rollover-application-popup.component.scss']
})
export class RolloverApplicationPopupComponent implements OnInit {

  rolloverdetails: RolloverDetails;
  application:ApplicationDetails = new ApplicationDetails;
  correspondingId: any;
  correspondingButton: any;
  files: File[] = [];
  dataLoaded: boolean = false;
  frequency: string[]=['Yearly','Half-Yearly','Quaterly','Monthly','Weekly','Daily'] 
  constructor(
    public dialogRef: MatDialogRef<RolloverApplicationPopupComponent>,
    private closServices: CLosService,
    public closService:CLosService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.correspondingId = data.fsIds;
    this.correspondingButton = data.buttonName;
    this.rolloverdetails = new RolloverDetails(this.correspondingId); 
    console.log(this.correspondingButton)
  }

  ngOnInit(): void {
    this.getRolloverDetails(this.correspondingId);
    this.getApplicationDetailsById(this.correspondingId);
  }

  onCloseClick (){
    this.dialogRef.close();
  }

  saveRolloverDetails(){
    this.closServices.saverollOverDetails(this.rolloverdetails).subscribe(
      res => {
        console.log(res);
      }
    )
    this.onCloseClick();
  }

  getRolloverDetails(appId:number){
    this.closServices.getrollOverDetails(appId,1,10).subscribe(
      res => {
        console.log(res);
        if (res.data && res.data.length > 0) {
          this.rolloverdetails = res.data[0];
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
          console.log("Field : {}", field)
          if (field == 'history') {
            if (!this.rolloverdetails.history) {
              this.rolloverdetails.history = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.rolloverdetails.history.push(response)
            this.cdr.detectChanges();
          }
          else{
            console.log("File ...... : ",field)
            if (!this.rolloverdetails.additionalDocuments) {
              this.rolloverdetails.additionalDocuments = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.rolloverdetails.additionalDocuments.push(response)
            this.cdr.detectChanges();
          }
        }
      )
    }
  }
  removeAttachment(type: string, index: number,) {
    if (type == 'history')
      this.rolloverdetails.history.splice(index, 1)
    else
      this.rolloverdetails.additionalDocuments.splice(index, 1)
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

  getApplicationDetailsById(id: number){
    this.closService.getApplicationDetailsByID(this.correspondingId).subscribe( res => {
      console.log("Application Details : ",res);
      this.application = res;
    },
    err => {
      console.log("Failed to fetch application details..")
    }
    )
  }
}
