import { ResultConfig } from "./ResultConfig";

export class Variables{
    id: number;
    name: string;
    type: string;
    description: string;
    tags: string;
    in_use: string;
    source: string;
    database_mode: string;
    others: any;
    is_selected?:Boolean;
    projectdetail: number;
    parameters: any[];
    headers: any;
    position?: number;
    config?: ResultConfig[];
}
export class VariableLibrary {
    id: number;
    name: string;
    description: string;
    created_by: string;
    created_on: Date;
    project: any;
    variables: Variables[];
}
export class VariablesList{
    count: number;
    next: string;
    previous: string;
    results: Variables[];
    
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
