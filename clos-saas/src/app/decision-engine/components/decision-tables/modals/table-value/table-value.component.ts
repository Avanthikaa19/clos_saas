import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NotifierService } from 'angular-notifier';
import { DecisionTableValueTree } from '../../../../models/DecisionTable';
import { Header, MultipleColumn } from '../../../../models/DecisionTables';
import { DecisionTablesList,SelectedColumn } from '../../../../models/DecisionTables';
import { DecisionTablesService } from '../../../../services/decision-tables.service';
import { UrlService } from '../../../../services/http/url.service';
import { ObjectModelService } from '../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { WizardserviceService } from 'src/app/flow-manager/components/flow-manager/modals/import-export-wizard/service/wizardservice.service';
import { DatabaseModelService } from 'src/app/decision-engine/services/database-model.service';
import { DatabaseConfig,DatabaseTree } from 'src/app/decision-engine/models/DatabaseConfig';


@Component({
  selector: 'app-table-value',
  templateUrl: './table-value.component.html',
  styleUrls: ['./table-value.component.scss']
})
export class TableValueComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  originalData: any[];
  treeControl = new NestedTreeControl<DecisionTableValueTree>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  treeData: DecisionTableValueTree[] = [];
  selectedNodedata: any;
  selectedNodeId: number = null as any;
  selectedNodeName: string = '';
  selectedNodeType: string = '';
  projectId: number = null as any;
  tableId: number = null as any;
  columnLable: string = 'conditionalVariable';
  selectedTableValue: DecisionTablesList = null as any;
  columnId: number = null as any;
  objectSearchKey1: string;
  objectSearchKey: string; 
  dbSearch:{ [key: number]: string } = {}; 
  serachRes: any[] = [];
  selectedTables1:any;
  page: number = 1;
  pageSize: number = 5;  
  selectedTables:string[] = ['LOS_ADMIN_ACCESS_ITEMS','LOS_ADMIN_ACCESS_TEMPLATE','LOS_ADMIN_ROLE_ACCESS_TEMPLATE','LOS_ADMIN_USERS','LOS_ADMIN_USERS_ROLES','LOS_DEPOSITOR_DECISION_STATUS','LOS_EXECUTION_JOB','LOS_NFIS_DECISION_STATUS1','LOS_NFIS_STP_STATUS1'];
  //database tree
  dataBaselist:any;
  modelMode:string;
  DatabaseName: string;
  tablelist:any;
  DatabaseTreeControl = new NestedTreeControl<DatabaseTree>(node => node.children);
  DatabaseSource = new MatTreeNestedDataSource<any>();
  databaseTreee:DatabaseTree[] = [];
  panelOpenState = false;
  isPanelOpen: boolean[] = [];
  loading: boolean = false;
  FieldsList: { [key: string]: any[] } = {};
  // dataBase:string='TSLOAN'
  checkedItems: any[] = [];
  openedPanelIndex: number = -1;
  totalPageCount = 27;
  filteredTablelist:string[] =[];
  tableName:string;
  filteredFieldsList: { [key: string]: string[][] } = {};
  selectAllChecked: boolean = false;

  constructor(
    private url: UrlService,
    private Wizardservice: WizardserviceService,
    private decisionTableService: DecisionTablesService,
    private selectedProject: DecisionEngineIdService,
    private objectModelService: ObjectModelService,
    public dialogRef: MatDialogRef<TableValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private notifierService: NotifierService,
    private databaseConfigService: DatabaseModelService,
  ) {
    this.tableId = data;
    this.modelMode = 'Database';
    // this.getDatabaseName();
  
    // this.DatabaseName =  this.dataBaselist[0];
  }

  hasChild = (_: number, node: DecisionTableValueTree) => !!node.children && node.children.length > 0;

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
    this.refreshTreeData();
    console.log('Selected Project', this.selectedProject.selectedProjectId, UrlService.API_URL);
    this.projectId = this.selectedProject.selectedProjectId;
    this.getDatabaseName();
  }

  refreshTreeData() {
    this.treeData = [];
    this.decisionTableService.getDecisionTableById(this.tableId).subscribe(
      res => {
        // this.selectedTableValue = res;
        this.treeCreation()

      }
    )
  }
  //FOR CREATE AND DISPLAY MAT TREE
  treeCreation() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        if(res[0]){
          console.log(res)
        let children = res[0].schema.children;
        let parameterName = res[0].schema.name + " - " + res[0].schema.type;
        console.log('parameterName',parameterName)
        // this.mattreeData = children;

        if (children) {
          children.forEach((e: { paramName: string; name: string; type: string; }) => {
            e.paramName = e.name + " - " + e.type;
          })
        }
        this.treeData.push(
          {
            name: parameterName,
            children: res[0].schema.children,
            expanded: true
          })
          console.log('treeData',this.treeData)
        this.dataSource.data = this.treeData;
        }
      },
    )
  }
  updataDecisionTable() {
    this.selectedTableValue.created_by = 'Admin';
    this.decisionTableService.updateDecisionTableById(this.selectedTableValue.id, this.selectedTableValue).subscribe(
      res => {
        this.onCloseClick();
        this.showNotification('success', 'Updated Successfully.')
      },
      (err) => {
        this.showNotification('error', 'Oops! Something Went Wrong.')
      }
    )
  }

  selectedNode(nodeName: any) {
    console.log('node name',nodeName)
    this.selectedNodedata = nodeName
    this.selectedNodeId = nodeName.id
    this.selectedNodeName = nodeName.name;
    this.selectedNodeType = nodeName.type;

  }

  onCreateClick() {
    console.log('selectedNode',this.selectedNodedata)
    console.log('checked-Data',this.checkedItems)
    if(this.modelMode == 'Object Model'){
    this.dialogRef.close({ result: this.selectedNodedata, lable: this.columnLable, mode: this.modelMode});
    }else{
     this.dialogRef.close({ result: this.checkedItems, lable: this.columnLable,  mode: this.modelMode });
      
    }
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        let children = res.object_model.json.children;
        children.forEach((e: any) => {
          let dataType = e.name;
        });
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

 //  object search 
objectTypeSearch() {
  const searchKey = this.objectSearchKey.toLowerCase().trim();
  if (searchKey === '') {
      this.dataSource.data = this.treeData;
      return;
  }
  this.Wizardservice.objectTypeSearch(searchKey).subscribe(
      res => {
          this.serachRes = res as string[];
          const filteredTreeData = this.filterTreeData(this.treeData, searchKey);
          this.expandFilteredNodes(filteredTreeData);
          this.dataSource.data = filteredTreeData;
          this.expandFilteredNodes(filteredTreeData);
      }
  );
}

  filterTreeData(nodes: DecisionTableValueTree[], searchKey: string, parentPath: DecisionTableValueTree[] = []): DecisionTableValueTree[] {
    const filteredNodes: DecisionTableValueTree[] = [];
    nodes.forEach(node => {
      const filteredChildren = this.filterTreeData(node.children, searchKey, [...parentPath, node]);
      if (node.name.toLowerCase().includes(searchKey) || filteredChildren.length > 0) {
        const expanded = filteredChildren.length > 0; // Expand the node if it has matching children
        filteredNodes.push({
          ...node,
          children: filteredChildren,
          expanded: expanded
        });
      }
    });
    return filteredNodes;
  }

  expandFilteredNodes(nodes: DecisionTableValueTree[]) {
    nodes.forEach(node => {
      if (node.expanded) {
        this.treeControl.expand(node); // Expand the node
      }
      if (node.children.length > 0) {
        this.expandFilteredNodes(node.children);
      }
    });
  }

  //get database
  getDatabaseName() {
    this.databaseConfigService.getDatabaseName().subscribe(
      (res) => {
        this.dataBaselist = res;
        this.DatabaseName = this.dataBaselist[0]
        this.getTableListByDatabaseName(this.DatabaseName)
      },
      (err) => {
        console.log(err);
      }
    );
  }

//get table list by database name
  getTableListByDatabaseName(database: string) {
    let tableConfig = new DatabaseConfig();
    tableConfig.dbName = database;
    this.databaseConfigService.getTableName(tableConfig).subscribe(
      (res) => {
        this.tablelist  = res;
        this.filteredTablelist = this.tablelist;
      },
      (err)=>{
        console.log("Err Response ", err);
      }
    )
  }
  
  //get fields value from mat panel
  getPanelvalue(item: any, index: number){
    this.page = 1;
    this.openedPanelIndex = index;
    this.tableName = item;
    if (!this.FieldsList[this.tableName]) {
      this.getFieldnameByTabalename(this.tableName, 1);
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
        console.log("Fields name", res.fields);
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

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const container = event.target;
    const atBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    const currentTableName = this.tableName;
    if (atBottom && !this.loading && this.page <= this.totalPageCount) {
      this.getFieldnameByTabalename(currentTableName, this.page);
      this.page++;
    }
  }

  isChecked(item: any): boolean {
    let selectedColumn:SelectedColumn = new SelectedColumn();
    selectedColumn.name = item[0];
    selectedColumn.type = item[1];
    // return this.checkedItems.includes(item);
    return this.checkedItems.some((checkedItem) => checkedItem.name === selectedColumn.name);
  }

  MultipleColumn:MultipleColumn = new MultipleColumn();

  onCheckboxChange(event: any, item: any): void {
    let selectedColumn:SelectedColumn = new SelectedColumn();
    selectedColumn.name = item[0];
    selectedColumn.type = item[1];
    if (event.checked) {
      this.checkedItems.push(selectedColumn);
    } else {
      // const index = this.checkedItems.indexOf(selectedColumn);
      const index = this.checkedItems.findIndex((checkedItem) => checkedItem.name === selectedColumn.name);
      if (index > -1) {
        this.checkedItems.splice(index, 1);
      }
    }
  }

   //FOR CREATE AND DISPLAY MAT TREE
   databaseTreeCreation(databaseSchema: string[]) {
    console.log("Database Schema", databaseSchema);

    this.DatabaseSource.data = databaseSchema;
  }

  // CHOOSE TABLE -> NGX MAT SELECT SEARCH FILTER FUNCTION
  onTableFilter(){
    if (this.objectSearchKey1) {
      const filteredTables = this.tablelist.filter(table => table.toLowerCase().includes(this.objectSearchKey1.toLowerCase()));
      this.filteredTablelist = filteredTables;
    }else{
      this.filteredTablelist = this.tablelist;
    }
  }

// database search
databaseSearch(panelIndex: number) {
  const dbSearch = this.dbSearch[panelIndex].toLowerCase().trim();
  const selectedTable = this.selectedTables[panelIndex];
  this.databaseConfigService.databaseSearchTable(dbSearch, selectedTable).subscribe(
    (res: any) => {
      this.serachRes = res['data'];
      if (!dbSearch) {
        this.filteredFieldsList[selectedTable] = this.FieldsList[selectedTable];
      } else {
        this.filteredFieldsList[selectedTable] = this.FieldsList[selectedTable].filter(fields =>
          fields.join(' ').toLowerCase().includes(dbSearch)
        );
      }
    },
  );
}

selectAll(e){
  if (e.checked) {
    console.log("CHECKED", e)
    this.selectedTables = [...this.filteredTablelist];
  }
  else {
    console.log("NOT CHECKED")
    this.selectAllChecked=false
    this.selectedTables=[]
  }
}
}


