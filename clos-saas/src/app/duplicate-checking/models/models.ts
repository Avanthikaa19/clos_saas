export class DuplicateModel {
    constructor(
        public allCustomerApplicationModel: application,
         public sortAsc: string,
         public sortOrder: string,
        public page: number,
        public pageSize: number
    ){}
}


export class application {
    constructor(
        public id: string,
        public ewbUploadDate: string,
        public sourceCode: string,
        public firstName: string,
        public middleName: string,
        public lastName: string
    ){}
}
export class displayFields {
    constructor(
 
    public  fieldName:any[],
    public  subFieldName:string,
    public  displayName:string,
    public  lockColumn:boolean,
    public  sortAsc:boolean,
    public  sortOrder:number,
    public  searchText:any[],

    ){}
}
export class configurations {
    constructor(
        public name: string,
        public dbName: string,
        public host: string,
        public port: string,
        public username: string,
        public password: string
    ){}
}

export class config {
    constructor(
        public tableName: string,
        public name: string,
        public description: string,
        public fieldsDetails: fieldsDetails[]
    ){}
}

export class fieldsDetails {
    constructor(
        public tableFields: [],
        public characters: [],
        public applicationFields: []
    ){}
}

export class displayFields1 {
    constructor(
 
    public  fieldName:string,
    public  subFieldName:string,
    public  displayName:string,
    public  lockColumn:boolean,
    public  sortAsc:boolean,
    public  sortOrder:number,
    public  searchText:any[],
    ){}
}