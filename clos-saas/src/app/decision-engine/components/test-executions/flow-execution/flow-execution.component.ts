import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Edge, Layout, MiniMapPosition, Node } from '@swimlane/ngx-graph';
import { Subscription } from 'rxjs';
import { fadeInOutRouter } from 'src/app/app.animations';
import { ConfigData, DecisionFlow, FlowTasks, TestFlowTable } from '../../../models/DecisionFlow';
import { CsvuploadService } from '../../../services/csvupload.service';
import { FlowtestService } from '../../../services/flowtest.service';
import { UrlService } from '../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import * as Shape from 'd3-shape';
import { NotifierService } from 'angular-notifier';
import { FlowtestConfigModalComponent } from './modals/flowtest-config-modal/flowtest-config-modal.component';
import { ApplyFilterComponent } from './modals/apply-filter/apply-filter.component';
import { ColDef, RowStyle } from 'ag-grid-community';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessControlData } from 'src/app/app.access';

@Component({
  selector: 'app-flow-execution',
  templateUrl: './flow-execution.component.html',
  styleUrls: ['./flow-execution.component.scss'],
  animations: [fadeInOutRouter]
})
export class FlowExecutionComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate'; 
  startdate: any='';
  tableResponse1:any[]=[];
  checked: boolean = false;
  //search
  inputText: string;

  // rowStyle: RowStyle;
  disabled: boolean = false;
  title: string = '';
  spin_load:boolean=false;
  preview: boolean = false;
  data: number = null as any;
  show: boolean = false;
  searchKeyString: string = '';
  searchValueString: string = '';
  options: string[] = [];
  valueOptions: any[] = [];
  searchFilter: any = {};
  rowClassRules: any;
  flow: DecisionFlow[] = []
  flow1: DecisionFlow[] = []
  flowList : DecisionFlow[] = []
  selectedFlow: DecisionFlow;
  selectedFlowId: number = null as any;
  name = 'Nirnaya'
  Extension = RegExp("^.*\.(xlsx)$"); // Regular expression for . extension
  Extension1 = RegExp("^.*\.(csv)$");
  fileExtStats: boolean = false;
  shortLink: string = "";
  fileError: any;
  fileStatus: any;
  loading: boolean = false;
  file: File = null as any;
  jsonResponse: string = ""
  schema: any;
  csvfilepath: any;
  selected: any;
  message: string = 'Click to Preview Flow';
  uploading: boolean = false
  executing: boolean = false
  flowname: string = '';
  flowtasks: any;
  shape = Shape;
  nodes: Node[] = [];
  links: Edge[] = [];
  flowTasks: FlowTasks[] = [];
  screenHeight: number = 0;
  screenWidth: number = 0;
  //Graph
  layoutSettings = {
    // orientation: 'TB',
    marginX: 100,
    marginY: 200,
  };
  showMiniMap: boolean = true;
  miniMapMaxWidthPx: number = 200;
  miniMapMaxHeightPx: number = 100;
  miniMapPosition: MiniMapPosition = MiniMapPosition.UpperLeft;
  layout: string | Layout = 'dagre';
  draggingEnabled: boolean = false;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;
  zoomSpeed: number = 0.15;
  zoomLevel: number = 0.7;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  panOnZoom: boolean = false;
  panOffsetX: number = 0;
  panOffsetY: number = 50;
  autoZoom: boolean = false;
  autoCenter: boolean = false;
  animate: boolean = false;
  tasks: FlowTasks[] = [];
  tablevalues1: any[] = [];
  tablevalues2: any[] = [];
  tableHeaders: TestFlowTable = null as any;
  headers1: any;
  headers2: any;
  values1: any;
  values2: any;
  result: any;  
  output: boolean = false
  flowConfigData: ConfigData;
  headerData: string[] = []
  inputHeaders: string[] = []
  outputHeaders: string[] = []
  decisionFlowData: any;
  routeEventSub: Subscription;
  endDate: string;
  floatingDiv: boolean = false
  id: any;
  selectedLogMessage: any;
  myGrid:string='myGrid'
  //TABLE
  tableHeader: string[] = [];
  tableResponse: any[] = [];
  tableResString: string = '';
  defaultColDef: ColDef = {
    sortable: true,
    floatingFilter: true,
    filter: true, resizable: true,
    // editable: true,
  };
  routeFlowId:any = null;
  columnDefs: ColDef[] = [];
  sideBar:any = ['filters'];
  rowData: any[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private router: ActivatedRoute,
    private route: Router,
    private flowtest: FlowtestService,
    private url: UrlService,
    private csvuploadService: CsvuploadService,
    public dialog: MatDialog,
    public projectId: DecisionEngineIdService,
    private notifierService: NotifierService,
    public flowtestService: FlowtestService,
    public ac:AccessControlData

  ) { }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }  
  async ngOnInit() {
    let response = await this.updateUrl();       
    UrlService.API_URL = response.toString();        
    if (UrlService.API_URL.trim().length == 0) {
      //console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.data = Number(this.router.snapshot.paramMap.get("id"));
    this.projectId.selectedProjectId = this.data;
    this.getFlowsList();
    console.log('Project Id', this.router.snapshot.paramMap.get("id"))
    this.routeFlowId=this.router.snapshot.paramMap.get("id")
    
    // this.rowStyle = { background: 'pink' };
  }

  getFlowsList() {
    this.flowtest.decisionFlowList(this.data).subscribe(
      (res: any) => {
        console.log(res);
        this.flow = res
        this.flowList = res
        if(this.routeFlowId){
          this.selectFlow(this.routeFlowId);
          this.getOneFlow()
        }
        // })
      }
    )
  }

  selectFlow(id: number | undefined = 0,) {
    this.startdate="";
    this.selectedFlowId = id;
    this.flow.forEach(flowData=>{
      if(flowData.id == +id){
        this.selectedFlow = flowData;
        this.title = this.selectedFlow.name;
      }
      this.show = true;
        this.preview = true;
        this.output = false;
    })
     }

  //search fllowname
  searchFlow() {
    this.loading=true
    if (this.inputText != "") {
      this.loading=false
      this.flowList = []
      this.flowList = this.flow.filter(res => {
        return res.name.toLocaleLowerCase().match(this.inputText.toLocaleLowerCase().trim())
      })
    }
    else if((this.inputText == "")){
      this.flowList = this.flow
    } 
  
  }

  clearSearchField() {
    this.inputText = '';
    this.flowList = this.flow
  }

  getNodesFromFlowTasks(flowTasks: FlowTasks[]): Node[] {
    this.nodes = [];
    for (let task of flowTasks) {
      let width:any = '';
      let temp: Node = { id: task.id.toString(), label: task.name, data: task, dimension: {width:width, height:50}}
      this.nodes.push(temp);
    }
    return this.nodes;
  }
  getLinksFromFlowTasks(flowTasks: FlowTasks[]): Edge[] {
    this.links = [];
    for (let task of flowTasks) {
      if (task.prevTaskId == null) {
      }
      else if (task.prevTaskId != null) {
        if (task.repeat == 1) {
          for (var i = 0; i < task.prevTaskId.length; i++) {
            let temp: Edge = { source: task.prevTaskId[i].toString(), target: task.id.toString() }
            this.links.push(temp);

          }
        }
        else if (task.repeat > 1) {
          for (var i = 0; i < task.prevTaskId.length; i++) {
            let temp: Edge = { source: task.prevTaskId[i].toString(), target: task.id.toString() }
            this.links.push(temp);
            this.links.push({ source: task.id.toString(), target: task.id.toString() });
          }
        }
      }

      else {
        //console.log("Error")
      }
    }
    return this.links;
  }

  testing(event: any) {
    console.log(event)
  }

  displayDiv(data: any) {
    this.selectedLogMessage = data;
    console.log(data)
  }
  goBackToConfig(){
    let t = this.router.url;
    let viewUrl = "desicion-engine/explorer/decisionFlow/decisionFlowView/"+this.selectedFlowId
    console.log(viewUrl)
    this.route.navigateByUrl(viewUrl)
  }
  loadNodesandLinks(taskData: any) {
    //console.log("tasks", taskData);
    this.getNodesFromFlowTasks(taskData)
    this.nodes = [...this.nodes]
    this.getLinksFromFlowTasks(taskData)
    this.links = [...this.links]
  }
  getOneFlow() {
    this.spin_load=true;
    this.flowtest.getoneflow(this.selectedFlowId).subscribe(
      (res) => {
        console.log('flowtest', res)
        let flows: any = res
        flows.forEach((flow: any) => {
          console.log('FlowTest', flow)
          this.decisionFlowData = res;
          this.spin_load=false;
          this.id = flow['id'];
          // this.getConfigData()
          this.flowname = flow['name']
          this.flowtasks = flow['flowTasks']
          this.tasks = []
          this.flowtasks.forEach((task: any) => {
            this.tasks.push(task)
            this.loadNodesandLinks(this.tasks)
          })
        })
      }

    )
  }
  handleFileInput1(event: any) {
    this.uploading = true;

    this.file = event.target.files[0];

    if (!this.Extension1.test(this.file.name)) {
      this.fileExtStats = true
      throw new Error("Unsupported file types")
    }

    this.loading = !this.loading;
    // File Upload Service
    this.csvuploadService.upload(this.file).subscribe(
      (event: any) => {
        this.fileStatus = event.status;
        this.fileExtStats = false;
        this.csvfilepath = event['body'].file_path_csv
        // get response after File upload
        if (typeof (event) === 'object') {
          this.showNotification('success', 'File uploaded successfully.');
          this.loading = false;
          this.uploading = false;
          this.schema = event.body;
        }
        //console.log('check', this.csvfilepath)
      },
      (error: any) => {
        this.loading = false;
        this.uploading = false;
        this.fileError = error;
        this.showNotification('error', 'Oops! something went wrong.');
      });

  }
  // getConfigData() {
  //   this.flowtestService.getConfigByFlowId(this.id).subscribe(config => {
  //     console.log(config.start_date)
  //     if(config.start_date!=null){
  //     this.startdate = new Date(config.start_date)
  //     }
  //     else{
  //       this.startdate=""
  //     }
  //     console.log( this.startdate)
  //   })
  // }
  exec() {
    this.loading=true;
    console.log(this.startdate)
    this.executing = true
    let task = JSON.stringify(this.tasks)
    let formData = new FormData();
    formData.append('id', this.id);
    formData.append('path', this.file);
    // formData.append('name', this.file.name);
    formData.append('flowTasks', task)
    if(this.startdate!= ""){
      formData.append("start_date", this.startdate.toLocaleDateString('en-us',{ month: 'numeric', day: 'numeric',year: 'numeric'} ))
     }
     else{
      this.startdate = new Date().toLocaleDateString('en-us',{ month: 'numeric', day: 'numeric',year: 'numeric'} )
      formData.append("start_date", this.startdate)
     }
    this.flowtest.flowexecution(formData).subscribe(response => {
      console.log(response)
      this.loading=false;
      
      this.tableResString = response.body;
      try{
        this.tableResponse = JSON.parse(response.body);
        this.tableResponse1 = JSON.parse(response.body);
        this.showNotification('success', 'Executed successfully');
        console.log(this.tableResponse);
        this.tableHeader = Object.keys(this.tableResponse[0]);
        console.log('Table Header', this.tableHeader);
        this.columnDefs = [];
        this.tableHeader.forEach((header: string) => {
          this.columnDefs.push({
            headerName: header,
            field: header,
          })
        })
        this.tableResponse1.forEach(tableRes=>{
          if(this.getTypeOf(tableRes.NOTIONAL)=='number'){
            tableRes.NOTIONAL=this.getCommaSeperated( tableRes.NOTIONAL)
  
          }if(this.getTypeOf(tableRes.NOTIONAL_BASE)=='number'){
            tableRes.NOTIONAL_BASE=this.getCommaSeperated( tableRes.NOTIONAL_BASE)
  
          }if(this.getTypeOf(tableRes.MAX_TRADE_RATE)=='number'){
            tableRes.MAX_TRADE_RATE=this.getCommaSeperated( tableRes.MAX_TRADE_RATE)
  
          }if(this.getTypeOf(tableRes.PNL_VALUE)=='number'){
            tableRes.PNL_VALUE=this.getCommaSeperated( tableRes.PNL_VALUE)
  
          }if(this.getTypeOf(tableRes.RATE)=='number'){
            tableRes.RATE=this.currencyRate( tableRes.RATE)
  
          }
        })


       this.rowData = this.tableResponse1
        this.rowClassRules = {
          'small_buy-warning': function (params: any) {
            
            var small_buy = params.data.SMALL_BUY;
            // var list=['SMALL_BUY']
            return  small_buy =='True' 
    
          },
          // 'sick-days-breach': function (params: any) {
          //   var numSickDays = params.data.CURRENCY;
          //   return numSickDays =='USD' 
    
          // },
          
        };
        }
      catch (error) {
        this.showNotification('error', response.body );
        this.rowData=[]
        this.columnDefs=[]
        
      }
     
    },
      (err) => {
        this.showNotification('error', 'Oops something went wrong.');
        this.rowData=[]
        this.columnDefs=[]
      }
    )
    this.preview = false;
    this.output = true;
    this.executing = false;
  }

  repeat() {
   console.log(this.rowData)
  }
  getSeperateHeader(headers: string[]) {

  }
  openConfigureDialog() {
    const dialogRef = this.dialog.open(FlowtestConfigModalComponent, {
      height: '85vh',
      width: '60vw',
      data: this.id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.flowtestService.getConfigByFlowId(result).subscribe((data1: any) => {
          console.log(data1)
          this.flowConfigData = data1.configure_data;
          console.log(this.flowConfigData)
          // this.startDate = data1.start_date;
          this.endDate = data1.end_date;

        }
        )
        this.decisionFlowData.configure_data = this.flowConfigData;
      }
    });
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  getTypeOf(type: any) {
    return typeof (type)
  }

  getCommaSeperated(num: number) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  currencyRate(num: number) {
    return num.toFixed(4).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
  }

  //EXPORT 
  getExportFile() {
    // tableResponse
    let configData = {
      "file_name": "fileName",
      "result": this.tableResString,
    }
    this.flowtestService.exportTestFlowTable(configData).subscribe(
      (res) => {
        console.log(res);
        var blob = new Blob([res], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = `export_file.csv`;
        anchor.href = url;
        anchor.click();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  onKeyChange(searchKeyString: string) {
    this.valueOptions = [];
    this.tableResponse.forEach(
      e => {
        if (e[searchKeyString] != null) {
          if (this.valueOptions.includes(e[searchKeyString])) {
            //DO NOTHING
          } else {
            this.valueOptions.push(e[searchKeyString]);
          }
        }
      }
    )
  }

  onValueChange(searchValueString: string) {
    console.log('Searchkeystring', this.searchKeyString);
    console.log('Value string', searchValueString);
  }

  addFilter() {
    console.log(this.searchKeyString, this.searchValueString);
    this.searchFilter[this.searchKeyString] = this.searchValueString;
    this.searchKeyString = '';
    this.searchValueString = '';
  }

  applyFilters() {
    console.log('Added Filters', this.searchFilter);
    const dialogRef = this.dialog.open(ApplyFilterComponent, {
      height: "80vh",
      width: "40vw",
      data: this.searchFilter,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

goBack(){
  let t = this.router.url;
  let viewUrl = "/desicion-engine/test"
  console.log(viewUrl)
  this.route.navigateByUrl(viewUrl)
}
saveDate() { 
  let formData = new FormData();
  if(this.startdate!=""){
   formData.append("start_date", this.startdate.toLocaleDateString('en-us',{ month: 'numeric', day: 'numeric',year: 'numeric'} ))
  }
  else{
   formData.append("start_date", this.startdate)
  }
  this.flowtestService.saveConfig(this.selectedFlowId, formData).subscribe(data => {
    console.log(data);

  })
}

// copy to clipboard
copyTableToClipboard() {
  const columnHeaders = this.columnDefs.map(columnDef => columnDef.headerName).join('\t');
  const rowData = this.rowData.map(row => Object.values(row).join('\t')).join('\n');
  const dataToCopy = columnHeaders + '\n' + rowData;
  navigator.clipboard.writeText(dataToCopy);
  this.openSnackBar('Copied to clipboard.', '');
}

openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 2000,
  });
}
}