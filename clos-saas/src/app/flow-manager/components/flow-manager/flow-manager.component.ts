import { Component, OnInit, HostListener, ViewChild, TemplateRef, ViewContainerRef, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, MiniMapPosition, Layout, } from '@swimlane/ngx-graph';
// import { Subject, Subscription, interval } from 'rxjs';
// import { app_header_height } from '../app.constants';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FlowManagerDataService } from './services/flow-manager-data.service';
import { Workflow, Task, Worksheet, TaskStatusResponse, Entry, WorksheetStatus, TaskEntriesStatus, TaskType, DFMSystem } from './models/models-v2';
import { EntryDetailsModalComponent } from './modals/entry-details-modal/entry-details-modal.component';
import { WorkflowDetailsModalComponent } from './modals/workflow-details-modal/workflow-details-modal.component';
import { WorksheetDetailsModalComponent } from './modals/worksheet-details-modal/worksheet-details-modal.component';
import { TaskDetailsModalComponent } from './modals/task-details-modal/task-details-modal.component';
// import { UrlService } from '../services/http/url.service';
import { LogViewerComponent } from './modals/log-viewer/log-viewer.component';
import { HttpEvent, HttpEventType } from '@angular/common/http';
// import { BatchUploadsModalComponent } from '../scf/modals/batch-uploads-modal/batch-uploads-modal.component';
import { ImportExportWizardComponent } from './modals/import-export-wizard/import-export-wizard.component';
// import { UserDataService } from '../services/user-data.service';
import { OutputEntriesQueueComponent } from './modals/queues/output-entries-queue/output-entries-queue.component';
import { MatMenuWorksheetComponent } from './mat-menu-worksheet/mat-menu-worksheet.component';
import { MatMenuWorkflowComponent } from './mat-menu-workflow/mat-menu-workflow.component';
import { TaskTypesModalComponent } from './modals/task-types-modal/task-types-modal.component';
// import { fadeInOut } from '../app.animations';
import { NotifierService } from 'angular-notifier';
import { SystemsListComponent } from './modals/systems-list/systems-list.component';
import { fadeInOut } from 'src/app/app.animations';
import { interval, Subject, Subscription } from 'rxjs';
import { AccessControlData } from 'src/app/app.access';
import { CollectorConfigModel } from './modals/task-configurations/collector-configration/collector-configration.component';
// import { interval, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-flow-manager',
  templateUrl: './flow-manager.component.html',
  styleUrls: ['./flow-manager.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]
    ),
    fadeInOut
  ]
})
export class FlowManagerComponent implements OnInit, OnDestroy {
  //test mode
  testMode: boolean = false;
  testSelectWorkflowId: number = 23;
  testSelectWorksheetId: number = 24;
  testExistingTask: boolean = true;
  testSelectTaskId: number = 25;
  testNewTask: boolean = false;
  newTaskType: string = 'HOLD_RELEASE';
  newTaskLayer: string = 'INPUT';

  //resolution fix
  mobile: boolean = false;
  fontSize: number = 5;

  // DFM_VERSION: string = UrlService.DFM_VERSION;
  //component size
  component_height = 500;
  dialogarr: any[] = [];
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - 80;
   
