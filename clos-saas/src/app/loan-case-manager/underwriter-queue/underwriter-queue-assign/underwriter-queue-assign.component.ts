import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Inprogress } from '../../models/loancase';
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';

@Component({
  selector: 'app-underwriter-queue-assign',
  templateUrl: './underwriter-queue-assign.component.html',
  styleUrls: ['./underwriter-queue-assign.component.scss']
})
export class UnderwriterQueueAssignComponent implements OnInit {

  assignValue;
  inprogress: Inprogress = new Inprogress('','');
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UnderwriterQueueAssignComponent,
    public loanCase : LoanCaseManagerServiceService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getAssignees();
  }

  showNotification(type: string, message: any) {
    this.notifierService.notify(type, message);
  }

  //Get Assignee Dropdown
  getAssignees() {
    this.loanCase.getDropdown().subscribe(
      res =>{
        this.assignValue = res;
      }
    )
  }

  //Update Assignee
  applyInprogress() {
    this.inprogress.applicationId = this.data;
    this.loanCase.updateUnderwriterAssignee(this.inprogress.applicationId,this.inprogress.assignedTo,this.inprogress).subscribe(
      res =>{
        console.log(res)
        this.showNotification('success', res);
      },
      err => {
        this.showNotification('error', err);
      }
    )
  }

}
