import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { config, fieldsDetails } from 'src/app/duplicate-checking/models/models';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';

@Component({
  selector: 'app-database-connection',
  templateUrl: './database-connection.component.html',
  styleUrls: ['./database-connection.component.scss']
})
export class DatabaseConnectionComponent implements OnInit {

  loading: boolean = false;
  config_id: number = null;
  field: fieldsDetails = new fieldsDetails([],[],[]);
  Config: config = new config("","","",[this.field]);
  config: config[] = [];
  variables;
  status: boolean;
  page: number = 1;
  pageSize: number = 1000;
  tableDrpdwn;
  fieldDrpdwn;
  drpResponse;
  newFieldDrp:any[]=[]
  drpdownTableName:string;
  appKeyword: string;
  appDrpdwn;
  tableName: string;
  splchr = ['-','/','{','}','*','='];
  ruleName: string;
  ruleDescription: string;
  threshold : string;
  
  constructor(
    private notifierService: NotifierService,
    public router:Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    public duplicateService: DuplicateCheckingService
  ) { }

  ngOnInit() {
    let param = this.route.queryParams.forEach(e => {
      this.config_id = e['config_id'];
    });
    if(this.config_id){
      this.viewRules();
    }else{
      this.config = [this.Config];
      this.variables = {name: '',description: '',threshold: ''};
    }
    this.getTable('');
    this.getAppDrpdwn('');
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  // Table Dropdown
  getTable(keyword) {
    let config = {
      "name":"Sample",
      "dbName":"TSLOAN_EXTERNAL",
      "host":"192.168.19.17",
      "port":"3306",
      "username":"TS_LOANUSER",
      "password":"ts@password"
    }
    this.duplicateService.getTable(keyword,this.page,this.pageSize,config).subscribe(
      res => {
        this.tableDrpdwn = res;
      }
    )
  }


  // Fields Dropdown
  getFields(data,keyword) {
    let config = {
      "name":"Sample",
      "dbName":"TSLOAN_EXTERNAL",
      "host":"192.168.19.17",
      "port":"3306",
      "username":"TS_LOANUSER",
      "password":"ts@password"
    }
     this.tableName = data;

    this.duplicateService.getFields(this.tableName,'',this.page,this.pageSize,config).subscribe(
      res => {
        this.tableName = data;
        this.drpResponse =res;
      //  this.fieldDrpdwn = res['data'];
      this.newFieldDrp.push(res)
      console.log('333', this.newFieldDrp)
        this.drpdownTableName =  res['tableName']
            
      }
    )   
  }

  // Application Fields Dropdown
  getAppDrpdwn(keyword){
    this.duplicateService.getAppField(keyword,this.page,this.pageSize).subscribe(
      res => {
        this.appDrpdwn = res;
      }
    )
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const clickedInside = this.elementRef.nativeElement.contains(event.target);
  //   if (!clickedInside) {
  //     this.dbKeyword = '';
  //   }
  // }

  // Read Rules
  viewRules(){
    this.duplicateService.viewRules(this.config_id).subscribe(
      res => {
        this.status = res['activeStatus'];
        this.config = res['configurations'];
        this.variables = res;
        if(this.config.length == 0){
          this.config = [this.Config];
        }
        for(let item of this.config){         
          this.getFields(item.tableName,'')
        }
      },
      err => {
        this.showNotification('error','Oops! something went wrong.')
      }
    )
  }

  // Save Rules
  saveRules() {
    this.ruleName = this.variables.name;
    this.ruleDescription =  this.variables.description;
    this.threshold = this.variables.matchingThreshold;
    this.duplicateService.saveRules(this.config,this.ruleName,this.ruleDescription,this.threshold).subscribe(
      res => {
        this.router.navigateByUrl('loan-application-matching/main-nav/duplicate-check-config')
        this.showNotification('success','Rules saved successfully')
      },
      err => {
        this.showNotification('error','Oops! something went wrong.')
      }
    )
  }

  // Update Rules
  updateRules(id) {
    this.ruleName = this.variables.name;
    this.ruleDescription =  this.variables.description;
    this.threshold = this.variables.matchingThreshold;
    this.duplicateService.updateRules(id,this.status,this.config,this.ruleName,this.ruleDescription,this.threshold).subscribe(
      res => {
        this.showNotification('success','Updated Successfully');
        this.router.navigateByUrl('loan-application-matching/main-nav/duplicate-check-config');
      },
      err => {
        this.showNotification('error','Oops! something went wrong.');
      }
    )
  }

  appField(data,event,data2){
    if(event.source._selected == true){
      if(event.isUserInput == true){
        data2.push(data)
      }
    }else{
      data2.pop()
    }
  }

  charField(data,event,data2){
    if(event.source._selected == true){
      if(event.isUserInput == true){
        data2.push(data)
      }
    }else{
      data2.pop()
    }
  }

  tableField(data,event,data2){
    if(event.source._selected == true){
      if(event.isUserInput == true){
        data2.push(data)
      }
    }else{
      data2.pop()
    }
  }

  addField(item){
    item.fieldsDetails.push({
      tableFields: [],
      characters: [],
      applicationFields: []
  });
  }

  addTable(){
    this.config.push(this.Config)
  }
}
