import { ColumnDefinition } from "src/app/c-los/models/clos-table";



export class AuditTrail {
    constructor(
        public auditHeaders: string[],
        public module: string,
        public action: string,
    ) {}
}
export class AuditReports {
    constructor(
        public id: number,
        public module: string,
        public object: string,
        public action: string,
        public objectId: string,
        public user: string,
        public ipAddress: string,
        public timeStamp: string,
        public auditBodies: AuditBodies[],
    ) {}
}
export class AuditBodies {
    constructor(
        public id: number,
        public item: string,
        public type: string,
        public beforeValue: string,
        public afterValue: string,
        public timeStamp: string,
    ) {}
}
export class AuditTrailFilter{
    constructor(
        public id: number,
        public module: string,
        public object: string,
        public action: string,
        public objectId: string,
        public user: string,
        public ipAddress: string,
        public lockResetFlag: string,
        public objectMessage: string,
        public userName: string,
        public objectName: string,
        public info1: string,
        public info2: string,
        public info3: string


    ){}
}
export class AuditTrailDetail{
    public action: string;
    public afterValue: string;
    public auditBody: string;
    public auditBodies:any[];
    public beforeValue: string;
    public created: string;
    public createdTime: string;
    public id: string;
    public objectId: string;
    public info1: string;
    public info2: string;
    public info3: string;
    public ipAddress: string;
    public lockResetFlag: string;
    public module: string;
    public object: string;
    public objectMessage:string;
    public objectName:string;
    public beforeValueList:any[];
    public beforeAllValueList:any[];
    public filterValueList:any[];
    public afterValueList:any[];
    public user:string;

    //For UI
    public isAfterMore:boolean;
    public isBeforeMore:boolean;

}
export class AuditTrailFilterSort{
    filters: AuditTrailFilter;
    sort: MultiSort[];
}
export class MultiSort{
    sortingOrder: string;
    orderBy: string;

}
export class ExportFile{
    filter: AuditTrailFilterSort;
    columnDefinitions: ColumnDefinition[];
}