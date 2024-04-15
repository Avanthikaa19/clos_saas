import { object } from '@amcharts/amcharts5';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DuplicateCheckingService } from '../../services/duplicate-checking.service';

@Component({
  selector: 'app-duplicate-view',
  templateUrl: './duplicate-view.component.html',
  styleUrls: ['./duplicate-view.component.scss']
})
export class DuplicateViewComponent implements OnInit {
  tableheaders = ['column 1', 'column 2', 'column 3', 'column 4', 'column 5', 'column 6', 'column 7', 'column 8', 'column 9', 'column 1', 'column 2', 'column 3', 'column 4',]
  tablebody = ['Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1', 'Row 1']

  getAppid;
  getlocalname;
  appId: any;
  appDetails: any;
  databaseDetail: any;
  activeRule: any;
  databaseKey: any;
  matchedColumn: any;
  appFielslist: any[] = [];
  configurations: any[] = [];
  appdetailList: any[] = [];
  displaydbList: any[] = [];
  appFieldsData: any[] = [];
  tableFieldsData: any[] = [];
  got1: any[] = [];
  gotTab: any[] = [];
  tableFieldsData1: any[] = [];
  dbDetails: any;
  collectdb: [] = [];
  multiDB: any[] = [];
  dbItems: any[] = [];
  applicationKey: any;
  matchFound:boolean=false;

  constructor(
    private route: ActivatedRoute,
    private duplicateService: DuplicateCheckingService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.forEach(e => {
      this.appId = e['id'];
    });
    this.getAppDetails(this.appId);
    this.getDatabaseDetails(this.appId);
    this.getactiveRule();
  }

  //get application details 
  getAppDetails(id: any) {
    this.duplicateService.getAppDetails(id).subscribe(res => {
      this.appDetails = res;
    })
  }

  // get database details
  getDatabaseDetails(id: any) {
    this.duplicateService.getMultiDbdetails(id,'').subscribe(res => {
      this.databaseDetail = res;
      this.databaseKey = Object.keys(this.databaseDetail)
      this.dbDetails = this.databaseDetail
      for (let duplicate in this.dbDetails) {
        this.multiDB.push(this.dbDetails[duplicate].duplicates)
      }
    })
  }

  //get active rule
  getactiveRule() {
    this.duplicateService.getactiveRule().subscribe(res => {
      this.activeRule = res;
      for (let config of this.activeRule?.configurations) {
        this.configurations.push(config)
      }
      for (let field in this.configurations) {
        this.appFielslist.push(this.configurations[field]?.fieldsDetails)
      }
      for (let newadd in this.appFielslist) {
        this.displaydbList.push(this.appFielslist[newadd])
      }
      for (let nextone in this.displaydbList) {
        this.tableFieldsData.push(this.displaydbList[nextone]);
      }
    })
  }

}