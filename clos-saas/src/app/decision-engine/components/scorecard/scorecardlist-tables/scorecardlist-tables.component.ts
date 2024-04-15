import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { fadeInOut } from 'src/app/app.animations';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { CreateScorecardComponent } from '../create-scorecard/create-scorecard.component';
import { Scorecard } from '../models/scorecard-models';
import { ScorecardService } from '../services/scorecard.service';

@Component({
  selector: 'app-scorecardlist-tables',
  templateUrl: './scorecardlist-tables.component.html',
  styleUrls: ['./scorecardlist-tables.component.scss'],
  animations: [fadeInOut]
})
export class ScorecardlistTablesComponent implements OnInit {

  pageData: PageData;
  loading: boolean = false;
  inputText: string;
  tableList: Scorecard[] = [];
  filterList: Scorecard[] = [];
  varId: number = 0;
  noAccess: boolean = false;
  inputData:boolean=false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private decisionFlowService: ScorecardService,
    private notifierService: NotifierService,
    public ac: AccessControlData
  ) {
    // INITIALIZING PAGEDATA
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
  }

  ngOnInit() {
    this.getTableList();
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  //Create Score Card Table
  createScoreCardTable() {
    this.decisionFlowService.saveUpdate = false;
    const dialogRef = this.dialog.open(CreateScorecardComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.getTableList();
    });
  }

  //Get List of Tables
  getTableList() {
    this.loading = true;
    this.inputData= false;
    this.decisionFlowService.getListOfTable(this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        this.loading = false;
        this.tableList = res['output'];
        this.pageData.totalRecords = res['total_items'];
        this.filterList = res['output'].reverse();
        if (this.tableList.length == 0) {
          this.showNotification('default', "No Data Found.");
        } else {
          this.showNotification('default', "Score Cards Loaded Successfully.");
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

  //Search Table
  searchTable() {
    this.loading = true;
    if (this.inputText != "") {
      this.decisionFlowService.getSearchScoreCard(this.inputText).subscribe((res) => {
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

  //Display Score Card View
  onClickCard(data: Scorecard) {
    this.decisionFlowService.saveUpdate = true;
    this.varId = data.id;
    this.createNav();
  }

  createNav() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/scoreCardView/' + this.varId;
    this.router.navigateByUrl(viewUrl);
  }

  //Delete Score Card
  deleteScoreCard(data: Scorecard) {
    this.decisionFlowService.deleteScoreCard(data.id).subscribe(
      res => {
        this.showNotification('success', "Tables Deleted Successfully.");
        this.getTableList();
      },
      err => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
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
  clearSearchField() {
    this.inputText = '';
    this.inputData= false;
    this.getTableList()
  }

  // CHANGING PAGINATION EVENT
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('scoreID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getTableList();
  }

}
