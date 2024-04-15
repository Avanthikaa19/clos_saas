import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskType, Task, Worksheet, Routes, DFMSystem } from '../../models/models-v2';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';


@Component({
  selector: 'app-task-details-modal',
  templateUrl: './task-details-modal.component.html',
  styleUrls: ['./task-details-modal.component.scss']
})
export class TaskDetailsModalComponent implements OnInit {

  validating: boolean = false;
  taskLayers: string[] = [];
  systems: DFMSystem[] = [];

  loadingSystems: boolean = false;
  loadingLayers: boolean = false;
  loadingTypes: boolean = false;
  taskTypes: TaskType[] = [];
  selectedTaskType: TaskType;
  valiDation: boolean = false;
  errormsg: boolean = false;

  loadingConfig: boolean = false;
  worksheet: Worksheet;
  creating: boolean = false;
  task: Task;

  selectedTabIndex = 0;

  inputType: TaskType = null;
  originalConfig: string;

  prevTaskManualValue: number;

  tempHide:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDetailsModalComponent,
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    if(data.inputType != undefined && data.inputType != null) {
      this.inputType = data.inputType;
    }
    if (data.worksheet == undefined || data.worksheet == null) {
      this.onClose();
    } else {
      this.worksheet = data.worksheet;
    }
    // console.log(data.task == undefined || data.task == null)
    // console.log(this.data)
    
    if (data.task == undefined || data.task == null) {
      this.task = new Task();
      this.task.worksheetId = this.worksheet.id;
      this.task.name = '';
      this.task.description = '';
      this.task.created = new Date();
      this.task.lastUpdated = new Date();
      this.task.autoStart = 'N';
      this.task.instances = 1;
      this.task.prevTaskInstance = 1;
      this.task.type = this.inputType == null ? null : this.inputType.type;
      this.task.layer = this.inputType == null ? null : this.inputType.layer;
      if (this.worksheet.tasks.length > 0) {
        this.task.prevTaskId = this.worksheet.tasks[this.worksheet.tasks.length - 1].id;
      }
    } else {
      // console.log(this.task)
      this.task = JSON.parse(JSON.stringify(data.task));
      // console.log(this.task)
      this.originalConfig = this.task.config.toString();
      // console.log(this.originalConfig)
      this.task.config = JSON.parse(this.originalConfig);
      // console.log(this.task)
    }
    let prevTaskOfSameOrigin: boolean = false;
    if (this.task.prevTaskId == null) {
      this.task.prevTaskId = 0;
      prevTaskOfSameOrigin = true;
    } else {
      for(let task of this.worksheet.tasks) {
        if(this.task.prevTaskId === task.id) {
          prevTaskOfSameOrigin = true;
          break;
        }
      }
    }
    if(!prevTaskOfSameOrigin) {
      this.prevTaskManualValue = this.task.prevTaskId;
      this.task.prevTaskId = -1;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.refreshSystems();
    this.refreshTaskLayers();
    this.refreshTaskTypes();
    // console.log(this.task.id)
    // this.getPreviousTasks(this.worksheet.id);
  }

  getConfig(config: any) {
    this.task.config = config;
  }

  //change config as per instance
  configChanged() {
    let routes: Routes[] = this.task.config.routes;
    if (routes.length != this.task.instances) {
      for (let i = 1; i <= this.task.instances; i++) {
        if (routes.find(x => x.instance === i)) {
          routes.find(x => x.instance === i).instance = i;
        } else {
          routes.push({ instance: i, name: '', match: '' });
        }
      }
      this.task.config.routes = routes;
    }

  }

  //method for validating configuration
  validateConfig() {
    // console.log(this.task.config);
    // console.log(this.task.type);
    if (this.task.config.length != 0 && this.task.type != null) {
      this.loadingLayers = true;
      this.errormsg = true;
      this.flowManagerDataService.validateConfiguration(this.task.type, this.task.config).subscribe(
        res => {
          this.loadingLayers = false;
          this.openSnackBar(JSON.stringify(res.message), null);
          this.createTask();
        }, err => {
          if (err.status == 200) {
            this.openSnackBar(JSON.stringify(err.error.text), null);
            this.createTask();
          } else {
            this.openSnackBar(JSON.stringify(err.error.message), null);
          }
          this.loadingLayers = false;
        }
      );
    }
  }

