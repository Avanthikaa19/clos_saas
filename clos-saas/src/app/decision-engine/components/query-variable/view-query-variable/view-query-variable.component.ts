import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { QueryBuilder } from 'src/app/decision-engine/models/QueryBuilder';
import { CsvuploadService } from 'src/app/decision-engine/services/csvupload.service';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { ObjectModelService } from 'src/app/decision-engine/services/Object-model.service';
import { ExampleHeaderComponent } from '../example-header/example-header.component';
import { QueryVariable, queryParams, Database, QueryInfo } from '../models/query';
import { QueryparamsComponent } from '../queryparams/queryparams.component';
import { DataSourceService } from '../services/data-source.service';
import { DecisionTablesService } from '../services/decision-tables.service';
import { ProjectIdService } from '../services/project-id.service';
import { QueryvariableService } from '../services/queryvariable.service';
@Component({
  selector: 'app-view-query-variable',
  templateUrl: './view-query-variable.component.html',
  styleUrls: ['./view-query-variable.component.scss']
})
export class ViewQueryVariableComponent implements OnInit {
  selectedDbName: string;
  searchKey: any = '';
  responseArray: any;
  filteredTableOptions: string[] = [];
  filteredFieldOptions: string[] = [];
  filteredFieldOptions1: any;
  tableSearch: any;
  readonly ExampleHeaderComponent = ExampleHeaderComponent;
  queryobj = new queryobj()
  Extension = RegExp("^.*\.(xlsx)$"); // Regular expression for . extension
  Extension1 = RegExp("^.*\.(csv)$");
  fileExtStats: boolean = false;
  shortLink: string = "";
  fileError: any;
  fileStatus: any;
  uploading: boolean = false;
  disableSave: boolean = false;
  file: File = null as any;
  jsonResponse: string = ""
  schema: any;
  csvfilepath: any;
  start: Date;
  end: Date;
  executedQuery: any;
  paramData: any;
  conquery: string;
  durations: any[] = [];
  dateValue: any;
  id: number = null as any;
  queryvar: QueryVariable = new QueryVariable();
  querybuild: QueryBuilder = new QueryBuilder();
  queryInfo: QueryInfo[] = [];
  tableNames: any
  queryParams: queryParams[] = [];
  mysqlDbList: Database[] = [];
  datetype: any[] = ['Custom', 'Standard']
  raw: boolean = true;
  builder: boolean = false;
  value = 'Clear me';
  open: boolean = true;
  list: any;
  db_queryConfig: QueryBuilder = new QueryBuilder();
  query: any = null;
  tableHeaders: string[] = [];
  outputFields: any[] = [];
  loading: boolean = false;
  show: boolean = true;
  message: string = "No Data Found";
  editorOptions = {
    theme: 'vs', language: 'sql',
    fontFamily: "Consolas, 'Courier New', monospace",
    fontSize: 14,
    fontLigatures: false,
    colorDecorators: true,
    dragAndDrop: true,
    linkedEditing: true,
    minimap: {
      enabled: true,
    },
    mouseWheelZoom: true,
    showFoldingControls: 'always',
    useTabStops: true,
  };
  filterData: any[] = [];
  switchQueryscreen: boolean = true;
  multipleDB: any[] = [];
  tabledropdown: any;
  tableId: any;
  conditonalTableField: any[] = [];
  conditonalField: any[] = [];
  variableList: any;
  noAccess:boolean = false;
  constructor(
    private url: UrlService,
    private dbModelService: ObjectModelService,
    private notifierService: NotifierService,
    private router: Router,
    private selectedProject: ProjectIdService,
    private dbSourceService: DataSourceService,
    public queryService: QueryvariableService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private csvuploadService: CsvuploadService,
    private decisionTableService: DecisionTablesService,
    public ac:AccessControlData
  )
  //   public dialogRef: MatDialogRef<QueryBuilderComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: QueryBuilderComponent,
  // ) 
  {
    // this.list = data;
    // this.setConfig();
    this.queryvar.project_id = selectedProject.selectedProjectId
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.queryvar.date_choices = "Custom"
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
    this.queryInfo.unshift({ databaseName: '', tableName: '', fields: [], tablevalues: [], fieldValues: [] })
    this.getMysqlDataSourceList()
    this.getOneQuery(this.id)
    // this.getStandardsTable()
    this.getDate()
    this.getDBNames();
  }
  getDate() {
    if (!this.id) {
      this.queryvar.start_date = new Date().toLocaleDateString('en-us', { month: 'numeric', day: 'numeric', year: 'numeric' })
      this.queryvar.end_date = new Date().toLocaleDateString('en-us', { month: 'numeric', day: 'numeric', year: 'numeric' })
      this.start = new Date()
      this.end = new Date()

    }
  }

