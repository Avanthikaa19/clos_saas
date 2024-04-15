export class StandardsTable{
    id: number;
    name: string;
    description?: string;
    type?:string;
    text_value?: string;
    niumeric_value?:string;
    created_on?: Date;
    created_by?: string;
}

export class Overrides{
    constructor(
        public field_name: string,
        public data_type: string,
    ){}
    
}
export class cells{
    constructor(
        public column_name: string,
        public type:string,
        public data_type: string,
        public operator: string,
        public value: string,
    ){}
}
export class OverrideStandards{
    constructor(
        public headers: any[],
        public  rows: any[],
    ){}

}
export class TlStandards{
    id: number;
    name: string;
    description?: string;
    fieldName?:string;
    fieldValue?: string;
    operator?: string;
    fieldType?:string;
    dataType?:string;
    override_standards?:OverrideStandards;
    action?:string;
    checked?:boolean;
    createdOn?: Date;
    createdBy?: string;
}