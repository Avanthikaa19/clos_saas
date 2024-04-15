import { QueryBuilder } from "src/app/decision-engine/models/QueryBuilder";

export class Database{
    id:number;
    name?:string;
    db_name:string;
    user:string;
    password:string;
    port:number;
    host:string;
    query?:string;
}
export class filter{
    column?:any;
    operand?:any;
    operator?:any;
    previous?:any;
    choosen?:any;
}
export class queryParams{
    id?:number;
    name:string;
    type?:string;
    columns?:string;
    query?:string;
    filter?:any;
}
export class QueryVariable{
    id:number;
    name:string;
    description?:string;
    project_id:number;
    query?:string;
    query_builder?:QueryBuilder;
    created_on:string;
    database?:Database;
    db_id?:number;
    date_choices?:string;
    date_value?:string;
    start_date:string;
    end_date:string;
    params?:queryParams[];
    queryInfo?:QueryInfo[];
} 

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

export class QueryInfo{
    databaseName: string;
    tableName: string;
    fields: any[];
    tablevalues:any[]=[];
    fieldValues:any[] = [];
    filteredTableOptions?: string[];
    filteredFields?: string[];
}
