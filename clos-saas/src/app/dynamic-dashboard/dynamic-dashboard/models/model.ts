export class GridStackElement{
    constructor(
    public id: number,
    public w: string,
    public h: string,
    public x: any,
    public y: any,
    public panelName: string,
    public primaryId?: number,
    //temp
   public widgetChooser?: boolean,
    ){}
}

export class CustomiseDashboard{
    public id!: number;
    public dashboardName!: string;
    public userName!: string;
    public layout!: GridStackElement[];
    public widget!: Widgets[];
    // public defaultDashboard: boolean;
    public selectedScreen!: string[];
    // public primaryUsers: string[];
    // public secondaryUsers: string[];
    public dynamicDashboardUsers!: string[];
    public createdDate:any;
}

export class Widgets{
    public id!: number;
    public type!: string;
    public layoutId!: GridStackElement['id'];
    public query!: QueryFieldCustomDashBoard;
    public queryText!: string;
    public data!: string;
    public actualData: any;
    public filters!: Filters[];
    public graphSettings!: GraphSetting;
    public totalCount!:number;
}
export class QueryFieldCustomDashBoard{
    constructor(
        public tableName: string,
        public columnName1: any,
        public columnName2: any,
        public columnName3:any,
        public columnName4:any,
        public columnName5:any,
        public columnName6:any,
        public aggregation1: string,
        public aggregation2: string,
        public aggregation3:string,
        public aggregation4:string,
        public aggregation5:string,
        public aggregation6:string,
        public aggregationList1: AggregationCondition[],
        public aggregationList2: AggregationCondition[],
        public where: WhereCondition[],
        public groupBy: string,
        //temp
        public tableName2: string,
        public keyCol1: string,
        public keyCol2: string,
        public where2: WhereCondition[],
        public groupBy2: string,
        public orderBy: string,
        public orderBy2: string,
        public order: string,
        public order2: string,
        public join: boolean,
    ){}
}
export class WhereCondition{
    constructor(
        public operation: string,
        public operandField:string,
        public operandType:string,
        public operator: string,
        public value: any,
        public whereList:any,
    ){}
    
}

export class AggregationCondition{
    constructor(
        public comSep: any,
        public colList: any,
        public aggregationField:any,
        public aggList: any,
    ){}
}
// export class WhereCondition2{
//     constructor(
//         public operation2: string,
//         public operandField2:string,
//         public operandType2:string,
//         public operator2: string,
//         public value2: any,
//     ){}
    
// }
export class GraphSetting{
    public titleText!: string;
    public titleSubText!: string;
    public titleShow!: boolean;
    public titleAlign!: string;
    public toolTipShow!: boolean;
    public toolTipTrigger!: string;
    public legendShow!: boolean;
    public legendAlign!: string;
    public legendName!: string;
    //multiple-chart
    public legendName2:string;
    public legendName3:string;
    public legendOrient!: string;
    public xaxis!: string;
    public yaxis!: string;
    public radius!: string | number;
    public outerRadius!: string | number;
    public innerRadius!: string | number;
    public toolboxShow!: boolean;
    public labelPosition!: string;
    public labelShow! : boolean;
    public labelLineShow! : boolean;
    public toolboxZoom! : boolean;
    public toolboxData! : boolean;
    public toolboxType!: boolean;
    public toolboxSave! : boolean;
    // Card 
    public cardColor!: string;
    public cardTextColor!: string;
    public labelName!: string;
    public borderTopColor! :string;
    public topThickness! : number;
    public borderBottomColor! :string;
    public bottomThickness! : number;
    public borderLeftColor! :string;
    public leftThickness! : number;
    public borderRightColor! :string;
    public rightThickness! : number;
    // table
    public headerBg!: string;
    public headerColor!: string;
    public headerBorder!: number;
    public bodyBg!: string;
    public bodyColor!: string;
    public bodyBorder!: number;
    public textAlign!: string;
    public tableName!: string;
    public headerBorderColor!: string;
    public bodyBorderColor!: string;
    //piechart
    public bckColor!:any;
}

export class Filters{
    public filterOperand!: string[];
    public type!: string[];
    public filterValue!: string[];
}

// export class Template{
//     public id: number;
//     public dashboardName: string;
//     public userName: string;
//     public types: any[];
// }

// export class DashboardMapping{
//     public id: number;
//     public dashboardId: number;
//     public dashboardName: string;
//     public selectedScreen: string;
//     public isPrimary: boolean;
//     public users: string[];
//     public status: string;
//     public error: string;
//     public createdBy: string;
//     public forAll: boolean;
//     public isDefault: boolean;
//     public types: any[];
// }

export class SearchScope{
    constructor(
        public pageSize: number,
        public tableName: string
    ){}
}