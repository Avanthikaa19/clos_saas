import { AccessTemplate } from "../../access-templates/models/AccessTemplate";
 
  
export class Role{
    isChecked:boolean;
    constructor(
        public id: number,
        public systemDefined: boolean,
        public name: string,
        public description: string,
        public created: string,
        public defaultAccessTemplate: AccessTemplate[],
        public originId:number,
        public version:number,
        public finalVersion:boolean,
        public createByUser:string,
        public finalizedByUser: string,
        public createdOn: string
    ){}
}

export class RoleFilter{
    constructor(
        public id: number,
        public systemDefined: boolean,
        public name: string,
        public description: string,
        public created: string,
        public defaultAccessTemplate: AccessTemplate[],
        public originId:number,
        public version:number,
        public finalVersion:boolean,
        public createByUser:string,
        public finalizedByUser: string,
        public createdOn: string
        ){}
}
export class MultiSort{
    sortingOrder: string;
    orderBy: string;
}

export class RolesFilterSort{
    filter: RoleFilter;
    sort: MultiSort[];
}

export class ExportFile{
    filter: RolesFilterSort;
    // columnDefinitions: ColumnDefinition[];
}