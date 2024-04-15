import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';
import { GroupFilter, Loancase, MultiSort } from '../../models/loancase';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DuplicatePopupComponent } from '../duplicate-popup/duplicate-popup.component';
import { VerifierQueueAssignComponent } from '../verifier-queue-assign/verifier-queue-assign.component';
import { NotifierService } from 'angular-notifier';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-verifier-queue-inprogress',
  templateUrl: './verifier-queue-inprogress.component.html',
  styleUrls: ['./verifier-queue-inprogress.component.scss']
})
export class VerifierQueueInprogressComponent implements OnInit {

  pageNum: number = 0;
  pageSize: number = 15;
  verificationStatus: string = 'VERIFIER_INPROGRESS';
  filter: GroupFilter = new GroupFilter(null,null,null,null,null,null,null,null,null,null);
  sort: MultiSort = new MultiSort('id','ASC');
  LoanCase:Loancase =  new Loancase(this.filter,[this.sort]);
  queueData;
  id: any;
  duplicateList;
  queueCount: number;
  loading: boolean = false;
  queue = ['Id','Company Name','Company Type','Applicant Name','Contact Number','Loan Type','SEC/DTI Registration No','Loan Amount','Loan Purpose','Verification Status','Assigned To','Reassign','View Details'];

  constructor(
    public loanCase : LoanCaseManagerServiceService,
    private router: Router,
    public dialog: MatDialog,
    public notifierService: NotifierService,
  ) { }

  ngOnInit(): void {
    this.getVerifyInprogress();
  }

  onMenuEvent(event: any) {
    let url = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    url = url + '/verifier-queue-detail';
    window.open(url, "_blank", 'location=yes,height=870,width=1370,scrollbars=yes,status=yes');
  }

  // Verification Inprogress
  getVerifyInprogress(pageNav?: PageEvent) {
    this.loading = true;
    if (pageNav) {
      this.pageSize = pageNav.pageSize;
      this.pageNum = pageNav.pageIndex;
    }
    this.loanCase.getVerificationQueue(this.pageNum + 1,this.pageSize,this.verificationStatus,this.LoanCase).subscribe(
      res => {
        this.loading = false;
        this.queueData = res['data'];
        this.queueCount = res['count'];
      },
      err => {
        this.loading = false;
        this.notifierService.notify('error', 'Error: Failed to load applications');
      }
    )
  }

  sortAscDsc(sort: Sort) {
    if (sort.direction == 'asc') {
      this.LoanCase.sort[0].sortingOrder = 'ASC';
    } else if (sort.direction == 'desc') {
      this.LoanCase.sort[0].sortingOrder = 'DESC';
    } else {
      this.LoanCase.sort[0].sortingOrder = '';
    }
    switch (sort.active) {
			case 'ID': this.LoanCase.sort[0].orderBy = 'id'; break;
			case 'COMPANY NAME': this.LoanCase.sort[0].orderBy = 'companyName'; break;
			case 'COMPANY TYPE':  this.LoanCase.sort[0].orderBy = 'companyType'; break;
			case 'APPLICANT NAME': this.LoanCase.sort[0].orderBy = 'applicantName'; break;
			case 'CONTACT NUMBER': this.LoanCase.sort[0].orderBy = 'contactNumber'; break;
			case 'LOAN TYPE': this.LoanCase.sort[0].orderBy = 'loanType'; break;
      case 'SEC/DTI NO': this.LoanCase.sort[0].orderBy = 'secTDINo' ;break;
			case 'LOAN AMOUNT': this.LoanCase.sort[0].orderBy = 'loanAmount'; break;
      case 'LOAN PURPOSE': this.LoanCase.sort[0].orderBy = 'loanPurpose'; break;
      case 'VERIFICATION STATUS': this.LoanCase.sort[0].orderBy = 'verificationStatus'; break;
		  }
    this.getVerifyInprogress();
}

openNewTab(element) {
  console.log(element)
  sessionStorage.setItem('appId',element)
  sessionStorage.setItem('TabIndex','1');
  this.router.navigateByUrl('/loan-case-manager/loan-case-manager-main/verifier-queue-detail')
}

openDialog() {
  this.findDuplicate();
}

findDuplicate() {
  this.id = sessionStorage.getItem('appId');
  this.loanCase.getFindDuplicate(this.id).subscribe(
    res =>{
      console.log(res);
      this.getDuplicate(res);
    }
  )
}

getDuplicate(data) {
  this.loanCase.getDuplicate(data).subscribe(
    res=>{
      console.log(res)
      this.duplicateList = res;
      if(this.duplicateList.length != 0){
      const dialogRef = this.dialog.open(DuplicatePopupComponent, {
        width: '450px',
        height: '300px',
      });
    }
    },
    err =>{
      let parse:JSON
      parse = err['error']
      console.log(err)
      console.log(parse)
      this.showNotification('error',parse['error'])
    }
  )
}
showNotification(type: string, message: string) {
  this.notifierService.notify(type, message);
}
autoClaim(id,element) {
  this.loanCase.selfAssignee(id).subscribe(
    res => {
      console.log(res);
    },err => {
      console.log(err,element);
      element.autoAssignedTo = element.autoAssignedTo;
    }
  )
}

//ReAssignee
openDialogBox(id) {
  const dialogRef = this.dialog.open(VerifierQueueAssignComponent, {
    data: id
});

  dialogRef.afterClosed().subscribe((result: any) => {
    console.log(`Dialog result: ${result}`);
    this.getVerifyInprogress();

  });
  this.router.events.subscribe(() => {
    dialogRef.close();
  });
}
}
