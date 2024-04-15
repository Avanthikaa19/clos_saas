import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { NotifierService } from 'angular-notifier';
import { fadeInOutRouter } from 'src/app/app.animations';
import { VariableLibrary, Variables } from '../../../models/Variables';
import { CsvuploadService } from '../../../services/csvupload.service';
import { UrlService } from '../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { VariablelibTestService } from '../../../services/variablelib-test.service';

@Component({
  selector: 'app-variable-lib-execution',
  templateUrl: './variable-lib-execution.component.html',
  styleUrls: ['./variable-lib-execution.component.scss'],
  animations: [fadeInOutRouter]

})
export class VariableLibExecutionComponent implements OnInit {
  
  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  constructor(
    private url: UrlService,
    private router: ActivatedRoute,
    private csvuploadService: CsvuploadService,
    private route: Router, public projectId: DecisionEngineIdService,
    private notifierService: NotifierService,
    private libraryTestService: VariablelibTestService
  ) { }
  selectedlibList:any[] = [];
  preview: boolean = true
  output: boolean = false
  selectedLib: VariableLibrary;
  selectedLibId: number = null as any;
  checked: boolean = false;
  // rowStyle: RowStyle;
  disabled: boolean = false;
  title: string = '';
  data: number = null as any;
  show: boolean = false;
  searchKeyString: string = '';
  searchValueString: string = '';
  options: string[] = [];
  valueOptions: any[] = [];
  searchFilter: any = {};
  variablelib: VariableLibrary[] = [];
  selectedLibrary: VariableLibrary;
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
  message: string = 'Click to Preview Variable Library';
  uploading: boolean = false
  executing: boolean = false;
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
  columnDefs: ColDef[] = [];
  sideBar:any = ['filters'];
  rowData: any[] = [];
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.data = Number(this.router.snapshot.paramMap.get("id"));
    this.projectId.selectedProjectId = this.data;
    this.getVariableList();
   
  }
  getVariableList() {
    console.log("coming")
    this.libraryTestService.getVariableLibraryList(this.data).subscribe(
      (res: any) => {
        console.log(res);
        this.variablelib = res
      }
    )

  }

  selectLibrary(id: number | undefined = 0, selectedData: VariableLibrary) {
    this.selectedLibId = id;
    this.selectedLib = selectedData;
    this.title = selectedData.name;
    this.show = true;
    this.preview = true;
    this.output = false;
  }

  getOneLib() {
    this.libraryTestService.getOneVariableLibraryById(this.selectedLibId).subscribe(
      (res) => {
        this.selectedlibList=[]
        this.selectedLibrary=res;
        console.log(this.selectedLibrary)
        console.log(this.selectedLibrary.variables)
        this.selectedLibrary.variables.forEach((e:any)=>{
           let variables=e.variable
           let variable={name:variables.name,description:variables.description}
           this.selectedlibList.push(variable)
        })
        console.log('var trest',  this.selectedlibList)
        
      }

    )
  }
  exec() {
    this.executing = true
    let librarayData = JSON.stringify(this.selectedLibrary)
    let formData = new FormData();
    formData.append('path', this.file);
    // formData.append('name', this.file.name);
    formData.append('variable_data', librarayData)
    this.libraryTestService.execcuteLibrary(formData).subscribe(response => {
      this.showNotification('success', 'Executed successfully');
      console.log(response);
      // this.tableResString = response.body;
      this.tableResponse = JSON.parse(response);
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
      this.rowData = this.tableResponse

      console.log("test", this.columnDefs)
      console.log(this.tableHeader);
    },
      (err) => {
        this.showNotification('error', 'Oops something went wrong.');
      }
    )
    this.preview = false;
    this.output = true;
    this.executing = false;
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
        //console.log(this.fileStatus);
        this.fileExtStats = false;
        //console.log(typeof (event['body'].file_path_csv));
        this.csvfilepath = event['body'].file_path_csv
        //console.log('check', this.csvfilepath)
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
  goBack(){
    let t = this.router.url;
    let viewUrl = "/alert-config/home/p/test"
    console.log(viewUrl)
    this.route.navigateByUrl(viewUrl)
  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}