  yourCreatefunc() {
    if (this.valiDation == false) {
      console.log("UnChecked")
      this.validateConfig();
    }
    else if (this.valiDation == true) {
      this.createTask()
      console.log("Checked")
    }
  }

  yourUpdatefunc() {
    if (this.valiDation == false) {
      console.log("UnChecked")
      this.validateUpdateConfig();
    }
    else if (this.valiDation == true) {
      this.updateTask()
      console.log("Checked")
    }
  }

  validateUpdateConfig() {
    // console.log(this.task.config)
    // console.log(this.task.type);
    if (this.task.config.length != 0 && this.task.type != null) {
      this.validating = true;
      this.errormsg = true;
      this.flowManagerDataService.validateConfiguration(this.task.type, this.task.config).subscribe(
        res => {
          this.openSnackBar(JSON.stringify(res.message), null);
          this.updateTask();
          this.validating = false;
        }, err => {
          if (err.status == 200) {
            this.openSnackBar(JSON.stringify(err.error.text), null);
            this.updateTask();
          } else {
            this.openSnackBar(JSON.stringify(err.error.message), null);
          }
          this.validating = false;
        }
      );
    }
  }

  refreshSystems() {
    this.loadingSystems = true;
    this.flowManagerDataService.getAllSystems().subscribe(
      res => {
        this.systems = res;
        this.loadingSystems = false;
      },
      err => {
        this.loadingSystems = false;
        console.error(err.error);
      }
    );
  }

  refreshTaskLayers() {
    this.loadingLayers = true;
    this.flowManagerDataService.getTaskLayers().subscribe(
      res => {
        this.taskLayers = res;
        this.loadingLayers = false;
      },
      err => {
        this.loadingLayers = false;
        console.error(err.error);
      }
    );
  }

  refreshTaskTypes() {
    this.loadingTypes = true;
    this.flowManagerDataService.getTaskTypes().subscribe(
      res => {
        this.taskTypes = res;
        if (this.task.type == null) {
          this.selectedTaskType = this.taskTypes[0];
          this.updateTaskTypeAndLayer();
        } else {
          for (let i = 0; i < this.taskTypes.length; i++) {
            if (this.task.type == this.taskTypes[i].type) {
              this.selectedTaskType = this.taskTypes[i];
              break;
            }
          }
        }
        this.loadingTypes = false;
      },
      err => {
        this.loadingTypes = false;
        console.error(err.error);
      }
    );
  }

  updateTaskTypeAndLayer() {
    this.task.type = this.selectedTaskType.type;
    this.task.layer = this.selectedTaskType.layer;
    //set config to null so that the component refreshes it
    this.task.config = null;
  }

  createTask() {
    this.creating = true;
    let taskToSave: Task = JSON.parse(JSON.stringify(this.task));
    if (taskToSave.prevTaskId == 0) {
      taskToSave.prevTaskId = null;
    } else if (taskToSave.prevTaskId === -1 && this.prevTaskManualValue) {
      taskToSave.prevTaskId = this.prevTaskManualValue;
    }
    taskToSave.config = JSON.stringify(taskToSave.config);
    this.flowManagerDataService.createTask(taskToSave).subscribe(
      res => {
        taskToSave = res;
        this.creating = false;
        this.dialogRef.close(taskToSave);
      },
      err => {
        this.creating = false;
        this.dialogRef.close();
      }
    );
  }

  updateTask() {
    let taskToSave: Task = JSON.parse(JSON.stringify(this.task));
    if (taskToSave.prevTaskId == 0) {
      taskToSave.prevTaskId = null;
    } else if (taskToSave.prevTaskId === -1 && this.prevTaskManualValue) {
      taskToSave.prevTaskId = this.prevTaskManualValue;
    }
    taskToSave.config = JSON.stringify(taskToSave.config);
    this.creating = true;
    this.flowManagerDataService.updateTask(taskToSave.id, taskToSave).subscribe(
      res => {
        taskToSave = res;
        this.creating = false;
        this.dialogRef.close(taskToSave);
      },
      err => {
        this.creating = false;
        this.dialogRef.close();
      }
    );
  }

  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
