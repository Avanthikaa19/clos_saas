import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { QueryVariable } from '../models/query';
import { ProjectIdService } from '../services/project-id.service';
import { QueryvariableService } from '../services/queryvariable.service';
import { fadeInOut } from 'src/app/app.animations';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { AccessControlData } from 'src/app/app.access';
@Component({
  selector: 'app-list-query-variable',
  templateUrl: './list-query-variable.component.html',
  styleUrls: ['./list-query-variable.component.scss'],
  animations: [fadeInOut]
})
export class ListQueryVariableComponent implements OnInit {

  pageData: PageData;
  inputText: string;
  queryVariables: QueryVariable[] = [];
  filterList: QueryVariable[] = [];
  loading: boolean = false;
  noAccess: boolean = false;
  inputData:boolean=false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private url: UrlService,
    private queryService: QueryvariableService,
    private selectedProject: ProjectIdService,
    private notifierService: NotifierService,
    public ac:AccessControlData
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
    this.getQueryVariableList();

  }

  createQueryVariable() {
    this.queryService.saveUpdate = false;
    this.openQueryVariable(new QueryVariable());
  }



  openQueryVariable(source: QueryVariable) {
    console.log(source)
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/query-variable-view/' + this.selectedProject.selectedProjectId
    this.router.navigateByUrl(viewUrl)
  }

  onCardClick(value: QueryVariable) {
    this.queryService.saveUpdate = true;
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/query-variable-view/' + value.id
    this.router.navigateByUrl(viewUrl)
  }

  getQueryVariableList() {
    this.loading = true;
    this.inputData= false;
    this.queryService.getQueryList(this.selectedProject.selectedProjectId, this.pageData.currentPage, this.pageData.pageSize).subscribe(
      (res) => {
        this.loading = false;
        this.queryVariables = res['output'];
        this.pageData.totalRecords = res['total_items'];
        this.filterList = res['output'].reverse();

        if (this.queryVariables.length == 0) {
          this.showNotification('default', "No Data Found.");
        } else {
          this.showNotification('default', "Query Variables Loaded Successfully.");
        }
      },
      (err) => {
        this.loading = false;
        if(err.status == 401){
          this.noAccess = true;
        }
        this.showNotification('error', 'Oops! Something went wrong.');
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  onDeleteClick(id: number) {
    let confirmation = confirm("Are you Sure to delete Query Variable?",);
    if (confirmation == true) {
      this.queryService.deleteQuery(id).subscribe((res) => {
        console.log(res)
        this.getQueryVariableList()
      })
    }
  }
  // searchQuery() {
  //   this.loading = true;
  //   if (this.inputText != "") {
  //     this.loading = false;
  //     this.queryVariables = []
  //     this.queryVariables = this.filterList.filter(res => {
  //       return res.name.toLocaleLowerCase().match(this.inputText.toLocaleLowerCase().trim())
  //     })
  //   }
  //   else if ((this.inputText == "")) {
  //     this.loading = false;
  //     this.queryVariables = this.filterList
  //   }
  // }

  searchQuery(){
    this.loading = true;
    if (this.inputText != "") {
      this.queryService.getSearchQuery(this.inputText).subscribe((res) => {
        this.loading = false;
        this.inputData= true;
        const searchArray = Object.assign([], res['data']);
        this.queryVariables = searchArray
        this.pageData.totalRecords = res['total_items'];
        this.filterList = searchArray.reverse()
        if (this.queryVariables.length == 0) {
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
            this.getQueryVariableList()
          }, 4000);
        }
  }

  sortAsc() {
    this.queryVariables.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }
  sortDesc() {
    this.queryVariables.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }).reverse()
  }
  clearSearchField() {
    this.inputText = '';
    this.inputData= false;
    this.getQueryVariableList()
  }

  // CHANGING PAGINATION EVENT
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('queryID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getQueryVariableList();
  }

}
