import { I } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { interval, Subject, Observable, Subscription } from 'rxjs';
import { fadeInOut } from 'src/app/app.animations';
import { DFMTLStatus, DFMTLSystemStatus, DFMTLTaskStatus, WorkflowNode } from '../../models/models-v2';
import { FlowManagerDashboardDataService } from '../../services/flow-manager-dashboard-data.service';

@Component({
  selector: 'app-systems-overview-dashboard',
  templateUrl: './systems-overview-dashboard.component.html',
  styleUrls: ['./systems-overview-dashboard.component.scss'],
  animations: [fadeInOut]
})
export class SystemsOverviewDashboardComponent implements OnInit, OnDestroy {
  @Output() refreshedTimestamp: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() goToFlows: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() reloadSubject: Subject<number[]> = new Subject<number[]>();
  @Input() reloadWorkflows: Subject<WorkflowNode[]> = new Subject<WorkflowNode[]>();

  refreshCount: number;

  refreshing: boolean;
  worksheetIds: number[];
  stopOnError: boolean;

  data: DFMTLStatus;
  filteredSystemStatuses: DFMTLSystemStatus[];
  focusedSystem: DFMTLSystemStatus;
  focusedSystemLayer: "INPUT" | "PROCESSING" | "OUTPUT";

  refreshObservable: Observable<number>;
  refreshSubscription: Subscription;

  search: string = '';

  tasksDetailsIndex: number = -1;

  workflows: WorkflowNode[];

  highPriorityStatuses: string[];
  sortBy: "Tasks Status" | "System Name" | "Display Name" = 'Tasks Status';
  sortAsc: boolean;

  constructor(
    private dashboardDataService: FlowManagerDashboardDataService,
    private notifierService: NotifierService
  ) {
    this.refreshCount = 0;
    this.refreshing = false;
    this.worksheetIds = [];
    this.stopOnError = true;
    this.data = null;
    this.filteredSystemStatuses = [];
    this.focusedSystem = null;
    this.refreshObservable = interval(1000);
    this.refreshSubscription = this.refreshObservable.subscribe(
      n => {
        this.refreshTLStatus();
      }
    );
    this.workflows = [];
    this.highPriorityStatuses = ['DOWN', 'PARTIAL_UP'];
    this.sortAsc = false;
  }

  ngOnInit(): void {
    this.reloadSubject.subscribe(response => {
      if (response) {
        this.worksheetIds = response;
        this.refreshTLStatus();
      }
    });
    this.reloadWorkflows.subscribe(response => {
      if (response) {
        this.workflows = response;
      }
    });
  }

  isColor(strColor) :boolean {
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }

  refreshTLStatus(notify?: boolean) {
    this.refreshing = true;
    this.dashboardDataService.getTLStatus(this.worksheetIds).subscribe(
      res => {
        this.data = res;
        this.filterStatuses();
        if (this.focusedSystem) {
          this.refreshFocusedSystemStatus();
        }
        this.refreshedTimestamp.next(this.data.timestamp);
        this.refreshing = false;
        this.refreshCount++;
        if (notify || this.refreshCount === 1) {
          this.showNotification("success", "Systems data refreshed successfully.");
        }
      },
      err => {
        if (this.stopOnError) {
          this.refreshSubscription.unsubscribe();
        }
        console.error(err);
        this.refreshing = false;
        if (notify) {
          this.showNotification("error", "There was a problem loading the systems data. Refer console for more details.");
        }
      }
    );
  }

  onSearchChanged() {
    this.clearFocusedTaskDetails();
    this.filterStatuses();
  }

  filterStatuses() {
    let searchUp = this.search.trim().toUpperCase();
    this.filteredSystemStatuses.length = 0;
    for (let sys of this.data.systemStatuses) {
      if (sys.systemName.trim().toUpperCase().includes(searchUp) || sys.system.displayName.trim().toUpperCase().includes(searchUp)
        || sys.system.systemCategory.trim().toUpperCase().includes(searchUp)) {
        this.filteredSystemStatuses.push(sys);
      }
    }
    this.filteredSystemStatuses.sort((a, b) => this.compare(a, b));
  }

