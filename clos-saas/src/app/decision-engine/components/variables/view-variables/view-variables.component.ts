import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Datatype } from 'src/app/decision-engine/models/ObjectModel';
import { ObjectModelService } from 'src/app/decision-engine/services/Object-model.service';
import { UrlService } from '../../../services/http/url.service';
import { ProjectIdService } from '../../query-variable/services/project-id.service';
import { Others, Variables, ActionVariable, scoreDecisionData, naLogicData, ActionDataVariable, allVariableData, VarConfigData, VarData, DateVarData, LogicVarData, DivideVarData, GrpByVarData, SplitVarData } from '../models/variable-models';
import { DecisionTablesService } from '../../../services/decision-tables.service';
import { QueryvariableService } from '../../query-variable/services/queryvariable.service';
import { VariablesService } from '../services/variables.service';
import { AccessControlData } from 'src/app/app.access';
export class Config {
  tableName: any;
  name: string;
  configMethod: ConfigMethod[];
}
export class ConfigMethod {
  name: string;
  input: string;
  output: string[];
  //UI use
  groupCol?: string;
  filterSymbol?: string;
  filterValue?: string;
  calcValue?: string;
}
export class ResultConfig {
  tableName: string;
  id?: number;
  varName: string;
  groupBy: string[];
  columnFilter: string[];
  rowFilter: string[];
  calc: string;
}
@Component({
  selector: 'app-view-variables',
  templateUrl: './view-variables.component.html',
  styleUrls: ['./view-variables.component.scss']
})
export class ViewVariablesComponent implements OnInit {
  selectedDbName: string;
  tableNames: any
  denominator: string = 'Denominator';
  numerator: string = 'Numerator';
  responseArray: any;
  decisionTableDropdown: any;
  dateChose = ['Days', 'Month', 'Year'];
  logicToChose = ['Sum', 'Divide', 'Multiply', 'Date Difference', 'N/A Logic', 'Group By', 'Max Date Difference', 'Split', 'Concat'];
  id: number = null as any;
  variableData: any = new Variables();
  pythonCode: Others = new Others();
  variableFields: any;
  loading: boolean = false;
  noAccess: boolean = false;
  configure: ConfigMethod[];
  configData: Config[] = [
    {
      "tableName": "",
      "name": "",
      "configMethod": [

        {
          "name": "groupBy",
          "input": "",
          "output": []
        },
        {
          "name": "columnFilter",
          "input": "",
          "output": []
        },
        {
          "name": "rowFilter",
          "input": "",
          "output": []
        },

        {
          "name": "calc",
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
  calcArray: string[] = ["aggregate", "transform"];
  filterSymbols: string[] = ["=", "!=", ">", "<", ">=", "<="];
  calcValues: string[] = ["min", "max", "sum", "count", "percentage"];
  name: string = '';
  disableSave: boolean = false;
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
  toggleVarData: boolean = false;
  tableListName: any;
  variableList: any;
  actionVariable: ActionVariable[] = [];
  actionvariable: ActionVariable = new ActionVariable('', '', [], []);
  actionDataVariable: ActionDataVariable[] = [];
  sumVarData = new VarData(null, "", "", []);
  sumLayout = [];
  maxDateVarData = new VarData(null, "", "", []);
  maxDateLayout = [];
  concatVarData = new VarData(null, "", "", []);
  concatLayout = [];
  splitVarData = new SplitVarData(null, "", "", [], null);
  splitLayout = [];
  divideVarData = new DivideVarData(null, '', '', [], 'Numerator', '', '', [], 'Denominator');
  divideLayout = [];
  mulVarData = new VarData(null, "", "", []);
  mulLayout = [];
  dateDiffVarData = new DateVarData('', '', [], '');
  dateDiffLayout = [];
  groupbyVarData = new GrpByVarData('', [], [], [], '', '');
  groupbyLayout = [];
  naLogicVarData = new LogicVarData('', [], '', '');
  naLogicLayout = [];
  overallVariables: allVariableData = new allVariableData(null, "", "", '', '', []);
  commonDataVariable: VarConfigData[] = [];
  commonDataVariables: VarConfigData = new VarConfigData(null, '', '', '', this.sumLayout, this.divideLayout, this.mulLayout, this.dateDiffLayout, this.naLogicLayout, this.groupbyLayout, this.maxDateLayout, this.splitLayout, this.concatLayout);
  actionDataVariables: ActionDataVariable = new ActionDataVariable('', []);
  scoreDecisionData: scoreDecisionData[] = [];
  NaLogicDecisionData: naLogicData[] = [];
  tableField: any[] = [];
  tableField1: any[] = [];
  sampleArray: any[] = [];
  valueType: any;
  logicType: any;
  dataSource: any;
  logicList: any;
  emptyTableName: string;
  conditonalTableField: any[] = []; 3
  tabledropdown: any;
  searchKey: any;
  conditonalField: any[] = [];
  filteredFieldOptions1: any;
  tableSearch: any;
  denominatorSearch: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public queryService: QueryvariableService,
    private selectedProject: ProjectIdService,
    public variableService: VariablesService,
    private objectModelService: ObjectModelService,
    private notifierService: NotifierService,
    private url: UrlService,
    public ac: AccessControlData,
    private decisionTablesService: DecisionTablesService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.actionVariable.push(this.actionvariable)
    this.actionDataVariable.push(this.actionDataVariables)
    this.commonDataVariable.push(this.commonDataVariables)
    this.sumLayout.push(this.sumVarData)
    this.mulLayout.push(this.mulVarData)
    this.dateDiffLayout.push(this.dateDiffVarData)
    this.groupbyLayout.push(this.groupbyVarData)
    this.divideLayout.push(this.divideVarData)
    this.maxDateLayout.push(this.maxDateVarData)
    this.concatLayout.push(this.concatVarData)
    this.splitLayout.push(this.splitVarData)
    this.variableData.scoreDecColumn = 'Score_Decision'
    this.toggleData = true;
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
    this.onGetVariableDataById();
    this.getDefaultObject()
    this.getChooseLogic();
    this.scoreDecisionData.unshift({ tableName: '', scoreColumns: '', scoreCondition: 'Equal To', scoreValue: 0, score: '' });
    this.NaLogicDecisionData.unshift({ tableName: '', actionVariable: '', naCondition: '', naValue: '' });
    // this.scoreDecisionData.forEach(item => {item.scoreCondition = item.scoreCondition ? '' || 'none' : 'Equal To'});
    this.getDBNames();
  }

  getvalueType(type) {
    this.valueType = type;
    if (this.valueType != 'N/A Logic') {
      this.variableData.totalSum = 'A_Score';
    }
  }
  onThemeChange(theme: string) {
    this.editorOptions = { ...this.editorOptions, theme: theme };
  }

  getChooseLogic() {
    this.variableService.getChooseLogic().subscribe(res => {
      this.logicList = res;
    })
  }

  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        let children = res[0].schema.children;
        this.params = children;
        this.name = this.params[0].name;
      },
      (err) => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  onValueSelected(event: any, selectedData: any, index) {
    if (event.isUserInput) {
      this.columnValues = selectedData.children;
      this.filterColumns("");
    }
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
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  onSaveClick() {
    let resultDataStr: ResultConfig[] = [];
    this.configData.forEach(e => {
      e.configMethod[0].output.push(e.configMethod[0].input)
      e.configMethod[1].output.push(e.configMethod[1].input)
      e.configMethod[2].output.push(e.configMethod[2].input)
      let calc = e.configMethod[3].input + "('" + e.configMethod[3].calcValue + "')";
      resultDataStr.push({
        "tableName": e.name,
        "varName": e.name,
        "groupBy": e.configMethod[0].output,
        "columnFilter": e.configMethod[1].output,
        "rowFilter": e.configMethod[2].output,
        "calc": calc,
      })
    })
    this.commonDataVariables.groupbyVariableData = resultDataStr;
    // let toString = JSON.stringify(resultDataStr);
    let stringfyData = JSON.stringify(this.pythonCode);
    this.variableData.projectdetail = this.selectedProject.selectedProjectId;
    this.variableData.others = stringfyData;
    this.variableData.actionVariableData = this.actionVariable;
    this.variableData.scoreDecisionData = this.scoreDecisionData;
    this.variableData.naLogicData = this.NaLogicDecisionData;
    this.variableData.dropdownOption = 'TotalScore Logic'
    this.disableSave = true;
    if (this.id == 0) {
      this.variableService.createVariables(this.variableData).subscribe(
        (res) => {
          this.showNotification('success', 'Variable created successfully.')
          // this.goBack();
          this.router.navigateByUrl('/desicion-engine/explorer/variables/variablesList')
        },
        (err) => {
          this.showNotification('error', 'Oops! something went wrong.');
        }
      )
    }
    else {
      this.variableService.updateVariables(this.variableData.id, this.variableData).subscribe(data => {
        this.showNotification('success', 'Variable Updated Successfully.');
        this.disableSave = false;
        this.router.navigateByUrl('/desicion-engine/explorer/variables/variablesList')
      },
        (err) => {
          this.showNotification('error', 'Oops! something went wrong.');
          this.disableSave = false;
        }
      )
    }
  }

  getDifferenceInDays(date1: any, date2: any) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }

  getPushData(input: any, symbol: any, value: any, calc: any) {
    if (input && symbol && value) {
      console.log(input + ' ' + symbol + ' ' + value)
      return input + ' ' + symbol + ' ' + value;
    }
    else if (input && calc) {
      console.log(input + "(" + calc + ")");
      return input + "(" + calc + ")";
    }
    else {
      return input;
    }
  }
  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/variablesList';
    this.router.navigateByUrl(viewUrl)
  }

  variableConfig() {
    this.loading = true;
    if (this.id == 0) {
      this.loading = false;
    } else {
      this.variableService.gettVariable(this.id).subscribe(
        (res: any) => {
          this.variableData = res;
          this.actionVariable = res['actionVariableData']
          this.scoreDecisionData = res['scoreDecisionData']
          this.NaLogicDecisionData = res['naLogicData']
          this.valueType = res.dropdownOption
          for (let i = 0; i < this.sumLayout.length; i++) {
            this.tableDropDwn(i, this.sumLayout[i].tableName,event,'')
          }
          for (let i = 0; i < this.scoreDecisionData.length; i++) {
            this.emptyTableDropDwn(i, this.scoreDecisionData[i].tableName)
          }
          // for (let i = 0; i < this.NaLogicDecisionData.length; i++) {
          //   this.tableDropDwn(i, this.NaLogicDecisionData[i].tableName)
          // }
          // if (this.variableData.config) {
          //   if (this.variableData.config.length > 0) {
          //     this.configData.pop()
          //     for (let i = 0; i < this.variableData.config.length; i++) {
          //       this.configData.push({
          //         name: this.variableData.config[i]['varName'], configMethod: [{ name: 'groupBy', input: '', output: this.variableData.config[i]['groupBy'] },
          //         { name: 'columnFilter', input: '', output: this.variableData.config[i]['columnFilter'] },
          //         { name: 'rowFilter', input: '', output: this.variableData.config[i]['rowFilter'] },
          //         { name: 'calc', input: '', output: this.variableData.config[i]['calc'] }
          //         ]
          //       })
          //     }

          //   } else {
          //     console.log('No data passed')
          //     // this.pythonCode =  new Others();
          //   }
          // }
          if (this.variableData.others) {
            this.pythonCode = JSON.parse(res.others);
            console.log(this.pythonCode)
          } else {
            this.pythonCode = new Others();
            console.log(this.pythonCode)
          }
          this.loading = false;
          this.variableData.name = res.name;
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }
  
  // logictype sum
  addTotalField(index: number) {
    this.commonDataVariable.forEach((sumVariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (sumVariable.logicType == 'Sum') {
          sumVariable.sumVariableData.push(
            {
              id: null,
              databaseName: '',
              tableName: '',
              fieldName: [],
              tablevalues: [],
              fieldValues: []
            })
        }
      }
    })
  }
  // MaxDate Difference 
  maxDateTotalField(index: number) {
    this.commonDataVariable.forEach((maxDateVariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (maxDateVariable.logicType == 'Max Date Difference') {
          maxDateVariable.maxdateVariableData.push(
            {
              id: null,
              databaseName: '',
              tableName: '',
              fieldName: [],
              tablevalues: [],
              fieldValues: []
            })
        }
      }
    })
  }
  // LogicType Concat 
  concatTotalField(index: number) {
    this.commonDataVariable.forEach((concatVariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (concatVariable.logicType == 'Concat') {
          concatVariable.concatVariableData.push(
            {
              id: null,
              databaseName: '',
              tableName: '',
              fieldName: [],
              tablevalues: [],
              fieldValues: []
            })
        }
      }
    })
  }
  // logictype sum
  splitTotalField(index: number) {
    this.commonDataVariable.forEach((splitVariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (splitVariable.logicType == 'Split') {
          splitVariable.splitVariableData.push(
            {
              id: null,
              databaseName: '',
              tableName: '',
              fieldName: [],
              range: null,
              tablevalues: [],
              fieldValues: []
            })
        }
      }
    })
  }
  // logictype multiply
  mulTotalField(index: number) {
    this.commonDataVariable.forEach((mulVariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (mulVariable.logicType == 'Multiply') {
          mulVariable.mulVariableData.push(
            {
              id: null,
              databaseName: '',
              tableName: '',
              fieldName: [],
              tablevalues: [],
              fieldValues: [],
            })
        }
      }
    })

  }

  // logictype divide
  divTotalField(index: number) {
    this.commonDataVariable.forEach((divVariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (divVariable.logicType == 'Divide') {
          divVariable.divVariableData.push(
            {
              id: null,
              databaseName_a: '',
              tableName_a: '',
              fieldName_a: [],
              mode_a: 'Numerator',
              tablevalues: [],
              fieldValues: [],
              databaseName_b: '',
              tableName_b: '',
              fieldName_b: [],
              mode_b: 'Denominator',
              tablevalues_b: [],
              fieldValues_b: [],

            })
        }
      }
    })

  }

  // logictype date difference
  dateDiffTotalField(index: number) {
    this.commonDataVariable.forEach((dateDiffvariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (dateDiffvariable.logicType == 'Date Difference') {
          dateDiffvariable.dateVariableData.push(
            {
              databaseName: '',
              tableName: '',
              fieldName: [],
              ResultType: '',
              tablevalues: [],
              fieldValues: [],
            })
          this.searchKey = '';
          this.tableSearch = '';
        }
      }
    })
  }

  // logictype nalogic
  naLogicTotalField(index: number) {
    this.commonDataVariable.forEach((naLogicVariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (naLogicVariable.logicType == 'N/A Logic') {
          naLogicVariable.naLogicData.push(
            {
              tableName: '',
              fieldName: [],
              naCondition: '',
              naValue: ''
            })
        }
      }
    })
  }

  addCardData() {
    this.commonDataVariable.push({
      id: null,
      dataSource: '',
      logicType: '',
      outputField: '',
      sumVariableData: [],
      divVariableData: [],
      mulVariableData: [],
      dateVariableData: [],
      naLogicData: [],
      groupbyVariableData: [],
      maxdateVariableData: [],
      splitVariableData: [],
      concatVariableData: [],
    });
  }

  // fieldname dropdown
  tableDropDwn(index: any, event, listName, type: any) {
    this.commonDataVariable.forEach(columnFieldsName => {
      if (columnFieldsName.dataSource == 'Decision Table') {
        this.variableService.getVariableField(listName).subscribe(res => {
          (type === 'numerator' || type === '') ? this.tableField[index] = res : this.tableField1[index] = res;
        });
      } else if (columnFieldsName.dataSource == 'Variables') {
        this.variableService.getVariableTableField(listName).subscribe(res => {
          (type === 'numerator' || type === '') ? this.tableField[index] = res : this.tableField1[index] = res;
        });
      }
      
    })
  }

  // table dropdown
  emptyTableDropDown(index: any, listName, tables) {
    this.variableList = listName;
    this.selectedDbName = listName;
    this.conditonalTableField[index] = [];
    this.queryService.getTableName(listName).subscribe(res => {
      this.conditonalTableField[index] = res;
      this.tableNames = res;
      if (tables)
        tables.tablevalues = res;
    });
  }
  emptyTableDropDown1(index: any, listName, tables) {
    this.variableList = listName;
    this.selectedDbName = listName;
    this.conditonalTableField[index] = [];
    this.queryService.getTableName(listName).subscribe(res => {
      this.conditonalTableField[index] = res;
      this.tableNames = res;
      if (tables)
        tables.tablevalues_b = res;
    });
  }

  emptyTableDropDwn(index: any, listName) {
    this.conditonalTableField[index] = [];
    this.variableService.getTableField(listName).subscribe(res => {
      this.conditonalTableField[index] = res;
    });
  }

  // Filter tables names
  tableOptions(index: any, emptyLogicList: any) {
    const searchQuery = this.searchKey?.toLowerCase();
    const filteredOptions = emptyLogicList?.tablevalues.filter(option =>
      option.toLowerCase().includes(searchQuery)
    );
    emptyLogicList.filteredTableOptions = filteredOptions;
    return emptyLogicList.filteredTableOptions;
  }
  // Denominator Search
  denominatorSearchOption(index: any, emptyLogicList: any) {
    const searchQuery = this.denominatorSearch?.toLowerCase();
    const filteredOptions = emptyLogicList?.tablevalues_b.filter(option =>
      option.toLowerCase().includes(searchQuery)
    );
    emptyLogicList.filteredTableOptions_b = filteredOptions;
    return emptyLogicList.filteredTableOptions_b;
  }

  // field dropdown
  actionField(index: any, event, field) {
    let seletedtableName = event;
    this.conditonalField[index] = [];
    this.queryService.getFieldName(seletedtableName, this.selectedDbName).subscribe(
      res => {
        this.conditonalField[index] = res;
        if (field)
          field.fieldValues = res;
      }
    )
  }

  actionField1(index: any, event, field) {
    let seletedtableName = event;
    this.conditonalField[index] = [];
    this.queryService.getFieldName(seletedtableName, this.selectedDbName).subscribe(
      res => {
        this.conditonalField[index] = res;
        if (field)
          field.fieldValues_b = res;
      }
    )
  }

  // filter in fields
  filterFieldOptions(index: any, emptyLogicList: any, name: any) {
    this.filteredFieldOptions1 = name;
    const tableSearch = this.tableSearch?.toLowerCase();
    const fieldSearch = emptyLogicList?.fieldValues.filter(option =>
      option.toLowerCase().includes(tableSearch)
    );
    emptyLogicList.filteredFields = fieldSearch;
    if (fieldSearch) {
      return emptyLogicList.filteredFields;
    }
    const fieldSearch1 = emptyLogicList?.fieldValues_b.filter(option =>
      option.toLowerCase().includes(tableSearch)
    );
    emptyLogicList.filteredFields_b = fieldSearch1;
    if (fieldSearch1) {
      return emptyLogicList.filteredFields_b;
    }
  }

  getLogicType(type, index) {
    this.logicType = type;
    this.commonDataVariable.forEach((data, arrayIndex) => {
      if (arrayIndex === index) {
        if (this.logicType == 'Sum') {
          data.sumVariableData = [];
          this.addTotalField(index);
        } if (this.logicType == 'Multiply') {
          data.mulVariableData = [];
          this.mulTotalField(index);
        }
        if (this.logicType == 'Date Difference') {
          data.dateVariableData = [];
          this.dateDiffTotalField(index);
        }
        if (this.logicType == 'Divide') {
          data.divVariableData = [];
          this.divTotalField(index);
        }
        if (this.logicType == 'N/A Logic') {
          data.naLogicData = [];
          this.naLogicTotalField(index);
        }
        if (this.logicType == 'Max Date Difference') {
          data.maxdateVariableData = [];
          this.maxDateTotalField(index);
        }
        if (this.logicType == 'Concat') {
          data.concatVariableData = [];
          this.concatTotalField(index);
        }
        if (this.logicType == 'Split') {
          data.splitVariableData = [];
          this.splitTotalField(index);
        }
      }
    })
  }
  // getDataSource
  getDataSource(type) {
    this.dataSource = type;
  }

  // To listing a database names
  getDBNames() {
    this.queryService.getDataBaseName().subscribe(
      (res) => {
        this.responseArray = res;
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // decision table dropdown
  getDecisionTableDrop(variable: any[]) {
    variable.forEach(dropDownData => {
      if (dropDownData.dataSource == 'Decision Table') {
        this.variableService.getDecicionTable().subscribe(
          res => {
            this.decisionTableDropdown = res;
          }
        )
      }
      else if (dropDownData.dataSource == 'Variables') {
        this.variableService.getvariableslist().subscribe(
          res => {
            this.decisionTableDropdown = res.map(variable => variable.name);
          }
        )
      }
    })
  }
// save button click
  onSaveBtnClick() {
    let resultDataStr: ResultConfig[] = [];
    this.configData.forEach(e => {
      e.configMethod[0].output.push(e.configMethod[0].input)
      e.configMethod[1].output.push(e.configMethod[1].input)
      e.configMethod[2].output.push(e.configMethod[2].input)
      let calc = e.configMethod[3].input + "('" + e.configMethod[3].calcValue + "')";
      resultDataStr.push({
        "tableName": e.tableName,
        "varName": e.name,
        "groupBy": e.configMethod[0].output,
        "columnFilter": e.configMethod[1].output,
        "rowFilter": e.configMethod[2].output,
        "calc": calc,
      })
    })
    this.commonDataVariables.groupbyVariableData = resultDataStr;
    let stringfyData = JSON.stringify(this.pythonCode);
    this.overallVariables.others = stringfyData;
    this.overallVariables.varConfigData = this.commonDataVariable;
    this.disableSave = true;
    this.overallVariables.varConfigData.forEach(data => {
      if (data.logicType == '') {
        this.overallVariables.varConfigData = [];
      } else if (data.logicType == 'Sum') {
        data.mulVariableData = [];
        data.divVariableData = [];
        data.dateVariableData = [];
        data.naLogicData = [];
        data.groupbyVariableData = [];
        data.maxdateVariableData = [];
        data.splitVariableData = [];
        data.concatVariableData = [];
      } else if (data.logicType == 'Multiply') {
        data.sumVariableData = [];
        data.divVariableData = [];
        data.dateVariableData = [];
        data.naLogicData = [];
        data.groupbyVariableData = [];
        data.maxdateVariableData = [];
        data.splitVariableData = [];
        data.concatVariableData = [];
      } else if (data.logicType == 'Divide') {
        data.sumVariableData = [];
        data.mulVariableData = [];
        data.dateVariableData = [];
        data.naLogicData = [];
        data.groupbyVariableData = [];
        data.maxdateVariableData = [];
        data.splitVariableData = [];
        data.concatVariableData = [];
      } else if (data.logicType == 'Date Difference') {
        data.sumVariableData = [];
        data.mulVariableData = [];
        data.divVariableData = [];
        data.naLogicData = [];
        data.groupbyVariableData = [];
        data.maxdateVariableData = [];
        data.splitVariableData = [];
        data.concatVariableData = [];
      } else if (data.logicType == 'N/A Logic') {
        data.sumVariableData = [];
        data.mulVariableData = [];
        data.divVariableData = [];
        data.dateVariableData = [];
        data.groupbyVariableData = [];
        data.maxdateVariableData = [];
        data.splitVariableData = [];
        data.concatVariableData = [];
      } else if (data.logicType == 'Group By') {
        data.sumVariableData = [];
        data.mulVariableData = [];
        data.divVariableData = [];
        data.dateVariableData = [];
        data.naLogicData = [];
        data.maxdateVariableData = [];
        data.splitVariableData = [];
        data.concatVariableData = [];
      } else if (data.logicType == 'Max Date Difference') {
        data.sumVariableData = [];
        data.mulVariableData = [];
        data.divVariableData = [];
        data.dateVariableData = [];
        data.naLogicData = [];
        data.groupbyVariableData = [];
        data.splitVariableData = [];
        data.concatVariableData = [];
      } else if (data.logicType == 'Split') {
        data.sumVariableData = [];
        data.mulVariableData = [];
        data.divVariableData = [];
        data.dateVariableData = [];
        data.naLogicData = [];
        data.groupbyVariableData = [];
        data.maxdateVariableData = [];
        data.concatVariableData = [];
      } else if (data.logicType == 'Concat') {
        data.sumVariableData = [];
        data.mulVariableData = [];
        data.divVariableData = [];
        data.dateVariableData = [];
        data.naLogicData = [];
        data.groupbyVariableData = [];
        data.maxdateVariableData = [];
        data.splitVariableData = [];
      }
    })
    if (this.id == 0) {
      this.variableService.createVariableData(this.overallVariables).subscribe(
        (res) => {
          this.showNotification('success', 'Variable created successfully.')
          this.router.navigateByUrl('/desicion-engine/explorer/variables/variablesList')
        },
        (err) => {
          this.showNotification('error', 'Oops! something went wrong.');
        }
      )
    }
    else {
      this.variableService.updateVariableData(this.overallVariables.id, this.overallVariables).subscribe(data => {
        this.showNotification('success', 'Variable Updated Successfully.');
        this.disableSave = false;
        this.router.navigateByUrl('/desicion-engine/explorer/variables/variablesList')
      },
        (err) => {
          this.showNotification('error', 'Oops! something went wrong.');
          this.disableSave = false;
        }
      )
    }
  }
  
  // processVariableData(variableData: any) {
  //   for (const key in variableData) {
  //     const data = variableData[key];
  //     if (Array.isArray(data)) {
  //       for (let i = 0; i < data.length; i++) {
  //         const currentData = data[i];
  //         if (currentData && currentData.tableName) {
  //           this.tableDropDwn(i, event, currentData.tableName, '');
  //           console.log(currentData.tableName, currentData);
  //         }
  //       }
  //     }
  //   }
  // }
  
  // on edit click
  onGetVariableDataById() {
    this.loading = true;
    if (this.id == 0) {
      this.loading = false;
    } else {
      this.variableService.gettVariable(this.id).subscribe(
        res => {
          this.overallVariables = res;
          this.commonDataVariable = res['varConfigData'];
          this.getDecisionTableDrop(this.commonDataVariable);
    for (const data of this.commonDataVariable) {
      if (data.sumVariableData) {
      const sumVariableData = data.sumVariableData;
      for (let i = 0; i < sumVariableData.length; i++) {
      this.tableDropDwn(i,event, sumVariableData[i].tableName, '');
      }      
      }
    if (data.mulVariableData) {
      const mulVariableData = data.mulVariableData;
      for (let i = 0; i < mulVariableData.length; i++) {
      this.tableDropDwn(i,event, mulVariableData[i].tableName, '');
      }      
      }
    if (data.dateVariableData) {
      const dateVariableData = data.dateVariableData;
      for (let i = 0; i < dateVariableData.length; i++) {
      this.tableDropDwn(i,event, dateVariableData[i].tableName, '');
      }      
      }
    if (data.naLogicData) {
      const naLogicData = data.naLogicData;
      for (let i = 0; i < naLogicData.length; i++) {
      this.tableDropDwn(i,event, naLogicData[i].tableName, '');
      }      
      }
    if (data.maxdateVariableData) {
      const maxdateVariableData = data.maxdateVariableData;
      for (let i = 0; i < maxdateVariableData.length; i++) {
      this.tableDropDwn(i,event, maxdateVariableData[i].tableName, '');
      }      
      }
    if (data.splitVariableData) {
      const splitVariableData = data.splitVariableData;
      for (let i = 0; i < splitVariableData.length; i++) {
      this.tableDropDwn(i,event, splitVariableData[i].tableName, '');
      }      
      }
    if (data.concatVariableData) {
      const concatVariableData = data.concatVariableData;
      for (let i = 0; i < concatVariableData.length; i++) {
      this.tableDropDwn(i,event, concatVariableData[i].tableName, '');
      }      
      }
      if (data.divVariableData) {
        const divVariableData = data.divVariableData;
        for (let i = 0; i < divVariableData.length; i++) {
        this.tableDropDwn(i,event, divVariableData[i].tableName_a, '');
        }      
        }
            if (data.groupbyVariableData) {
              const groupbyVariableData = data.groupbyVariableData;
              if (groupbyVariableData.length > 0) {
                this.configData.pop();
                for (let i = 0; i < groupbyVariableData.length; i++) {
                  const configItem = groupbyVariableData[i];
                  this.configData.push({
                    tableName: configItem.tableName,
                    name: configItem.varName,
                    configMethod: [
                      { name: 'groupBy', input: '', output: configItem.groupBy || [] },
                      { name: 'columnFilter', input: '', output: configItem.columnFilter || [] },
                      { name: 'rowFilter', input: '', output: configItem.rowFilter || [] },
                      { name: 'calc', input: '', output: [configItem.calc] }
                    ]
                  });
                }
              }
            }
          }
          if (this.overallVariables.others) {
            this.pythonCode = JSON.parse(res.others);
          } else {
            this.pythonCode = new Others();
            console.log(this.pythonCode)
          }
        }
      )
    }
  }
 
  // logictype group
  groupTotalField(index: number) {
    this.commonDataVariable.forEach((mgrpVariable, arrayIndex) => {
      if (arrayIndex === index) {
        if (mgrpVariable.logicType == 'Group By') {
          mgrpVariable.groupbyVariableData.push(
            {
              tableName: '',
              groupBy: [],
              columnFilter: [],
              rowFilter: [],
              varName: '',
              calc: '',
            })
        }
      }
    })

  }
}
