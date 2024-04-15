import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DecisionFlowValueTree, FlowTasks } from '../../../../models/DecisionFlow';
import { Datatype } from '../../../../models/ObjectModel';
import { ObjectModelService } from '../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { ExampleHeaderComponent } from '../../../../components/query-variable/example-header/example-header.component';

@Component({
  selector: 'app-assign-condition',
  templateUrl: './assign-condition.component.html',
  styleUrls: ['./assign-condition.component.scss']
})
export class AssignConditionComponent implements OnInit {
  readonly ExampleHeaderComponent = ExampleHeaderComponent;
  conditionenable:boolean = false;
  treeControl = new NestedTreeControl<DecisionFlowValueTree>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DecisionFlowValueTree>();
  treeData: DecisionFlowValueTree[] = [];
  selectedNodeName: string = '';
  start:Date;
  end:Date;
  start_date:any
  end_date:any
  projectId: number = null as any;
  selectedNodeData: any = { "nodeName": "", "nodeType": "" }
  objectData: FlowTasks;
  booleanTypes: string[] = [];
  integerTypes: string[] = [];
  stringTypes: string[] = [];
  dateTypes:string[] = [];
  resultSelect: string = ''
  conditionData:any;
  booleanEnable: boolean = false;
  integerEnable: boolean = false;
  stringEnable: boolean = false;
  dateEnable: boolean = false;
 mattreeData:Datatype[] = []
  constructor(

    private objectModelService: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    public dialogRef: MatDialogRef<AssignConditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FlowTasks,
  ) {
    this.objectData = data;
    this.projectId = this.selectedProject.selectedProjectId;

  }

  hasChild = (_: number, node: DecisionFlowValueTree) => !!node.children && node.children.length > 0;

  
  ngOnInit() {
    console.log(this.objectData)
    this.treeCreation()

  }
//FOR CREATE AND DISPLAY MAT TREE
treeCreation() {
  this.objectModelService.getDefaultObjectModel().subscribe(
    res => {
      console.log(res[0].schema)
      let children = res[0].schema.children;
      console.log(children)
  let parameterName = res[0].schema.name + " - " + res[0].schema.type;
  this.mattreeData = children;

  if ( this.mattreeData) {
this.mattreeData.forEach(e=>{
  e.paramName = e.name + " - " + e.type;
})
  }
  this.treeData.push(
    {
      name: parameterName,
      children: this.mattreeData,
    })
  
    console.log(this.treeData)
  this.dataSource.data = this.treeData;   
    },
  )
  }

  //TO GET SELECTED MAT TREE NODE NAME AND TYPE 
  selectedNode(nodeName: string, nodeType: string) {
    this.stringEnable = false;
    this.integerEnable = false;
    this.selectedNodeName = nodeName;
    this.selectedNodeData.nodeName = nodeName;
    this.selectedNodeData.nodeType = nodeType;
  }
//FOR SELECT CONDITION
  selectCondition() { 
    this.conditionData='';
    this.conditionenable=false;
    this.resultSelect=''   
    this.stringTypes=[];
    this.booleanTypes = [];
    this.integerTypes = [];
    this.selectedNodeData.nodeType = this.selectedNodeData.nodeType.toLowerCase();
    if (this.selectedNodeData.nodeType == "integer" || this.selectedNodeData.nodeType == "float" || this.selectedNodeData.nodeType == "int") {
      this.integerEnable = true;
      this.stringEnable = false;
      this.booleanEnable = false;
      this.dateEnable=false;
    }
    else if (this.selectedNodeData.nodeType == "string" || this.selectedNodeData.nodeType == "str") {
      this.stringEnable = true;
      this.booleanEnable = false;
      this.integerEnable = false;
      this.dateEnable=false;
    }
//FOR CREATING BOOLEAN CONDITIONS
    else if (this.selectedNodeData.nodeType == "boolean" || this.selectedNodeData.nodeType == "bool") {
      this.booleanEnable = true;
      this.stringEnable = false;
      this.dateEnable=false;
      this.booleanTypes = []
      let booleandata = this.selectedNodeData.nodeName + " == " + "TRUE"
      console.log(booleandata);
      this.booleanTypes.push(booleandata);
      booleandata = this.selectedNodeData.nodeName + " == " + "FALSE"
      this.booleanTypes.push(booleandata);
    }
    else if (this.selectedNodeData.nodeType == "datetime" || this.selectedNodeData.nodeType == "dateTime") {
      this.stringEnable = false;
      this.booleanEnable = false;
      this.integerEnable = false;
      this.dateEnable=true;

    }

  }
  //API CALL TO GET DEFAULT OBJECTMODEL DATA USING SELECTED PROJECT ID
  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        let children = res[0].schema.children;
        this.mattreeData = children;
        
      },
    )
  }