    if(window.innerWidth < 1649){
      this.mobile = true;
      // console.log('Condition Satisfied', this.mobile);
    }else{
      this.mobile = false;
      // console.log('Condition UNSatisfied', this.mobile);
    }
  }

  tabIndex = 0;
  tasksTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (this.nodes.length > 0) {
      this.selectedTask = this.nodes[tabChangeEvent.index].data.task;
      this.selectedTaskConfig = JSON.parse(this.selectedTask.config.toString());
    }
  }
  tabIndex2 = 0;
  tasksSubTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    //do nothing
  }

  @ViewChild('nodeMenu', { static: true }) nodeMenu: TemplateRef<any>;
  @ViewChild(OutputEntriesQueueComponent) queueComp: OutputEntriesQueueComponent;

  overlayRef: OverlayRef | null;
  sub: Subscription = new Subscription();
  isSuperuser: boolean = false;

  typeTag: string;
  showFiller = false;
  //graph
  nodes: Node[] = [];
  panelOpenState: boolean = false;
  links: Edge[] = [];
  curveType: string = "Linear";
  curve: any = shape.curveLinear;
  layout: String | Layout = 'dagre';
  animate: boolean = false;
  draggingEnabled: boolean = false;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = false;
  zoomSpeed: number = 0.5;
  zoomLevel: number = 0.75;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  panOnZoom: boolean = true;
  panOffsetX: number = 0;
  panOffsetY: number = 0;
  autoZoom: boolean = false;
  autoCenter: boolean = true;
  update$: Subject<boolean> = new Subject();
  updateGraph() {
    this.update$.next(true)
  }
  center$: Subject<boolean> = new Subject();
  centerGraph() {
    // trigger center
    this.center$.next(true);
  }
  showMiniMap: boolean = true;
  miniMapMaxWidthPx: number = 200;
  miniMapMaxHeightPx: number = 100;
  miniMapPosition: MiniMapPosition = MiniMapPosition.UpperLeft;
  zoomToFit$: Subject<boolean> = new Subject();
  zoomToFit() {
    this.zoomToFit$.next(true);
  }
  panToNode$: Subject<boolean> = new Subject();
  //Flows
  workflows: Workflow[] = [];
  tasks: Task[] = [];

  //selections
  autoSelectWorkflowId: number = null;
  autoSelectWorksheetId: number = null;

  selectedWorkflow: Workflow = null;
  selectedWorksheet: Worksheet = null;
  selectedWorksheetStatus: WorksheetStatus = null;
  selectedTask: Task = null;
  selectedTaskConfig: any = {};

  //refreshing tasks statuses
  loadingStatus: boolean = false;
  autoRefreshStatusSubscription: Subscription = null;
  autoRefreshStatus: boolean = true;
  autoRefreshStatusSeconds: number = 5;

  //loading flags
  loadingWorkflows: boolean = false;
  loadingWorksheets: boolean = false;
  loadingTasks: boolean = false;

  //error message
  errorMessage: string = '';
  errorMessageCount: number = 0;
  errorNotificationMinimized: boolean = true;

  loadingSystems: boolean = false;
  systems: DFMSystem[] = [];
  systemsMap: any = {};
  peekSystemSeconds: number = 5;
  peekSystemSecondsUsed: number = 0;
  peekSystem: boolean = false;

  getFieldLabels(fieldName: string) {
    switch (fieldName) {
      case 'created': return 'Created';
      case 'processed': return 'Processed';
      case 'sourceId': return 'Source ID';
      case 'id': return 'ID';
      case 'version': return 'Version';
      case 'dataType': return 'Data Type';
      case 'searchKey': return 'Search Key';
      case 'bucketId': return 'Bucket ID';
      default: return fieldName;
    }
  }

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public ac: AccessControlData,
    // private url: UrlService,
    // private userDataService: UserDataService,
    private notifierService: NotifierService
  ) {
    this.updateComponentSize();
    this.setInterpolationType("Monotone X");
  }

  // public updateUrl(): Promise<Object> {
  //   return this.url.getUrl().toPromise();
  // }

  async ngOnInit() {
    // let response = await this.updateUrl();
    // UrlService.API_URL = response.toString();
    // if (UrlService.API_URL.trim().length == 0) {
    //   console.warn('FALLING BACK TO ALTERNATE API URL.');
    //   UrlService.API_URL = UrlService.FALLBACK_API_URL;
    // }
    //init component
    if(sessionStorage.getItem('AUTO_SELECT_WORKFLOW_ID')) {
      this.autoSelectWorkflowId = Number.parseInt(sessionStorage.getItem('AUTO_SELECT_WORKFLOW_ID'));
      sessionStorage.removeItem('AUTO_SELECT_WORKFLOW_ID');
    }
    if(sessionStorage.getItem('AUTO_SELECT_WORKSHEET_ID')) {
      this.autoSelectWorksheetId = Number.parseInt(sessionStorage.getItem('AUTO_SELECT_WORKSHEET_ID'));
      sessionStorage.removeItem('AUTO_SELECT_WORKSHEET_ID');
    }
    this.refreshSystems();
    this.refreshWorkflows();
    // this.refreshSuperuser();
  }

  ngAfterViewInit() {
    this.scrollErrorLogsToBottom(); // For messsages already present
    this.messageContainers.changes.subscribe((list: QueryList<ElementRef>) => {
      this.scrollErrorLogsToBottom(); // For messages added later
    });
    //TESTING
    // this.openWizard();
    // this.openEntry(1668);
  }

  ngOnDestroy() {
    this.closeAllOpenTabs();
    if (this.autoRefreshStatusSubscription != undefined) {
      this.autoRefreshStatusSubscription.unsubscribe();
    }
  }

  closeAllOpenTabs() {
    for(let i=0;i<this.dialogarr.length;i++) {
      this.dialogarr[i].close();
    }
  }

  // refreshSuperuser() {
  //   this.userDataService.isLoggedInUserSuper().subscribe(
  //     res => {
  //       this.isSuperuser = res.amisuper;
  //     }
  //   );
  // }

  refreshSystems() {
    this.loadingSystems = true;
    this.flowManagerDataService.getAllSystems().subscribe(
      res => {
        this.systems = res;
        this.systemsMap = {};
        for(let system of this.systems) {
          this.systemsMap[system.systemName] = system;
        }
        this.loadingSystems = false;
      },
      err => {
        this.showNotification('error', 'Systems data could not be laoded. Refer console for more details.');
        this.loadingSystems = false;
      }
    );
  }

  onPeekSystem() {
    this.peekSystem = true;
    this.showNotification('default', `Showing system names for ${this.peekSystemSeconds} seconds.`);
    setTimeout(() => {
      this.peekSystem = false;
    }, 1000 * this.peekSystemSeconds);
  }

  setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === "Bundle") {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === "Cardinal") {
      this.curve = shape.curveCardinal;
    }
    if (curveType === "Catmull Rom") {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === "Linear") {
      this.curve = shape.curveLinear;
    }
    if (curveType === "Monotone X") {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === "Monotone Y") {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === "Natural") {
      this.curve = shape.curveNatural;
    }
    if (curveType === "Step") {
      this.curve = shape.curveStep;
    }
    if (curveType === "Step After") {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === "Step Before") {
      this.curve = shape.curveStepBefore;
    }
  }

  refreshWorkflows() {
    // this.openEntry(305541);
    this.loadingWorkflows = true;
    this.flowManagerDataService.getWorkflows().subscribe(
      res => {
        this.workflows = res;
        this.loadingWorkflows = false;
        if(this.testMode) {
          console.log('TEST MODE: ' + 'Selecting workflow ' + this.testSelectWorkflowId);
          if(this.workflows.length > 0) {
            this.selectWorkflowById(this.testSelectWorkflowId);
          } else {
            console.warn('TEST MODE: ' + 'No workflows to select.');
          }
        }
        //todo later
        if(this.autoSelectWorkflowId != null) {
          this.selectWorkflowById(this.autoSelectWorkflowId);
        }
      },
      err => {
        this.loadingWorkflows = false;
        this.addToErrorLogs(err.error);
      }
    );
  }

  selectWorkflowById(id: number) {
    for (let i = 0; i < this.workflows.length; i++) {
      if (this.workflows[i].id == id) {
        this.onWorkflowSelected(this.workflows[i]);
        break;
      }
    }
  }

  onWorkflowSelected(workflow: Workflow) {
    //when a workflow is selected, fetch the worksheets under it
    this.selectedWorkflow = workflow;
    if (this.selectedWorkflow.worksheets.length > 0) {
      for (let i = 0; i < this.selectedWorkflow.worksheets.length; i++) {
        let selectForTesting: boolean = (this.testMode && this.selectedWorkflow.worksheets[i].id == this.testSelectWorksheetId);
        if(selectForTesting) {
          console.log('TEST MODE: ' + 'Selecting worksheet ' + this.testSelectWorksheetId);
        }
        let selectForAutoSelect: boolean = (this.autoSelectWorksheetId && this.selectedWorkflow.worksheets[i].id == this.autoSelectWorksheetId);
        if (selectForAutoSelect || selectForTesting) {
          this.onWorksheetSelected(this.selectedWorkflow, this.selectedWorkflow.worksheets[i]);
          break;
        }
      }
      // this.onWorksheetSelected(this.selectedWorkflow, this.selectedWorkflow.worksheets[0]);
      //TESTING
      if(this.testMode && this.testExistingTask && this.selectedWorksheet) {
        console.log('TEST MODE: ' + 'Selecting task ' + this.testSelectTaskId);
        for(let task of this.selectedWorksheet.tasks) {
          if(task.id === this.testSelectTaskId) {
            this.openTaskDetails(this.selectedWorksheet, task);
            break;
          }
        }
      } else if(this.testMode && this.testNewTask) {
        this.createTaskByTaskType(this.selectedWorksheet, { type: this.newTaskType, layer: this.newTaskLayer });
      }
    } else {
      if(this.testMode && this.testSelectWorksheetId) {
        console.warn('TEST MODE: ' + 'No worksheets to select.');
      }
    }
  }

  onWorksheetSelected(workflow: Workflow, worksheet: Worksheet) {
    //when a worksheet is selected, fetch the tasks under it
    this.tasks = [];
    this.selectedWorkflow = workflow;
    this.selectedWorksheet = worksheet;
    this.selectedTask = null;
    this.tasks = this.selectedWorksheet.tasks;
    this.loadingTasks = true;
    this.loadNodesAndLinks(this.selectedWorksheet.tasks);
    this.loadingTasks = false;

    //autoselect first task
    if (this.selectedWorksheet.tasks.length > 0) {
      this.selectedTask = this.selectedWorksheet.tasks[0];
    }

    //refresh status initially on select
    this.selectedWorksheetStatus = null;
    this.refreshWorksheetStatus();

    //unsubscribe
    if (this.autoRefreshStatusSubscription != null && !this.autoRefreshStatusSubscription.closed) {
      this.autoRefreshStatusSubscription.unsubscribe();
    }
    //resubscribe
    if (this.autoRefreshStatus && (this.autoRefreshStatusSubscription == null || this.autoRefreshStatusSubscription.closed)) {
      this.autoRefreshStatusSubscription = interval(this.autoRefreshStatusSeconds * 1000).subscribe(x => {
        if (this.autoRefreshStatus && !this.loadingStatus && !document.hidden) {
          this.refreshTasksStatus();
          this.refreshWorksheetStatus();
        }
      });
      console.log(`Refreshing task statuses every ${this.autoRefreshStatusSeconds} seconds.`);
    }

    for (let i = 0; i < this.tasks.length; i++) {
      this.tasks[i].status = new TaskStatusResponse(this.tasks[i].id, 'LOADING', '');
    }
    this.refreshTasksStatus();
    this.refreshQMSStatus();
    //peek system names if necessary
    if(sessionStorage.getItem('AUTO_PEEK_SYSTEMS')) {
      setTimeout(() => {
        this.onPeekSystem();
      }, 500);
      sessionStorage.removeItem('AUTO_PEEK_SYSTEMS');
    }
  }

  //worksheet status refresh
  refreshWorksheetStatus() {
    this.flowManagerDataService.getWorksheetStatus(this.selectedWorksheet.id).subscribe(
      res => {
        this.selectedWorksheetStatus = res;
        node_loop:
        for (let i = 0; i < this.nodes.length; i++) {
          if (this.nodes[i].data != null && this.nodes[i].data.task != null && this.nodes[i].data.task.id != null) {
            status_loop:
            for (let j = 0; j < this.selectedWorksheetStatus.taskEntriesStatuses.length; j++) {
              let status: TaskEntriesStatus = this.selectedWorksheetStatus.taskEntriesStatuses[j];
              if (this.nodes[i].data.task.id == status.taskId) {
                this.nodes[i].data.taskErrored = status.errorCount;
                this.nodes[i].data.taskProcessed = status.processedCount;
                this.nodes[i].data.taskUnProcessed = status.unProcessedCount;
                break status_loop;
              } else {
                this.nodes[i].data.taskErrored = null;
                this.nodes[i].data.taskProcessed = null;
                this.nodes[i].data.taskUnProcessed = null;
              }
            }
          }
        }
      },
      err => {
        this.addToErrorLogs(err.error);
      }
    );
  }

  //single task status refresh
  refreshTaskStatus(task: Task) {
    task.status = new TaskStatusResponse(task.id, 'LOADING', '');
    this.flowManagerDataService.getTaskStatus(task.id).subscribe(
      res => {
        task.status = res;
        console.log(this.tasks);
      },
      err => {
        this.addToErrorLogs(err.error);
      }
    );
  }

  //bulk refresh all tasks statuses in a single request
  refreshTasksStatus() {
    if (this.selectedWorksheet == null) {
      return;
    }
    if (this.tasks.length > 0) {
      this.loadingStatus = true;
      let taskIds: number[] = [];
      for (let i = 0; i < this.tasks.length; i++) {
        taskIds.push(this.tasks[i].id);
      }
      this.flowManagerDataService.getTasksStatuses(taskIds).subscribe(
        res => {
          let taskStatuses: TaskStatusResponse[] = res;
          task_loop:
          for (let i = 0; i < this.tasks.length; i++) {
            res_loop:
            for (let j = 0; j < taskStatuses.length; j++) {
              if (this.tasks[i].id == taskStatuses[j].taskId) {
                //if task is starting, dont update its status unless it has started
                if (this.tasks[i].status.status === 'STARTING' && taskStatuses[j].status === 'RUNNING') {
                  this.tasks[i].status = taskStatuses[j];
                  continue task_loop;
                } else
                  //if task is stopping, dont update its status unless it has stopped
                  if (this.tasks[i].status.status === 'STOPPING' && taskStatuses[j].status === 'STOPPED') {
                    this.tasks[i].status = taskStatuses[j];
                    continue task_loop;
                  } else
                    //otherwise, just update its status regardless
                    if (['LOADING', 'RUNNING', 'STOPPED'].includes(this.tasks[i].status.status)) {
                      this.tasks[i].status = taskStatuses[j];
                      continue task_loop;
                    }
              }
            }
          }
          this.loadingStatus = false;
        },
        err => {
          this.loadingStatus = false;
          this.addToErrorLogs(err.status == 0 ? `Disconnected from server. Retrying in ${this.autoRefreshStatusSeconds} seconds.` : err);
        }
      );
    }
  }

  onTaskSelected(tabIndex: number, task: Task) {
    //switches current tab
    this.tabIndex = tabIndex;
    this.selectedTask = task;
    // console.log(this.selectedTask.config.toString());
    this.selectedTaskConfig = JSON.parse(this.selectedTask.config.toString());
  }

  stopLayerTasks(layer: String) {
    console.log(layer);
    for (let node of this.nodes) {
      if (node.data.layer == layer) {
        //this.stopTask(node.id);
      }
    }
  }

  loadNodesFlag(flag: boolean) {
    for (let x of this.nodes) {
      x.data.flag = flag;
    }
  }

  loadNodesAndLinks(tasks: Task[]) {
    this.nodes = this.getNodesFromTasks(tasks);
    this.links = this.getLinksFromTasks(tasks);
    // if (this.nodes.length >= 7) {
    //   this.zoomLevel = 0.75;
    // } else {
    //   this.zoomLevel = 1.0;
    // }
  }

  getNodesFromTasks(tasks: Task[]): Node[] {
    let nodes: Node[] = [];
    let i = 0;
    for (let task of tasks) {
      let prevTaskOfSameOrigin: boolean = task.prevTaskId ? this.taskIdExistsInArray(task.prevTaskId, tasks) : true;
      let data = { idx: i, type: 'Task', height: "60px", layer: task.layer, task: task, status: 'RUNNING', prevTaskOfSameOrigin: prevTaskOfSameOrigin };
      let temp: Node = { id: task.id.toString(), label: task.name, data: data };
      nodes.push(temp)
      i++;
    }
    return nodes;
  }

  getLinksFromTasks(tasks: Task[]): Edge[] {
    let links: Edge[] = [];
    for(let task of tasks) {
      if(task.type === 'COLLECTOR') {
        //read config and get linking tasks
        let taskConfig: CollectorConfigModel = JSON.parse(task.config);
        collector_input_loop:
        for(let inp of taskConfig.inputs) {
          //check if task is in the same worksheet
          if(inp.workflowName === this.selectedWorkflow.name && inp.worksheetName === this.selectedWorksheet.name) {
            //find task ID
            for(let t of this.tasks) {
              if(t.name === inp.taskName) {
                links.push(
                  {
                    source: t.id.toString(),
                    target: task.id.toString(),
                    label: inp.taskInstance.toString(),
                    data: { highlight: false }
                  }
                );
                continue collector_input_loop;
              }
            }
          }
        }
      }

    }
    for (let task of tasks) {
      let prevTaskOfSameOrigin: boolean = this.taskIdExistsInArray(task.prevTaskId, tasks);
      if (!task.prevTaskId || !prevTaskOfSameOrigin) {
        //do nothing for first task in flow
        //do nothing for tasks that receive inputs from other worksheets
      } else {
        //make the link
        links.push(
          {
            source: task.prevTaskId.toString(),
            target: task.id.toString(),
            label: task.prevTaskInstance.toString(),
            data: { highlight: false }
          }
        );
      }
    }
    return links;
  }

  taskIdExistsInArray(taskId: number, tasks: Task[]) {
    for(let task of tasks) {
      if(taskId === task.id) {
        return true;
      }
    }
    return false;
  }

  clearTracks() {
    this.links.forEach(
      link => {
        link.data.highlight = false;
        link.data.highlightEntryId = null;
      }
    );
    this.nodes.forEach(
      node => {
        node.data.highlight = false;
      }
    );
  }

  trackEntry(entryId: number) {
    this.flowManagerDataService.trackEntryById(entryId).subscribe(
      res => {
        let linksCount: number = 0;
        let nodesCount: number = 0;
        this.clearTracks();
        let lastEntry: Entry;
        res.forEach(
          entry => {
            this.links.forEach(
              link => {
                if(link.target === entry.queueId.toString()) {
                  link.data.highlight = true;
                  link.data.highlightEntryId = lastEntry ? lastEntry.id : null;
                  linksCount++;
                }
              }
            );
            this.nodes.forEach(
              node => {
                if(node.data.task.id === entry.queueId) {
                  node.data.highlight = true;
                  nodesCount++;
                }
              }
            );
            lastEntry = entry;
          }
        );
        this.openSnackBar('Highlighted ' + linksCount + ' paths through ' + nodesCount + ' tasks.', null);
      },
      err => {
        console.error(err);
        this.clearTracks();
      }
    );
  }

  //TASK NODES RIGHT CLICK MENU & ACTIONS
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  //CHILD COMPONENT WORKFLOW
  @ViewChild(MatMenuWorkflowComponent) childWorkflow:MatMenuWorkflowComponent;
  //CHILD COMPONENT WROKSHEET
  @ViewChild(MatMenuWorksheetComponent) childWorksheet:MatMenuWorksheetComponent;

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, item: Task) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

