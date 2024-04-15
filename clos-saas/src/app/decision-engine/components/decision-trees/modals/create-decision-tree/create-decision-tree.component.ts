import { Component, Inject, OnInit } from '@angular/core';
import { DecisionTreeList,DecisionTreeParameters } from '../../../../models/DecisionTrees';
import { Datatype } from '../../../../models/ObjectModel';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DecisionTreesService } from '../../../../services/decision-trees.service';
import { UrlService } from '../../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { ObjectModelService } from '../../../../services/Object-model.service'
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DecisionFlowValueTree } from '../../../../models/DecisionFlow';
export class NodeData{
  public nodeName:string;
  public nodeType:string;
}
@Component({
  selector: 'app-create-decision-tree',
  templateUrl: './create-decision-tree.component.html',
  styleUrls: ['./create-decision-tree.component.scss']
})
export class CreateDecisionTreeComponent implements OnInit {
  projectId: number = null as any;
  params: Datatype[] = [];
  treeDetails: DecisionTreeList = new DecisionTreeList();
  selectedParam:Datatype[]=[];
  conditionTab: boolean=false;
  actionTab: boolean=false;
  decisionTreeTab: boolean=true;
  selectedConditionsNode:NodeData[] = [];
  conditionData:any[] = [];
  selectedActionsNode:any={ "nodeName": "", "nodeType": "" };
  conditionDisabled:boolean=false;
  master_indeterminate: boolean = false;
  master_checked: boolean = false;
  loading: boolean = true;
  constructor(
    private url: UrlService,   
    private decisionTreeService: DecisionTreesService,
    private selectedProject: DecisionEngineIdService,
    private objectModelService: ObjectModelService,
    public dialogRef: MatDialogRef<CreateDecisionTreeComponent>,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public decisionTreeData:DecisionTreeList
  ) { 
    if(this.decisionTreeData){
      this.treeDetails=this.decisionTreeData;
    }
  }

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
    console.log('Selected Project', this.selectedProject.selectedProjectId);
    this.projectId = this.selectedProject.selectedProjectId;
    this.getDefaultObject();
  

  }
  hasChild = (_: number, node: DecisionFlowValueTree) => !!node.children && node.children.length > 0;
  treeControl = new NestedTreeControl<DecisionFlowValueTree>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DecisionFlowValueTree>();
  treeData: DecisionFlowValueTree[] = [];
  selectedNodeData: any = { "nodeName": "", "nodeType": "" }
  selectedNodeName: string = '';
 
  master_change() {
    for (let value of Object.values(this.params)) {
      value.checked = this.master_checked;
    }
  }
  list_change() {
    let checked_count = 0;
    for (let value of Object.values(this.params)) {
      if (value.checked)
        checked_count++;
    }
    if (checked_count > 0 && checked_count < this.params.length) {
      this.master_indeterminate = true;
    } else if (checked_count == this.params.length) {
      this.master_indeterminate = false;
      this.master_checked = true;
    } else {
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }



  errMsg(): any{
    if(!this.treeDetails.name){
      return '* Tree Name is a required field';
    }
    else if(this.treeDetails.description){
      return ''
    }
    return '';
  }
//To create mat tree using selected parameter
  treeCreation(params: any[]) {
    console.log(params)
    params.forEach(param=>{
    let parameterName = param.name + " - " + param.type;
    console.log(parameterName)
    if (param.children) {
      console.log('Parameter Children', param.children);
      param.children.forEach((e: { paramName: string; name: string; type: string; }) => {
        e.paramName = e.name + " - " + e.type;
      } ) }
    this.treeData.push({ name: parameterName, children: param.children, })
  })
    console.log(this.treeData)
    this.dataSource.data = this.treeData;
  }
//To Display condition variable tree
displayConditionVar(){
  // console.log(this.selectedParam)
  // this.selectedParam=this.params.filter(param=>param.checked==true)
  // console.log(this.selectedParam)
  // this.treeData=[]
  // this.treeCreation(this.selectedParam);
  this.decisionTreeTab=false
  this.conditionTab=true;
}
//to display action variable tree
displayActionVar(){
  this.conditionTab=true;
  this.conditionDisabled=true
  this.actionTab=true;
}
conditionBack(){
  this.decisionTreeTab=true;
  this.conditionTab=false;
}
actionBack(){
  this.conditionTab=true;
  this.actionTab=false;
}
  //Api call to create new decisiontree with selected data
  createTreeList() {
    this.treeDetails.project = this.projectId;
    let parameters={"condition":this.selectedConditionsNode,"action":this.selectedActionsNode}
    this.treeDetails.parameters=parameters;
this.dialogRef.close(this.treeDetails);
    // this.decisionTreeService.createDecisionTree(this.treeDetails).subscribe(
    //   res => {
    //     this.showNotification('success','Created Successfully.')
    //     this.dialogRef.close()
       
    //   },
    //   (err)=>{
    //     this.showNotification('error','Oops! Something Went Wrong.')
    //   }
    // )
  }
 
//mat checkbox change event function for selecting condition variable data
  selectedConditionNode(nodeName: string, nodeType: string, e: any){
    let data={"nodeName": nodeName, "nodeType":nodeType }
    if (!e.checked) {
      let index=this.conditionData.indexOf(nodeName)
      this.conditionData.splice(index,1)
      let i = this.selectedConditionsNode.indexOf(data)
      this.selectedConditionsNode.splice(i, 1);
     console.log( this.selectedConditionsNode)
    } 
    else if (e.checked){
      this.conditionData.push(nodeName)
      this.selectedConditionsNode.push(data);
      console.log( this.selectedConditionsNode);
    }
}

  selectAction(name:any,type:string){
    this.selectedNodeName=name;
    this.selectedActionsNode={"nodeName":name,"nodeType":type}
    console.log( this.selectedActionsNode)
  }

//To get default object model for selected project
getDefaultObject() {
  this.objectModelService.getDefaultObjectModel().subscribe(
    res => {
      if(res){
      let children = res[0].schema.children;
      this.loading=false;
      this.params = children;
      console.log(this.params)
      this.treeCreation(this.params)
    }
    },
    (err)=>{
      this.showNotification('error','Oops! Something Went Wrong.')
    }
  )
}
showNotification(type: string, message: string) {
  this.notifierService.notify(type, message);
}

}