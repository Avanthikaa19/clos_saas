import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { CreateRuleSetComponent } from '../modals/create-rule-set/create-rule-set.component';
import { RuleSet } from '../models/rulesetmodels';
import { ProjectService } from '../services/projectservice';
import { RuleEngineService } from '../services/rule-engine.service';
import { fadeInOut } from 'src/app/app.animations';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { AccessControlData } from 'src/app/app.access';

@Component({
  selector: 'app-list-rule-set',
  templateUrl: './list-rule-set.component.html',
  styleUrls: ['./list-rule-set.component.scss'],
  animations: [fadeInOut]

})
export class ListRuleSetComponent implements OnInit {

  pageData: PageData;
  inputText: string;
  listRules: RuleSet[] = [];
  filterList: RuleSet[] = [];
  loading: boolean = false;
  noAccess:boolean = false;
  inputData:boolean=false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private url: UrlService,
    private ruleEngineService: RuleEngineService,
    private selectedProject: ProjectService,
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
    this.getRuleSetList();

  }

  createRuleSet() {
    this.ruleEngineService.saveUpdate = false;
    this.openRuleSet(new RuleSet());
  }

  openRuleSet(source: RuleSet) {
    const dialogRef = this.dialog.open(CreateRuleSetComponent, {
      width: '70rem',
      height: '80rem',
      data: { list: source },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getRuleSetList();
    });
  }

  onCardClick(rules: RuleSet) {
    this.ruleEngineService.saveUpdate = true;
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/rule-set-view/' + rules.id
    this.router.navigateByUrl(viewUrl)
  }

  deleteRuleSet(rid: number) {
    let confirmation = confirm("Are you Sure to delete Ruleset");
    this.loading = true;
    if (confirmation == true) {
      this.ruleEngineService.deleteRuleset(rid).subscribe(
        (res) => {
          console.log(res);
          setTimeout(() => {
            this.getRuleSetList()
          }, 3000)
          this.showNotification('default', 'Ruleset deleted successfully.');
        },
        (err) => {
          console.log(err);
        });
    } else {
      this.loading = false;
    }
  }


  getRuleSetList() {
    this.loading = true;
    this.inputData= false;
    this.ruleEngineService.getRuleSetList(this.selectedProject.selectedProjectId, this.pageData.currentPage, this.pageData.pageSize).subscribe(
      (res) => {
        this.loading = false;
        this.listRules = res['output'];
        this.pageData.totalRecords = res['total_items'];
        this.filterList = res['output'].reverse();
        if (this.listRules.length == 0) {
          this.showNotification('default', "No Data Found.");
        } else {
          this.showNotification('default', "RuleSets Loaded Successfully.");
        }
      },
      (err) => {
        this.loading = false;
        this.showNotification('error','Oops! Something went wrong.');
        if(err.status == 401){
          this.noAccess = true;
        }
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  searchRuleset(){
    this.loading = true;
    if (this.inputText != "") {
      this.ruleEngineService.getSearchRulesSet(this.inputText).subscribe((res) => {
        this.loading = false;
        this.inputData= true;
        const searchArray = Object.assign([], res['data']);
        this.listRules = searchArray
        this.pageData.totalRecords = res['total_items'];
        this.filterList = searchArray.reverse()
        if (this.listRules.length == 0) {
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
            this.getRuleSetList()
          }, 4000);
        }
  }

  sortAsc() {
    this.listRules.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    })
  }
  sortDesc() {
    this.listRules.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }).reverse()
  }
  clearSearchField() {
    this.inputText = '';
    this.inputData= false;
    this.getRuleSetList()
  }

  // CHANGING PAGINATION EVENT
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('ruleSetID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getRuleSetList();
  }

}
