export class Functions{
    id: number;
    name: string;
    desc: string;
    project:number;
    import_package:ImportData[];
    import_function:ImportData[];
    python_code: string;
    created_by: string;
    created_on: string;
}
export class ImportData{
    constructor(
        public name: string,
       public alias_name: string,
    public    checked:boolean,
    public disabled: boolean,
    public funConfig?:any)
        {}
   
}