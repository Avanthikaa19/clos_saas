import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { ProjectIdService } from '../../query-variable/services/project-id.service';
import { AddConditionalRuleComponent } from '../../rule-set/modals/add-conditional-rule/add-conditional-rule.component';
import { Rules, Conditions, ReasonCode } from '../../rule-set/models/rulesetmodels';
import { RuleEngineService } from '../../rule-set/services/rule-engine.service';
import { RuleEngineParameters } from '../modals/rules';
import { ReasoncodeService } from '../services/reasoncodeservice';

@Component({
  selector: 'app-view-rules',
  templateUrl: './view-rules.component.html',
  styleUrls: ['./view-rules.component.scss']
})
export class ViewRulesComponent implements OnInit {

  inputData:any[] = [];
  outputData:any[] = [];
  choosemode;
  id: number = null as any;
  rule: Rules = new Rules();  
  ruleDataById: Rules = null as any;
  conditions:Conditions[]=[]
  action:any[]=[]
  disableSave: boolean = false;
  noAccess:boolean = false;
  ruleParams: RuleEngineParameters[] = [
    {
      "parameterName": "",
      "parameterType": {
        name: "",
        type: "",
      },
    },
  ];
reasonCodeList:ReasonCode[] = [];
isDirty: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private url: UrlService,
    public ruleEngineService: RuleEngineService,
    private selectedProject: ProjectIdService,
    public datepipe: DatePipe,
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private reasoncodeService:ReasoncodeService,
    public ac: AccessControlData,


  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }
  canDeactivate(): boolean {
    return !this.isDirty
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
    this.ruleConfig();
    this.getReasonCodeList()
    
  }

  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/rules-list';
    this.router.navigateByUrl(viewUrl)
  }

  ruleConfig() {
    if (this.id == 0) {
      console.log('Create Config');
    } else {
      this.ruleEngineService.getRuleById(this.selectedProject.selectedProjectId, this.id).subscribe(
        (res) => {         
          this.rule = res;
          if(this.rule.effect_from && this.rule.effect_to){
            this.rule.effect_from = this.rule.effect_from.split('T')[0];
            this.rule.effect_to = this.rule.effect_to.split('T')[0];
          }
          this.rule.conditions=this.rule.conditions
          this.rule.action=this.rule.action  
          this.conditions=this.rule.conditions
          this.action=this.rule.action
          this.rule.parameters=this.rule.parameters   
          this.inputData= this.rule.conditions  
          this.outputData=this.rule.action 
        },
        (err) => {
          if(err.status == 401){
            this.noAccess = true;
          }
        }
      )
    }
  }

  onSaveClick() {   
    console.log(this.choosemode)
    this.isDirty = false 
    this.rule.rule_type = "editor";
    this.rule.effect_from = new Date(this.rule.effect_from);
    this.rule.effect_to = new Date(this.rule.effect_to);
    this.rule.parameters = this.ruleParams   
    this.rule.project = this.selectedProject.selectedProjectId;
    this.rule.conditions=this.conditions
    this.rule.action=this.action
    this.rule.choose_mode = this.choosemode;
    this.disableSave = true;
    if (this.id == 0) {
      this.ruleEngineService.createRulesPid(this.rule).subscribe(
        (res) => { 
          this.showNotification('success','Rule created successfully.')
          this.goBack();
          this.disableSave = false;
          
        },
        (err) => {
          console.log(this.rule.conditions)
          if(err.status == 500 && this.rule.conditions?.length == 0){
            this.showNotification('error','Atleast Select one Condition in the Rule');
          }
          else if(err.status == 500){
            this.showNotification('error','Oops! Something went wrong');
          }
          this.disableSave = false;
        }
      )
    } else {
      this.ruleEngineService.updateRule(this.id, this.rule).subscribe(
        (res) => {
          this.showNotification('success','Rule edited successfully.')
          // this.ruleConfig();
          this.disableSave = false;
          this.router.navigateByUrl('/desicion-engine/explorer/rules/rules-list');
        },
        (err) => {
          this.showNotification('error','Oops! something went wrong.');
          this.disableSave = false;
        }
      )
    }
 
// this.ruleConfig()
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  openRuleBuilder() { 
      const dialogRef = this.dialog.open(AddConditionalRuleComponent,{
        height: "80vh",
        width: "70vw",
        data: {conditions:this.rule.conditions,action:this.rule.action,parameter:this.rule.parameters,saveUpdateChange:this.ruleEngineService.saveUpdate,choosemode:this.rule.choose_mode}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        console.log("result checking",result)
        this.choosemode = result[0].choosemode;
        for(let i=0;i<result.length;i++){
        console.log(result[i]['condition'])
          let changes = result[i]['changes']
          this.conditions=result[i]['condition']
          this.action=result[i]['action']
          this.ruleParams=result[i]['parameters']
          this.inputData=this.conditions
          this.outputData=this.action
          if(changes==true){
            this.isDirty = true
          }
          else {
            this.isDirty = this.isDirty
          }
        }
      });  
     
  }

  getReasonCodeList() {
    this.reasoncodeService.getReasonCodeList(this.selectedProject.selectedProjectId).subscribe(
      (res:any) => {
        this.reasonCodeList = res;          
  })
  }

  detectChange() {
    this.isDirty = true
  }

  errMsg() {
    if (!this.rule.name) {
      return '* Rule Name is a required field';
    }
    return ''
  }

}