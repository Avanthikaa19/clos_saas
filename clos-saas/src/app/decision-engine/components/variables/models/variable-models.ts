export class Variables {
  id: number;
  name: string;
  type: string;
  description: string;
  totalSum?: string;
  tags: string;
  in_use: string;
  source: string;
  database_mode: string;
  others: any;
  is_selected?: Boolean;
  projectdetail: number;
  parameters: any[];
  headers: any;
  position?: number;
  config?: ResultConfig[];
  actionVariableData?: ActionVariable[];
  scoreDecisionData?: scoreDecisionData[];
  scoreDecColumn: string;
  dropdownOption: string;
  naLogicData?: naLogicData[]
}

export class ResultConfig {
  id?: number;
  varName: string;
  groupBy: string[];
  columnFilter: string[];
  rowFilter: string[];
  calc: string;
}

export class Others {
  id: number;
  fileName: string;
  code: string;
}

export class ActionVariable {
  constructor(
    public tableName: string,
    public databaseName: string,
    public fields: any[],
    public actionVariable?: any[],
    public tablevalues: any[] = [],
    public fieldValues: any[] = [],
    public filteredTableOptions?: string[],
    public filteredFields?: string[]
  ) { }
}
export class scoreDecisionData {
  constructor(
    public tableName: string,
    public scoreColumns: string,
    public scoreCondition: string,
    public scoreValue: number,
    public score: string
  ) { }
}
export class naLogicData {
  constructor(
    public tableName: string,
    public actionVariable: string,
    public naCondition: string,
    public naValue: string,
  ) { }
}
export class ActionDataVariable {
  constructor(
    public tableName: string,
    public actionVariable: any[]
  ) { }
}

export class DataTable {
  constructor(
    public dataSource: string,
    public operator: string,
    public sumVariableData: sumVariableData[]
  ) { }
}

export class sumVariableData {
  constructor(
    public tablename: string,
    public operator: string,
    public sumVariableData: ActionVariable[]
  ) { }
}
export class allVariableData {
  constructor(
    public id: number,
    public name: string,
    public type: string,
    public description: string,
    public others: any,
    public varConfigData: VarConfigData[],
  ) { }
}
export class VarConfigData {
  constructor(
    public id: number,
    public dataSource: string,
    public logicType: string,
    public outputField: string,
    public sumVariableData: VarData[],
    public divVariableData: DivideVarData[],
    public mulVariableData: VarData[],
    public dateVariableData: DateVarData[],
    public naLogicData:LogicVarData[],
    public groupbyVariableData: GrpByVarData[],
    public maxdateVariableData:VarData[],
    public splitVariableData:SplitVarData[],
    public concatVariableData:VarData[],
  ) { }
}
export class VarData {
  constructor(
    public id: number,
    public databaseName: string,
    public tableName: string,
    public fieldName: string[],
    public tablevalues: any[] = [],
    public fieldValues: any[] = [],
    public filteredTableOptions?: string[],
    public filteredFields?: string[]
  ) { }
}

export class DivVarData{
  constructor(
    public divisionData : VarData[],
  ){ }
}

export class LogicVarData{
  constructor(
    public tableName: string,
    public fieldName: string[],
    public naCondition: string,
    public naValue: string,
  ){}
}
export class DateVarData{
  constructor(
    public databaseName: string,
    public tableName: string,
    public fieldName: string[],
    public ResultType: string,
    public tablevalues: any[] = [],
    public fieldValues: any[] = [],
    public filteredTableOptions?: string[],
    public filteredFields?: string[]
  ){}
}
export class GrpByVarData{
  constructor(
    // public databaseName?: string,
    public tableName: string,
    public groupBy: string[],
    public columnFilter: string[],
    public rowFilter: string[],
    public varName: string,
    public calc: string,
  ){}
}

export class SplitVarData {
  constructor(
    public id: number,
    public databaseName: string,
    public tableName: string,
    public fieldName: string[],
    public range: number,
    public tablevalues: any[] = [],
    public fieldValues: any[] = [],
    public filteredTableOptions?: string[],
    public filteredFields?: string[]
  ) { }
}
export class DivideVarData{
  constructor(
    public id:number,
    public databaseName_a: string,
    public tableName_a: string,
    public fieldName_a: string[],
    public mode_a: string,
    public databaseName_b: string,
    public tableName_b: string,
    public fieldName_b: string[],
    public mode_b: string,
    public tablevalues: any[] = [],
    public fieldValues: any[] = [],
    public filteredTableOptions?: string[],
    public filteredFields?: string[],
    public tablevalues_b: any[] = [],
    public fieldValues_b: any[] = [],
    public filteredTableOptions_b?: string[],
    public filteredFields_b?: string[]
  ){}
}
