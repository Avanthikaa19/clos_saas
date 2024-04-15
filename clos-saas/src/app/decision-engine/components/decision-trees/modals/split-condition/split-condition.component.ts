import { Component, Inject, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { IntegerTable, Condition, TreeClusters, TreeNodes, DecisionTreeList} from '../../../../models/DecisionTrees';
import { DecisionTreesService } from '../../../../services/decision-trees.service';
import { ExampleHeaderComponent } from '../../../../components/query-variable/example-header/example-header.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NotifierService } from 'angular-notifier';
import { DecisionTableValueTree, DecisionTableList } from '../../../../models/DecisionTable';
import { UrlService } from '../../../../services/http/url.service';
import { ObjectModelService } from '../../../../services/Object-model.service';

@Component({
  selector: 'app-split-condition',
  templateUrl: './split-condition.component.html',
  styleUrls: ['./split-condition.component.scss']
})
export class SplitConditionComponent implements OnInit {
  treeControl = new NestedTreeControl<DecisionTableValueTree>(node => node.children);
  matSource = new MatTreeNestedDataSource<DecisionTableValueTree>();
  matTreeData: DecisionTableValueTree[] = [];
  selectedNodeId: number = null as any;
  selectedNodeName: string = '';
  selectedNodeType: string = '';
  projectId: number = null as any;
  booleanDisplay: boolean = false;
  stringDisplay: boolean = false;
  dateDisplay: boolean = false;
  integerDisplay: boolean = false;
  conditionData:any;
  readonly ExampleHeaderComponent = ExampleHeaderComponent;
  start:Date;
  end:Date;
  start_date:any
  end_date:any
  loading: boolean = true;
  splitDisplay: boolean = false;
  splitData:Condition[]=[];
  splitDate:Condition[]=[];
  master_checked: boolean = false;
  all_checked: boolean = false;
  master_indeterminate: boolean = false;
  indeterminate_data: boolean = false;
  conditionalVarList:any[] = [];
  finalCond:any[]=[];
  dataArray:any[] = [];
  booleanSplit:string[] = [];
  spiltConditionData:any[] = [];
  selectedParam:string=""; 
  clusterData:TreeClusters[]=[];
  treeData:DecisionTreeList= null as any;
  tableData:IntegerTable[] = [ { lower: -Infinity, operator: "<=..<", upper: Infinity},
];
  displayedColumns: string[] = ['select',  'lower', 'operator','upper'];
  condition_name:string = '';
  dataSource = new MatTableDataSource<IntegerTable>(this.tableData)
  datatype:string='';
  constructor(
    private url: UrlService,
    public dialogRef: MatDialogRef<SplitConditionComponent>,private decisionTreeService: DecisionTreesService,
    private objectModelService: ObjectModelService,
    @Inject(MAT_DIALOG_DATA) public treeId: number,
    private notifierService: NotifierService
  ) {
  }

  hasChild = (_: number, node: DecisionTableValueTree) => !!node.children && node.children.length > 0;

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.treeCreation()

  }
//To create Date split condition
createDateSplit(){
  this.splitDate=[]    
  this.conditionData=this.conditionData.toUpperCase().trim();
  if(!this.dataArray.includes(this.conditionData) && this.conditionData!=''){
    this.dataArray.push(this.conditionData)
   }
   this.conditionData='';
   this.dataArray.forEach(data=>{    
    if((data!="NOW")&&(data!="NOW-1 D")){     
      let lower:any=data.split('..')[0].toUpperCase()
      let upper:any=data.split('..')[1].toUpperCase()
      let operator:any='<=..<'      
      let label =lower+operator+upper
      let splitDate=this.selectedNodeName+"=="+label
      let output=new Condition(label,splitDate,false);
      this.splitDate.push(output);  
    }
    else{     
      let label=" == " + data
      let splitDate=this.selectedNodeName + label
      let output = new Condition(label,splitDate,false);
      this.splitDate.push(output);
  
     label=" != " +data
     splitDate=this.selectedNodeName +label
     output = new Condition(label,splitDate,false);
     this.splitDate.push(output);  
    }    
   })
}



//To format relative day ranges
relativeDateChange(start:any, end:any){
  let data:any
  if(start =='now' && end =='now'){
   data='NOW'
  }
  else if(start =='now-1 d' && end =='now-1 d'){
   data='NOW-1 D'
  }
  else{
   data=start+'..'+end
 }
 return data
 }

//To create Integer split condition
splitIntegerFromInput(){
  this.tableData=[];
  if(!this.dataArray.includes(this.conditionData) && this.conditionData!=''){
   this.dataArray.push(this.conditionData)
  }   
   this.dataArray=this.dataArray.sort( function( a , b){
     if(a > b) return 1;
     if(a < b) return -1;
     return 0;
  });
  if(this.dataArray.length==1){     
    this.tableDataCreation('-Infinity',this.conditionData,'<')
    this.tableDataCreation(this.conditionData,'Infinity','>')
  }
  else if(this.dataArray.length>1){    
   this.tableDataCreation('-Infinity',this.dataArray[0],'<')
   
     for(var j=0; j<this.dataArray.length-1;j++){
          this.tableDataCreation(this.dataArray[j],this.dataArray[j+1],'<=..<')
   this.tableDataCreation(this.dataArray[this.dataArray.length -1],'Infinity','>')
     }
  }
   this.dataSource = new MatTableDataSource<IntegerTable>(this.tableData);
   console.log(this.tableData)
   this.conditionData=''
}

//To create mat table from tableData
tableDataCreation(lower:string,upper:string,operator:string){
  this.tableData.push({lower:lower,upper:upper,operator:operator})
  }
  
//To convert values from date picker
onChange(start: any,end: any){
  this.start=new Date(start.value)
  this.end=new Date(end.value)
  if (sessionStorage.getItem('start') !== null) {      
    this.start_date=sessionStorage.getItem('start')
    this.end_date=sessionStorage.getItem('end')
    sessionStorage.removeItem('start')
  } else if (sessionStorage.getItem('end') !== null){    
    this.end_date=sessionStorage.getItem('end')
    sessionStorage.removeItem('end')
  }
  else{    
  this.start_date=formatDate(this.start, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  this.end_date=formatDate(this.end, 'yyyy-MM-dd HH:mm:ss', 'en-US');    
 }
 this.conditionData=this.relativeDateChange(this.start_date,this.end_date) 
}

master_change() {
  if(this.splitData.length > 0) {    
    for (let value of Object.values(this.splitData)) {
      value.checked = this.master_checked;
    }
  }
  else if(this.splitDate.length > 0) {    
    for (let value of Object.values(this.splitDate)) {
      value.checked = this.master_checked;
    }
  }
  
}
//To create split condition 
createSplitCondition(){
  this.splitDisplay=true;
  this.selectedNodeType= this.selectedNodeType.toLowerCase();
if(this.selectedNodeType=='string' || this.selectedNodeType=='str'){  
this.stringDisplay=true;
this.conditionData='';
this.booleanDisplay=false;
this.integerDisplay=false;
this.dateDisplay=false;

}
else if(this.selectedNodeType=='boolean' || this.selectedNodeType=='boolean'){
  let data=this.selectedNodeName+" == "+"True"
  this.booleanSplit.push(data);
   data=this.selectedNodeName+" == "+"False"
   this.booleanSplit.push(data);
  this.booleanDisplay=true;
  this.stringDisplay=false;
  this.integerDisplay=false;
  this.dateDisplay=false;

}
else if(this.selectedNodeType=='integer' || this.selectedNodeType=='int' ||this.selectedNodeType=='float'){
  this.conditionData=''
  this.integerDisplay=true;
  this.booleanDisplay=false;
  this.stringDisplay=false;
  this.dateDisplay=false;
}
else if(this.selectedNodeType=='dateTime' || this.selectedNodeType=='datetime' ||this.selectedNodeType=='Time'){
  console.log(this.selectedNodeType)
  this.conditionData=this.start_date
  this.integerDisplay=false;
  this.booleanDisplay=false;
  this.stringDisplay=false;
  this.dateDisplay=true;
}
else{
  console.log(this.selectedNodeType)
}
}
 applyCondition(){
   this.splitDisplay=true;
   this.createSplitCondition()
 }

//To create String split condition
createStringSplit(){
  this.splitData=[]
  this.conditionData=this.conditionData.toUpperCase();
  if(!this.dataArray.includes(this.conditionData) && this.conditionData!=''){
    this.dataArray.push(this.conditionData)
   }
   this.conditionData='';
   this.dataArray.forEach(data=>{
    let label=" == " + data
    let splitData=this.selectedNodeName + label
    let output = new Condition(label,splitData,false);
  this.splitData.push(output);
  
  label=" != " +data
  splitData=this.selectedNodeName +label
    output = new Condition(label,splitData,false);
    this.splitData.push(output);  
   })
   console.log( "split",this.splitData)
}
list_change() {
  let checked_count = 0;
  if(this.splitData){
    for (let value of Object.values(this.splitData)) {
      if (value.checked)
        checked_count++;
    }
  }
  else if(this.splitDate){
    for (let value of Object.values(this.splitDate)) {
      if (value.checked)
        checked_count++;
    }
  }
  
  if ((checked_count > 0 && checked_count < this.splitData.length) || (checked_count > 0 && checked_count < this.splitDate.length)) {
    this.master_indeterminate = true;
  } else if ((checked_count == this.splitData.length) || (checked_count == this.splitDate.length)) {
    this.master_indeterminate = false;
    this.master_checked = true;
  } else {
    this.master_indeterminate = false;
    this.master_checked = false;
  }
}
all_change() {
  for (let value of Object.values(this.tableData)) {
    value.checked = this.all_checked;
  }
}
check_change() {
  let checked_count = 0;
  for (let value of Object.values(this.tableData)) {
    if (value.checked)
      checked_count++;
  }
  if (checked_count > 0 && checked_count < this.tableData.length) {
    this.indeterminate_data = true;
  } else if (checked_count == this.tableData.length) {
    this.indeterminate_data = false;
    this.all_checked = true;
  } else {
    this.indeterminate_data = false;
    this.all_checked = false;
  }
}
  
  //FOR CREATE AND DISPLAY MAT TREE
treeCreation() {
  this.objectModelService.getDefaultObjectModel().subscribe(
    res => {
      console.log(res[0].schema)
      let children = res[0].schema.children;
      console.log(children)
  let parameterName = res[0].schema.name + " - " + res[0].schema.type;
  // this.mattreeData = children;

  if ( children) {
    children.forEach((e: { paramName: string; name: string; type: string; })=>{
  e.paramName = e.name + " - " + e.type;
})
  }
  this.matTreeData.push(
    {
      name: parameterName,
      children: res[0].schema.children,
    })
  
    console.log(this.matTreeData)
  this.matSource.data = this.matTreeData;   
    },
  )
  }
 
  selectedNode(nodeName: any) {
    console.log(nodeName)
    this.selectedNodeId = nodeName.id
    this.selectedNodeName = nodeName.name;
    this.selectedNodeType = nodeName.type;

  }

  

  onCloseClick() {
    this.dialogRef.close();
  }

  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        console.log(res.object_model.json.children);
        let children = res.object_model.json.children;
        children.forEach((e: any) => {
          console.log(e);
          let dataType = e.name;
        });
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  
//To display integer split node conditions
conditionFormat(cond:any){
  let low=cond.lower
  let high=cond.upper
  let positive_max='Infinity';
  let negative_min='-Infinity';
  if (low==negative_min)
  {    
    this.condition_name=cond.operator+cond.upper   
  }
  else if( high==positive_max){
    this.condition_name=cond.operator+cond.lower    
  }
  else{    
    this.condition_name=cond.lower+cond.operator+cond.upper   
  } 
  return this.condition_name  
}
  applySplit(){
    // this.selectedParam.push(this.selectedNodeName)
    if(this.selectedNodeType=='string' || this.selectedNodeType=='str'){
      let filterOutput=this.splitData.filter(split=>split.checked==true);
      filterOutput.forEach(filter=>{
      this.spiltConditionData.push({"name":filter.name, "condition":filter.condition ,"datatype":"string"})
    })}
    else if(this.selectedNodeType=='integer' || this.selectedNodeType=='int'|| this.selectedNodeType=='float'){
        let filterOutput=this.tableData.filter(data=>data.checked==true);
        filterOutput.forEach(filter=>{      
        let name:string=this.conditionFormat(filter)
        this.spiltConditionData.push({"name":name, "condition":this.selectedNodeName+"="+filter.lower+filter.operator+filter.upper,"datatype":"integer"})
      })}
    else if(this.selectedNodeType=='dateTime' || this.selectedNodeType=='date'|| this.selectedNodeType=='datetime'){
        let filterOutput=this.splitDate.filter(data=>data.checked==true);
        filterOutput.forEach(filter=>{ 
        this.spiltConditionData.push({"name":filter.name, "condition":filter.condition,"datatype":"dateTime"})
      })}    
    this.dialogRef.close({"splitCondition":this.spiltConditionData,"clustertype":this.selectedNodeType,"clusterName":this.selectedNodeName});
  }
  }   


