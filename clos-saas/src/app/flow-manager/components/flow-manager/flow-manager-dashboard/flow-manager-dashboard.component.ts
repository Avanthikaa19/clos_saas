import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';
import { fadeInOut } from 'src/app/app.animations';
// import { UrlService } from 'src/app/services/http/url.service';
import { WorkflowNode, WorksheetNode } from '../models/models-v2';
import { FlowManagerDashboardDataService } from '../services/flow-manager-dashboard-data.service';

@Component({
  selector: 'app-flow-manager-dashboard',
  templateUrl: './flow-manager-dashboard.component.html',
  styleUrls: ['./flow-manager-dashboard.component.scss'],
  animations: [ fadeInOut ]
})
export class FlowManagerDashboardComponent implements OnInit {
  reloadTrafficLightSubject: Subject<number[]> = new Subject<number[]>();
  reloadTrafficLightWorkflows: Subject<WorkflowNode[]> = new Subject<WorkflowNode[]>();

  loadingWorkflows: boolean;
  workflows: WorkflowNode[];

  showWorksheetSelection: boolean = false;

  selectedCount: number = 0;
  selectedWorksheets: WorksheetNode[];

  //refresh times
  systemsDashboardRefreshTime: Date;

  constructor(
    private dashboardDataService: FlowManagerDashboardDataService,
    // private url: UrlService,
    private notifierService: NotifierService,
    private router: Router
  ) { 
    this.loadingWorkflows = false;
    this.workflows = [];
    this.showWorksheetSelection = false;
    this.selectedCount = 0;
    this.selectedWorksheets = [];
    this.systemsDashboardRefreshTime = null;
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
    this.refreshWorkflows();
    this.changedWorksheetsFilter();
  }

  refreshWorkflows() {
    this.loadingWorkflows = true;
    this.dashboardDataService.getWorkflowsSummary().subscribe(
      res => {
        this.workflows = res;
        //set selection to false by default
        for(let workflow of this.workflows) {
          workflow.selected = false;
          for(let worksheet of workflow.worksheets) {
            worksheet.selected = false;
          }
        }
        this.reloadTrafficLightWorkflows.next(this.workflows);
        this.loadingWorkflows = false;
      },
      err => {
        this.loadingWorkflows = false;
        this.showNotification("error", "Failed to load workflows list. Refer console for mode details.");
        console.error(err);
      }
    );
  }

  getNewFilter(workflows: WorkflowNode[]) {
    this.selectedCount = 0;
    this.selectedWorksheets = [];
    this.workflows = workflows;
    for(let workflow of this.workflows) {
      if(workflow.selected) {
        for(let worksheet of workflow.worksheets) {
          worksheet.selected = true;
        }
      }
      for(let worksheet of workflow.worksheets) {
        if(worksheet.selected) {
          this.selectedCount++;
          this.selectedWorksheets.push(worksheet);
        }
      }
    }
    this.changedWorksheetsFilter();
  }

  changedWorksheetsFilter(notify?: boolean) {
    let worksheetIds: number[] = [];
    for (let worksheet of this.selectedWorksheets) {
      if(worksheet.selected) {
        worksheetIds.push(worksheet.id);
      }
    }
    this.reloadTrafficLightSubject.next(worksheetIds);
    if(notify) {
      this.showNotification("default", "Dashboard data is refreshing..");
    }
  }

  // Systems Dashboard
  systemsDashboardRefreshed(event) {
    this.systemsDashboardRefreshTime = new Date(event[0], (event[1]-1), event[2], event[3], event[4], event[5]);
  }

  goToFlows() {
    this.router.navigateByUrl('/flow-manager/flows');
  }

  showNotification(type: "default" | "info" | "warning" | "success" | "error", message: string) {
    this.notifierService.notify(type, message);
  }

}
