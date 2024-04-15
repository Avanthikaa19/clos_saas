import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { configDetail, configDetails, configFieldsDetails, configurations, field, route } from '../../models/config.models';
import { ConfigService } from '../../services/config.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ClosCaseManagerService } from 'src/app/loan-case-manager/service/clos-case-manager.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {
  dbDropdown1: any[][] = [];
  showAddTableButton: boolean = false;
  ruleName: string = '';
  ruleDescription: string = '';
  highThreshold: number;
  avgFromThreshold: number;
  avgToThreshold: number;
  lowThreshold: number;
  route: route = new route(null, null, 0)
  fieldz: field = new field([], '', '', '', [], '', '', false, 0, '', '','', '', [this.route], []);
  configfieldz: configDetail = new configDetail([], '', '',[],[]);
  field: configFieldsDetails = new configFieldsDetails([], [], [], false, "", '', 0, [this.route]);
  configure: configDetails = new configDetails(null, 0, [this.field], [], [], null, null, null, null, null, null, null, false, [this.configfieldz]);
  config: configDetails[] = [];
  variables;
  selectedIndex: number;
  status: boolean;
  choseClr: any;
  tableDrpdwn;
  page: number = 1;
  pageSize: number = 1000;
  splchr = ['-', '/', '{', '}', '*', '=', ',', '.'];
  algorithm: any;
  dbDropdown: any[][] = [];
  charKeyword: string = '';
  appDropdown: any[][] = [];
  appDropdown2: any[][] = [];
  appKeyword: string = '';
  dbKeyword: string = '';
  overallTablename: string = '';
  stageDropdown: any;
  stage;
  temp: any[] = [];
  inquireKeyword: string = '';
  inquireDropdown: any[] = [];
  inquireDropdown2: any[] = [];
  matchKeyword: string = '';
  matchDropdown: any[] = [];
  matchDropdown2: any[] = [];
  DatabaseConfig: configurations = new configurations('Sample', 'TSLOAN', '192.168.19.17', '5306', 'LOANUSER', 'tspassword')
  selectedTableNames: string[] = [];
  configDetail : configDetail[]= [];
  dbDropdowns: any[][][] = [];
  appDropdowns: any[][][] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<ConfigurationsComponent>,
    public closCaseManagerService: ClosCaseManagerService,
    public configService: ConfigService,
    
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.viewRules();
    } else {
      this.config = [this.configure];
    }
    this.getTable('');
    this.getAppDrpdwn('');
    this.getStage();
    this.getInquireDrpdwn('');
    this.getAlgDrpdwn();
  }
  isButtonDisabled(): boolean {
    return this.config.some(item =>
      !item.tableName ||
      !item.fieldsDetails.every(field =>
        field.tableFields.length > 0 && field.applicationFields.length > 0
      )
    );
  }

  // Add Table
  addTable() {
    this.config.push({
      tableName: '',
      tablePriority: 2,
      fieldsDetails: [({
        tableFields: [],
        characters: [],
        applicationFields: [],
        doHighlight: false,
        chosenColor: '',
        chosenAlgorithm: '',
        fieldPriority: 1,
        routingResultsAndPriority: [({
          chosenPriorityLevel: null,
          result: null,
          routingPriority: 0
        })]
      })],
      inquiredApplicationFields: [],
      matchedTableFields: [],
      highMatchThreshold: '',
      averageFromMatchThreshold: '',
      averageToMatchThreshold: '',
      lowMatchThreshold: '',
      avgMatchCCode: '',
      highMatchCCode: '',
      lowMatchCCode: '',
      multipleTable: false,
      configurationMultiple: []
    });
    this.showAddTableButton = false;
  }

  // Add Field
  addField(item) {
      item.fieldsDetails.push({
        tableFields: [],
        characters: [],
        applicationFields: [],
        doHighlight: false,
        chosenColor: '',
        chosenAlgorithm: ''
      });
  }

  // Remove Field
  removeField(i: number, j: number) {
    this.config[i].fieldsDetails.splice(j, 1);
  }

  // Remove Table
  removeTable(index) {
    this.config.splice(index, 1);
    if (index === 0) {
      this.showAddTableButton = true;
    }
  }

  // Notification
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  // Create Rule
  createRules() {
    for (let item of this.config) {
      this.getDbDrpdwn('', item.tableName)
      for (let i = 0; i < item.fieldsDetails.length; i++) {
        this.choseClr = item.fieldsDetails[i].chosenColor.replace('#', '');
        item.fieldsDetails[i].chosenColor = this.choseClr;
      }
    }
    this.config.forEach(data => {
      if (data.highMatchCCode) {
        data.highMatchCCode = data.highMatchCCode.replace('#', '');
      }
      if (data.avgMatchCCode) {
        data.avgMatchCCode = data.avgMatchCCode.replace('#', '');
      }
      if (data.lowMatchCCode) {
        data.lowMatchCCode = data.lowMatchCCode.replace('#', '');
      }
    });
    for(let i=0;i<this.config.length;i++){
      if(this.config[i].multipleTable == true){
        delete this.config[i].tableName
        delete this.config[i].averageFromMatchThreshold
        delete this.config[i].averageToMatchThreshold
        delete this.config[i].avgMatchCCode
        delete this.config[i].fieldsDetails
        delete this.config[i].highMatchCCode
        delete this.config[i].highMatchThreshold
        delete this.config[i].inquiredApplicationFields
        delete this.config[i].lowMatchCCode
        delete this.config[i].lowMatchThreshold
        delete this.config[i].matchedTableFields
        delete this.config[i].tableName
        delete this.config[i].tablePriority
      }
      console.log(this.config[i].configurationMultiple)
      for(let j=0;j<this.config[i].configurationMultiple.length;j++){
        console.log(this.config[i].configurationMultiple[j].fieldsDetails)    
      }
    }
    console.log(this.config)
    this.closCaseManagerService.createRules(this.ruleName, this.ruleDescription, this.stage, this.config).subscribe(
      res => {
        this.showNotification('success', 'Saved successfully');
        this.onCloseClick();
      },
      err => {
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
  }

  checkArray: any[] = []
  // View Rule
  viewRules() {
    this.configService.ViewRules(this.data).subscribe(
      res => {
        this.config = res['configurations'];
        // Initialize an array to store the extracted fields
        const extractedFields = [];
        // Loop through the configurations
        for (const config of this.config) {
          if (config.multipleTable && config.configurationMultiple.length > 0) {
            for (const subConfig of config.configurationMultiple) {
              for (const fieldDetail of subConfig.fieldsDetails) {
                extractedFields.push(fieldDetail);
              }
            }
          }
        }
        this.variables = res;
        this.ruleName = this.variables.name;
        this.ruleDescription = this.variables.description;
        this.stage = this.variables.executionStage;
        this.highThreshold = this.variables.highMatchThreshold;
        this.avgFromThreshold = this.variables.averageFromMatchThreshold;
        this.avgToThreshold = this.variables.averageToMatchThreshold;
        this.lowThreshold = this.variables.lowMatchThreshold;
        this.status = this.variables.activeStatus;
        this.config.forEach(data => {
          if (data.highMatchCCode) {
            data.highMatchCCode = '#' + data.highMatchCCode;
          }
          if (data.avgMatchCCode) {
            data.avgMatchCCode = '#' + data.avgMatchCCode;
          }
          if (data.lowMatchCCode) {
            data.lowMatchCCode = '#' + data.lowMatchCCode;
          }
        })

        for (let item of this.config) {
          for (let i = 0; i < item.fieldsDetails.length; i++) {
            this.choseClr = item.fieldsDetails[i].chosenColor.replace('#', '');
            item.fieldsDetails[i].chosenColor = this.choseClr;
          }
        }
        for (let i = 0; i < this.config.length; i++) {
          this.getInquireDrpdwn('', i);
          this.getMatchDrpdwn('', this.config[i].tableName, i);
          for (let j = 0; j < this.config[i].fieldsDetails.length; j++) {
            this.getAppDrpdwn('', i, j)
            this.getDbDrpdwn('', this.config[i].tableName, i, j);
          }
        }
        for (let i = 0; i < this.config.length; i++) {
          if(this.config[i].multipleTable == true){
            for (let j = 0; j < this.config[i].configurationMultiple.length; j++) {
              this.getInquireDrpdwn('', j);
              this.getMatchDrpdwn('', this.config[i].configurationMultiple[j].tableName, j);
              for(let k = 0;k < this.config[i].configurationMultiple[j].fieldsDetails.length; k++){
                this.getAppDrpdwns('',i, j, k)
                this.getDbDrpdwns('', this.config[i].configurationMultiple[j].tableName,i, j, k);
              }
            }
          }
        }
      },
      err => {
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
  }

  // Update Rules
  updateRules() {
    for (let item of this.config) {
      this.getDbDrpdwn('', item.tableName);
      for (let i = 0; i < item.fieldsDetails.length; i++) {
        this.choseClr = item.fieldsDetails[i].chosenColor.replace('#', '');
        item.fieldsDetails[i].chosenColor = this.choseClr;
      }
    }
    if (this.status == undefined) {
      this.status = false;
    }
    this.config.forEach(data => {
      if (data.highMatchCCode) {
        data.highMatchCCode = data.highMatchCCode.replace('#', '');
      }
      if (data.avgMatchCCode) {
        data.avgMatchCCode = data.avgMatchCCode.replace('#', '');
      }
      if (data.lowMatchCCode) {
        data.lowMatchCCode = data.lowMatchCCode.replace('#', '');
      }
    });
    for(let i=0;i<this.config.length;i++){
      if(this.config[i].multipleTable == true){
        delete this.config[i].tableName
        delete this.config[i].averageFromMatchThreshold
        delete this.config[i].averageToMatchThreshold
        delete this.config[i].avgMatchCCode
        delete this.config[i].fieldsDetails
        delete this.config[i].highMatchCCode
        delete this.config[i].highMatchThreshold
        delete this.config[i].inquiredApplicationFields
        delete this.config[i].lowMatchCCode
        delete this.config[i].lowMatchThreshold
        delete this.config[i].matchedTableFields
        delete this.config[i].tableName
        delete this.config[i].tablePriority
      }
    }
    this.configService.updateRules(this.ruleName, this.ruleDescription, this.data, this.stage, this.config).subscribe(
      res => {
        this.showNotification('success', 'Updated successfully');
        this.onCloseClick();
      },
      err => {
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
  }

  // color change
  colorChange(color, name) {
    let changedColor = name.chosenColor.substring(1);
    name.chosenColor = changedColor;
  }

  // Table Dropdown
  getTable(keyword) {
    this.closCaseManagerService.getTable(keyword?.toUpperCase(), this.page, this.pageSize, this.DatabaseConfig).subscribe(
      res => {
        this.tableDrpdwn = res;
        // let configDetail = [];
        this.tableDrpdwn.forEach(element => 
          this.configDetail.push(
            {
              "tableName": element,
              "tablePriority": '',
              "fieldsDetails": [],
              "inquiredApplicationFields": [],
              "matchedTableFields": []
            }
          )
          );
      }
    )
  }

  charField(data, event, data2) {
    if (event.source._selected == true) {
      if (event.isUserInput == true) {
        data2.push(data)
      }
    } else {
      data2.pop()
    }
  }

  tableField(data, event, data2) {
    if (event.source._selected == true) {
      if (event.isUserInput == true) {
        data2.push(data)
      }
    } else {
      data2.pop()
    }
  }

  // Table Fields Dropdown
  getDbDrpdwn(keyword, tableName, i?: any, j?: any, select?: any) {
    console.log(i,j)
    if (!this.dbDropdown[i]) {
      this.dbDropdown[i] = [];
    }
    if (!this.dbDropdown[i][j]) {
      this.dbDropdown[i][j] = [];
    }
    if (!this.dbDropdown1[i]) {
      this.dbDropdown1[i] = [];
    }
    if (!this.dbDropdown1[i][j]) {
      this.dbDropdown1[i][j] = [];
    }
    this.dbDropdown1[i][j] = select;
    this.closCaseManagerService.getFields(tableName, keyword, this.page, this.pageSize, this.DatabaseConfig).subscribe(
      res => {
        this.dbDropdown[i][j] = res['data'];
      }
    )
  }

  // Table Fields Dropdown
  getDbDrpdwns(keyword, tableName, i?: any, j?: any,k?:any,select?:any) {
    this.closCaseManagerService.getFields(tableName, keyword, this.page, this.pageSize, this.DatabaseConfig).subscribe(
      res => {
        if (!this.dbDropdowns[i]) {
          this.dbDropdowns[i] = [];
        }
        if (!this.dbDropdowns[i][j]) {
          this.dbDropdowns[i][j] = [];
        }
        this.dbDropdowns[i][j][k] = res['data'];
      }
    )
  }

  // Application Fields Dropdown
  getAppDrpdwns(keyword: string, i?: number, j?: number,k?:any, select?: any) {
    this.closCaseManagerService.getAppField(keyword, this.page, this.pageSize).subscribe(
      res => {
        if (!this.appDropdowns[i]) {
          this.appDropdowns[i] = [];
        }
        if (!this.appDropdowns[i][j]) {
          this.appDropdowns[i][j] = [];
        }
        this.appDropdowns[i][j][k] = res;
      }
    );
  }

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  previousSelectedIndex: number = 0;

  ngAfterViewInit() {
    // Initialize the previousSelectedIndex with the initial selected index
    this.previousSelectedIndex = this.tabGroup.selectedIndex;
  }

  onTabSelectionChange(event: MatTabChangeEvent) {
    // Store the previous selected index before changing it
    this.previousSelectedIndex = event.index;
  }

  onCloseClick() {
    this.dialogRef.close();
    const channel = new BroadcastChannel('close');
    channel.postMessage('close');
  }

  getCurrentSelectedIndex() {
    const selectedIndex = this.tabGroup.selectedIndex;
  }

  // While changing the Table Name set other fields as empty
  condition(data) {
    data.inquiredApplicationFields = [];
    data.matchedTableFields = [];
    for (let name of data.fieldsDetails) {
      name.tableFields = [];
      name.doHighlight = false;
      name.chosenColor = '';
      name.characters = [];
      name.chosenAlgorithm = [];
      name.applicationFields = [];
    }
  }

  buttonDisable(): boolean {
    return (
      !this.ruleName ||
      !this.ruleDescription  ||
      !this.stage
    );
  }

  // Application Fields Dropdown
  getAppDrpdwn(keyword: string, i?: number, j?: number, select?: any) {
    console.log(i, j);
    if (!this.appDropdown[i]) {
      this.appDropdown[i] = [];
    }
    if (!this.appDropdown[i][j]) {
      this.appDropdown[i][j] = [];
    }
    if (!this.appDropdown2[i]) {
      this.appDropdown2[i] = [];
    }
    if (!this.appDropdown2[i][j]) {
      this.appDropdown2[i][j] = [];
    }
    this.appDropdown2[i][j] = select;
    this.closCaseManagerService.getAppField(keyword, this.page, this.pageSize).subscribe(
      res => {
        this.appDropdown[i][j] = res;
      }
    );
  }

  // Stage Dropdown
  getStage() {
    this.closCaseManagerService.stage().subscribe(
      res => {
        this.stageDropdown = res;
      }
    )
  }

  // Inquire Fields Dropdown
  getInquireDrpdwn(keyword, i?: number, name?: any) {
    this.inquireDropdown2[i] = name;
    this.inquireDropdown[i] = [];
    this.closCaseManagerService.getAppField(keyword, this.page, this.pageSize).subscribe(
      res => {
        this.inquireDropdown[i] = res;
      }
    )
  }

  // Match Fields Dropdown
  getMatchDrpdwn(keyword, table, i?: number, name?: any) {
    this.matchDropdown2[i] = name;
    this.matchDropdown[i] = [];
    this.closCaseManagerService.getFields(table, keyword, this.page, this.pageSize, this.DatabaseConfig).subscribe(
      res => {
        this.matchDropdown[i] = res['data'];
      }
    )
  }

  // ALGORITHM DROPDOWN API
  getAlgDrpdwn() {
    this.closCaseManagerService.algDrpdwn().subscribe(
      res => {
        this.algorithm = res as String[];
        this.algorithm = this.generateOptionsArray(this.algorithm);
      }
    )
  }

  // DYNAMIC OBJECT CREATION FOR ALGORITHM MAT OPTION FOR ALL THE TABLE
  generateOptionsArray(response: string[]): any[] {
    return response.map((value) => ({
      value: value,
      displayValue: value.replace(/_/g, ' '),
    }));
  }

  multiples() {
    this.configure.multipleTable = false;
  }

  addRoute(route) {
    route.push({
      chosenPriorityLevel: '',
      result: '',
      routingPriority: 0
    })
  }

  removeRoute(route,l) {
   route.splice(l,1)
  }

  changeMultiple(i) {
   this.config[i].configurationMultiple.push({
    fieldsDetails: [({
      applicationFields: [],
      averageFromMatchThreshold: null,
      averageToMatchThreshold: null,
      avgMatchCCode: null,
      characters: [],
      chosenAlgorithm: '',
      chosenColor: '',
      doHighlight: false,
      fieldPriority: 0,
      highMatchCCode: null,
      highMatchThreshold: null,
      lowMatchCCode: null,
      lowMatchThreshold: null,
      routingResultsAndPriority: [({
        result: null,
        chosenPriorityLevel: null,
        routingPriority: 0
      })],
      tableFields: []
    })],
    tableName: null,
    tablePriority: 0,
    inquiredApplicationFields: [],
    matchedTableFields: []
   })
  }

  addFieldMultiple(item,j){
   item.configurationMultiple[j].fieldsDetails.push({
        tableFields: [],
        characters: [],
        applicationFields: [],
        doHighlight: false,
        chosenColor: '',
        chosenAlgorithm: '',
        routingResultsAndPriority: [({
          result: null,
          chosenPriorityLevel: null,
          routingPriority: 0
        })]
   })
  }

  // Remove Field
  removeMultiple(i: number, j: number,item) {
    item.configurationMultiple[i].fieldsDetails.splice(j, 1);
  }

  tablename(item){
    for(let j=0;j<item.configurationMultiple.length;j++){
      item.configurationMultiple[j].fieldsDetails = [];
        this.configDetail.push(
          {
            "tableName": item.configurationMultiple[j].tableName,
            "tablePriority": item.configurationMultiple[j].tablePriority,
            "fieldsDetails": item.configurationMultiple[j].fieldsDetails.push({
              tableFields: [],
              characters: [],
              applicationFields: [],
              doHighlight: false,
              chosenColor: '',
              chosenAlgorithm: [],
              routingResultsAndPriority: [({
                result: null,
                chosenPriorityLevel: null,
                routingPriority: 0
              })]
            }),
            "inquiredApplicationFields": item.configurationMultiple[j].inquiredApplicationFields,
            "matchedTableFields": item.configurationMultiple[j].matchedTableFields
          }
        )
    }
  }

  configs(item){
    if(item.length == 0){
      item.push({
        fieldsDetails: [],
        tableName: null,
        tablePriority: 0
       })
    }
  }
}
