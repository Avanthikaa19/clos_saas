import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { RuleSet } from '../../models/rulesetmodels';
import { ProjectService } from '../../services/projectservice';
import { RuleEngineService } from '../../services/rule-engine.service';

@Component({
  selector: 'app-create-rule-set',
  templateUrl: './create-rule-set.component.html',
  styleUrls: ['./create-rule-set.component.scss']
})
export class CreateRuleSetComponent implements OnInit {

  list: RuleSet;

  constructor(
    private url: UrlService,
    public dialogRef: MatDialogRef<CreateRuleSetComponent>,
    @Inject(MAT_DIALOG_DATA)public data: CreateRuleSetComponent,
    private ruleEngineService: RuleEngineService,
    private selectedProject: ProjectService,
    private notifierService: NotifierService
  ) { 
    this.list = JSON.parse(JSON.stringify(data.list));
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
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  createRuleSet(){
    this.list.created_by = 'Admin';
    this.list.project = this.selectedProject.selectedProjectId;
    this.ruleEngineService.createRuleSet(this.list).subscribe(
      (res)=>{
        console.log(res);
        this.showNotification('success', "Rule Sets Created Successfully");
        this.onNoClick();
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  errMsg(): any{
    if(!this.list.name){
      return '* Ruleset name is a required field.'
    }
    
  }

}
