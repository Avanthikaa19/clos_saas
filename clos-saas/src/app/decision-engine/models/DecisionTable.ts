import { Datatype } from "./ObjectModel";


export class DecisionTableList{
    id: number;
    name: string;
    description: string;
    version: number;
    rows: any[];
    columns: DecisionTableColumns[];
    parameters:Datatype[];
    created_on: Date;
    created_by: string;
    project: number;
}

export class DecisionTableColumns{
    id? : number;
    lable: string;
    name: string;
    type: string;
    // rows: any[];
}

export class DecisionTableRows{
    id?: number;
    name: string;    
}
export class DecisionTableParameters {
    id?: number;
    parameterName: string;
    parameterType: Datatype;
}

export class DecisionTableValueTree{
    id?: number;
    name: string;
    children?: DecisionTableValueTree[];
    expanded?: boolean;
}