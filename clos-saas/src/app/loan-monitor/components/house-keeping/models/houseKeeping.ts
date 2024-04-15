export class HouseKeepingJob{
    public jobName:string;
    public id:number;
    public databaseName:string;
    public tableName:string;
    public logic:string;
    public process:string;
    public dateFrom:string;
    public startTime:string;
    public method:string;
    public archiveTable:string;
    public dateTo:string;
    public status:string;
    public scheduler:string;
}
export class HouseKeepingJobDropdown{
    public databaseName:any;
    public tableName:any;
    public logic:string[];
    public process:string[];
    public method:string[];
    public archiveTable:string[];
    public scheduler:string[];
}
export class HouseKeepingJobFields{
    public jobLabel:string;
    public jobType:string;
    public jobField :string;
    public isVisible :boolean ;
   
}
export class HouseKeepingJobDetails{
    public houseKeepingJobFields :HouseKeepingJobFields[]


}