import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanServiceService } from '../loan-processes/service/loan-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DuplicateViewDetailsComponent } from '../duplicate-view-details/duplicate-view-details.component';
import { D } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-duplicate-dashboard',
  templateUrl: './duplicate-dashboard.component.html',
  styleUrls: ['./duplicate-dashboard.component.scss']
})
export class DuplicateDashboardComponent implements OnInit {

  loadingApplications: boolean = false;
  applicationArrayList: any[] = [];
  applicationHeader=['Applicant Name', 'Application Id', 'Application Date', 'Initial Data Capture', 'Full Data Capture', 'Documentation', 'Status'];
  duplicateAppList: any[]=[];
  comparators:string[]
  entryCount: any;


  constructor(
    private loanService: LoanServiceService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.duplicateApp();
  }

  keerthi;
  index;
  // Duplicate Application
  duplicateApp(){
      this.loanService.getDuplicateApp().subscribe(
        res => {
          console.log("response",res);
          this.comparators = Object.keys(res['data'])
          console.log("keys",this.comparators);
          this.duplicateAppList=Object.values(res['data']);
          for(let item of this.duplicateAppList){
            this.keerthi = item;
          }
          this.entryCount = res['count'];
          console.log(this.duplicateAppList,this.entryCount,this.comparators)
          for(let i=0;i<this.entryCount;i++){
            this.index = i+1;
          }
         
          })        
  }
  openNewTab(element) {
    console.log(element)
    sessionStorage.setItem('appId',element)
    sessionStorage.setItem('TabIndex','1');
  }
  

  duplicateList;
  getDuplicate(data) {
    this.loanService.getDuplicate(data).subscribe(
      res=>{
        console.log(res)
        this.duplicateList = res;
      //   if(this.duplicateList.length != 0){
      //   const dialogRef = this.dialog.open(DuplicatePopupComponent, {
      //     width: '450px',
      //     height: '300px',
      //   });
      // }
      }
    )
  }

    // duplicate view dialog
    openDuplicateDialog(id): void {
    const dialogRef = this.dialog.open(DuplicateViewDetailsComponent, {  
      data:id
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
     this.duplicateApp();
    });
}

getDuplicateListInArrayFormat(data,comparators) {
  for(let i=0;i< comparators.length;i++){
    this.duplicateAppList.push(data[comparators[i]])
  }
  console.log("lists",this.duplicateAppList)
  for(let item of this.duplicateAppList){
    console.log(item)
  }
}
}
