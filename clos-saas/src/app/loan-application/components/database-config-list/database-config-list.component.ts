import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { ConfigService } from '../services/config.service';
import { RulesImportExportComponent } from '../../common/rules-import-export/rules-import-export.component'
import { PageData } from '../../common/share-data-table/share-data-table.component';
import { ClosCaseManagerService } from 'src/app/loan-case-manager/service/clos-case-manager.service';

@Component({
  selector: 'app-database-config-list',
  templateUrl: './database-config-list.component.html',
  styleUrls: ['./database-config-list.component.scss']
})
export class DatabaseConfigListComponent implements OnInit {
  searchTerm: string = '';
  loading: boolean = false;
  rulesList: any;
  configId: number = null;
  activeStatus: boolean;
  filteredRulesList: any[];
  page: number = 1;
  pageData: PageData;
  noItemsFound: boolean = false; 

  constructor(
    public dialog: MatDialog,
    private notifierService: NotifierService,
    private router: Router,
    public dupliateService: DuplicateCheckingService,
    public closCaseManagerService: ClosCaseManagerService,
    private configService: ConfigService
  ) {
    // INITIALIZING PAGEDATA
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
  }

  ngOnInit(): void {
     this.getRules();
    this.filteredRulesList = this.rulesList;
  }

  // Get All DB
  getRules() {
    console.log('rule')
    this.loading = true;
    this.closCaseManagerService.getAllRules(this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        this.loading = false;
        this.rulesList = res['data'];
        this.pageData.totalRecords = res['count'];
        this.filteredRulesList = this.rulesList;
        for (let i = 0; i < this.rulesList.length; i++) {
          const rulesName = this.rulesList[i]['name']
        }
        this.showNotification('success', 'Loaded successfully.')
      },
      err => {
        this.loading = false;
        this.showNotification('error', 'Oops! something went wrong.')
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  addConfiguration() {
    const dialogRef = this.dialog.open(ConfigurationsComponent, {
      // width: '96%', height: '81%', maxWidth: '100vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getRules();
    })
  }

  onDataSourceSelect(dataSource: any) {
    const dialogRef = this.dialog.open(ConfigurationsComponent, {
      // width: '96%', height: '81%', maxWidth: '100vw', 
      data: dataSource.id
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getRules();
    })
  }

  editDataSource() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/dbc-table/'
    console.log(viewUrl)
    this.router.navigate([viewUrl], { queryParams: { config_id: this.configId } })
  }

  // Active Status
  getActiveStatus(id, event) {
    this.dupliateService.ActivaRule = true;
    this.dupliateService.getActiveStatus(id).subscribe(
      res => {
        if (event.checked == true) {
          this.showNotification('success', res);
          this.getRules();
          setTimeout(() => {
            this.router.navigateByUrl('loan-application-matching/main-nav/duplicate-check-config');
          }, 1);
          // setTimeout(() => {
          //   this.router.navigateByUrl('/duplicate-checking/duplicate-checking/config')
          // }, 2);
        } else {
          this.showNotification('success', 'Updated as an Disactive Rule');
        }
        this.findDuplicates();
      },
      err => {
        this.showNotification('error', err);
      }
    )
  }

  //findDuplicates
  findDuplicates() {
    this.dupliateService.findDuplicates().subscribe(res => {
      console.log(res)
    })
  }
  // Delete rules
  deleteRules(id) {
    this.closCaseManagerService.deleteRules(id).subscribe(
      res => {
        this.showNotification('success', 'Deleted Successfully');
        this.getRules();
        this.router.navigateByUrl('loan-application-matching/main-nav/duplicate-check-config');
      },
      err => {
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
    // alert('This rule cannot be deleted.To delete this, make another rule as active.')
  }

  // filter rules
  filterRules() {
    this.filteredRulesList = this.rulesList.filter(rule =>
      rule.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.noItemsFound = this.filteredRulesList.length === 0; 
  }

  // clear filter
  clearSearchFilter() {
    this.searchTerm = '';
    this.noItemsFound = false;
    this.filterRules();
  }
  //Export Ruels
  expoerRules() {
    // this.configService.exportRuels().subscribe(res => {
    //   console.log('export success')
    // },
    // (error) => {
    //   console.log('error', error)
    // })
    const dialogRef = this.dialog.open(RulesImportExportComponent, {
      width: '70%', maxWidth: '100vw',
      data: this.rulesList
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getRules();
    })
  }

  // CHANGING PAGINATION EVENT
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('configID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getRules();
  }

  getSearchItem(searchItem:string){
    this.dupliateService.searchDuplicateRules(searchItem).subscribe(
      res =>
      {
       this.filteredRulesList = res['data']
      }
    )
  }
  clearSearchItem(){
    this.searchTerm ='';
    this.getSearchItem('');
  }
}


