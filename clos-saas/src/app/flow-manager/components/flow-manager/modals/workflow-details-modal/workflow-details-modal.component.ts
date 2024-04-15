import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { Workflow } from '../../models/models-v2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workflow-details-modal',
  templateUrl: './workflow-details-modal.component.html',
  styleUrls: ['./workflow-details-modal.component.scss']
})
export class WorkflowDetailsModalComponent implements OnInit {

  workflow: Workflow;
  name: string;
  namerrmsg: string;
  err: boolean = true;
  errMessage: string = '';
  

  constructor(
    public dialogRef: MatDialogRef<WorkflowDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkflowDetailsModalComponent,
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    if (data.workflow == undefined || data.workflow == null) {
      this.workflow = new Workflow(null, '', '', '', [], new Date(), new Date());
    } else {
      this.workflow = JSON.parse(JSON.stringify(data.workflow));
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  createWorkflow() {
    this.flowManagerDataService.createWorkflow(this.workflow).subscribe(
      res => {
        this.workflow = res;
        this.dialogRef.close(this.workflow);
      },
      err => {
        console.error(err.error);
        this.onClose();
        this.openSnackBar((err.error), '');
      }
    );
  }

  updateWorkflow() {
    this.flowManagerDataService.updateWorkflow(this.workflow.id, this.workflow).subscribe(
      res => {
        this.workflow = res;
        this.dialogRef.close(this.workflow);
      },
      err => {
        console.error(err.error);
        this.onClose();
        this.openSnackBar((err.error), '');
      }
    );
  }

  // //NAME VALIDATE
  // namevalidate() {

  //   this.err = true;
  //   if (this.workflow.name != '' && this.workflow.name != undefined && this.workflow.name != null) {
  //     if ((!this.workflow.name.match(/^[a-zA-Z][a-zA-Z ]+$/))) {
  //       if (this.workflow.name.trim().length < 4) {
  //         this.namerrmsg = 'Minimum character length is 4';
  //       } else if (!this.workflow.name[0].match(/^[a-zA-Z]/)) {
  //         // this.namerrmsg = 'The first character should be alphabet';
  //         this.namerrmsg = '';
  //       } else if (!this.workflow.name.match(/^[a-zA-Z ]+$/)) {
  //         // this.namerrmsg = 'Alphabets and space is only accepted';
  //         this.namerrmsg = '';
  //       } else  {
  //         this.namerrmsg = '';
  //       }
  //     } else {
  //       this.namerrmsg = '';
  //     }
  //   } else {
  //     this.namerrmsg = 'Name cannot be empty';
  //   }
  // }

  //OPEN SNACKBAR
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
} 