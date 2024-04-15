export class Report {
    public id: number;
    public name: string;
    public nickname: string;
    public description: string;
    public reportFolder: string;
    public outputFormat: string;
    public supportedFormats: string[];
    public outputFileName: string;
    public outputFolder: string;
    public parameters: ReportParamSpec[];
    public parallelProcess: string;
    public owner: string;
    public visibleTo: string;
    public editableBy: string;
    public computationStages: ComputationStage[];       
    public sheets: Sheet[];   
    
    //temp
    public defaultFormat: string;
    public generateOnServer?: boolean;
}

export class Sheet {
    public id: number;
    public name: string;
    public report: number;
    public sheetOrder: number;
    public layout: number;
    public theme: number;

    // temp
    selectedLayout? : Layout;
    reportCardClipPath?: string;
    reportCardClipPathHovered?: string;
}

export class ComputationStage {
    public id: number;
    public reportId: number;
    public step: number;
    public name: string;
    public description: string;
    public parallelize: boolean;
    public computationQueries: ComputationQuery[];
}

export class ComputationQuery {
    public id: number;
    public name: string;
    public description: string;
    public visibleTo: string;
    public editableBy: string;
    public owner: string;
    public sql: string;
    public required: string;
}

export class ExtractionQuery {
    public id: number;
    public name: string;
    public description: string;
    public visibleTo: string;
    public editableBy: string;
    public fields: QueryField[];
    public owner: string;
    public sql: string;
    public fieldCount: number;
    public parameters: string;
}

export class QueryField {
    public pos: number;
    public name: string;
    public type: string;
}

export class Layout {
    public id: number;
    public name: string;
    public defaultSheetName: string;
    public description: string;
    public visibleTo: string;
    public editableBy: string;
    public owner: string;
    public specification: LayoutSpec;
}

export class LayoutSpec {
    public baseThemeId: number;
    public bandGroupMetadata: BandGroupMetadata[];
    public bandMetadata: BandMetadata[];
    public titleBand: TitleBand[];
    public headerBands: ContextBand[];
    public extractionBands: ExtractionBand[];
    public footerBands: ContextBand[];
    //local vars
    public baseTheme: Theme;
}

export class BandGroupMetadata {
    public groupId: number;
    public groupName: string;
    public bandId: number;
    public bandName: string;
}

export class BandMetadata {
    public bandId: number;
    public bandName: string;
    public elementId: number;
    public elementName: string;
}

export class BandGroup {
    public id: number;
    public name: string;
    public bands: Band[];
    //temp
    expanded?: boolean;
}

export class Band {
    public id: number;
    public name: string;
    public include: boolean;
    public anchored: boolean;
    public anchorX: number;
    public anchorY: number;
    public width: number;
    public height: number;
    public margins: Margins;
    public innerBorders: Border;
    public outerBorders: Borders;
    public backgroundColor: string;
    public parameters: string;
    //temp
    visible?: boolean;
    style?: string;
    contextElement?: any;
    elements?: any;
}

export class Margins {
    top: number;
    bottom: number;
    left: number;
    right: number;
    constructor(top: number, right: number, bottom: number, left: number) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
}

export class ExtractionBand extends Band {
    public baseThemeId: number;
    public extractionId: number;
    public engineScopeMode:EngineScopeMode;
    public override elements: DataElement[];
}

export enum EngineScopeMode{
    GLOBAL,
    PER_FIELD,
    PER_RECORD,
    PER_CELL
}


export class ContextBand extends Band {
    public override elements: ContextElement[];
}

export class TitleBand extends Band {
    public override contextElement: ContextElement;
}

export class DataElement {
    public fieldHeaderCell: ContextElement;
    public fieldDataCell: ContextElement;
}

export class ContextElement {
    public id: number;
    public name: string;
    public include: boolean;
    public align: string; 
    public cellData: CellData;
    public cellFormat: CellFormat;
    //temp
    deletable?: boolean;
    visible?: boolean;
    style?: string;
}

export class CellData {
    public type: string;
    public value: string;
}

export class Theme {
    public id: number;
    public name: string;
    public description: string;
    public visibleTo: string;
    public editableBy: string;
    public owner: string;
    public specification: ThemeSpec;
}

export class ThemeSpec {
    public titleCell: CellFormat;
    public subTitleCell: CellFormat;
    public headerCell: CellFormat;
    public fieldHeaderCell: CellFormat;
    public fieldDataCell: CellFormat;
    public footerCell: CellFormat;
}

export class CellFormat {
    public override?: boolean;
    public textAlign: string;
    public font: string;
    public fontStyle: string;
    public fontSize: number;
    public fontColor: string;
    public backgroundColor: string;
    public borders: Borders;
    //temp
    public left?: number
}

export class Borders {
    public top: Border;
    public bottom: Border;
    public left: Border;
    public right: Border;
}

export class Border {
    public thickness: number;
    public color: string;
}

// export enum ALIGNMENT {
//     LEFT,
//     CENTER,
//     RIGHT
// }

export class exportJson {
    public exportName: string;
    public exportDescription: string;
    public reportName: string;
    public reportId: string;
    public extractionQueryName: string;
    public extractionQueryId: string;
    public computationQueryName: string;
    public computationQueryId: string;
    public layoutName: string;
    public layoutId: string;
    public themeName: string;
    public themeId: string     
}

export class ParamSpec{
    public name: String ;
    public formulaName: String ;
    public formulaType:  String;
    public formulaValue: String ;
}

export enum RPTFormulaType {
    STATIC_TEXT,
    EVALUATE_JS,
    SQL,
    QUERY_FIELD
}

export class ReportParamSpec extends ParamSpec {    
    public mandatory: boolean;
    public userEditable: boolean;
}

export class  JobExecution {
    constructor (
    public jobId: number,
    public reportId: number,
    public reportName: string,
    public paramData: string,
    public progress: number,
    public started: boolean,
    public ended: boolean,
    public endedError: boolean,
    public startedOn: string,
    public endedOn: string,
    public outputFileName: string,
    public username: string,

    public style? : string
    ){
        
    }
}

export class  JobExecutionLog {
    constructor (
        public id: number,
        public jobId: number,
        public reportId: number,
        public logType: string,
        public source: string,
        public read: string,
        public message: string,
        public timestamp: string
    ){
        
    }
}

export enum RPTLogType {
    DEBUG,
    INFO,
    WARN,
    ERROR
}

export class ReportFolder {
    name: string;
    path: string;
    children?: ReportFolder[];
}

export class ReportsFetchFilter {
    name: string;
    folders: string[];
}

export class Parameter{
    public name:string;
    public formulaName:string;
    public formulaType:string;
    public formulaValue:string;
    public mandatory:boolean;
    public userEditable:boolean;
    public sheetNumber?:number;
}