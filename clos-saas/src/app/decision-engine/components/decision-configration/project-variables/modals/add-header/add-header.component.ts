import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DecisionTableParameters, DecisionTableValueTree } from '../../../../../models/DecisionTable';
import { Datatype } from '../../../../../models/ObjectModel';
import { UrlService } from '../../../../../services/http/url.service';
import { ObjectModelService } from '../../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-add-header',
  templateUrl: './add-header.component.html',
  styleUrls: ['./add-header.component.scss']
})
export class AddHeaderComponent implements OnInit {

  constructor(private url: UrlService,
    private selectedProject: DecisionEngineIdService,
    private objectModelService: ObjectModelService,
    public dialogRef: MatDialogRef<AddHeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedParam:DecisionTableParameters[]
    
    ) { }
    hasChild = (_: number, node: DecisionTableValueTree) => !!node.children && node.children.length > 0;

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  treeControl = new NestedTreeControl<DecisionTableValueTree>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DecisionTableValueTree>();
  treeData: DecisionTableValueTree[] = [];
  selectedNodeId: number = null as any;
  selectedNodeName: string = '';
  projectId: number = null as any;
  dataType: string = '';
  params: Datatype[]=[];
  selectedNodeData:any={"nodeName":"","nodeType":""}

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    // this.refreshTreeData();
    console.log('Selected Project', this.selectedProject.selectedProjectId);
    this.projectId = this.selectedProject.selectedProjectId;
   this.treeCreation(this.selectedParam)
  }

  selectedNode(nodeName: string,nodeType: string) {
    this.selectedNodeName = nodeName;
    console.log(this.selectedNodeName);
    this.selectedNodeData.nodeName = nodeName;
    this.selectedNodeData.nodeType = nodeType;
    console.log(this.selectedNodeData); 
  }

  onCreateClick() {
    console.log(this.dataType, this.selectedNodeName,);
    let myStr = this.selectedNodeName;
    let result = {"type":this.dataType,"data":this.selectedNodeData}
    console.log(result);
    this.dialogRef.close(result); 
    
  }
  onCloseClick() {
    this.dialogRef.close();
  }
  // getDefaultObject() {
  //   this.objectModelService.getDefaultObjectModel(this.projectId).subscribe(
  //     res => {
  //       console.log(res);
  //       let children = res[0].schema;
  //       this.params = children;
  //       console.log('Children', this.params);
  //       this.treeCreation(this.params)
  //     }
  //   )
  // }
  treeCreation(params:any){
    this.treeData=[];
    console.log(params)
    params.forEach((e: { parameterType: { name: string; type: string; children: any[]; }; }) => {
      let parameterName = e.parameterType.name + " - " + e.parameterType.type;
      if (e.parameterType.children) {
        console.log('Parameter Children', e.parameterType.children);
        e.parameterType.children.forEach(e => {
          e.paramName = e.name + " - " + e.type;
        }
        )
      }
      this.treeData.push(
        {
          name: parameterName,
          children: e.parameterType.children,
        }
      )
    });
    this.dataSource.data = this.treeData;
}
}