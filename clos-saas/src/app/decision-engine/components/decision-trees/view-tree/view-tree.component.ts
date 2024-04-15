import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { actionData, Cluster, DecisionTree, DecisionTreeList, NewNode, Nodes, TreeClusters, TreeNodes } from '../../../models/DecisionTrees';
import { Datatype } from '../../../models/ObjectModel';
import { DecisionTreesService } from '../../../services/decision-trees.service';
import { UrlService } from '../../../services/http/url.service';
import { Edge, MiniMapPosition,Node } from '@swimlane/ngx-graph';
import { MatMenuTrigger } from '@angular/material/menu';
import { SplitConditionComponent } from '../modals/split-condition/split-condition.component';
import { ActionnodeCreateComponent } from '../modals/actionnode-create/actionnode-create.component';
import { EditModalComponent } from '../modals/edit-modal/edit-modal.component';
import { NotifierService } from 'angular-notifier';
import { ActionFunctionComponent } from '../modals/action-function/action-function.component';
import { ChildNodeComponent } from '../modals/child-node/child-node.component';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-view-tree',
  templateUrl: './view-tree.component.html',
  styleUrls: ['./view-tree.component.scss']
})
export class ViewTreeComponent implements OnInit {
  data: number = null as any;
  decisionTreeData: DecisionTreeList;
  params: Datatype[] = [];
  selectednode: string = '';
  position: any = MiniMapPosition.UpperRight;
  value = 50;
  nodes: Node[] = [];
  links: Edge[] = [];
  clusters: any[] = [];
  treeNodes:TreeNodes[]=[]
  treeClusters: TreeClusters[] = [];
  decisionTreeId:number = null as any;
  nodetarget: string[] = [];
  selectedcluster: string = '';
  selectedClusterData:TreeClusters=null as any;
  selectedClusterNext:any[]=[]
  actionCluster:any=null as any;
  condCluster:any=[]
  editSelectedNode:TreeNodes=null as any;
  miniMapPosition: MiniMapPosition = MiniMapPosition.UpperLeft;
  prevId:any;
  loading: boolean = false;
  disableSave: boolean = false;
  color:any='red';
  // treeGraphOption: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private url: UrlService,
    private decisionTreeService: DecisionTreesService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
  ) {
    console.log(this.router.url)
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
    this.data = Number(this.route.snapshot.paramMap.get("id"));   
    this.getDecisionTreeById();    
  }

  datas = {
    name: 'Start',
    children:[
      {
        name:'== REVOLVING CREDIT LINE',
          children: [
            {
            name:'0<=..20000000',
            children: [
      {
        name: '== RETAIL',
        children: [
          {
            name: '50000000',
            value:'MIN LIMIT',
            label:{
                color: "white",
          backgroundColor: 'rgba(213, 200, 200, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          },
          {
             name: '1000000',
            value:'MAX LIMIT',
             label:{
                color: "white",
          backgroundColor: 'lightgreen',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          }
        ],
             label: {
          color: "grey",
          backgroundColor: 'rgba(254, 216, 216, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
      },
      {
        name: '== WHOLESALE',
        children: [
          {
            name: '50000000',
            value:'MIN LIMIT',
             label:{
                color: "white",
          backgroundColor: 'rgba(213, 200, 200, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          },
          {
             name: '1000000',
            value:'MAX LIMIT',
                    label:{
                color: "white",
          backgroundColor: 'lightgreen',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          }
        ],
                   label: {
          color: "grey",
          backgroundColor: 'rgba(254, 216, 216, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
      },
      {
        name: '== F&B',
        children: [
          {
            name: '50000000',
            value:'MIN LIMIT',
             label:{
                color: "white",
          backgroundColor: 'rgba(213, 200, 200, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          },
          {
             name: '1000000',
            value:'MAX LIMIT',
                    label:{
                color: "white",
          backgroundColor: 'lightgreen',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          }
        ],
                   label: {
          color: "grey",
          backgroundColor: 'rgba(254, 216, 216, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
      },
          {
        name: '== SERVICES',
        children: [
          {
            name: '50000000',
            value:'MIN LIMIT',
             label:{
                color: "white",
          backgroundColor: 'rgba(213, 200, 200, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          },
          {
             name: '1000000',
            value:'MAX LIMIT',
                    label:{
                color: "white",
          backgroundColor: 'lightgreen',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          }
        ],
                   label: {
          color: "grey",
          backgroundColor: 'rgba(254, 216, 216, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
      },
          {
        name: '== OTHERS',
        children: [
          {
            name: '50000000',
            value:'MIN LIMIT',
             label:{
                color: "white",
          backgroundColor: 'rgba(213, 200, 200, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          },
          {
             name: '1000000',
            value:'MAX LIMIT',
                    label:{
                color: "white",
          backgroundColor: 'lightgreen',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          }
        ],
                   label: {
          color: "grey",
          backgroundColor: 'rgba(254, 216, 216, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
      },
          {
        name: '== CONSTRUCTION',
        children: [
          {
            name: '50000000',
            value:'MIN LIMIT',
             label:{
                color: "white",
          backgroundColor: 'rgba(213, 200, 200, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          },
          {
             name: '1000000',
            value:'MAX LIMIT',
                    label:{
                color: "white",
          backgroundColor: 'lightgreen',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
            }
          }
        ],
                   label: {
          color: "grey",
          backgroundColor: 'rgba(254, 216, 216, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
      },
    ],
               label: {
          color: "grey",
          backgroundColor: 'rgba(255, 249, 130, 1)',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
            }
            ],
                       label: {
          color: "black",
          backgroundColor: 'skyblue',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
      }],
                 label: {
          color: "grey",
          backgroundColor: 'beige',
          borderRadius: [2, 2, 2, 2],
          padding: [6, 6, 6, 6]
        }
  };
  treeGraphOption:EChartsOption = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    legend: {
      show: false,
      top: '2%',
      left: '3%',
      orient: 'vertical',
      data: [
        {
          name: 'tree1',
          icon: 'rectangle'
        },
        {
          name: 'tree2',
          icon: 'rectangle'
        }
      ],
      borderColor: '#c23531'
    },
    series: [
      {
        type: 'tree',
        name: 'tree1',
        data: [this.datas],
        // top: '5%',
        // left: '7%',
        // bottom: '2%',
        // right: '60%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant'
        },
        expandAndCollapse: false,
        animationDuration: 550,
        animationDurationUpdate: 750
      },
    ]
  }

//GO BACK TO FLOW LISTING SCREEN
  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    console.log(t);
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/decisionTreeList'
    console.log(viewUrl)
    this.router.navigateByUrl(viewUrl)
  }

//TO EDIT NODE IN TREE
  nodeEdit(node:any){
    console.log("nodecreated",node)
    const dialog = this.dialog.open(EditModalComponent, {  width: '600px',data: node})
    dialog.afterClosed().subscribe(result =>{
      if(result){
      this.loading=true;
        this.decisionTreeService.updateNodeDataByID(node.id,node).subscribe(resutNodeData =>{
          console.log(resutNodeData)
      this.getDecisionTreeById()
      this.loading=false;
        this.showNotification('success', 'Condition Updated Successfully.');
        }
        ,err=>{
      this.loading=false;
          this.showNotification('error', 'Oops! Something Went Wrong.');
        }
        )
      }
    })
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

//TO EDIT NODE IN TREE
  nodeDelete(node:any){
    this.loading=true;
    let targetNodeId: number[]=[];
    let sourceNode:number;
    console.log(node)
    this.links.forEach(link =>{
      if(link.source == node.id){
        targetNodeId.push(+link.target)
      }
      if(link.target ==node.id){
        sourceNode = +link.source
      }
    })
    let deleteData={"target":targetNodeId, "source":sourceNode,"cluster":this.selectedClusterData.orgId}
    console.log(deleteData)
    this.decisionTreeService.deleteTreeNode(node.id,deleteData).subscribe(result =>{
      console.log(result)
      this.showNotification('success', 'Condition Deleted Successfully.');
      this.loading=false;
      this.getDecisionTreeById()
    },
    err=>{
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }
//TO GET DECISION TREE DATA
  getDecisionTreeById() {
    this.loading=true;
    this.decisionTreeService.getDecisionTreeById(this.data).subscribe(
      res => {    
        if(res) {
        console.log(res)   
        let node=res.tree_node        
        let cluster=res.tree_cluster
        let params=res.parameters
        this.decisionTreeData = res;
        this.decisionTreeId=res.id;    
        this.loadNodesClustersAndLinks(this.decisionTreeData )
        // this.updateDecisionTreeConfig(node,cluster,params);
        this.showNotification('default', 'Tree Loaded Successfully.');
      this.loading=false;
      } 
      return res
    },err=>{
      this.showNotification('error', 'Oops! Something Went Wrong.');
    }
    )
  }
  
  updateDecisionTreeConfig(node:any,cluster:any,params:any) {
    let config={"node":node,"cluster":cluster,"parameters":params}    
    this.decisionTreeService.updateOptimalTreeByID(this.data,config).subscribe(
      res=> {
        // this.decisionTreeData= res;
        console.log(res)
      }
    )
  }

  //LOAD NODES CLUSTERS AND LINKS -- CHANGING INTO GRAPH ACCEPTABLE FORMAT
  loadNodesClustersAndLinks(treeData:DecisionTreeList) {
    this.treeNodes = treeData.tree_node;
    this.treeClusters=treeData.tree_cluster;
    if(this.treeNodes){
      this.nodes = this.createTreeNodes(this.treeNodes);
      this.nodes=[...this.nodes]
      this.links = this.createLinksFromNodes(this.treeNodes);
      this.links=[...this.links]
    }
    if(this.treeClusters){
      this.clusters = this.createTreeClusters(this.treeClusters);
      this.clusters=[...this.clusters]
    }
  }

  //CREATE TREE NODES TO ACCEPTABLE NODE FORMAT
  createTreeNodes(treeNodes:any){
    let nodes: Nodes[] = [];
    for (let node of treeNodes) {
      let temp: Nodes = { id: node.id.toString(), label: node.name ,nextnode_id:node.nextnode_id,name:node.name,action:node.action,condition:node.condition,datatype:node.datatype}
      nodes.push(temp);
    }
    return nodes;
  }

  //FOR CREATING  LINKS IN DECISION GRAPH
  createLinksFromNodes(treeNodes: any[]): Edge[] {
    let links: Edge[] = [];
    for (let nodes of treeNodes) {
      if(nodes.nextnode_id.length>0){
        nodes.nextnode_id.forEach((nextId:number) => {
          links.push({source: nodes.id.toString(), target: nextId.toString() }); 
        })}}
    return links;
  }

  //CREATE TREE CLUSTERS TO ACCEPTABLE CLUSTER FORMAT
  createTreeClusters(treeclusters:any){
    let clusters: Cluster[] = [];
    for (let cluster of treeclusters) {  
      if(cluster.childNodeIds.length>0)  {
      let temp: Cluster = { id: cluster.id.toString()+new Date().toDateString(),orgId:cluster.id, label: cluster.name ,childNodeIds:cluster.childNodeIds,clustertype:cluster.clustertype,next_cluster_id:cluster.next_cluster_id,cluster_data_type:cluster.cluster_data_type}
      clusters.push(temp);
      }
    }
    return clusters;
  } 

  triggerfunc(rootdata: string = '', data: string = ''){
    // this.nodetarget=[];
    console.log(data)
    if(data!=''){
      this.selectednode = rootdata;
      this.links.filter(e=>{
        if(e.target==data){
          this.nodetarget.push(data)
          this.triggerfunc(this.selectednode, e.source)
        }
      })
    } else if(data=='') {
      this.nodetarget=[];
      this.selectednode = '';
    }
    // console.log(this.nodetarget)
  }

//TO GET SELECTED CLUSTER DATA WHILE CLICKING CLUSTER
  selectCluster(cluster:any){
    this.selectedcluster=cluster.orgId;
    console.log(this.selectedcluster);
  }

//TO GET SELECTED CLUSTER DATA WHILE CLICKING NODE
  clusterselect(data: string = ''){
    this.clusters.forEach(e => {
      e.childNodeIds.forEach((res:any)=>data==res?this.selectedcluster=e.orgId:'')
      if(e.orgId==this.selectedcluster){       
        this.selectedClusterData=e
        this.selectedClusterNext= e.next_cluster_id
      }
    });   
    console.log(this.selectedClusterData)
  }


//RIGHT CLICK MENU OPERATIONS
// we create an object that contains coordinates 
menuTopLeftPosition =  {x: '0', y: '0'} 
// reference to the MatMenuTrigger in the DOM 
@ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger; 

onRightClick(event: MouseEvent, item:any) { 
  // preventDefault avoids to show the visualization of the right-click menu of the browser 
  event.preventDefault(); 

  // we record the mouse position in our object 
  this.menuTopLeftPosition.x = event.clientX + 'px';
  this.menuTopLeftPosition.y = event.clientY + 'px';

  // we open the menu 
  // we pass to the menu the information about our object 
  this.matMenuTrigger.menuData = {item: item} 

  // we open the menu 
  this.matMenuTrigger.openMenu(); 
} 

//TO GET SELECTED NODE DATA
selectedNode(node: any) {
  this.editSelectedNode = node;
  console.log(this.editSelectedNode)
}

//TO GET CONDITION CLUSTER DATA 
getCondCluster(cluster:any){
  this.condCluster=''
  this.clusters.forEach(clus=>{       
    if(clus.clustertype=='Condition' && clus.label==cluster){
     this.condCluster=clus
    }
  })
}

//TO GET ACTION CLUSTER DATA
getActionCluster(cluster:any){
  this.clusters.forEach(clus=>{    
    if(clus.clustertype=='Action' && clus.label==cluster){
      console.log("satis")
     this.actionCluster=clus
    }
    else{
      this.actionCluster=null;
    }
  })
  return this.actionCluster
}

//TO ADD A NEW NODE TO TREE
addNode(node:any){
  this.prevId=node.id
     const addDialog=this.dialog.open(ChildNodeComponent,
      {data:this.decisionTreeId,width:'80rem',height:'70rem'})
      addDialog.afterClosed().subscribe(result =>{
        if(result){
          console.log(result)  
          this.loading=true;
          this.getCondCluster(result.clusterName)  
        //IF SELECTED PARAMETER CLUSTER IS ALREADY PRESENT
          if(this.condCluster){
            let nodeData:NewNode[]=[];      
          result.splitCondition.forEach((nodes:any) => {  
            console.log("node1 cluster",nodes.condition) 
          let newNodeData:NewNode=new NewNode(nodes.name,this.decisionTreeId,this.prevId,+this.condCluster.orgId,nodes.condition,nodes.datatype)      
          nodeData.push(newNodeData) }) 
          console.log(nodeData)
           this.createNodetoBackend(nodeData)
        
      }}})
     
}

//TO CREATE A NODES TO BACKEND USING NODEDATA 
createNodetoBackend(nodeData:NewNode[]){
  this.decisionTreeService.createNode(nodeData).subscribe((resultData:any )=>{console.log(resultData);
    this.decisionTreeData=resultData;
    this.showNotification("success","Condition Created successfully")
    this.loading = false;
    this.loadNodesClustersAndLinks( this.decisionTreeData)
    },err=>{
      this.showNotification('error', 'Oops! Something Went Wrong.');
      this.loading=false;
    })
}

//CREATE A NODE AND CLUSTER TO DECISION TREE
createNodeandCluster(treeCluster:TreeClusters,node:any,nodeData:TreeNodes[],param:string){
  console.log("created cluster",treeCluster)
 this.decisionTreeData.selectedParameter.push(param)
  let treeData=new DecisionTree(node.id,+this.selectedcluster,nodeData,treeCluster, this.decisionTreeData.selectedParameter)
  console.log("created treeData",treeData)
  this.decisionTreeService.createNodeCluster(this.decisionTreeId,treeData).subscribe((resultData:any )=>{
    console.log(resultData);
    this.decisionTreeData=resultData;   
    this.loadNodesClustersAndLinks( this.decisionTreeData)
this.loading=false;
  },err=>{
    this.showNotification('error', 'Oops! Something Went Wrong.');
    this.loading=false;
  })
}

//TO CREATE A SPLIT NODES IN TREE BY ITS CONDITION
createSplitNode(node:any){   
  this.prevId=node.id
  let clusterData:any;
  let nodeData:TreeNodes[]=[];
  const dialogRef = this.dialog.open(SplitConditionComponent,{
  width: '75rem',
  height: '70rem',
})
dialogRef.afterClosed().subscribe(result => {
  if(result){ 
    console.log(result)  
  this.loading=true;
  clusterData=result.clusterName;    
  this.getCondCluster(clusterData)  
//IF SELECTED PARAMETER CLUSTER IS ALREADY PRESENT
  if(this.condCluster){
    let nodeData:NewNode[]=[];      
  result.splitCondition.forEach((node:any) => {  
    console.log("node1 cluster",node.condition) 
  let newNodeData:NewNode=new NewNode(node.name,this.decisionTreeId,this.prevId,+this.condCluster.orgId,node.condition,node.datatype)      
  nodeData.push(newNodeData) }) 
  console.log(nodeData)
   this.createNodetoBackend(nodeData)
  }

//IF SELECTED PARAMETER CLUSTER IS NOT EXISTS IN TREE
  else{
    console.log("condi",result.clustertype,clusterData)
    result.splitCondition.forEach((node:any) => {
      // console.log("node",node)
      let treeNode=new TreeNodes(0,node.name,node.condition,node.datatype)
      // console.log("node,tree",nodeData,treeNode)
      nodeData.push(treeNode)})
      // console.log("nodedata",nodeData)
      let treeCluster=new TreeClusters(0,clusterData,[],"Condition",[],result.clustertype)
      console.log("cluster",treeCluster)
      this.createNodeandCluster(treeCluster,node,nodeData,clusterData)
  }}
});
}

//TO CREATE A ACTION VALUE NODE AND CLUSTER TO DECISION TREE
addActionNodeandClustertotree(node:any){
  const dialogRef = this.dialog.open(ActionnodeCreateComponent,{
    width: '75rem',
    height: '70rem',
 })
  dialogRef.afterClosed().subscribe(res=>{
    if(res) {
    this.loading=true;
      console.log(res)
      this.getActionCluster(res.name)
      console.log(this.actionCluster)
   //IF SELECTED ACTION PARAMETER ALREADY EXISTS IN TREE DATA
   if  (this.actionCluster){                              
    let nodeData:NewNode[]=[];
    let condition :string=this.actionCluster.label+" == "+res.value
    let action:actionData=new actionData(res.name,"value")
    let newNodeData:NewNode=new NewNode(res.value,this.decisionTreeId,node.id,+this.actionCluster.orgId,condition,"string",action)
    nodeData.push(newNodeData);    
     this.createNodetoBackend(nodeData)
      }

  //IF SELECTED ACTION PARAMETER NOT EXISTS IN TREE DATA
  else{
    console.log("nodename",res.value )
    let action:actionData=new actionData(res.name,"value")
      let treeNode=[new TreeNodes(0,res.value,res.name+" == "+res.value,'string',action)]
   let treeCluster=new TreeClusters(0,res.name,[],'Action',[],res.type)
   this.createNodeandCluster(treeCluster,node,treeNode,res.name)
  }  
     }
   })}

//TO CREATE A ACTION FUNCTION NODE AND CLUSTER TO DECISION TREE
AddFunctionActionNodeandCluster(node:any){
    const dialogRef = this.dialog.open(ActionFunctionComponent,{
      width: '85rem',
      height: '70rem',
    data:this.decisionTreeData.parameters.action.nodeName})
    dialogRef.afterClosed().subscribe(res=>{
      if(res) {
        this.loading=true;
        console.log(res)
        let value:any=res.function;
          this.getActionCluster(res.name)
         //IF SELECTED ACTION PARAMETER ALREADY EXISTS
         if  (this.actionCluster){   
          let action:actionData=new actionData(value["name"],"Function",value["id"],value)
          console.log(action)
          let nodeData:NewNode[]=[];
          let condition :string=this.actionCluster.label+" "+"=="+value['name']
          let newNodeData:NewNode=new NewNode(value['name'],this.decisionTreeId,node.id,+this.actionCluster.orgId,condition,"",action)
          nodeData.push(newNodeData);    
          console.log(action,nodeData)
          this.createNodetoBackend(nodeData)
            }
        //IF SELECTED ACTION PARAMETER ALREADY NOT EXISTS
        else{
          let action:actionData=new actionData(value["name"],"Function",value["id"],value)
            let treeNode=[new TreeNodes(0,value['name'],res.name+"="+value['name'],'',action)]
         let treeCluster=new TreeClusters(0,res.name,[],'Action',[],'')
          this.createNodeandCluster(treeCluster,node,treeNode,res.name)
        }  
       }
     })}

saveTree(){
  let treeData={"name":this.decisionTreeData.name,"description":this.decisionTreeData.description}
  this.disableSave = true;
  this.decisionTreeService.saveTree(this.decisionTreeId,treeData).subscribe((resultData:any )=>{
    this.showNotification('success',"Saved successfully")
    this.disableSave = false;
  },err=>{
    this.showNotification('error', 'Oops! Something Went Wrong.');
    this.loading=false;
    this.disableSave = false;
  })
}
}

