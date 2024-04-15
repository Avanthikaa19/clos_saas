import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { ProjectIdService } from '../../query-variable/services/project-id.service';
import { Rules } from '../../rule-set/models/rulesetmodels';
import { RuleEngineService } from '../../rule-set/services/rule-engine.service';
import { fadeInOut } from 'src/app/app.animations';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { AccessControlData } from 'src/app/app.access';

@Component({
  selector: 'app-list-rules',
  templateUrl: './list-rules.component.html',
  styleUrls: ['./list-rules.component.scss'],
  animations: [fadeInOut]

})
export class ListRulesComponent implements OnInit {

  pageData: PageData;
  inputText: string;
  ruleList: Rules[] = [];
  filterList: Rules[] = [];
  ruleId: number = 0;
  loading: boolean = false;
  noAccess:boolean = false;
  inputData:boolean=false;

  constructor(
    private ruleEngineService: RuleEngineService,
    private url: UrlService,
    private selectedProject: ProjectIdService,
    private notifierService: NotifierService,
    private router: Router,
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
    this.getRulesList();
  }

  // GETTING RULES LIST RESPONSE
  getRulesList() {
    this.loading = true;
    this.inputData= false;
    this.ruleEngineService.getRulesPidList(this.selectedProject.selectedProjectId, this.pageData.currentPage, this.pageData.pageSize).subscribe(
      (res) => {
        this.loading = false;
        this.ruleList = res['output'];
        this.pageData.totalRecords = res['total_items'];

        this.filterList = res['output'].reverse();
        if (this.ruleList.length == 0) {
          this.showNotification('default', "No Data Found.");
        } else {
          this.showNotification('default', "Rules Loaded Successfully.");
        }
      },
      (err) => {
        this.loading = false;
        this.showNotification('error','Oops! something went wrong.');
        if(err.status == 401){
          this.noAccess = true;
        }
      }
    )
  }

  editRule(ruleId: number) {
    console.log('RULE ID', ruleId)
    this.ruleEngineService.saveUpdate = true;
    this.ruleId = ruleId;
    // this.createRuleNav();
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/rules-change/' + this.ruleId;
    this.router.navigateByUrl(viewUrl);
  }

  createRuleNav() {
    this.ruleEngineService.saveUpdate = false;
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/rules-change/' + this.ruleId;
    this.router.navigateByUrl(viewUrl);
  }
  deleteRuleList(rid: number) {
    let confirmation = confirm("Are you Sure to delete Rules");
    if (confirmation == true) {
      this.ruleEngineService.deleteRule(rid).subscribe(
        (res) => {
          console.log(res);
          this.showNotification('default', 'Rules deleted successfully.');
          this.getRulesList()

        },
        (err) => {
          console.log(err);
        }
      )
    }
  }


  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  searchRule(){
    this.loading = true;
    if (this.inputText != "") {
      this.ruleEngineService.getSearchRules(this.inputText).subscribe((res) => {
        this.loading = false;
        this.inputData= true;
        const searchArray = Object.assign([], res['data']);
        this.ruleList = searchArray
        this.pageData.totalRecords = res['total_items'];
        this.filterList = searchArray.reverse()
        if (this.ruleList.length == 0) {
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
            this.getRulesList()
          }, 4000);
        }
  }
  sortAsc() {
    this.ruleList.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    })
  }
  sortDesc() {
    this.ruleList.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }).reverse()
  }
  clearSearchField() {
    this.inputText = '';
    this.inputData= false;
    this.getRulesList()
  }

  // CHANGING PAGINATION EVENT
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('rulesID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getRulesList();
  }

}
