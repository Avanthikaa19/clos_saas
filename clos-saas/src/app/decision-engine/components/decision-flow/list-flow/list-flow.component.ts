import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UrlService } from '../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { CreateDecisionFlowComponent } from '../modals/create-decision-flow/create-decision-flow.component';
import { DecisionFlow } from '../../../models/DecisionFlow';
import { DecisionFlowService } from '../../../services/decision-flow.service';
import { fadeInOut } from 'src/app/app.animations';
import { ImportFlowComponent } from '../modals/import-flow/import-flow.component';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { AccessControlData } from 'src/app/app.access';


@Component({
  selector: 'app-list-flow',
  templateUrl: './list-flow.component.html',
  styleUrls: ['./list-flow.component.scss'],
  animations: [fadeInOut]
})
export class ListFlowComponent implements OnInit {

  pageData: PageData;
  inputText: string;
  loading: boolean = false;
  flowList: DecisionFlow[] = [];
  filterList: DecisionFlow[] = [];
  projectId: number = null as any;
  disabled: boolean = true;
  noAccess:boolean = false;
  inputData:boolean=false;
  constructor(
    public dialog: MatDialog,
    private url: UrlService,
    private decisionFlowService: DecisionFlowService,
    private selectedProject: DecisionEngineIdService,
    private notifierService: NotifierService,
    public ac:AccessControlData,
    private router: Router
  ) {
    // INITIALIZING PAGEDATA
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.getFlowList();
    console.log('Selected Project Id', this.selectedProject.selectedProjectId)
  }

  //FOR CREATING NEW DECISION FLOW
  createFlowConfigDialoge() {
    const dialogRef = this.dialog.open(CreateDecisionFlowComponent, {
      data: this.selectedProject.selectedServiceId
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getFlowList();
      // this.onClickCard(result)
      // let jsonFlowData = JSON.parse(result);  
    });
  }

  onClickCard(data: DecisionFlow) {
    this.decisionFlowService.saveUpdate = true;
    console.log(data)
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/decisionFlowView/' + data.id
    this.router.navigateByUrl(viewUrl)
  }

  deleteFlow(data: DecisionFlow) {
    let confirmation = confirm("Are you Sure to delete Decision Flow");
    this.loading = true;
    if (confirmation == true) {
      this.decisionFlowService.deleteDecisionFlow(data.id).subscribe(datares => {
        console.log(datares)
        setTimeout(() => { this.getFlowList() }, 3000)
        this.showNotification('default', "Table Deleted Successfully.");

      }, err => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      });
    } else {
      this.loading = false;
    }
  }
  getFlowList() {
    this.loading = true;
    this.inputData= false;
    this.decisionFlowService.getListOfFlow(this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        this.loading = false;
        this.flowList = res['output'];
        this.pageData.totalRecords = res['total_items'];
        this.filterList = res['output'].reverse();
        if (this.flowList.length == 0) {
          this.showNotification('default', "No Data Found.");
        } else {
          this.showNotification('default', "Flows Loaded Successfully.");
        }
      },
      err => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  searchFlow() {
    this.loading = true;
    if (this.inputText != "") {
      this.decisionFlowService.getSearchDecisionFlow(this.inputText).subscribe((res) => {
        this.loading = false;
        this.inputData= true;
        const searchArray = Object.assign([], res['data']);
        this.flowList = searchArray
        this.pageData.totalRecords = res['total_items'];
        this.filterList = searchArray.reverse()
        if (this.flowList.length == 0) {
          this.showNotification('default', "No Data Found.");
        } else {
          this.showNotification('default', "Query Variables Loaded Successfully.");
        }
      })
    }
    else if ((this.inputText == "")) {
          this.loading = false;
          this.inputText = '';
          setTimeout(() => {
            this.getFlowList()
          }, 4000);
        }

  }

  sortAsc() {
    this.flowList.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    })
  }
  sortDesc() {
    this.flowList.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }).reverse()
  }
  clearSearchField() {
    this.inputText = '';
    this.inputData= false;
    this.getFlowList()
  }
  //Import Flow 
  ImportFlow() {
    const dialogRef = this.dialog.open(ImportFlowComponent, {
      data: this.selectedProject.selectedServiceId
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getFlowList();
    });
  }

  // CHANGING PAGINATION EVENT
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('decisionID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getFlowList();
  }

}
