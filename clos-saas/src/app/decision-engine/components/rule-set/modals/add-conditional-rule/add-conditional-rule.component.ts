import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, HostListener, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DatabaseConfig } from 'src/app/decision-engine/models/DatabaseConfig';
import { Datatype, ObjectModel } from 'src/app/decision-engine/models/ObjectModel';
import { DatabaseModelService } from 'src/app/decision-engine/services/database-model.service';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { ObjectModelService } from 'src/app/decision-engine/services/Object-model.service';
import { WizardserviceService } from 'src/app/flow-manager/components/flow-manager/modals/import-export-wizard/service/wizardservice.service';
import { ProjectIdService } from '../../../query-variable/services/project-id.service';
import { Rules, Actions, Conditions, RulesValueTree } from '../../models/rulesetmodels';
import { FunctionService } from '../../services/function.service';

@Component({
  selector: 'app-add-conditional-rule',
  templateUrl: './add-conditional-rule.component.html',
  styleUrls: ['./add-conditional-rule.component.scss']
})
export class AddConditionalRuleComponent implements OnInit {

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  options: any[] = ['value', 'function']
  parameterData: Datatype[] = [];
  rules: Rules;
  conditions: Conditions;
  actions: Actions;
  actionData: Actions[] = [];
  conditionData: Conditions[] = [];
  selectedParam: Datatype[] = [];
  symbols: any[] = [{ name: "equal to", value: "==", disable: false }, { name: "not equal to", value: "!=", disable: false },
  { name: "greater than or equal to", value: ">=", disable: true }, { name: "less than or equal to", value: "<=", disable: true },
  { name: "greater than", value: ">", disable: true }, { name: "less than", value: "<", disable: true }, { name: "between", value: "..", disable: true },
  { name: "index range", value: "....", disable: false }];
  selectedNodeName: string = '';
  inputData: any[] = [];
  outputData: any[] = [];
  id: number = null as any;
  projectId: number = null as any;
  params: Datatype[] = [];
  objectModel: ObjectModel[] = [];
  conditionChecked: string[] = [];
  actionChecked: string[] = [];
  tabChangeIndex: number = 0;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 3;
  master_indeterminate: boolean = false;
  master_checked: boolean = false;
  ruleParams: any[] = []
  treeControl = new NestedTreeControl<RulesValueTree>(node => node.children);
  dataSource = new MatTreeNestedDataSource<RulesValueTree>();
  ruleData: RulesValueTree[] = [];
  functionsList: any;
  isDirty: boolean = false;
  keyword: string = '';
  objModelKey: string = '';
  input1: any;
  input2: any;
  input3: any;
  from: any;
  to: any;
  index: any;
  indexValue: any;
  objName: any;
  loading: boolean = false;
  temp: any;
  temp2: any;
  objModelList: any;
  actionSearchKey: string = '';
  actionobjModel: any;
  saveUpdate: boolean;
  checkedItems: string[] = [];
  checkedItems2: string[] = [];
  modelMode: string;
  DatabaseName: string;
  dataBaselist: any;
  tablelist: any;
  isPanelOpen: boolean[] = [];
  dbConditionChecked: string[] = [];
  actionConditionChecked: string[] = [];
  inputDbData: any[] = [];
  inputActionData: any[] = [];
  FieldsList: { [key: string]: any[] } = {};
  pageSize = 5;
  page = 1;
  totalPageCount = 27;
  tableName: any;
  openedPanelIndex: number = -1;
  selectedTables: string[] = ['LOS_ACTION_LIST', 'LOS_ADMIN_ACCESS_ITEMS', 'LOS_ADMIN_ACCESS_TEMPLATE', 'LOS_ADMIN_DOWNLOAD_JOBS', 'LOS_ADMIN_FIELD_MATCH',
    'LOS_ADMIN_ROLES', 'LOS_ADMIN_ROLE_ACCESS_TEMPLATE', 'LOS_ADMIN_ROLE_ACCESS_TEMPLATES', 'LOS_ADMIN_ROLE_TEMPLATES', 'LOS_ADMIN_SELECT_QUERY_BUILDER'];
  searchTableName: string;
  filteredTablelist: string[] = [];
  selectedAll = false;
  @ViewChild('selectAll') selectAll: MatSelect;

