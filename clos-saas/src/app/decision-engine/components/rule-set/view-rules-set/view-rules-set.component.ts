import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { CreateRuleComponent } from '../modals/create-rule/create-rule.component';
import { Rules, RuleSet } from '../models/rulesetmodels';
import { ProjectService } from '../services/projectservice';
import { RuleEngineService } from '../services/rule-engine.service';

@Component({
  selector: 'app-view-rules-set',
  templateUrl: './view-rules-set.component.html',
  styleUrls: ['./view-rules-set.component.scss']
})
export class ViewRulesSetComponent implements OnInit {

  
  id: number = null as any;
  listRules: Rules[] = [];
  loading: boolean = false;
  ruleSet: RuleSet = null as any;
  disableSave: boolean = false;
  saveUpdate: boolean;
  noAccess:boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private url: UrlService,
    public ruleEngineService: RuleEngineService,
    private selectedProject: ProjectService,
    private notifierService: NotifierService,
    public ac:AccessControlData
  ) { }

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
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id);
    // this.getRules();
    this.getRuleSetByID();
    this.selectedProject.selectedRuleSetId = this.id;
    // this.ruleEngineService.saveUpdate = false;
  }

  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    console.log(t);
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/rule-engine-list'
    console.log(viewUrl)
    this.router.navigateByUrl(viewUrl)
  }

  createRule(){
    this.editRule(new Rules())
  }

  editRule(rules: Rules) {
    const dialogRef = this.dialog.open(CreateRuleComponent,{
      height: "90vh",
      width: "40vw",
      data: { rule: this.listRules },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getRuleSetByID();
    });
  }

 

  getRules(){
    this.ruleEngineService.getRulesList().subscribe(
      (res)=>{
          console.log(res);
          this.listRules = res;
          this.showNotification('default','Rules Loaded Successfully.');
      },
      (err)=>{
        console.log(err);
        this.showNotification('error','Oops! Something went wrong');
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  getRuleSetByID(){
    this.loading = true;
    this.ruleEngineService.getRuleSetById(this.id).subscribe(
      (res)=>{
        console.log(res);
        this.loading = false;
        this.ruleSet = res;
        this.listRules = res.rules;
      },
      (err)=>{
        console.log(err);
        if(err.status == 401){
          this.noAccess = true;
        }
      }
    )
  }

  editRuleToView(ruleId: number){
      let t = this.router.url;
      t = t.substr(0, t.lastIndexOf("/rule-set-view"));
      t = t.substr(0, t.lastIndexOf("/"));
      console.log(t);
      let viewUrl = t + '/rules/rules-change/' + ruleId;
      console.log(viewUrl);
      this.router.navigateByUrl(viewUrl);
  }

saveRuleset(){
  console.log(this.ruleSet)
  this.disableSave = true;
   this.ruleEngineService.saveruleset(this.id,this.ruleSet).subscribe(
     (res) =>{
       this.disableSave = false;
       console.log(res)
       this.showNotification('success','Updated Successfully');
      this.router.navigateByUrl('/desicion-engine/explorer/rule-set/rule-set-list')
     },
     (err)=>{
        console.log(err);
        this.showNotification('error','Oops! Something went wrong');
      }
   )
}


}
