import { Component, OnInit, Inject } from '@angular/core';
import { Workflow, Worksheet } from '../../models/models-v2';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-worksheet-details-modal',
  templateUrl: './worksheet-details-modal.component.html',
  styleUrls: ['./worksheet-details-modal.component.scss']
})
export class WorksheetDetailsModalComponent implements OnInit {

  workflow: Workflow;
  // name validate
  worksheet: Worksheet;
  name: string;
  namerrmsg: string;
  err: boolean = true;
  errMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<WorksheetDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorksheetDetailsModalComponent,
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    if (data.workflow == undefined || data.workflow == null) {
      this.onClose();
    } else {
      this.workflow = JSON.parse(JSON.stringify(data.workflow));
    }
    if (data.worksheet == undefined || data.worksheet == null) {
      this.worksheet = new Worksheet(null, this.workflow.id, '', '', '', [], new Date(), new Date(), false);
      this.worksheet.tag = this.workflow.tag;
    } else {
      this.worksheet = JSON.parse(JSON.stringify(data.worksheet));
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  // create workflow
  createWorksheet() {
    this.flowManagerDataService.createWorksheet(this.worksheet).subscribe(
      res => {
        this.worksheet = res;
        this.dialogRef.close(this.worksheet);
      },
      err => {
        console.error(err.error);
        this.onClose();
        this.openSnackBar((err.error), '');
      }
    );
  }

  updateWorksheet() {
    this.flowManagerDataService.updateWorksheet(this.worksheet.id, this.worksheet).subscribe(
      res => {
        this.worksheet = res;
        this.dialogRef.close(this.worksheet);
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
  //   if (this.worksheet.name != '' && this.worksheet.name != undefined && this.worksheet.name != null) {
  //     if ((!this.worksheet.name.match(/^[a-zA-Z][a-zA-Z ]+$/))) {
  //       if (this.worksheet.name.trim().length < 4) {
  //         this.namerrmsg = 'Minimum character length is 4';
  //       } else if (!this.worksheet.name[0].match(/^[a-zA-Z]/)) {
  //         //this.namerrmsg = 'The first character should be alphabet';
  //         this.namerrmsg = '';
  //       } else if (!this.worksheet.name.match(/^[a-zA-Z ]+$/)) {
  //         //this.namerrmsg = 'Alphabets and space is only accepted';
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
