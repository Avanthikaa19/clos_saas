import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ScorecardService } from '../../services/scorecard.service';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeletePopupComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private decisionFlowService: ScorecardService,
    private notifierService: NotifierService,
  ) { }

  ngOnInit(): void {
  }

  // Notification Message
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  // Delete Variables
  deleteVariables() {
    this.decisionFlowService.deleteVariables(this.data).subscribe(
      res =>{
        this.showNotification('success', "Variables Deleted Successfully");
      },
      err => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

}