  refreshFocusedSystemStatus() {
    for (let systemStatus of this.filteredSystemStatuses) {
      if (systemStatus.systemName === this.focusedSystem.systemName) {
        this.focusedSystem.inputStatus = systemStatus.inputStatus;
        this.focusedSystem.totalInputTasks = systemStatus.totalInputTasks;
        this.focusedSystem.runningInputTasks = systemStatus.runningInputTasks;
        this.focusedSystem.processingStatus = systemStatus.processingStatus;
        this.focusedSystem.totalProcessingTasks = systemStatus.totalProcessingTasks;
        this.focusedSystem.runningProcessingTasks = systemStatus.runningProcessingTasks;
        this.focusedSystem.outputStatus = systemStatus.outputStatus;
        this.focusedSystem.totalOutputTasks = systemStatus.totalOutputTasks;
        this.focusedSystem.runningOutputTasks = systemStatus.runningOutputTasks;
        for (let newTask of systemStatus.inputTaskStatuses) {
          let exists: boolean = false;
          for (let focusedTask of this.focusedSystem.inputTaskStatuses) {
            if (newTask.taskId === focusedTask.taskId) {
              this.copyTaskProperties(newTask, focusedTask);
              exists = true;
              break;
            }
          }
          if (!exists) {
            this.focusedSystem.inputTaskStatuses.push(newTask);
          }
        }
        for (let newTask of systemStatus.processingTaskStatuses) {
          let exists: boolean = false;
          for (let focusedTask of this.focusedSystem.processingTaskStatuses) {
            if (newTask.taskId === focusedTask.taskId) {
              this.copyTaskProperties(newTask, focusedTask);
              exists = true;
              break;
            }
          }
          if (!exists) {
            this.focusedSystem.processingTaskStatuses.push(newTask);
          }
        }
        for (let newTask of systemStatus.outputTaskStatuses) {
          let exists: boolean = false;
          for (let focusedTask of this.focusedSystem.outputTaskStatuses) {
            if (newTask.taskId === focusedTask.taskId) {
              this.copyTaskProperties(newTask, focusedTask);
              exists = true;
              break;
            }
          }
          if (!exists) {
            this.focusedSystem.outputTaskStatuses.push(newTask);
          }
        }
        break;
      }
    }
  }

  copyTaskProperties(src: DFMTLTaskStatus, dst: DFMTLTaskStatus) {
    dst.running = src.running;
    dst.stopReason = src.stopReason;
    dst.stopErrorLog = src.stopErrorLog;
    dst.stoppedByUser = src.stoppedByUser;
    dst.taskName = src.taskName;
    dst.task = src.task;
    //set worksheet name
    workflow_loop:
    for(let workflow of this.workflows) {
      for(let worksheet of workflow.worksheets) {
        if(worksheet.id === dst.task.worksheetId) {
          dst.workflowName = workflow.name;
          dst.worksheetName = worksheet.name;
          break workflow_loop;
        }
      }
    }
  }

  toggleTasksDetails(i: number, focusedLayer: "INPUT" | "PROCESSING" | "OUTPUT") {
    if (this.tasksDetailsIndex === i && this.focusedSystemLayer === focusedLayer) {
      this.clearFocusedTaskDetails();
    } else {
      this.tasksDetailsIndex = i;
      this.focusedSystem = this.filteredSystemStatuses[i];
      this.focusedSystemLayer = focusedLayer;
    }
  }

  clearFocusedTaskDetails() {
    this.tasksDetailsIndex = -1;
    this.focusedSystem = null;
    this.focusedSystemLayer = null;
  }

  goToWorksheet(worksheetId: number) {
    if (!this.workflows) {
      this.showNotification("error", "Workflows data not available.");
      return;
    }
    let workflowId: number = null;
    workflow_loop:
    for (let workflow of this.workflows) {
      for (let worksheet of workflow.worksheets) {
        if (worksheet.id === worksheetId) {
          workflowId = workflow.id;
          break workflow_loop;
        }
      }
    }
    if (!workflowId) {
      this.showNotification("error", "The workflow cannot be found for the given worksheet.");
      return;
    }
    sessionStorage.setItem('AUTO_SELECT_WORKFLOW_ID', `${workflowId}`);
    sessionStorage.setItem('AUTO_SELECT_WORKSHEET_ID', `${worksheetId}`);
    sessionStorage.setItem('AUTO_PEEK_SYSTEMS', 'Y');
    this.goToFlows.next(true);
  }

  showNotification(type: "default" | "info" | "warning" | "success" | "error", message: string) {
    this.notifierService.notify(type, message);
  }

  compare(a: DFMTLSystemStatus, b: DFMTLSystemStatus) {
    switch (this.sortBy) {
      case 'Tasks Status': {
        let downCountA = 0;
        let downCountB = 0;
        downCountA = this.highPriorityStatuses.includes(a.inputStatus) ? downCountA+1 : downCountA;
        downCountA = this.highPriorityStatuses.includes(a.processingStatus) ? downCountA+1 : downCountA;
        downCountA = this.highPriorityStatuses.includes(a.outputStatus) ? downCountA+1 : downCountA;
        downCountB = this.highPriorityStatuses.includes(b.inputStatus) ? downCountB+1 : downCountB;
        downCountB = this.highPriorityStatuses.includes(b.processingStatus) ? downCountB+1 : downCountB;
        downCountB = this.highPriorityStatuses.includes(b.outputStatus) ? downCountB+1 : downCountB;
        if (downCountA < downCountB) {
          return this.sortAsc ? -1 : 1;
        }
        if (downCountA > downCountB) {
          return this.sortAsc ? 1 : -1;
        }
        break;
      }
      case 'System Name': {
        if (a.systemName < b.systemName) {
          return this.sortAsc ? -1 : 1;
        }
        if (a.systemName > b.systemName) {
          return this.sortAsc ? 1 : -1;
        }
        break;
      }
      case 'Display Name': {
        if (a.system.displayName < b.system.displayName) {
          return this.sortAsc ? -1 : 1;
        }
        if (a.system.displayName > b.system.displayName) {
          return this.sortAsc ? 1 : -1;
        }
        break;
      }
    }
    return 0;
  }

}
