import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Datatype } from '../../../../models/ObjectModel';
import { UrlService } from '../../../../services/http/url.service';
import { ObjectModelService } from '../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigVariablesComponent } from '../modals/config-variables/config-variables.component';
import { ProfileVariableService } from '../../../../services/profile-variable.service';
import { Others, Profiles,ResultConfig ,Config,ConfigMethod} from '../../../../models/ProfileVariable';
import { QueryBuilder } from '../../../../models/QueryBuilder';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';


@Component({
  selector: 'app-view-variable',
  templateUrl: './view-variable.component.html',
  styleUrls: ['./view-variable.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class ViewVariableComponent implements OnInit {

  id: number = null as any;
  profileData: any = new Profiles();
  pythonCode: Others = new Others();
  variableFields: any;
  loading: boolean = false;
  configure: ConfigMethod[]=[];
  db_config: QueryBuilder = new QueryBuilder();
  configData: any = [
    {
      "dateField":"","period":"",
      "configMethod": [
        
        {
          "name": "columnFilter",
          "input": "",
          "output": []
        },{
          "name": "profile_for",
          "input": "",
          "output": []
        },
        
      ]
    },
  ]


  params: Datatype[] = [];
  projectId: number = null as any;
  columnValues: any[] = [];
  filteredColumns: any[] = [];
  name: string = '';
  profileName:string = ''
  selectedColumnList: any[] = [];
  yday: number = 0;

  editorOptions = {
    theme: 'vs-dark', language: 'python',
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

  fileName: string = '';
  code: string = '';

  editorTheme: string[] = ['hc-black', 'vs-dark', 'vs'];
  toggleData: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private selectedProject: DecisionEngineIdService,
    private objectModelService: ObjectModelService,
    private notifierService: NotifierService,
    private profileService: ProfileVariableService,
    private queryService: ObjectModelService,
    private url: UrlService, public dialog: MatDialog,
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
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
    this.variableConfig();
    this.getDefaultObject()
   

  }

  onThemeChange(theme: string) {
    this.editorOptions = { ...this.editorOptions, theme: theme };
  }
  
getCloumnList(){
  let configData:any=this.configData[0]
  this.selectedColumnList=configData.configMethod[0].output
  
}

getDefaultObject() {
  this.objectModelService.getDefaultObjectModel().subscribe(
    res => {
      let children = res[0].schema.children;
      this.params = children;
      console.log(this.params);
      this.name = this.params[0].name;
    },
    (err) => {
      this.showNotification('error', 'Oops! Something Went Wrong.');
    }
  )
}
onValueSelected(data: any) {
  this.columnValues = data.children;
  this.filterColumns("");
}
filterColumns(event: any) {
  let searchText: string = event;
  if (searchText == null) {
    searchText = '';
  }
  this.filteredColumns = [];
  for (let i = 0; i < this.columnValues.length; i++) {
    if (this.columnValues[i].name != null) {
      if (this.columnValues[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
        this.filteredColumns.push(this.columnValues[i]);
      }
    }
  }
}

onSaveClick() {
  let resultDataStr: ResultConfig[] = [];
  // this.configData.forEach(e => {
  //   // console.log(e)
  //   resultDataStr.push({
  //     "dateField": e.dateField,
  //     "columnFilter": e.configMethod[0].output,
  //      "profile_for": e.configMethod[1].output
     
  //   })
  // })
  this.profileData.config=resultDataStr;
  console.log(this.profileData.config);
  // let toString = JSON.stringify(resultDataStr);
  let stringfyData = JSON.stringify(this.pythonCode);
  this.profileData.projectdetail = this.selectedProject.selectedProjectId;
  this.profileData.others=stringfyData;
  if (this.id == 0) {
    this.loading = false;
    this.profileService.createProfile(this.profileData).subscribe(
      (res) => { 
    this.loading = false;

        this.showNotification('success','Profiling  created successfully.')
        this.goBack();
      },
      (err) => {
    this.loading = true;

        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  else{
  this.profileService.updateProfiles(this.profileData.id,this.profileData).subscribe(data =>{
    console.log(data)
    this.showNotification('success','Profiling  updated Successfully.');

  },
  (err) => {
    this.showNotification('error','Oops! something went wrong.');
  }
  )}

}

showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

getPushData(input: any, symbol: any, value: any) {
  if (input && symbol && value) {
    console.log(input + ' ' + symbol + ' ' + value)
    return input + ' ' + symbol + ' ' + value;
  }
 
  else {
    return input;
  }}
  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/profile-list';
    this.router.navigateByUrl(viewUrl)
    // let viewUrl = "/home/p/config"
    // console.log(viewUrl)
    // this.router.navigateByUrl(viewUrl)
  }
  configcreation() {
    console.log(this.profileData.config)
  }
  configureProfile(){
   console.log(this.profileData)

 const dialog=this.dialog.open(ConfigVariablesComponent,{
  width:'105rem',height:'60rem',data:{inputTable:this.profileData.input_table,outputTable:this.profileData.output_table}
})
dialog.afterClosed().subscribe(config=>{
  if(config){
    this.profileData.input_table = config[0]
    this.profileData.output_table = config[1]
  }
  
})
  }
  variableConfig() {
    this.loading = true;
    if (this.id == 0) {
      this.profileName="Create"
      // console.log('Create Config');
      this.loading=false;
      

    } else {
      this.profileName="Edit"
      console.log('Edit Config');
      this.profileService.getProfile( this.id).subscribe(
        (res:any) => {  
          console.log(res);
          // this.db_config=res.input_table.db      
          this.profileData = res;
          if (this.profileData.config) {
            if (this.profileData.config.length > 0) {
              this.configData.pop()
              
              // console.log("before",this.configData)
              // for(let i=0;i<this.profileData.config.length;i++){
              //   this.configData.push({"dateField": this.profileData.config[i]['dateField'],"period": this.profileData.config[i]['period'],
              //     configMethod:[
              //   {name: 'columnFilter',input: '',output: this.profileData.config[i]['columnFilter']},{name: 'profile_for',input: '', output: this.profileData.config[i]['profile_for']},
              // ]})
              // }
              this.getCloumnList()

              // console.log("after",this.configData)

            } else {
              console.log('No data passed')
              // this.pythonCode =  new Others();
            }
          }
          console.log(this.profileData)
          if (this.profileData.others) {
            this.pythonCode = JSON.parse(res.others);
            console.log(this.pythonCode)
          } else {
            this.pythonCode = new Others();
            console.log(this.pythonCode)

          }
          this.loading = false;
          this.profileData.name = res.name;

        },
        (err) => {
          console.log(err);
        }
      )
    }
  }

saveConfig(){
  
  this.onSaveClick()
}
RunProfile(){
  console.log(this.profileData)
  this.profileService.runProfile(this.profileData).subscribe(data=>{console.log(data)})
}

}
