import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DecisionTableValueTree } from '../../../../models/DecisionTable';
import { Functions } from '../../../../models/Function';
import { FunctionService } from '../../../../services/function.service';
import { UrlService } from '../../../../services/http/url.service';
import { ObjectModelService } from '../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-action-function',
  templateUrl: './action-function.component.html',
  styleUrls: ['./action-function.component.scss']
})
export class ActionFunctionComponent implements OnInit {

  constructor(
    private url: UrlService,
    public dialogRef: MatDialogRef<ActionFunctionComponent>,
    private objectModelService: ObjectModelService,
    @Inject(MAT_DIALOG_DATA) public actionData:any, private functionService: FunctionService,

    private selectedProject: DecisionEngineIdService,

  ) { }
hasChild = (_: number, node: DecisionTableValueTree) => !!node.children && node.children.length > 0;
treeControl = new NestedTreeControl<DecisionTableValueTree>(node => node.children);
  matSource = new MatTreeNestedDataSource<DecisionTableValueTree>();
  matTreeData: DecisionTableValueTree[] = [];
  projectId: number = null as any;
  selectedNodeName: string = '';
  splitDisplay: boolean = false;
  selectedNodeId: number = null as any;
  selectedNodeType: string = '';selectedFunction: number;
  onSelectFunction: Functions = null as any;
  onSelectFunctionString: string = '';
  functionsList: Functions[] = [];
loading: boolean = false;
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
  // this.refreshTreeData();
  // console.log('Selected Project', this.selectedProject.selectedProjectId);
  // this.projectId = this.selectedProject.selectedProjectId;
  this.treeCreation()
  this.getFunctionsList()

}
onCreateClick() {
  this.onSelectFunctionString = JSON.stringify(this.onSelectFunction);
  this.dialogRef.close({"name": this.selectedNodeName,"function": this.onSelectFunction })
}
onCloseClick() {
  this.dialogRef.close()
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
  applyAction(){
    this.splitDisplay=true;
  }

  getFunctionsList() {
    this.loading=true;
    this.functionService.getFunctionsList(this.selectedProject.selectedProjectId).subscribe(
      (res:any)=>{
        console.log(res);
        this.functionsList = res;
        this.loading= false;
      },
      (err)=>{
        console.log(err);
      }
    )
  }
  selectfunction(functionData: Functions) {
    this.selectedFunction = functionData.id;
    console.log("clicked")
    this.onSelectFunction = functionData;
  }
  oncancelClick() {
    this.dialogRef.close();

  }


}