//FOR CREATING INTEGER CONDITIONS
  integerCondition() {
    this.integerTypes = [];
    this.integerTypes.push(this.selectedNodeData.nodeName + " > " + this.conditionData);
    this.integerTypes.push(this.selectedNodeData.nodeName + " < " + this.conditionData);
    this.integerTypes.push(this.selectedNodeData.nodeName + " <= " + this.conditionData);
    this.integerTypes.push(this.selectedNodeData.nodeName + " >= " + this.conditionData);
    this.integerTypes.push(this.selectedNodeData.nodeName + " == " + this.conditionData);
    this.integerTypes.push(this.selectedNodeData.nodeName + " != " + this.conditionData);
    this.conditionenable=true;   
    this.resultSelect='';
  }
  //FOR CREATING STRING CONDITIONS
  stringCondition() {
    this.stringTypes = []
    this.selectedNodeData.nodeName = this.selectedNodeData.nodeName;
    console.log(this.selectedNodeData.nodeName)
    console.log(this.conditionData)
    this.stringTypes.push(this.selectedNodeData.nodeName + " == " + this.conditionData);
    this.stringTypes.push(this.selectedNodeData.nodeName + " != " + this.conditionData);
    console.log(this.stringTypes)
    this.conditionenable=true;   
    this.resultSelect='';
  }
  //FOR CREATING DATE CONDITIONS
  dateCondition() {
    this.dateTypes = []   
    this.selectedNodeData.nodeName = this.selectedNodeData.nodeName;
    console.log(this.selectedNodeData.nodeName)
    console.log(this.conditionData)
    let lower=this.conditionData.split('..')[0]
    let upper=this.conditionData.split('..')[1]
    if(lower && upper){
      // this.dateTypes.push(lower+" < "+this.selectedNodeData.nodeName + " < " + upper);      
      // this.dateTypes.push(lower+" <= "+this.selectedNodeData.nodeName + " <= " + upper);
      this.dateTypes.push(this.selectedNodeData.nodeName + " == "+lower+"<..<"+upper);      
      this.dateTypes.push(this.selectedNodeData.nodeName + " == " +lower+"<=..<=" +upper);
      this.dateTypes.push(this.selectedNodeData.nodeName + " == "+lower+"<=..<"+upper);      
      this.dateTypes.push(this.selectedNodeData.nodeName + " == " +lower+"<..<=" +upper);
    }
    else{
      this.dateTypes.push(this.selectedNodeData.nodeName + " == " + this.conditionData);
      this.dateTypes.push(this.selectedNodeData.nodeName + " != " + this.conditionData);
    }   
    this.conditionenable=true;   
    this.resultSelect=''; 
  }
  
//CLOSE POPUP WITH CONDITION DATA
  onCreateClick() {
    this.dialogRef.close({ "result": this.resultSelect, "type": this.selectedNodeData.nodeType });

  }
  relativeDateChange(start:any, end:any){
    let data:any
  if(start =='now' && end =='now'){
    data='NOW'
  }
  else if(start =='now-1 d' && end =='now-1 d'){
    data='NOW-1 D'
  }
  else{
    if((typeof(start)=='string') || (typeof(end)=='string')){
      console.log('string')
      data=start.toUpperCase()+'..'+end.toUpperCase()
    }  
    else{
      data=start+'..'+end
    } 
    
  }
  return data
  }
  onChange(start: any,end: any){
    this.start=new Date(start.value)
    this.end=new Date(end.value)
    console.log(start.value,end.value,this.start,this.end)
  
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
  console.log(this.start_date,this.end_date); 
  this.conditionData =this.relativeDateChange(this.start_date,this.end_date)
  }
//CANCEL OPERATION
  onCloseClick() {
    this.dialogRef.close();
  }


}
