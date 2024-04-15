import { Group } from "../../groups/models/Group";
import { Role } from "../../roles/models/Role";

export class User {
    isChecked: boolean;
    constructor(
        public id: number,
        public murexId: number,
        public username: string,
        public firstName: string,
        public initial: string,
        public lastName: string,
        public birthdate: any,
        public gender: string,
        public emailId: string,
        public emailVerified: string,
        public mobileNumber: number,
        public mobileVerified: string,
        public addressLine1: string,
        public addressLine2: string,
        public addressLine3: string,
        public pincode: number,
        public country: string,
        public isLocked: boolean,
        public defaultProfileImage: string,
        public profileImage: string,
        public designation: string,
        public failedLogins: number,
        public lastLoginTimestamp: string,
        public creator: string,
        public editor: string,
        public settings: string,
        public localAccount: string,
        public created: string,
        public domain: string,
        public systemDefined: boolean,
        public groups: Group[],
        public groupsList: string[],
        public roles: Role[],
        public supervisingUser: string,
        public isSuspended: any,
        public department: any,
        public password?: any
    ) { }
}

export class UserFilter {
    constructor(
        public id: number,
        public murexId: number,
        public ldapId: number,
        public username: string,
        public firstName: string,
        public initial: string,
        public lastName: string,
        public lastNameFirst: string,
        public birthdate: any,
        public gender: string,
        public emailId: string,
        public emailVerified: string,
        public mobileNumber: number,
        public mobileVerified: string,
        public addressLine1: string,
        public addressLine2: string,
        public addressLine3: string,
        public pincode: number,
        public country: string,
        public isLocked: boolean,
        public defaultProfileImage: string,
        public profileImage: string,
        public designation: string,
        public failedLogins: number,
        public lastLoginTimestamp: string,
        public creator: string,
        public editor: string,
        public settings: string,
        public localAccount: string,
        public  jobId: number,
        public domain: string,
        public systemDefined: boolean,
        public groups: Group[],
        public groupsList: Group[],
        public roles: Role[],
        public supervisingUser: string,
        public isSuspended: any,
        public department: any,
        public createdTime:any,
        public employeeId:any,
    ) { }
}
 export class  managerUserFilter{
     constructor(
        public fieldName:string,
        public displayName:string,
        public lockColumn:boolean,
        public sortAsc:string,
        public  isExport:boolean,
        public searchText:string,
        public dropDownList:[],
        public searchItem:[],
        public filterDisable:boolean,
        public hideExport:boolean,
        public columnDisable:boolean,
     ){ }
 }
{ }


export class MultiSort{
    sortingOrder: string;
    orderBy: string;
}
//Filter & Sort 
export class UsersFilterSort{
    filter: UserFilter;
    sort: MultiSort[];
}

export class ExportFile{
    filter: UsersFilterSort;
    // columnDefinitions: ColumnDefinition[];
}