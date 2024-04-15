
import { Datatype } from "./ObjectModel";
export class DatabaseConfig{
    dbName: string;
    tableName: string;
}

export class DatabaseParameters {
    id?: number;
    parameterName: string;
    parameterType: Datatype;
}

export class DatabaseTree{
    id?: number;
    name: string;
    children?: DatabaseTree[];
    expanded?: boolean;
}