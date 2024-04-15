import { Component, OnInit, Inject } from '@angular/core';
import { Worksheet, TaskLog } from '../../models/models-v2';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss']
})
export class LogViewerComponent implements OnInit {

  worksheet: Worksheet;

  logs: TaskLog[] = [];

  selectedLogMessage: string;

  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LogViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LogViewerComponent,
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog
  ) {
    this.worksheet = data.worksheet;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.refreshLogs();
  }

  refreshLogs() {
    this.loading = true;
    this.flowManagerDataService.getLogsByWorksheet(this.worksheet.id, 100).subscribe(
      res => {
        this.logs = res;
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
  }

}
