import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
// import { SearchBand } from "../dashboard/browserdataservice";
import { SearchScope } from "./models/model";
import { CustomiseDashboard } from "./models/model";
import { CustomServiceService } from "./service/custom-service.service";

@Injectable({
    providedIn: 'root'
  })

export class DynamicCaheService{
    constructor(public dynamicCache:CustomServiceService,
        public datepipe:DatePipe,){}
    allTemplate:CustomiseDashboard[];
    searchScope:SearchScope=new SearchScope(6,'Templates');
    totalCount:any;
    createdDate=new Date();

async getTemplates(){
    if(this.allTemplate==undefined){
       await this.dynamicCache.getTypesOfTemplate(this.searchScope.pageSize,1,'','desc','id').pipe().toPromise().then(
           async res=>{
               this.allTemplate=res['data'];
               this.totalCount=res['count'];
               this.sortReconJobs();
           }
       )
    }
   return {data:this.allTemplate,count:this.totalCount}
}
sortReconJobs(){
    let sortedList=this.allTemplate;
    this.allTemplate=sortedList?.slice();
    this.allTemplate?.sort((a,b)=>a.createdDate>b.createdDate?1:-1)
   }
}