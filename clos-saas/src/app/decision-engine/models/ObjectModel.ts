export class ObjectModel {
    constructor(
        public name: string,
        public type: string,
        public id : string,
        public children?: ObjectModel[],
        public project_id?: number,
        public is_selected?: boolean
    ) { }
}

export class Datatype {
    constructor(
        public name: string,
        public type: string,
        public paramName?: string,
        public children?: Datatype[],
        public checked?: boolean
    ) { }
}

export class ObjectModelDetail {
    id: number;
    alias_name: string;
    description: string;
    name: string;
    progress: string;
    created_by: string;
    created_on: Date;
    status: string;
    object_model: number;
}

export class ObjectModelDefaultId {
    object_id: number;
}

export class ObjectModelList {
    id: number;
    name: string;
    path: string;
    status: string;
    type: string;
    created_on: Date;
    created_by: string;
    json: Datatype;
    fields: ObjectModelFieldDetail[];
    is_default?: boolean;
}

export class ObjectModelFieldDetail {
    id: number;
    name: string;
    children: ObjectModelFieldDetail[];
    type: string;
    description: string;
    tag: string;
    in_use: string;
    source: string;
    others: string;
    parent: number;

    //For UI Use
    editableMode: boolean;
}


export class DbConnection{
    id: number;
    name: string;
    type: string;
    db_connection: DbDetail;
    is_default: boolean;
    created_by: string;
    created_on: Date;
    status: string
}

export class DbDetail{
    user: string;
    database: string;
    host: string;
    password: string;
    port: string;
}