  constructor(
    private url: UrlService,
    private selectedProject: ProjectIdService,
    private wizardService: WizardserviceService,
    private objectModelService: ObjectModelService,
    private functionService: FunctionService,
    private databaseConfigService: DatabaseModelService,
    public dialogRef: MatDialogRef<AddConditionalRuleComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    // this.modelMode = 'Object Model';
    // this.DatabaseName =  'TSLOAN';
  }
  hasChild = (_: number, node: RulesValueTree) => !!node.children && node.children.length > 0;

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
    this.projectId = this.selectedProject.selectedProjectId;
    if (this.data.choosemode == 'Database') {
      this.modelMode = 'Database';
      this.getDatabaseName();
    } else {
      this.modelMode = 'Object Model';
      this.getVariables();
      this.getFunctionsList();
    }
    if (this.data.conditions) {
      this.data.conditions.forEach((element: any) => {
        this.temp = element.name + ' - ' + element.type;
        this.conditionChecked.push(this.temp)
        this.checkedItems.push(this.temp);
      });
      this.inputData = this.data.conditions
      this.inputDbData = this.data.conditions
      this.conditionData = this.data.conditions
      for (let input of this.inputDbData) {
        console.log(input)
      }
      for (let i = 0; i < this.data.conditions.length; i++) {
        if (this.data.conditions[i].operator == '....') {
          let temp = this.data.conditions[i].operand?.split('..');
          this.from = temp[0];
          this.to = temp[1];
          this.index = temp[2];
        }
      }
    }
    else {
      this.conditionData = this.conditionData
      this.inputData = this.inputData
      this.inputData = this.inputDbData
    }
    if (this.data.action) {
      this.data.action.forEach((element: any) => {
        this.temp2 = element.name + ' - ' + element.type;
        this.actionChecked.push(this.temp2)
        this.checkedItems2.push(this.temp2);
      });
      this.actionData = this.data.action
      this.outputData = this.data.action
      this.inputActionData = this.data.action
    }
    if (this.data.saveUpdateChange) {
      this.saveUpdate = true;
    } else if (!this.data.saveUpdateChange) {
      this.saveUpdate = false;
    }
  }
  getFunctionsList() {
    this.functionService.getFunctionsList(this.selectedProject.selectedProjectId).subscribe(
      (res: any) => {
        this.functionsList = res;
      }
    )
  }

  // getCheckedParams(){
  // this.selectedParam=this.params.filter(param=>param.checked==true)
  // this.refreshRuleData(this.selectedParam)
  // console.log( this.selectedParam)
  // }
  // refreshRuleData(param:any[]) {
  //   this.ruleData = []; 
  //   param.forEach(e => {
  //     let parameterName = e.name + " - " + e.type;
  //     if (e.children) {
  //       e.children.forEach((e: { paramName: string; name: string; type: string; }) => {
  //         e.paramName = e.name + " - " + e.type;
  //       }
  //       )
  //     }
  //     let temp = [];
  //     this.ruleData.push(
  //       {
  //         name: parameterName,
  //         children: e.children,
  //       }
  //     )
  //   });
  //   this.dataSource.data = this.ruleData;

  // }
  // getDefaultObject() {
  //   this.objectModelService.getDefaultObjectModel(this.projectId).subscribe(
  //     res => {
  //       let children = res[0].schema.children;
  //       this.params = children;
  //       if(this.data.parameter){
  //         this.parameterData=this.data.parameter; 
  //         console.log(this.params)
  //         if(this.params.length==this.parameterData.length){
  //           this.master_checked=true
  //         }
  //         else{
  //           this.master_indeterminate=true
  //         }
  //          for(let i=0;i<this.params.length;i++){
  //            for(let i=0;i<this.parameterData.length;i++){
  //              if(this.params[i].name==this.parameterData[i].name){
  //                this.params[i].checked=true
  //              }
  //            }
  //          }
  //       }  
  //       else if(!this.data.parameter){        
  //       this.getCheckedParams()
  //       } 

  //     },
  //     (err)=>{
  //       this.showNotification('error','Oops! Something Went Wrong.')
  //     }
  //   )
  // }
  //To get default object model for selected project
  // getSearch(){
  //   this.serviceService.getSearchFunction(this.keyword).subscribe(
  //     res=>{
  //       let children = res['data'];
  //       this.treeCreation(children)
  //     }
  //   )
  // }
  //To create mat tree using selected parameter
  // treeCreation(params: any[]) {
  //   params.forEach(param => {
  //     if(this.keyword == ''){
  //     this.ruleData.push({ name: param.name, children: param.children})
  //     }
  //     else{
  //       this.ruleData = params;       
  //     }
  //   })
  //   console.log(this.ruleData)
  //   this.dataSource.data = this.ruleData;
  // }

  // showNotification(type: string, message: string) {
  //   this.notifierService.notify(type, message);
  // }


  saveParams() {
    console.log(this.modelMode)
    for (let input of this.inputData) {
      if (input.operator == '..') {
        input.operand = this.input3;
        console.log(input.operand)
      }
      if (input.operator == '....') {
        input.operand = this.indexValue;
        console.log(input.operand)
      }
    }
    this.outputData.forEach((element: any) => {
      if (element.choosen == "function") {
        console.log("NNN")
        this.functionsList.forEach((ele: any) => {
          console.log(element)

          if (ele.id == element.function) {
            element.config = ele
          }
        });
      }
    })
    console.log(this.inputDbData)
    console.log(this.inputActionData)
    const dbInput = this.inputDbData.map(data => ({
      name: data.name,
      type: data.type,
      operator: data.operator,
      operand: data.operand
    }));
    const actionInput = this.inputActionData.map(data => ({
      name: data.name,
      type: data.type,
      operand: data.operand,
      choosen: 'value'
    }));
    console.log(dbInput, actionInput)
    if (this.modelMode == 'Database') {
      this.ruleParams.push({ "condition": dbInput, "action": actionInput, "parameters": this.selectedParam, "changes": this.isDirty, "choosemode": this.modelMode })
    }
    if (this.modelMode == 'Object Model') {
      this.ruleParams.push({ "condition": this.conditionData, "action": this.outputData, "parameters": this.selectedParam, "changes": this.isDirty, "choosemode": this.modelMode })
    }
    this.dialogRef.close(this.ruleParams);


  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    this.tabChangeIndex = tabChangeEvent.index
  }

  nextStep() {
    if (this.selectedIndex != this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
    console.log(this.selectedIndex);
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
    console.log(this.selectedIndex);
  }
  // selectedInputNode(nodeName: any, name: any, e: any) {
  //   if (!e.checked) {
  //     this.conditionChecked.forEach(e => {
  //       if (e == name) {
  //         let index = this.conditionChecked.indexOf(e);
  //         this.conditionChecked.splice(index, 1)
  //       }
  //     })
  //     this.conditionData.forEach(e => {
  //       if (e['name'] == nodeName['name']) {
  //         let i = this.conditionData.indexOf(e);
  //         this.conditionData.splice(i, 1);
  //       }
  //     })
  //     if (this.conditionData) {
  //       this.inputData = this.conditionData;
  //     }
  //   } else {
  //     this.conditions = new Conditions()
  //     this.conditions.name = nodeName.name
  //     this.conditions.type = nodeName.type
  //     this.conditionData.push(this.conditions)
  //     this.conditionChecked.push(name)
  //     if (this.conditionData) {
  //       this.inputData = this.conditionData;
  //     }
  //     if (this.conditionData.length > 1) {
  //       for (let i = 1; i < this.conditionData.length; i++) {
  //         if (this.conditionData[i].logical_operator != true) {
  //           this.conditionData[i].logical_operator = false
  //         }
  //       }
  //     }
  //   }
  // }
  // selectedOutputNode(nodeName: any, name: any, e: any) {
  //   if (!e.checked) {
  //     this.actionChecked.forEach(e => {
  //       if (e == name) {
  //         let index = this.actionChecked.indexOf(e);
  //         this.actionChecked.splice(index, 1)
  //       }
  //     })
  //     this.actionData.forEach(e => {
  //       if (e['name'] == nodeName['name']) {
  //         let i = this.actionData.indexOf(e);
  //         this.actionData.splice(i, 1);
  //       }
  //     })
  //     if (this.actionData) {
  //       this.outputData = this.actionData;
  //   console.log("output",this.isDirty)
  // }

  //   } else {
  //     this.actions = new Actions()
  //     this.actions.name = nodeName.name
  //     this.actions.type = nodeName.type
  //     this.actions.choosen = "value"

  //     this.actionData.push(this.actions)
  //     console.log(this.actionData)
  //     this.actionChecked.push(name)
  //     if (this.actionData) {
  //       this.outputData = this.actionData;
  //     }
  //   }
  // }
  master_change() {
    for (let value of Object.values(this.params)) {
      value.checked = this.master_checked;
    }
  }
  list_change() {
    let checked_count = 0;
    for (let value of Object.values(this.params)) {
      if (value.checked)
        checked_count++;
    }
    if (checked_count > 0 && checked_count < this.params.length) {
      this.master_indeterminate = true;
    } else if (checked_count == this.params.length) {
      this.master_indeterminate = false;
      this.master_checked = true;
    } else {
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }

  detectChange() {
    console.log("entered", this.inputData)
    this.input3 = this.input1 + '..' + this.input2;
    this.isDirty = true
  }

  detectChange2() {
    console.log("entered", this.inputData)
    this.indexValue = this.from + '..' + this.to + '..' + this.index;
    this.isDirty = true
  }

  //Get Object Model
  getVariables() {
    this.loading = true;
    // this.serviceService.getSearchFunction(this.keyword).subscribe(
    // res=>{
    //   this.loading = false;
    //   console.log('objName',res['data'])
    //  this.objName = res['data']
    // })
    this.objectModelService.getDefaultObjectModel().subscribe(res => {
      this.loading = false;
      this.objModelList = res[0].schema.children;
      this.searchObjModel();
      this.actionSearch();
    })
  }

  searchObjModel() {
    if (!this.objModelKey) {
      this.objName = this.objModelList;
      return this.objName;
    } else {
      const searchKey = this.objModelKey.toLowerCase();
      this.wizardService.objectTypeSearch(searchKey).subscribe(res => {
        this.objName = this.objModelList.filter(item => {
          const hasMatchingChild = item.children.some(child => {
            const childNameLower = child.name.toLowerCase();
            return childNameLower.includes(searchKey);
          });
          item.panelOpenState = hasMatchingChild;
          return hasMatchingChild;
        });
      });
    }
  }

  // CHOOSE TABLE -> NGX MAT SELECT SEARCH FILTER FUNCTION
  onTableFilter() {
    if (this.searchTableName) {
      const filteredTables = this.tablelist.filter(table => table.toLowerCase().includes(this.searchTableName.toLowerCase()));
      this.filteredTablelist = filteredTables;
    } else {
      this.filteredTablelist = this.tablelist;
    }
  }

  actionSearch() {
    if (!this.actionSearchKey) {
      this.actionobjModel = this.objModelList;
      return this.actionobjModel
    } else {
      const searchKey = this.actionSearchKey.toLowerCase();
      this.wizardService.objectTypeSearch(searchKey).subscribe(res => {
        this.actionobjModel = this.objModelList.filter(item => {
          const hasMatchingChild = item.children.some(child => {
            const childNameLower = child.name.toLowerCase();
            return childNameLower.includes(searchKey);
          });
          item.panelOpenState = hasMatchingChild;
          return hasMatchingChild;
        });
      });
    }
  }

  //Conditional Variable
  selectedInputNode(nodeName: any, name: any, nodeType: any, e: any) {
    let type = nodeName.split('- ');
    let type1 = type[0];
    let type2 = nodeType;
    if (!e.checked) {
      this.conditionChecked.forEach(e => {
        if (e == name) {
          let index = this.conditionChecked.indexOf(e);
          this.conditionChecked.splice(index, 1)
        }
      })
      this.conditionData.forEach(e => {
        if (e['name'] == type1) {
          let i = this.conditionData.indexOf(e);
          this.conditionData.splice(i, 1);
        }
      })
      if (this.conditionData) {
        this.inputData = this.conditionData;
      }
    } else {
      this.conditions = new Conditions()
      this.conditions.name = type1;
      this.conditions.type = type2;
      this.conditionData.push(this.conditions)
      this.conditionChecked.push(name)
      if (this.conditionData) {
        this.inputData = this.conditionData;
      }
      if (this.conditionData.length > 1) {
        for (let i = 1; i < this.conditionData.length; i++) {
          if (this.conditionData[i].logical_operator != true) {
            this.conditionData[i].logical_operator = false
          }
        }
      }
    }
  }

  //Action Variable
  selectedOutputNode(nodeName: any, name: any, nodeType: any, e: any) {
    let type = nodeName.split('- ');
    let type1 = type[0];
    let type2 = nodeType;
    if (!e.checked) {
      this.actionChecked.forEach(e => {
        if (e == name) {
          let index = this.actionChecked.indexOf(e);
          this.actionChecked.splice(index, 1)
        }
      })
      this.actionData.forEach(e => {
        if (e['name'] == type1) {
          let i = this.actionData.indexOf(e);
          this.actionData.splice(i, 1);
        }
      })
      if (this.actionData) {
        this.outputData = this.actionData;
        console.log("output", this.isDirty)
      }

    } else {
      this.actions = new Actions()
      this.actions.name = type1;
      this.actions.type = type2;
      this.actions.choosen = "value"

      this.actionData.push(this.actions)
      console.log(this.actionData)
      this.actionChecked.push(name)
      if (this.actionData) {
        this.outputData = this.actionData;
      }
    }
  }

  //get database
  getDatabaseName() {
    if (this.modelMode == 'Database') {
      this.databaseConfigService.getDatabaseName().subscribe(
        (res) => {
          console.log("Config Service ", res);
          this.dataBaselist = res;
          this.DatabaseName = this.dataBaselist[0]
          this.getTableListByDatabaseName(this.DatabaseName)
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  //get table list by database name
  getTableListByDatabaseName(database: string) {
    console.log('get dataBasename', database)
    let tableConfig = new DatabaseConfig();
    tableConfig.dbName = database;
    this.databaseConfigService.getTableName(tableConfig).subscribe(
      (res) => {
        this.tablelist = res;
        this.filteredTablelist = this.tablelist;
      },
      (err) => {
        console.log("Err Response ", err);
      }
    )
  }

  getPanelvalue(item: any, index: number) {
    this.openedPanelIndex = index;
    const tableName = item;
    if (!this.FieldsList[tableName]) {
      this.getFieldnameByTabalename(tableName, 1);
    }
  }

  getFieldnameByTabalename(tableName: string, pageIndex: number) {
    console.log('get tablename', tableName);
    this.loading = true;
    let tableConfig = new DatabaseConfig();
    tableConfig.dbName = this.DatabaseName;
    tableConfig.tableName = tableName;
    this.databaseConfigService.getFieldName(pageIndex, this.pageSize, tableConfig).subscribe(
      (res: any) => {
        if (!this.FieldsList[tableName]) {
          this.FieldsList[tableName] = [];
        }
        this.FieldsList[tableName] = [...this.FieldsList[tableName], ...res['fields']];
        this.totalPageCount = res['total_pages'];
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const container = event.target;
    const atBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    const currentTableName = this.tablelist[this.openedPanelIndex];

    if (atBottom && !this.loading && this.page <= this.totalPageCount) {
      this.getFieldnameByTabalename(currentTableName, this.page);
      this.page++;
    }
  }

  actionCondition(fields, e) {
    if (e.checked) {
      this.actionConditionChecked.push(fields);
      const convertedArray = this.actionConditionChecked.flatMap(item => {
        if (Array.isArray(item)) {
          const [name, type, operator, operand] = item;
          return { name, type, operator, operand };
        } else {
          return item;
        }
      });
      this.inputActionData.push(...convertedArray);
      this.actionConditionChecked = [];
    } else {
      const firstIndexValue = fields[0];
      const indexToRemove = this.inputActionData.findIndex(item => item.name === firstIndexValue);
      if (indexToRemove !== -1) {
        this.inputActionData.splice(indexToRemove, 1);
      }
    }
  }

  findFieldIndexAction(fields: string[]): number {
    return this.actionConditionChecked.findIndex(field => field[0] === fields[0] && field[1] === fields[1]);
  }

  isFieldCheckedAction(fields: string[]): boolean {
    return this.actionConditionChecked.some(field => field[0] === fields[0] && field[1] === fields[1]);
  }

  databaseCondition(fields, e) {
    if (e.checked) {
      this.dbConditionChecked.push(fields);
      const convertedArray = this.dbConditionChecked.flatMap(item => {
        if (Array.isArray(item)) {
          const [name, type, operator, operand] = item;
          return { name, type, operator, operand };
        } else {
          return item;
        }
      });
      this.inputDbData.push(...convertedArray);
      this.dbConditionChecked = [];
    } else {
      const firstIndexValue = fields[0];
      const indexToRemove = this.inputDbData.findIndex(item => item.name === firstIndexValue);
      if (indexToRemove !== -1) {
        this.inputDbData.splice(indexToRemove, 1);
      }
    }  
  }

  findFieldIndex(fields: string[]): number {
    return this.dbConditionChecked.findIndex(field => field[0] === fields[0] && field[1] === fields[1]);
  }

  isFieldChecked(fields: string[]): boolean {
    return this.dbConditionChecked.some(field => field[0] === fields[0] && field[1] === fields[1]);
  }

  // for type integer
  onKeyPress(event: KeyboardEvent) {
    const allowedCharacters = /[0-9,]/;
    const inputChar = event.key;
    if (!allowedCharacters.test(inputChar)) {
      event.preventDefault();
    }
  }

  // for type string
  onKeyPress1(event: KeyboardEvent) {
    const isLetter = /^[a-zA-Z]+$/;
    const inputChar = event.key;
    if (!isLetter.test(inputChar)) {
      event.preventDefault();
    }
  }

  // for type decimal
  onKeyPress2(event: KeyboardEvent) {
    const allowedCharacters = /[0-9,.]/;
    const inputChar = event.key;
    if (!allowedCharacters.test(inputChar)) {
      event.preventDefault();
    }
  }

  toggleAll() {
    console.log(this.selectedTables, 'asdf')
    if (this.selectedAll) {
      this.selectAll.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectAll.options.forEach((item: MatOption) => item.deselect());
    }
  }
}