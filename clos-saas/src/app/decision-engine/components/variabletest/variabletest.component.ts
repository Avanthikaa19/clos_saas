import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CsvuploadService } from '../../services/csvupload.service';
import { UrlService } from '../../services/http/url.service';
import { DecisionEngineIdService } from '../../services/decision-engine-id.service';
import { VariablelistService } from '../../services/variablelist.service';

@Component({
  selector: 'app-variabletest',
  templateUrl: './variabletest.component.html',
  styleUrls: ['./variabletest.component.scss']
})
export class VariabletestComponent implements OnInit {
  data: number = null as any;
  variables:any[]=[]
  selectedVariable:any;
  selectedVariableId: number = null as any;
  Extension = RegExp("^.*\.(py)$"); // Regular expression for .py extension
  Extension1 = RegExp("^.*\.(csv)$");
  fileExtStats: boolean = false;
  shortLink: string = "";
  fileError: any;
  fileStatus: any;
  loading: boolean = false;
  file: File = null as any;
  jsonResponse: string = ""
  schema:any;
  csvfilepath:any;
  selected:any; 
  show:boolean=false;
  message: string = 'Click to Preview Table';
  tablevalues:any[]=[]
  headers:any;
  values:any;
  result:any;
  preview:boolean=false
  output:boolean=false
  uploading: boolean=false
  executing: boolean=false
  name: string;
  type: string;
  description: string;
  tags: string;
  Inuse: string;
  source: string;
  database: string;
  list:string[]=[]
  head:string[]=['Name','Type','Description','Tags','In-Use','Source','Database']
  constructor(
    private variablelist:VariablelistService,
    private url: UrlService,
   private router: ActivatedRoute,
  private csvuploadService: CsvuploadService,
  private projectId:DecisionEngineIdService,
  private route:Router) { }

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.data = Number(this.router.snapshot.paramMap.get("id"));
    this.getVariablesList();
    console.log('Project Id',this.router.snapshot.paramMap.get("id"))
  }
  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
selectVariable(id: number | undefined = 0, selectedData: any){

  this.selectedVariableId = id;
  this.selectedVariable=selectedData
  this.show=true
  console.log(this.selectedVariableId)
  console.log(this.selectedVariable)
  this.name =selectedData.name
  this.type=selectedData.type
  this.description=selectedData.description
  this.tags=selectedData.tags
  this.Inuse=selectedData.in_use
  this.source=selectedData.source
  this.database=selectedData.database_mode
  this.list=[this.name,this.type,this.description,this.tags,this.Inuse,this.source,this.database]
  this.preview=true
  this.output=false
}
getVariablesList(){
  this.variablelist.getvariableslist().subscribe(
    (res) => {
        let data:any=res
     this.variables=data.results
     this.variables.forEach(e => {
      if (e.is_selected == true) {
        this.selectVariable(e.id, e);
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
      console.log(typeof(event['body'].file_path_csv));
      
      this.csvfilepath=event['body'].file_path_csv
       console.log('check',this.csvfilepath)
      
      // get response after File upload
      if (typeof (event) === 'object') {
        // this.shortLink = event.body.script_api;
        // this.jsonResponse = event.body.json;
        // console.log("Shortlink:" + this.shortLink)
        this.loading = false;
        this.uploading = false;

       
    
        this.schema = event.body
      }
      console.log('check',this.csvfilepath)

    },
    (error: any) => {
      this.loading = false;
      this.fileError = error

    });

}
exec(){
  this.executing=true
  let formData = new FormData();
  formData.append('path',this.file);
  formData.append('name',this.file.name);
  // formData.append("rows",this.rows);
  // formData.append("columns",this.columns);
  this.variablelist.variableExecution(formData,this.selectedVariableId).subscribe(response=>{
    this.result=response.body
  console.log(this.result)
    this.result=JSON.parse(this.result)
    let values=Object.values(this.result)
    this.tablevalues=[]
    for(let i=0;i<values.length;i++){
    this.values=values[i]
    this.headers=Object.keys(this.values)
    this.tablevalues.push(Object.values(this.values))
    this.preview=false
    this.output=true
    this.executing=false
    }

    console.log("values = = =",this.headers);
    console.log("values = = =",this.tablevalues);
    
  })

}
goBack(){
  let t = this.router.url;
  let viewUrl = "/desicion-engine/test"
  console.log(viewUrl)
  this.route.navigateByUrl(viewUrl)
}

}