  getOneQuery(id: number) {
    if (this.id > 0) {
      this.queryService.getOneQuery(id).subscribe((res) => {
        if (res.id != 0) {
          this.queryvar = res;
          this.queryvar.db_id = res.db_id
          this.queryInfo = res['queryInfo'];
          for (let i = 0; i < this.queryInfo.length; i++) {
            this.emptyTableDropDwn(i, this.queryInfo[i].databaseName, this.queryInfo[i])
            this.variableList = this.queryInfo[i].databaseName
            this.actionField(i, this.queryInfo[i].tableName, this.queryInfo[i]);
          }
          //  this.queryvar.date_value=res.date_value['id']
          this.queryParams = res.params
          this.filterData = res.params
          if (res.start_date.includes("now")) {
            let result: any = res.start_date.split("-")
            if (result[1]) {
              let number = result[1].split(" ")
              let num = +number[0]
              let format = number[1]
              if (num && format == "d") {
                let expression = new Date(new Date().getTime() - num * 24 * 60 * 60 * 1000);
                this.start = expression
              }
              else if (num && format == "m") {
                let expression = new Date(new Date().getTime() - num * 30 * 24 * 60 * 60 * 1000);
                this.start = expression
              }
              else if (num && format == "y") {
                let expression = new Date(new Date().getTime() - num * 364 * 24 * 60 * 60 * 1000);
                this.start = expression
              }
            }
            else {
              this.start = new Date()
            }

          }
          else {
            this.start = new Date(res.start_date)
          }
          if (res.end_date.includes("now")) {
            let result: any = res.end_date.split("-")
            if (result[1]) {
              let number = result[1].split(" ")
              let num = +number[0]
              let format = number[1]
              if (num && format == "d") {
                let expression = new Date(new Date().getTime() - num * 24 * 60 * 60 * 1000);
                this.end = expression
              }
              else if (num && format == "m") {
                let expression = new Date(new Date().getTime() - num * 30 * 24 * 60 * 60 * 1000);
                this.start = expression
              }
              else if (num && format == "y") {
                let expression = new Date(new Date().getTime() - num * 364 * 24 * 60 * 60 * 1000);
                this.start = expression
              }
            }
            else {
              this.end = new Date()
            }

          }
          else {
            this.end = new Date(res.end_date)
          }
        }
      })
    }
  }

