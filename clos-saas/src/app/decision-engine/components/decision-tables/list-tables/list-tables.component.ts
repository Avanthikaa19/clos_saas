import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DecisionTablesList } from '../../../models/DecisionTables';
import { DecisionTablesService } from '../../../services/decision-tables.service';
import { UrlService } from '../../../services/http/url.service';
// import { CreateDecisionTableComponent } from '../../decision-table/modals/create-decision-table/create-decision-table.component';
import { CreateDecisionTablesComponent } from '../modals/create-decision-tables/create-decision-tables.component';
import { fadeInOut } from 'src/app/app.animations';
import { AccessControlData } from 'src/app/app.access';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
// import { CreateDecisionTableComponent } from '../modals/create-decision-table/create-decision-table.component';

@Component({
  selector: 'app-list-tables',
  templateUrl: './list-tables.component.html',
  styleUrls: ['./list-tables.component.scss'],
  animations: [fadeInOut]
})
export class ListTablesComponent implements OnInit {

  pageData: PageData;
  inputText: string;
  loading: boolean = false;
  tableList: DecisionTablesList[] = [];
  filterList: DecisionTablesList[] = [];

  projectId: number = null as any;
  noAccess: boolean = false;
  inputData:boolean=false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private url: UrlService,
    private decisionTableService: DecisionTablesService,
    private notifierService: NotifierService,
    public ac: AccessControlData
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
    this.getTableList();
  }

  createDecisionTable() {
    const dialogRef = this.dialog.open(CreateDecisionTablesComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getTableList();
      // this.tableList = [];
    });
  }

  onClickCard(data: DecisionTablesList) {
    this.decisionTableService.saveUpdate = true;
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/decisionTableView/' + data.id
    this.router.navigateByUrl(viewUrl)
  }

  getTableList() {
    this.loading = true;
    this.inputData= false;
    this.decisionTableService.getListOfTable(this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        this.loading = false;
        this.tableList = res['output'];
        this.filterList = res['output'].reverse();
        this.pageData.totalRecords = res['total_items'];
        if (this.tableList.length == 0) {
          this.showNotification('default', "No Data Found.");
        } else {
          this.showNotification('default', "Tables Loaded Successfully.");
        }
      },
      err => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
        if (err.status === 401) {
          this.noAccess = true;
        }
      }
    )
  }
  deleteTable(data: DecisionTablesList) {
    let confirmation = confirm("Are you Sure to delete Decision Table");
    this.loading = true;
    if (confirmation == true) {
      this.decisionTableService.deleteDecisionTableById(data.id).subscribe(
        res => {
          this.showNotification('default', "Table Deleted Successfully.");
          this.getTableList()
        },
        err => {
          this.showNotification('error', 'Oops! Something Went Wrong.');
        });
    } else {
      this.loading = false;
    }

  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  searchTable(){
    this.loading = true;
    if (this.inputText != "") {
      this.decisionTableService.getSearchDecisionStandard(this.inputText).subscribe((res) => {
        this.loading = false;
        this.inputData= true;
        const searchArray = Object.assign([], res['data']);
        this.tableList = searchArray
        this.pageData.totalRecords = res['total_items'];
        this.filterList = searchArray.reverse()
        if (this.tableList.length == 0) {
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
            this.getTableList()
          }, 4000);
          
        }
  }

  clearSearchField() {
    this.inputText = '';
    this.inputData= false;
    this.getTableList()
  }

  sortAsc() {
    this.tableList.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    })
  }
  sortDesc() {
    this.tableList.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }).reverse()
  }


  // CHANGING PAGINATION EVENT
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('tableID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getTableList();
  }
}
