import { AccessTemplate } from "../../access-templates/models/AccessTemplate";
import { Role } from "../../roles/models/Role";
import { User } from "../../users/models/User";

export class Group {
    isChecked: boolean;
    constructor(
        public id: number,
        public name: string,
        public country: string,
        public murexId: number,
        public description: string,
        public systemDefined: boolean,
        // public roleTemplates: RoleTemplate[],
        public roleTemplates: any[],
        public users: User[],
    ) { }
}
export class RoleTemplate {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public created: Date,
        public role: Role[],
        public accessTemplates: AccessTemplate[],
        public isChecked?: boolean,
    ) { }
}
export class GroupFilter {
    constructor(
        public id: number,
        public murexId: number,
        public name: string,
        public description: string,
        public roleName: Role,
       
    ) { }
}
export class MultiSort {
    sortingOrder: string;
    orderBy: string;
}
export class GroupsFilterSort {
    filter: GroupFilter;
    sort: MultiSort[];
}
export class RoleTemplateFilter {

    constructor(
        public id: number,
        public name: string,
        public description: string,
        public role: string,
        public accessTemplates: string,
    ) { }
}
export class RoleTemplateFilterSort {
    filters: RoleTemplateFilter;
    sort: MultiSort[];
}
export class ExportFile{
    filter: GroupsFilterSort;
    // columnDefinitions: ColumnDefinition[];
}