  executeQuery() {
    this.show = false;
    this.loading = true;
    this.querybuild.query = this.queryvar.query
    this.db_queryConfig = this.querybuild;
    for (let i = 0; i < this.mysqlDbList.length; i++) {
      if (this.mysqlDbList[i].id == this.queryvar.db_id) {
        this.querybuild.db_name = this.mysqlDbList[i].db_name
        this.querybuild.host = this.mysqlDbList[i].host
        this.querybuild.password = this.mysqlDbList[i].password
        this.querybuild.port = this.mysqlDbList[i].port
        this.querybuild.user = this.mysqlDbList[i].user
      }
    }
    for (let i = 0; i < this.durations.length; i++) {
      if (this.durations[i].id == this.queryvar.date_value) {
        this.dateValue = this.durations[i]
      }
    }
    this.querybuild.project = this.selectedProject.selectedProjectId
    this.queryobj.queryconfig = this.db_queryConfig
    this.queryobj.path = this.file
    console.log("file", this.queryobj, this.queryobj.path)
    let formData = new FormData()
    formData.append("path", this.file)
    formData.append("queryconfig", JSON.stringify(this.db_queryConfig))
    formData.append("params", JSON.stringify(this.queryParams))
    formData.append("start", this.queryvar.start_date)
    formData.append("end", this.queryvar.end_date)
    formData.append("date_type", this.queryvar.date_choices)
    formData.append("date_value", JSON.stringify(this.dateValue))

    this.dbModelService.queryExecution(formData).subscribe(
      (res) => {
        console.log("res", res)
        this.loading = false;
        this.outputFields = []
        this.tableHeaders = []
        this.show = true
        // if(res==null){
        //   this.message = "SQL query Error"
        // }
        if (res != null) {
          if (res.length > 0) {
            this.outputFields = res;
            console.log(this.outputFields[0])
            this.tableHeaders = Object.keys(this.outputFields[0]);
            this.showNotification('success', 'Database connected successfully.')
            this.message = ""
          }

          else {
            this.show = true
            this.loading = false;
            this.outputFields = [];
            this.tableHeaders = [];
            this.message = "No Data Found"
          }
        }
        else {
          this.message = "SQL query error"
        }
      },
      (err) => {
        this.showNotification('error', 'Oops! something went wrong.')
        this.message = "SQL query Error"
        this.outputFields = []
        this.tableHeaders = []
        this.loading = false;
        this.show = true;
        console.log(err);
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  onValChange(value: any) {
    if (value == "section1") {
      this.raw = true
      this.builder = false
    }
    else if (value == "section2") {
      this.raw = false
      this.builder = true
    }
  }
  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    console.log(t);
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/query-variable-list'
    console.log(viewUrl)
    this.router.navigateByUrl(viewUrl)
  }
  getMysqlDataSourceList() {
    // this.loading = true;
    this.dbSourceService.getMysqlList().subscribe(
      (res) => {
        this.loading = false;
        this.mysqlDbList = res;
        if (this.id) {
          // this.executeQuery()
        }

        if (!this.id) {
          this.queryvar.db_id = this.mysqlDbList[0].id
        }
        this.showNotification('default', 'Loaded successfully.')
      },
      (err) => {
        this.loading = false;
        console.log(err);
        if(err.status == 401){
           this.noAccess = true;
        }
        this.showNotification('error', 'Oops! something went wrong.')
      }
    )
  }
  onSaveClick() {
    console.log(this.queryvar.db_id)
    this.queryvar.params = this.queryParams
    this.queryvar.queryInfo = this.queryInfo
    for (let i = 0; i < this.mysqlDbList.length; i++) {
      if (this.mysqlDbList[i].id == this.queryvar.db_id) {
        console.log("enter")
        this.querybuild.db_name = this.mysqlDbList[i].db_name
        this.querybuild.host = this.mysqlDbList[i].host
        this.querybuild.password = this.mysqlDbList[i].password
        this.querybuild.port = this.mysqlDbList[i].port
        this.querybuild.query = this.queryvar.query
        this.querybuild.user = this.mysqlDbList[i].user
        // this.querybuild.
        console.log(this.querybuild)
        this.queryvar.query_builder = this.querybuild
      }
    }
    this.disableSave = true;
    if (this.id > 0) {
      this.queryService.editQuery(this.id, this.queryvar).subscribe((res) => {
        console.log(res)
        this.showNotification('success', 'Updated Successfully!')
        this.disableSave = false;
        this.router.navigateByUrl('/desicion-engine/explorer/query-variable/query-variable-list')
      },
        (error) => {
          this.disableSave = false;
          console.log(error.message);
          this.showNotification('error', 'Query name should not be empty')
        });
    }
    else {
      this.queryService.createQueryVariable(this.queryvar).subscribe(res => {
        console.log(res);
        this.showNotification('success', 'Created Successfully!')
        this.goBack()
        this.disableSave = false;
      },
        (error) => {
          this.disableSave = false;
          console.log(error.message);
          this.showNotification('error', 'Query name should not be empty')
        });
    }
  }

  onChange(start: any, end: any) {
    this.start = new Date(start.value)
    this.end = new Date(end.value)
    console.log(start.value, end.value, this.start, this.end)

    if (sessionStorage.getItem('start') !== null) {

      console.log(`Email address exists`,);
      // start.value= sessionStorage.getItem('start')
      // end.value=sessionStorage.getItem('end')
      this.queryvar.start_date = sessionStorage.getItem('start')
      this.queryvar.end_date = sessionStorage.getItem('end')
      sessionStorage.removeItem('start')
    } else if (sessionStorage.getItem('end') !== null) {
      // end.value=sessionStorage.getItem('end')
      this.queryvar.end_date = sessionStorage.getItem('end')
      sessionStorage.removeItem('end')
    }
    else {
      // start.value=start.value
      // end.value=end.value
      this.queryvar.start_date = start.value
      this.queryvar.end_date = end.value
      // this.start=start.value
      // this.end=end.value
    }
  }
  addParams() {
    const dialog = this.dialog.open(QueryparamsComponent, { width: '90rem', height: '60rem', panelClass: 'query-param-model' })
    dialog.afterClosed().subscribe((data: queryParams) => {
      console.log(data)
      console.log()
      if (data) {
        this.filterData.push(data)
        this.queryParams = this.filterData
      }
    })
  }

  onEditClick(i: any) {
    let value: any = this.queryParams[i];
    this.paramData = value
    // let new:any=value
    const dialog = this.dialog.open(QueryparamsComponent, { width: '90rem', height: '60rem', data: this.queryParams[i], disableClose: true })
    dialog.afterClosed().subscribe((query: queryParams) => {
      //  this.queryParams.splice(i,1)
      //  this.queryParams[i]=query
    })
  }

  onDeleteClick(i: any) {
    var result = confirm("Want to delete?");
    if (result) {
      this.queryParams.splice(i, 1)
    }
  }

  // getStandardsTable() {
  //   this.decisionTableService.getstandardstable().subscribe((res) => {
  //     console.log(res)
  //     this.durations = res
  //   })
  // }

  handleFileInput1(event: any) {
    this.uploading = true;

    this.file = event.target.files[0];

    if (!this.Extension1.test(this.file.name)) {
      this.fileExtStats = true
      throw new Error("Unsupported file types")
    }

    // File Upload Service
    this.csvuploadService.upload(this.file).subscribe(
      (event: any) => {
        this.fileStatus = event.status;
        this.fileExtStats = false;
        this.csvfilepath = event['body'].file_path_csv
        console.log('check', this.csvfilepath)
        if (typeof (event) === 'object') {
          this.showNotification('success', 'File uploaded successfully.');
          this.uploading = false;
          this.schema = event.body;
        }
      },
      (error: any) => {
        this.uploading = false;
        this.fileError = error;
        this.showNotification('error', 'Oops! something went wrong.');
      });

  }

  // To listing a database names
  getDBNames() {
    this.queryService.getDataBaseName().subscribe(
      (res) => {
        this.responseArray = res;
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // table dropdown
  emptyTableDropDwn(index: any, listName, tables) {
    this.variableList = listName;
    this.selectedDbName = listName;
    this.conditonalTableField[index] = [];
    this.queryService.getTableName(listName).subscribe(res => {
      this.conditonalTableField[index] = res;
      this.tableNames = res;
      if (tables)
        tables.tablevalues = res;
    });
  }

  // Filter tables names
  tableOptions(index: any, emptyLogicList: any) {
    const searchQuery = this.searchKey?.toLowerCase();
    const filteredOptions = emptyLogicList?.tablevalues.filter(option =>
      option.toLowerCase().includes(searchQuery)
    );
    emptyLogicList.filteredTableOptions = filteredOptions;
    return emptyLogicList.filteredTableOptions;
  }

  // field dropdown
  actionField(index: any, event, field) {
    let seletedtableName = event;
    this.conditonalField[index] = [];
    this.queryService.getFieldName(seletedtableName, this.selectedDbName).subscribe(
      res => {
        this.conditonalField[index] = res;
        if (field)
          field.fieldValues = res;
      }
    )
  }

  // filter in fields
  filterFieldOptions(index: any, emptyLogicList: any, name: any) {
    this.filteredFieldOptions1 = name;
    const tableSearch = this.tableSearch?.toLowerCase();
    const fieldSearch = emptyLogicList?.fieldValues.filter(option =>
      option.toLowerCase().includes(tableSearch)
    );
    emptyLogicList.filteredFields = fieldSearch;
    return emptyLogicList.filteredFields;
  }

}

export class queryobj {
  queryconfig: QueryBuilder;
  path: File;
}
