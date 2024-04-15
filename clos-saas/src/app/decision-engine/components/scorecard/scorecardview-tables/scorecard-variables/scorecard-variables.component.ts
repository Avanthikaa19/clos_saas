import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScoreCardVariables } from '../../models/scorecard-models';
import { ScorecardService } from '../../services/scorecard.service';
import { ObjectModelService } from 'src/app/decision-engine/services/Object-model.service';
import { WizardserviceService } from 'src/app/flow-manager/components/flow-manager/modals/import-export-wizard/service/wizardservice.service';
import { DatabaseModelService } from 'src/app/decision-engine/services/database-model.service';
import { DatabaseConfig } from 'src/app/decision-engine/models/DatabaseConfig';

@Component({
  selector: 'app-scorecard-variables',
  templateUrl: './scorecard-variables.component.html',
  styleUrls: ['./scorecard-variables.component.scss']
})
export class ScorecardVariablesComponent implements OnInit {

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  selectedVariable: string;
  res = [];
  selectedId: any;
  selectedName: string;
  variableNames: string[] = [];
  keyword: string = '';
  objName: any;
  type: string;
  type1: string;
  type2: string;
  type3: any;
  loading: boolean = false;
  scoreDetails: ScoreCardVariables = new ScoreCardVariables();
  objSearchKey: string = '';
  objModelList: any;
  modelMode: string;
  DatabaseName: string;
  tablelist:any;
  dataBaselist: any;
  FieldsList: { [key: string]: any[] } = {};
  isPanelOpen: boolean[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalPageCount = 27;
  tableName: any;
  openedPanelIndex: number = -1;
  searchText:string  = '';
  filteredList:string[]=[];
  checkedTableNames:string[] = ['LOS_LOAN_CUSTOMER','LOS_MATCHED_RESULT','LOS_DUP_DEPOSITOR_BASE','LOS_DUP_CAMM','LOS_RESULTS','LOS_POLICY_MATCHING_STATUS','LOS_NTB_MATCHING_STATUS','LOS_DATABASE_MATCHING_STATUS','LOS_NFIS_DECISION_STATUS','LOS_THICK_THIN'];
  constructor(
    private service: ScorecardService,
    public dialog: MatDialog,
    private wizardService: WizardserviceService,
    private objectModelService: ObjectModelService,
    private databaseConfigService: DatabaseModelService,
  ) { }


  ngOnInit() {
    this.modelMode = 'Object Model';
    // this.DatabaseName =  'TSLOAN';
    this.getVariables();
    this.selectedVariable = this.variableNames[''];
    this.getVariablesList();
  }

  //Get Object Model
  getVariables() {
    this.loading = true;
    // this.service.getSearchFunction(this.keyword).subscribe(
    // res=>{
    //   this.loading = false;
    //   this.objName = res['data']
    // })
    this.objectModelService.getDefaultObjectModel().subscribe(res => {
      this.loading = false;
      this.objModelList = res[0].schema.children;
      this.objModelSearch();
    });
  }

  objModelSearch() {
    if (!this.objSearchKey) {
      this.objName = this.objModelList;
      return this.objName
    } else {
      const searchKey = this.objSearchKey.toLowerCase();
      this.wizardService.objectTypeSearch(searchKey).subscribe(res => {
        this.objName = this.objModelList.filter(item => {
          const hasMatchingChild = item.children.some(child => {
            const childNameLower = child.name.toLowerCase();
            return childNameLower.includes(searchKey);
          });
          item.panelOpenState = hasMatchingChild;
          return hasMatchingChild;
        });
      });
    }
  }

  variable(event, type) {
    this.type = event.split('- ');
    this.type1 = this.type[0];
    this.type2 = type;
  }
  Capitalize(lowerstr: string) {
    //  const lower  = this.type1.toLocaleLowerCase();
    return lowerstr.charAt(0).toUpperCase() + lowerstr.slice(1)

  }
  // Add Variables
  addVariable() {
    this.scoreDetails.name = this.Capitalize(this.type1);
    this.scoreDetails.type = this.type2;
    this.scoreDetails.functionId = this.selectedId ? this.selectedId : null;;
    let id = sessionStorage.getItem('id')
    this.service.putScoreCard(id, this.scoreDetails).subscribe(
      res => {
        console.log(res);
        sessionStorage.removeItem('id');
      }
    )
  }

  // get varilablelist dropdown
  getVariablesList() {
    this.service.getVariableList().subscribe(
      res => {
        this.res = res;
        this.variableNames = res.map(variable => variable.name);
        this.selectedName = this.variableNames[''];
      }
    )
  }


  handleSelectionChange(vari: string) {
    this.service.getVariableList().subscribe(
      res => {
        this.selectedId = this.res.find(v => v.name === vari).id;
        console.log('The id is:', this.selectedId);
      }
    )
  }

  //get database
  getDatabaseName() {
    if (this.modelMode == 'Database') {
      this.databaseConfigService.getDatabaseName().subscribe(
        (res) => {
          console.log("Config Service ", res);
          this.dataBaselist = res;
          this.DatabaseName = this.dataBaselist[0]
          this.getTableListByDatabaseName(this.DatabaseName)
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  //get table list by database name
  getTableListByDatabaseName(database: string) {
    console.log('get dataBasename',database)
    let tableConfig = new DatabaseConfig();
    tableConfig.dbName = database;
    this.databaseConfigService.getTableName(tableConfig).subscribe(
      (res) => {
        this.tablelist  = res;
        this.filteredList = this.tablelist;
      },
      (err)=>{
        console.log("Err Response ", err);
      }
    )
  }

  //get fields value from mat panel
  getPanelvalue(item: any,index:number){
    this.openedPanelIndex = index;
    const tableName = item;
    if (!this.FieldsList[tableName]) {
      this.getFieldnameByTabalename(tableName, 1);
    }
  }  

  getFieldnameByTabalename(tableName: string, pageIndex: number) {
    console.log('get tablename',tableName)
    let tableConfig = new DatabaseConfig();
    tableConfig.dbName = this.DatabaseName;
    tableConfig.tableName = tableName;
    this.loading  = true;
    this.databaseConfigService.getFieldName(pageIndex,this.pageSize,tableConfig).subscribe(
      (res) => {
        console.log("Fields name", res);
        this.loading  = false;
        if (!this.FieldsList[tableName]) {
          this.FieldsList[tableName] = [];
        }
        this.FieldsList[tableName] = [...this.FieldsList[tableName], ...res['fields']];
        this.totalPageCount = res['total_pages'];
      },
      (err)=>{
        console.log("Err Response ", err);
      }
    )
  }

   // CHOOSE TABLE -> NGX MAT SELECT SEARCH FILTER FUNCTION
   onTableFilter(){
    if (this.searchText) {
      const filteredTables = this.tablelist.filter(table => table.toLowerCase().includes(this.searchText.toLowerCase()));
      this.filteredList = filteredTables;
    }else{
      this.filteredList = this.tablelist;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const container = event.target;
    const atBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    const currentTableName = this.tablelist[this.openedPanelIndex];

    if (atBottom && !this.loading && this.page <= this.totalPageCount) {
      this.getFieldnameByTabalename(currentTableName, this.page);
      this.page++;
    }
  }

}
