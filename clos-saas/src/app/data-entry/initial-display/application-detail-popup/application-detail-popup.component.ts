import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { DataEntrySharedService } from '../../data-entry-shared.service';

@Component({
  selector: 'app-application-detail-popup',
  templateUrl: './application-detail-popup.component.html',
  styleUrls: ['./application-detail-popup.component.scss']
})

export class ApplicationDetailPopupComponent implements OnInit {
activeStepIndex:number=0;
activesubtabIndex:number=0;
categoryList:any;
id:string;
fieldList:any;
fieldkeyList:any;
supplymentryFieldList:any;
supfieldKeyList:any;
appId:number;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ApplicationDetailPopupComponent>,
    private dataentryService:DataEntrySharedService,
    private closDataEntryService:CLosService,
  ) {
    console.log("data in popup", data);
    this.id = data;
   }

  ngOnInit(): void {
    this.getCategoryList();
  }

  //get the first mat-tab-group label
  onStepSelectionChange(event:any){
    if(event.tab.textLabel != 'Supplementary Information'){
    this.tabChange(event.tab.textLabel);
    }else if(event.index === 9){
      this.activesubtabIndex = 9;
      setTimeout(() => {
        this.activesubtabIndex = 0; // Activate the first tab in the second mat-tab-group
      });
    this.supplymentryTabChange('Supplementary Information 1')
    }
  }

  //get the second mat-tab-group label
  onSelectsubCategory(event:any){
    this.supplymentryTabChange(event.tab.textLabel);
  }

  onCloseClick (){
    this.dialogRef.close();
  }

  //get category list (mat-tab label)
  getCategoryList(){
    this.closDataEntryService.getCategoryList(this.appId).subscribe(res => {
      this.categoryList = res;
    },
    (error) => {
      console.log('error', error)
    });
  }

  //get the field value of first mat group
  tabChange(category:string):void{
    this.dataentryService.getFieldList(this.data,category).subscribe(res => {
      this.fieldList = res;
      const fieldKey = [];
      Object.keys(res).forEach(key => {
        fieldKey.push(key);
      });
      this.fieldkeyList = fieldKey
      Object.keys(res).forEach(key => {
        if (key === 'GENDER') {
          if(res[key]==0){
            res[key] = 'M';
          }
          else if(res[key]==1){
            res[key] = 'F';
          }
          else if (res[key]==2){
            res[key] = 'U';
          }
        }

        if (key === 'MARITAL STATUS') {
          if(res[key]==0){
            res[key] = 'S';
          }
          else if(res[key]==1){
            res[key] = 'M';
          }
          else if (res[key]==2){
            res[key] = 'D';
          }
          else if (res[key]==3){
            res[key] = 'W';
          }
        }
      });
      
    },
    (error) => {
      console.log('error', error)
    })
  }

  //get the field value of second mat group
  supplymentryTabChange(category:string):void{
    this.dataentryService.getFieldList(this.data,category).subscribe(res => {
      this.supplymentryFieldList = res;
      const supfieldKey = [];
      Object.keys(res).forEach(key => {
        supfieldKey.push(key);
      });
      this.supfieldKeyList = supfieldKey

      Object.keys(res).forEach(key => {
        if(key==='S1 GENDER' || key==='S2 SEX'|| key==='S3 SEX' || key==='S4 SEX' || key==='S5 SEX' || key==='S6 SEX' || key==='S7 SEX' || key==='S8 SEX' || key==='S9 SEX'){
          console.log("enter")
          if(res[key]==0){
            res[key] = 'M';
          }
          else if(res[key]==1){
            res[key] = 'F';
          }
          else if (res[key]==2){
            res[key] = 'U';
          }
        }
      });
      
    },
    (error) => {
      console.log('error', error)
    })
  }
}