//WORKFLOW NODES RIGHT CLICK MENU & ACTIONS
  childWorkflowComponent(event: MouseEvent, workflow : Workflow){
    this.selectedWorkflow = workflow;
     event.preventDefault();
     this.childWorkflow.onContextMenuWorkFlow(event, workflow);
  }
//WORKSHEET NODES RIGHT CLICK MENU & ACTIONS
  childWorksheetComponent(event: MouseEvent, worksheet: Worksheet){
    this.selectedWorksheet = worksheet;
    event.preventDefault();
    this.childWorksheet.onContextMenuWorksheet(event, worksheet);
  }
//TO CALL PARENT WORKFLOW FUNCTION
  parentWorkflowFun(){
    console.log(this.selectedWorkflow)
    this.flowManagerDataService.cloneWorflow(this.selectedWorkflow).subscribe(
      res => {
        this.openSnackBar('Workflow has cloned successfully!', null);
        this.refreshWorkflows();
      }
    );
    console.log('Workflow API Works')
    
  }
//TO CALL PARENT WORKSHEET FUNCTION
  parentWorksheetFun(){
    this.flowManagerDataService.cloneWorksheet(this.selectedWorksheet).subscribe(
      res => {
        this.openSnackBar('Worksheet has cloned successfully!', null);
        this.refreshWorkflows();
      }
    );
    console.log('Worksheet API Works')
    
  }  

  startTask(task: Task) {
    let oldStatus: string = task.status.status;
    task.status.status = 'STARTING';
    this.flowManagerDataService.startTask(task.id).subscribe(
      res => {
        this.openSnackBar(res.message, null);
        setTimeout(() => {
          this.refreshTaskStatus(task);
          this.refreshWorksheetStatus();
        }, 2000);
      },
      err => {
        task.status.status = oldStatus;
        this.addToErrorLogs(err.error);
        this.errorNotificationMinimized = false;
      }
    );
  }

  stopTask(task: Task) {
    let oldStatus: string = task.status.status;
    task.status.status = 'STOPPING';
      this.flowManagerDataService.stopTask(task.status.jobName).subscribe(
        res => {
          this.openSnackBar(res.message, null);
          setTimeout(() => {
            this.refreshTaskStatus(task);
            this.refreshWorksheetStatus();
          }, 5000);
        },
        err => {
          task.status.status = oldStatus;
          this.addToErrorLogs(err.error);
          this.errorNotificationMinimized = false;
        }
      );
  }

  startWorksheet(worksheet: Worksheet) {
    if (worksheet == undefined || worksheet == null) {
      return;
    }
    for (let i = 0; i < worksheet.tasks.length; i++) {
      this.startTask(worksheet.tasks[i]);
    }
  }

  stopWorksheet(worksheet: Worksheet) {
    if (worksheet == undefined || worksheet == null) {
      return;
    }
    for (let i = 0; i < worksheet.tasks.length; i++) {
      this.stopTask(worksheet.tasks[i]);
    }
  }

  stopInputTasks() {
    for (let task of this.selectedWorksheet.tasks) {
      if (task.layer == 'INPUT') {
        this.stopTask(task);
      }
    }
  }

  stopProcessingTasks() {
    for (let task of this.selectedWorksheet.tasks) {
      if (task.layer == 'PROCESSING') {
        this.stopTask(task);
      }
    }
  }

  stopOutputTasks() {
    for (let task of this.selectedWorksheet.tasks) {
      if (task.layer == 'OUTPUT') {
        this.stopTask(task);
      }
    }
  }

  startInputTasks() {
    for (let task of this.selectedWorksheet.tasks) {
      if (task.layer == 'INPUT') {
        this.startTask(task);
      }
    }
  }

  startProcessingTasks() {
    for (let task of this.selectedWorksheet.tasks) {
      if (task.layer == 'PROCESSING') {
        this.startTask(task);
      }
    }
  }

  startOutputTasks() {
    for (let task of this.selectedWorksheet.tasks) {
      if (task.layer == 'OUTPUT') {
        this.startTask(task);
      }
    }
  }

  clearAllSelections() {
    this.selectedWorksheet = null;
    this.selectedWorkflow = null;
    this.tasks = [];
    this.nodes = [];
  }

  purgeAllProcessedEntriesByTask(id: number) {
    if (confirm('Are you sure you want to proceed? \nThis process is irreversible!')) {
      this.openSnackBar('Please wait..', null);
      this.flowManagerDataService.purgeAllProcessedEntriesByTaskId(id).subscribe(
        res => {
          this.openSnackBar(res.message, null);
        },
        err => {
          this.addToErrorLogs(err.error);
          this.openSnackBar('Problem purging entries. Refer console/error logs.', null);
        }
      );
    }
  }

  purgeAllUnprocessedEntriesByTask(id: number) {
    if (confirm('Are you sure you want to proceed? \nThis process is irreversible!')) {
      this.openSnackBar('Please wait..', null);
      this.flowManagerDataService.purgeAllUnprocessedEntriesByTaskId(id).subscribe(
        res => {
          this.openSnackBar(res.message, null);
        },
        err => {
          this.addToErrorLogs(err.error);
          this.openSnackBar('Problem purging entries. Refer console/error logs.', null);
        }
      );
    }
  }

  deleteWorkflow(workflow: Workflow) {
    this.autoSelectWorkflowId = null;
    this.autoSelectWorksheetId = null;
    console.log('request to delete workflow..');
    if (confirm('Are you sure you want to delete this workflow? \nThis process is irreversible!')) {
      this.flowManagerDataService.deleteWorkflow(workflow.id).subscribe(
        res => {
          this.openSnackBar('Workflow deleted.', null);
          this.clearAllSelections();
          this.refreshWorkflows();
        },
        err => {
          this.addToErrorLogs(err.error);
          this.errorNotificationMinimized = false;
        }
      );
    }
  }

  refreshWorksheetInSelectedWorkflow(worksheet: Worksheet) {
    for (let j = 0; j < this.selectedWorkflow.worksheets.length; j++) {
      if (worksheet.id == this.selectedWorkflow.worksheets[j].id) {
        this.selectedWorkflow.worksheets[j].refreshing = true;
        this.flowManagerDataService.getWorksheet(worksheet.id).subscribe(
          res => {
            this.selectedWorkflow.worksheets[j].refreshing = false;
            this.selectedWorkflow.worksheets[j] = res;
            this.onWorksheetSelected(this.selectedWorkflow, this.selectedWorkflow.worksheets[j]);
          },
          err => {
            this.selectedWorkflow.worksheets[j].refreshing = false;
          }
        );
      }
    }
  }

  deleteWorksheet(worksheet: Worksheet) {
    this.autoSelectWorkflowId = this.selectedWorkflow.id;
    this.autoSelectWorksheetId = null;
    console.log('request to delete worksheet..');
    if (confirm('Are you sure you want to delete this worksheet? \nThis process is irreversible!')) {
      this.flowManagerDataService.deleteWorksheet(worksheet.id).subscribe(
        res => {
          this.openSnackBar('Worksheet deleted.', null);
          this.clearAllSelections();
          this.refreshWorkflows();
        },
        err => {
          this.addToErrorLogs(err.error);
          this.errorNotificationMinimized = false;
        }
      );
    }
  }

  // WROKFLOW DETAILS MODAL

  createWorkflow() {
    const dialogRef = this.dialog.open(WorkflowDetailsModalComponent, {
      width: '600px',
      data: { workflow: null },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.clearAllSelections();
        this.autoSelectWorkflowId = null;
        this.autoSelectWorksheetId = null;
        this.refreshWorkflows();
      }
    });
  }

  // change 

  openWorkflowDetails(workflow, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(WorkflowDetailsModalComponent, {
      width: '600px',
      data: { workflow: workflow }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //reload workflows
        this.clearAllSelections();
        this.autoSelectWorkflowId = null;
        this.autoSelectWorksheetId = null;
        this.refreshWorkflows();
      }
    });
  }

  // WORKSHEET DETAILS MODAL

  createWorksheet(workflow: Workflow) {
    const dialogRef = this.dialog.open(WorksheetDetailsModalComponent, {
      width: '600px',
      data: { workflow: workflow, worksheet: null },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.clearAllSelections();
        this.autoSelectWorkflowId = workflow.id;
        this.autoSelectWorksheetId = result.id;
        this.refreshWorkflows();
      }
    });
  }

  openWorksheetDetails(workflow, worksheet, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(WorksheetDetailsModalComponent, {
      width: '600px',
      data: { workflow: workflow, worksheet: worksheet },

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.clearAllSelections();
        this.autoSelectWorkflowId = workflow.id;
        this.autoSelectWorksheetId = result.id;
        this.refreshWorkflows();
      }
    });
  }

  // FILE UPLOAD ======================================================================================

  @ViewChild('file') file;
  fileArray: Array<File> = [];
  currentFileUpload: File;
  uploading: boolean = false;
  progress: number = 0;
  loading: boolean = false;
  fileUploadComplete: boolean = false;
  fileUploadRef = {};
  fileUploadErrorMessage: string = '';

  selectFile(event) {
    this.fileUploadRef = {};
    //console.log(event.target.files[0].name);
    if (event.target.files[0].name.toLowerCase().endsWith('.json')) {
      this.fileArray = Array.from(event.target.files);
    } else {
      let errorMessage = 'Only .json format files are accepted.';
      this.openSnackBar(errorMessage, '');
    }
  }


  uploadWorksheet(workflow: Workflow) {
    this.currentFileUpload = this.fileArray[0];
    // this.selectedFiles.item(0);
    this.flowManagerDataService.exportWorksheet(this.currentFileUpload, workflow.id).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            // console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            // console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            this.progress = 0;
            this.fileUploadRef = event.body;
            this.fileArray = [];
            this.fileUploadComplete = true;
            this.uploading = false;
            this.refreshWorkflows();
        }
      },
      error => {
        this.fileUploadErrorMessage = error.error;
        this.fileUploadRef = '';
        this.fileUploadComplete = false;
        this.uploading = false;
      });
  }

  //export worksheets as json
  exportWorkSheet() {
    this.flowManagerDataService.downloadWorksheet(this.selectedWorksheet.id).subscribe(
      (response: any) => {
        var sJson = JSON.stringify(response);
        var blob = new Blob([sJson], { type: 'text/json' });
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = `${this.selectedWorksheet.id}.json`;
        anchor.href = url;
        anchor.click();
      },
      (err) => {
        //TO CONVER ARRAY BUFFER FORMAT INTO STRING FORMAT
        var enc = new TextDecoder()
        console.log(enc.decode(err.error))
        this.openSnackBar(enc.decode(err.error), '');
      }
    )
  }

  deleteTask(worksheet: Worksheet, task: Task) {
    if (confirm('Are you sure you want to delete this task? \nThis process is irreversible!')) {
      this.flowManagerDataService.deleteTask(task.id).subscribe(
        res => {
          this.openSnackBar('Task deleted.', null);
          this.refreshWorksheetInSelectedWorkflow(worksheet);
        },
        err => {
          console.error(err.error);
        }
      );
    }
  }

  // TASKS DETAILS MODAL

  openTaskDetails(worksheet: Worksheet, task: Task) {
    const dialogRef = this.dialog.open(TaskDetailsModalComponent, {
      width: '700px',
      hasBackdrop: false,
      panelClass: 'no-pad-dialog',
      data: { worksheet: worksheet, task: task },
      disableClose: true
    });
    this.dialogarr = [];
    this.dialogarr.push(dialogRef);
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //reload worksheet
        this.refreshWorksheetInSelectedWorkflow(worksheet);
      }
    });
  }


  cloneTaskDetails(worksheet: Worksheet, task: Task) {
    this.flowManagerDataService.cloneTask(task).subscribe(
      res => {
        this.openSnackBar('Task has cloned successfully!', null);
        this.refreshWorksheetInSelectedWorkflow(worksheet);
      },
      err => {
        console.error(err.error);
      }
    );
  }

  createTask(worksheet: Worksheet) {
    //open task type modal
    const dialogRef1 = this.dialog.open(TaskTypesModalComponent, {
      width: '1100px',
      data: null,
      disableClose: true
    });
    dialogRef1.afterClosed().subscribe(result => {
      if (result != null) {
        let selectedTaskType: TaskType = result;
        // console.log('selected type:');
        // console.log(selectedTaskType);
        if(worksheet == null) {
          return;
        }

        this.createTaskByTaskType(worksheet, selectedTaskType);
        // worksheet.tasks = this.tasks;
        // const dialogRef2 = this.dialog.open(TaskDetailsModalComponent, {
        //   width: '700px',
        //   data: { worksheet: worksheet, task: null, inputType: selectedTaskType },
        //   disableClose: true
        // });
        // dialogRef2.afterClosed().subscribe(result => {
        //   if (result != null) {
        //     //reload worksheet
        //     this.refreshWorksheetInSelectedWorkflow(worksheet);
        //   }
        // });
      }
    });
  }

  createTaskByTaskType(worksheet: Worksheet, taskType: TaskType) {
    worksheet.tasks = this.tasks;
    const dialogRef2 = this.dialog.open(TaskDetailsModalComponent, {
      width: '700px',
      data: { worksheet: worksheet, task: null, inputType: taskType },
      disableClose: true
    });
    dialogRef2.afterClosed().subscribe(result => {
      if (result != null) {
        //reload worksheet
        this.refreshWorksheetInSelectedWorkflow(worksheet);
      }
    });
  }

  //ENTRY DETAILS MODAL
  openEntry(entryIdToOpen: number, event?) {
    if(event) {
      event.stopPropagation();
    }
    if(!entryIdToOpen) {
      return;
    }
    const dialogRef = this.dialog.open(EntryDetailsModalComponent, {
      width: '1200px',
      hasBackdrop: false,
      // panelClass: 'no-pad-dialog',
      data: { entryId: entryIdToOpen }
    });
    this.dialogarr = [];
    this.dialogarr.push(dialogRef);
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // console.log(result);
      }
    });
  }

  bulkResolveErrorsByTask(taskId: number, reason: string) {
    this.openSnackBar("Resolving.. Please wait..", null);
    this.flowManagerDataService.forceEntryErrorResolvedByTask(taskId, reason).subscribe(
      res => {
        this.openSnackBar(res.message, null);
      },
      err => {
        console.error(err.error);
        this.openSnackBar("Some problem occurred while resolving.. Press F12 for more details.", null);
      }
    );
  }

  bulkResendErrorsByTask(taskId: number, reason: string) {
    this.openSnackBar("Resending.. Please wait..", null);
    this.flowManagerDataService.forceEntryErrorResendByTask(taskId, reason).subscribe(
      res => {
        this.openSnackBar(res.message, null);
      },
      err => {
        console.error(err.error);
        this.openSnackBar("Some problem occurred while resending.. Press F12 for more details.", null);
      }
    );
  }


  //LOGS MODAL

  openLogs(worksheet: Worksheet) {
    const dialogRef = this.dialog.open(LogViewerComponent, {
      width: '1000px',
      data: { worksheet: worksheet }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // console.log(result);
      }
    });
  }

  //ERROR LOGS

  addToErrorLogs(error: any) {
    this.errorMessageCount++;
    let date: Date = new Date();
    if (this.errorMessage.length != 0) {
      this.errorMessage += `\n\n${this.errorMessageCount}. ${date.toLocaleTimeString('it-IT')}:\n` + JSON.stringify(error);
    } else {
      console.log(JSON.stringify(error));
      this.errorMessage = `\n${this.errorMessageCount}. ${date.toLocaleTimeString('it-IT')}:\n` + JSON.stringify(error);
    }
    this.scrollErrorLogsToBottom();
  }

  @ViewChildren("messageContainer") messageContainers: QueryList<ElementRef>;
  @ViewChild('scrollableErrorLogs') private scrollableErrorLogs: ElementRef;

  scrollErrorLogsToBottom(): void {
    try {
      this.scrollableErrorLogs.nativeElement.scrollTop = this.scrollableErrorLogs.nativeElement.scrollHeight;
    } catch (err) { }
  }
  //OPEN DIALOGE
  // openSCFBatchStatusDialog() {
  //   const dialogRef = this.dialog.open(BatchUploadsModalComponent, {
  //     data: { typeTag: "DFM" }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }
  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  showNotification(type: "default" | "info" | "warning" | "success" | "error", message: string) {
    this.notifierService.notify(type, message);
  }

  openWizard() {
    const dialogRef = this.dialog.open(ImportExportWizardComponent, {
      panelClass: 'no-pad-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshWorkflows();
      // console.log(`Dialog result: ${result}`);
    });
  }

  openSystemConfigs() {
    const dialogRef = this.dialog.open(SystemsListComponent, {
      panelClass: 'no-pad-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshSystems();
    });
  }

  refreshQMSStatus() {
    if(!this.selectedWorksheet) {
      return;
    }
    let worksheetId: number = this.selectedWorksheet.id;
    let taskIds: number[] = [];
    for(let task of this.selectedWorksheet.tasks) {
      taskIds.push(task.id);
    }
    this.selectedWorksheet.loadingStatus = true;
    this.flowManagerDataService.getQMSStatus(taskIds).subscribe(
      res => {
        if(this.selectedWorksheet.id === worksheetId) {
          this.selectedWorksheet.status = res;
          this.selectedWorksheet.status.totalHits = this.selectedWorksheet.status.store.cacheHits + this.selectedWorksheet.status.store.databaseHits;
          this.selectedWorksheet.status.cacheHitRatio = (this.selectedWorksheet.status.store.cacheHits/this.selectedWorksheet.status.totalHits) * 100;
          this.selectedWorksheet.status.databaseHitRatio = (this.selectedWorksheet.status.store.databaseHits/this.selectedWorksheet.status.totalHits) * 100;
        }
        this.selectedWorksheet.loadingStatus = false;
      },
      err => {
        console.error(err.error);
        this.selectedWorksheet.loadingStatus = false;
      }
    );
  }

}
