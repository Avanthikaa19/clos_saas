import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecisionTableList } from '../../models/DecisionTable';
import { TableList } from '../../models/DecisionTableList';
import { CsvuploadService } from '../../services/csvupload.service';
import { UrlService } from '../../services/http/url.service';
import { DecisionEngineIdService } from '../../services/decision-engine-id.service';
import { TabletestService } from '../../services/tabletest.service';

@Component({
  selector: 'app-tabletest',
  templateUrl: './tabletest.component.html',
  styleUrls: ['./tabletest.component.scss']
})
export class TabletestComponent implements OnInit {
  data: number = null as any;
  tables: TableList[] = []
  selectedTable: TableList;
  selectedTableId: number = null as any;
  name = 'Nirnaya'
  Extension = RegExp("^.*\.(py)$"); // Regular expression for .py extension
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
  show: boolean = false;
  message: string = 'Click to Preview Table';
  tablevalues: any[] = []
  headers: any;
  values: any;
  result: any;
  rows: any;
  columns: any;
  config:any;
  tablerow: any;
  tablecol: any;
  preview: boolean = false
  output: boolean = false
  uploading: boolean = false
  executing: boolean = false

  constructor(private tablelist: TabletestService,
    private url: UrlService,
    private route:Router,
    private router: ActivatedRoute,
    private csvuploadService: CsvuploadService,
    private projectId:DecisionEngineIdService,

  ) { }


  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.data = Number(this.router.snapshot.paramMap.get("id"));
    this.getTablesList();
    console.log('Project Id', this.router.snapshot.paramMap.get("id"))
    // console.log(this.route.url)
    // console.log(this.router.snapshot.paramMap.get("id"));
  }
  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  selectTable(id: number | undefined = 0, selectedData: TableList) {

    this.selectedTableId = id;
    this.selectedTable = selectedData
    this.show = true
    console.log(this.selectedTableId)
    console.log(this.selectedTable.rows)
    this.tablerow = this.selectedTable.rows
    this.tablecol = this.selectedTable.columns
    this.rows = JSON.stringify(this.selectedTable.rows)
    this.columns = JSON.stringify(this.selectedTable.columns)
    this.config=JSON.stringify(this.selectedTable.optimised_config)
    console.log("row=", this.rows)
    console.log("column=", this.columns)
    this.preview = true
    this.output = false
  }
  getTablesList() {
    this.tablelist.gettablelist(this.data).subscribe(
      (res) => {
        this.tables = res
        this.tables.forEach(e => {
          if (e.is_selected == true) {
            this.selectTable(e.id, e);
          }
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
        this.fileStatus = event.status
        this.fileExtStats = false;
        console.log(typeof (event['body'].file_path_csv));

        this.csvfilepath = event['body'].file_path_csv
        console.log('check', this.csvfilepath)

        // get response after File upload
        if (typeof (event) === 'object') {
          // this.shortLink = event.body.script_api;
          // this.jsonResponse = event.body.json;
          // console.log("Shortlink:" + this.shortLink)
          this.loading = false;
          this.uploading = false;



          this.schema = event.body
        }
        console.log('check', this.csvfilepath)

      },
      (error: any) => {
        this.loading = false;
        this.fileError = error

      });

  }
  exec() {
    this.executing = true
    let formData = new FormData();
    formData.append('path', this.file);
    formData.append('name', this.file.name);
    formData.append("rows", this.rows);
    formData.append("columns", this.columns);
    formData.append("optimised_config",this.config)
    this.tablelist.tableExecution(formData).subscribe(response => {
      this.result = response.body
      console.log(this.result)
      this.result = JSON.parse(this.result)
      let values = Object.values(this.result)
      this.tablevalues = []
      for (let i = 0; i < values.length; i++) {
        this.values = values[i]
        this.headers = Object.keys(this.values)
        this.tablevalues.push(Object.values(this.values))
        // this.preview=false
        this.output = true
        this.executing = false
      }

      console.log("values = = =", this.headers);
      console.log("values = = =", this.tablevalues);

    })

  }
  goBack(){
    let t = this.router.url;
    let viewUrl = "desicion-engine/test"
    console.log(viewUrl)
    this.route.navigateByUrl(viewUrl)
  }
}
