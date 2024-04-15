import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../components/services/config.service';
import { DuplicateCheckingService } from '../../../duplicate-checking/services/duplicate-checking.service';


@Component({
  selector: 'app-duplicate-view',
  templateUrl: './duplicate-view.component.html',
  styleUrls: ['./duplicate-view.component.scss']
})
export class DuplicateViewComponent implements OnInit {

  id: number;
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
  matchFound: boolean = false;


  constructor(
    public service: ConfigService,
    private route: ActivatedRoute,
    private duplicateService: DuplicateCheckingService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.forEach(e => {
      this.id = e['fsId'];
    });
    // this.findDuplicates();
    this.getactiveRule();
    this.getAppDetails(this.id)
    this.getDatabaseDetails(this.id)
  }
  //findDuplicates
  findDuplicates() {
    this.duplicateService.findDuplicates().subscribe(res => {
      console.log(res)
    })
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
      console.log('222', this.databaseDetail)
      this.databaseKey = Object.keys(this.databaseDetail)
      this.dbDetails = this.databaseDetail
      for (let duplicate in this.dbDetails) {
        this.multiDB.push(this.dbDetails[duplicate].recordDetails)
        if(this.dbDetails[duplicate].matchedCategory == 'NOT_MATCHED'){
          this.dbDetails[duplicate].matchedCategory = 'NOT MATCHED'
        }else if(this.dbDetails[duplicate].matchedCategory == 'POSSIBLE_MATCHES'){
          this.dbDetails[duplicate].matchedCategory = 'POSSIBLE MATCHES'
        }
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
      console.log('33333',this.configurations)
      console.log('4444',this.displaydbList)
      if(this.displaydbList){
    this.highlightMatches(this.displaydbList);
      }

    })
  
  }
  highLighter:any;
highlightMatches(comparedData:any){
  console.log('7777',comparedData);
for(let i=0;i<comparedData.length;i++){
  const fieldColorMap = new Map();
  comparedData[i].forEach((column) => {
    const { tableFields, applicationFields, chosenColor } = column;
      tableFields.forEach((tableField) => {
        fieldColorMap.set(tableField, chosenColor);
      });
    applicationFields.forEach((applicationField) => {
      fieldColorMap.set(applicationField, chosenColor);
    });
  });
  console.log('555',fieldColorMap);
this.highLighter = fieldColorMap;

}
}
}
