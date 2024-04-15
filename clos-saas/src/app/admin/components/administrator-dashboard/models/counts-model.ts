export class Count {
    users: number;
    roles: number;
    templates: number;
}

export class audit {
    constructor(
    public fieldName: string,
    public displayName: string,
    public lockColumn: boolean,
    public sortAsc: boolean,
    public isExport: boolean,
    public dateFormat: string,
    public searchText: string,
    public dropDownList:[],
    public columnDisable: boolean,
    public searchItem:[]
    ){}
}
