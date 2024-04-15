import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskType } from '../../models/models-v2';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';

@Component({
  selector: 'app-task-types-modal',
  templateUrl: './task-types-modal.component.html',
  styleUrls: ['./task-types-modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class TaskTypesModalComponent implements OnInit {

  loadingTypes: boolean = false;
  taskTypes: TaskType[] = [];
  selectedTaskType: TaskType = null;

  filterName: string = '';
  filterLayer: string = '';
  filterPurpose: string = '';
  
  constructor(
    public dialogRef: MatDialogRef<TaskTypesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskTypesModalComponent,
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.refreshTaskTypes();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  refreshTaskTypes() {
    this.loadingTypes = true;
    this.flowManagerDataService.getTaskTypes().subscribe(
      res => {
        this.taskTypes = res;
        this.loadingTypes = false;
      },
      err => {
        this.loadingTypes = false;
        console.error(err.error);
      }
    );
  }

  selectTaskType(taskType: TaskType) {
    this.selectedTaskType = taskType;
  }

  completeSelection() {
    this.dialogRef.close(this.selectedTaskType);
  }

}
