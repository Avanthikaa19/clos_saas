
export class Profiles{
    id: number;
    name: string;
    description: string;
    others: any;
    is_selected?:Boolean;
    projectdetail: number;
    position?: number;
    input_table:InputTable;
    output_table:OutputTable;
    config?: ResultConfig[];
}
export class Config {
    dateField: string;
    FilteredListField:any[];
    periodField:string;
    configMethod: ConfigMethod[];
  }
  export class ProfileConfig {
    columnFilter:any[];
    periodField:string;
    dateField: string;
    profileField:string;
    calc:any;
    FilteredListField?:any[];
  }
export class ProfileVariable{
    id?: number;
    name: string;
    description: string;
    others: any;
    config:ProfileConfig;
    objectModel:any;
    input_table:InputTable;
    output_table:OutputTable;
    // config?: ResultConfig[];
}
export class InputTable{
    dbType: any;
    db: any;
    selectTable: string='';
       
}
 export class DataSource{
    name:string;
    description:string;
    project:any;
    db_type:any;
    default:boolean;
    host:string;
    db_name:string;
    user:string;
    password:string;
    port:number;
    tls_client_auth:boolean;
    ca_cert:boolean;
    tls_verify:boolean;
    max_open:number
    max_idle:number
    max_life_time:number
    max_time_interval:number
 }

export class OutputTable{
    dbType:any;
    db:any;
    selectTable:string='';
    tableQuery:string='';
    tableName:string='';
    newTableQuery:string='';
   tableConfig:Tableconfig[]=[]
       
}
export class Tableconfig {
    name:string='';
    type:string='';
    size:string='';
    
  }
export class ProfilesList{
    count: number;
    next: string;
    previous: string;
    results: Profiles[];
    
}
export class Sorting{
    valueString: string;
    displayName: string;
}

export class Others{
    id: number;
    fileName: string;
    code: string;
}

export class QueryBuilder {
    id?: number;
    user: string;
    password: string;
    db_name: string;
    host: string;
    port: number;
    query: string='';
    project: any;
}
export class ResultConfig {
    id?: number;
    dateField:string;
    periodField:string;
    profile_for: string[];
    columnFilter: string[];
    // rowFilter: string[];
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