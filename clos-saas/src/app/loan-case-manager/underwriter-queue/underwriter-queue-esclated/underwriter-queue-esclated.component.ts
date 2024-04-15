import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { GroupFilter, Loancase, MultiSort } from '../../models/loancase';
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';

@Component({
  selector: 'app-underwriter-queue-esclated',
  templateUrl: './underwriter-queue-esclated.component.html',
  styleUrls: ['./underwriter-queue-esclated.component.scss']
})
export class UnderwriterQueueEsclatedComponent implements OnInit {

  pageNum: number = 0;
  pageSize: number = 15;
  verificationStatus: string = 'ESCLATED';
  filter: GroupFilter = new GroupFilter(null,null,null,null,null,null,null,null,null,null);
  sort: MultiSort = new MultiSort('id','ASC');
  LoanCase:Loancase =  new Loancase(this.filter,[this.sort]);
  queueData;
  queueCount: number;
  loading: boolean = false;
  queue = ['Id','Company Name','Company Type','Applicant Name','Contact Number','Loan Type','SEC/DTI Registration No','Loan Amount','Loan Purpose','Verification Status','Assigned To'];

  constructor(
    public loanCase : LoanCaseManagerServiceService,
    private router: Router,
    public dialog: MatDialog,
    public notifierService: NotifierService,
  ) { }

  ngOnInit(): void {
    this.getEsclated();
  }

  // underwriter Esclated
  getEsclated(pageNav?: PageEvent) {
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
    this.getEsclated();
}
}