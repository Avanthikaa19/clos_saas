import { Component, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Edge, Layout, MiniMapPosition, Node } from '@swimlane/ngx-graph';
import { DecisionFlow, Flow, FlowTasks, Scenario } from '../../../models/DecisionFlow';
import { CreateFlowTaskComponent } from '../modals/create-flow-task/create-flow-task.component';
import * as Shape from 'd3-shape';
import { DecisionTreeConfigurationComponent } from '../task-configurations/decision-tree-configuration/decision-tree-configuration.component';
import { DecisionFlowService } from '../../../services/decision-flow.service';
import { FlowTask } from '../../../models/DecisionFlow';
import { AssignConditionComponent } from '../modals/assign-condition/assign-condition.component';
import { VersionServiceService } from '../../../services/version-service.service';
import { BranchCreationComponent } from '../modals/branch-creation/branch-creation.component';
import { DecisionTableConfigComponent } from '../task-configurations/decision-table-config/decision-table-config.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { UrlService } from '../../../services/http/url.service';
import { VariablesConfigComponent } from '../task-configurations/variables-config/variables-config.component';
import { NotifierService } from 'angular-notifier';
import { finalize } from 'rxjs/operators';
import { RuleEngineConfigComponent } from '../task-configurations/rule-engine-config/rule-engine-config.component';
import { FlowtestService } from '../../../services/flowtest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryVariableConfigComponent } from '../task-configurations/query-variable-config/query-variable-config.component';
import { Subject } from 'rxjs';
import { VariableLibConfigComponent } from '../task-configurations/variable-lib-config/variable-lib-config.component';
import { FunctionConfigComponent } from '../task-configurations/function-config/function-config.component';
import { DecisionTablesConfigComponent } from '../task-configurations/decision-tables-config/decision-tables-config.component';
import { StandardConfigComponent } from '../task-configurations/standard-config/standard-config.component';
import { ScoreCardConfigComponent } from '../task-configurations/score-card-config/score-card-config.component';
import { AccessControlData } from 'src/app/app.access';
import { MatDrawer } from '@angular/material/sidenav';


interface VersionList {
  config: string;
  version: number;
  id: number;
}

@Component({
  selector: 'app-decision-graph',
  templateUrl: './decision-graph.component.html',
  styleUrls: ['./decision-graph.component.scss']
})

export class DecisionGraphComponent implements OnInit {

  //NGX GRAPH Vars
  shape = Shape;
  nodes: Node[] = [];
  links: Edge[] = [];
  screenHeight: number = 0;
  screenWidth: number = 0;
  layoutSettings = {
    marginX: 100,
    marginY: 300,
    rankPadding: 150
  };
  editSelectedNode: Node = null as any;
  selectedFlowId: string = "";
  showMiniMap: boolean = true;
  miniMapMaxWidthPx: number = 200;
  miniMapMaxHeightPx: number = 100;
  miniMapPosition: MiniMapPosition = MiniMapPosition.UpperLeft;
  layout: string | Layout = 'dagre';
  draggingEnabled: boolean = false;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;
  zoomSpeed: number = 0.15;
  zoomLevel: number = 0.7;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  panOnZoom: boolean = false;
  panOffsetX: number = 0;
  panOffsetY: number = 50;
  autoZoom: boolean = false;
  autoCenter: boolean = false;
  animate: boolean = false;
  tasks: FlowTasks[] = [];
  flowId: number;
  versions: VersionList[] = [];
  selectedVersion: any;
  scenarios: Scenario[] = []
  flowData: Flow[] = [];
  button: boolean = false;
  disableSave: boolean = false;
  popupSize = { width: '1000px', height: '780px', }
  loading: boolean = false;
  spinnerLoad: boolean = false;
  // we create an object that contains coordinates 
  menuTopLeftPosition = { x: '0', y: '0' }
  data: number;
  len: number = 0;
  center$ = new Subject<any>();
  // reference to the MatMenuTrigger in the DOM 
  @ViewChild(MatMenuTrigger) matMenuTrigger!: MatMenuTrigger;
  @ViewChild('sideNav') sideNav: MatDrawer;
  enablePaste: boolean = false;
  max_version: any
  restored_version: number = 0
  flowById: DecisionFlow;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private decisionService: DecisionFlowService,
    private versionService: VersionServiceService,
    private _snackBar: MatSnackBar,
    private selectedProject: DecisionEngineIdService,
    private url: UrlService,
    private notifierService: NotifierService,
    private flowtestService: FlowtestService,
    public ac:AccessControlData
  ) {
    this.getScreenSize();
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  public getUrl(): Promise<Object> {
    return this.url.getDecisionEngineUrl().toPromise();
  }
  async ngOnInit() {
    let response = await this.updateUrl();
    let resp = await this.getUrl();
    UrlService.API_URL = response.toString();
    UrlService.API_URL = resp.toString();
    if (UrlService.API_URL.trim().length == 0) {
      UrlService.API_URL, UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.data = Number(this.route.snapshot.paramMap.get("id"));
    this.getDecisionFlowById();
    // this.getScenariosList()
  }

  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/decisionFlowList'
    this.router.navigateByUrl(viewUrl)
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight - 85;
    this.screenWidth = window.innerWidth;
  }

  onRightClick(event: MouseEvent, item: any) {
    if(this.ac.super || this.ac.items?.DF003H_DECISION_FLOW_INSERT_DELETE_NODE){
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.matMenuTrigger.menuData = { "item": item }
    this.matMenuTrigger.openMenu();
    }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  doCenter() {
    // trigger center
    this.center$.next(true);
    this.autoCenter = true;
  }
  goToSource(id: any) {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("decisionFlow/decisionFlowView/"));
    // t = t.substr(0, t.lastIndexOf("/"));
    // t = t.substr(0, t.lastIndexOf("decisionFlow"));
    let viewUrl: any;
    if (this.editSelectedNode.data.flow_type == 'TREE') {
      viewUrl = t + 'decisionTree/decisionTreeView/' + id
      this.router.navigateByUrl(viewUrl)

    }
    else if (this.editSelectedNode.data.flow_type == 'TABLE') {
      viewUrl = t + 'decisionTable/decisionTableView/' + id
      this.router.navigateByUrl(viewUrl)
    }
    else if (this.editSelectedNode.data.flow_type == 'TABLES') {
      viewUrl = t + 'decisionTables/decisionTableView/' + id
      this.router.navigateByUrl(viewUrl)
    }
    else if (this.editSelectedNode.data.flow_type == 'FUNCTIONS') {
      viewUrl = t + 'functions/pythoncode/' + id
      this.router.navigateByUrl(viewUrl)
    }
    else if (this.editSelectedNode.data.flow_type == 'QUERY_VARIABLE') {
      viewUrl = t + 'query-variable/query-variable-view/' + id
      this.router.navigateByUrl(viewUrl)
    } else if (this.editSelectedNode.data.flow_type == 'VARIABLE_LIB') {
      viewUrl = t + 'variable-library/variable-library-view/' + id
      this.router.navigateByUrl(viewUrl)
    } else if (this.editSelectedNode.data.flow_type == 'RULE_SET') {
      viewUrl = t + 'rule-set/rule-set-view/' + id
      this.router.navigateByUrl(viewUrl)
    } else if (this.editSelectedNode.data.flow_type == 'VARIABLES') {
      viewUrl = t + 'variables/variableView/' + id
      this.router.navigateByUrl(viewUrl)
    } else if (this.editSelectedNode.data.flow_type == 'SCORECARD') {
      viewUrl = t + 'scoreCard/scoreCardView/' + id
      this.router.navigateByUrl(viewUrl)
    }
    // this.dialog.open(ViewTreeComponent,{data:id})
  }
  testDecisionGraph() {
    let viewUrl = "/desicion-engine/test/flowtest/" + this.flowId
    this.router.navigateByUrl(viewUrl)
  }
  //GET FLOW DETAILS BY PASSING PROJECT ID
  getDecisionFlowById() {
    this.flowtestService.getDefaultDecisionFlow(this.data).subscribe(
      serviceData => {
        if (serviceData) {
          this.flowById = serviceData
          this.loadNodesAndLinks(serviceData.flowTasks);
          this.loading = true;
          this.flowId = serviceData.id;
          this.spinnerLoad = false
          this.flowById.scenario = serviceData.scenario?.id   

        }
        this.showNotification('default', 'Flow Loaded Successfully.');
      },
      (err) => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      })
  }

  //Reload nodes
  refresh(node: Node) {
    this.editSelectedNode.data.tempId = node.data.configId
    this.editSelectedNode.data.tempName = node.data.configName
    this.editSelectedNode.data.tempType = node.data.flow_type
    this.editSelectedNode.data.temp_condition = node.data.condition
  }
  getScenariosList() {
    this.decisionService.getScenariosList().subscribe(
      res => {
        this.scenarios = res;
      }
    )
  }
  //LOAD NODES AND LINKS -- CHANGING INTO GRAPH ACCEPTABLE FORMAT
  loadNodesAndLinks(data?: any) {
    this.tasks = data;
    if (this.tasks) {
      this.nodes = this.getNodesFromFlowTasks(this.tasks);
      this.nodes = [...this.nodes]
      this.links = this.getLinksFromFlowTasks(this.tasks);
      this.links = [...this.links];

    }
  }
  //FOR CREATING FLOWTASKS NODES IN DECISIONFLOW GRAPH
  getNodesFromFlowTasks(flowTasks: FlowTasks[]): Node[] {
    let nodes: Node[] = [];
    for (let task of flowTasks) {
      let width:any = '';
      let temp: Node = { id: task.id.toString(), label: task.name, data: task,dimension: {width:width, height:50} }
      nodes.push(temp);
    }
    return nodes;
  }
  //FOR CREATING  LINKS IN DECISIONFLOW GRAPH
  getLinksFromFlowTasks(flowTasks: FlowTasks[]): Edge[] {
    let links: Edge[] = [];
    for (let task of flowTasks) {
      if (task.prevTaskId.length > 0) {
        task.prevTaskId.forEach(prevId => {
          links.push({ source: prevId.toString(), target: task.id.toString(), label: task.condition });
        })
      }
    }
    return links;

  }
  //FOR OPEN EDIT POPUP
  editFlowTask(item: any) {
    const dialogRef = this.dialog.open(CreateFlowTaskComponent, { width: '600px', height: '430px', data: item.data });
    dialogRef.afterClosed().subscribe(editData => {
      if (editData) {
        let jsonData = JSON.parse(editData);
        this.editNodesandLinks(jsonData)
      }
    });
  }
  editFlowData(node: any) {
    this.editSelectedNode.data.configName = this.editSelectedNode.data.tempName;
    this.editSelectedNode.data.configId = this.editSelectedNode.data.tempId;
    this.editSelectedNode.data.flow_type = this.editSelectedNode.data.tempType;
    this.editSelectedNode.data.condition = this.editSelectedNode.data.temp_condition;
    this.editSelectedNode.data.condition_type = this.editSelectedNode.data.temp_condition_type;
    this.editNodesandLinks(this.editSelectedNode.data)

  }
  //FOR EDIT INDIVIDUAL NODES IN DECISIONFLOW GRAPH
  editNodesandLinks(taskData?: any) {
    let formData = new FormData();
    formData.append("flowTasks", taskData)
    this.decisionService.updateFlowTask(taskData, taskData.id).subscribe()
    this.tasks.forEach(e => {
      if (e.id == taskData.id) {
        e.name = taskData.name;
        e.prevTaskId = taskData.prevTaskId;
        e.flow_type = taskData.tempType;
        e.tempType = taskData.tempType;
        e.id = taskData.id;
        e.created = taskData.created;
        // if(taskData.tempName && taskData.tempId){          
        //   e.configName = taskData.tempName;
        //   e.configId = taskData.tempId
        // }

        e.configName = taskData.configName;
        e.configId = taskData.configId


        e.repeat = taskData.repeat
        e.repeatTo = taskData.repeatTo;
      }
    })
    this.loadNodesAndLinks(this.tasks)
  }
  //FOR INSERT SINGLE TASK IN DECISIONFLOW GRAPH
  insertTaskNode(node: any) {
    let targetNodeId: any;
    this.spinnerLoad = true;
    // this.loading=false;
    let PrevId: number = +node.id;
    this.links.forEach(link => {
      if (link.source == node.id) {
        targetNodeId = +link.target;
      }
    })
    let taskData: object[] = [{ "name": "default_node", "prevTaskId": [PrevId] }]
    let newtask: FlowTask = new FlowTask(taskData)
    this.decisionService.getTaskId(newtask, this.flowId).subscribe(resultTask => {
      this.tasks.push(resultTask)
      this.tasks.forEach(task => {
        if (task.id == targetNodeId) {
          task.prevTaskId = task.prevTaskId.filter(taskPreId => taskPreId != node.id)
          task.prevTaskId.push(resultTask.id)
          this.decisionService.updateFlowTask(task, task.id).subscribe()
          this.loadNodesAndLinks(this.tasks)
          this.spinnerLoad = false;
          // this.loading=true
        }
      })
    })
  }
  removeBranch(branch: any) {
    let target: any;
    this.spinnerLoad = true;
    this.links.forEach(link => {
      if (link.source == branch.id) {
        target = link.target
      }
    })
    this.tasks.forEach(task => {
      if (task.id == target) {
        task.prevTaskId = task.prevTaskId.filter(data => data != branch.id)
        let data_delete = { "update_node": task, "flow_id": this.flowId }
        this.decisionService.deleteDecisionFlowTask(branch.id, data_delete).subscribe(data => {
          if (data) {
            this.showNotification('default', 'Branch Removed Successfully.');
            this.getDecisionFlowById()
          }

        }
        )
      }
    })


  }

  deleteFlowTask(node: any) {
    this.spinnerLoad = true;
    let prevId: any[] = [];
    let nodes: any;
    let updateNode: any;
    prevId = node.prevTaskId

    this.links.forEach(link => {
      if (link.source == node.id) {
        nodes = link.target
      }
    })
    this.tasks.forEach(task => {
      if (task.id == nodes) {
        task.prevTaskId = task.prevTaskId.filter(data => data != node.id)
        prevId.forEach(e => {
          task.prevTaskId.push(e)
        })
        updateNode = task
      }
    })


    let data_delete = { "update_node": updateNode, "flow_id": this.flowId }
    // this.decisionService.updateFlowTask(updateNode, updateNode.id).subscribe(da=>{
    //   if(da){
    //   this.decisionService.deleteDecisionFlowTask(node.id).pipe(finalize(()=>{})).subscribe(result=>{

    //       this.loadNodesAndLinks(this.tasks);
    //   })}
    // })
    this.decisionService.deleteDecisionFlowTask(node.id, data_delete).subscribe(data => {
      if (data) {
        this.showNotification('success', 'Task Deleted Successfully.');
        this.getDecisionFlowById()
      }

    }
    )
  }


  //FOR OPEN BRANCH CREATION POPUP TO SELECT PARAMETERS AND NO OF BRANCHES
  openDupBranchCreationDialog(item: any) {
    const dialogRef = this.dialog.open(BranchCreationComponent, { width: '70rem', height: '80rem', });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.branchCreation(item, result, 'NO');
      }
    });
  }
  //FOR OPEN BRANCH CREATION POPUP TO SELECT PARAMETERS AND NO OF BRANCHES
  openBranchCreationDialog(item: any) {
    const dialogRef = this.dialog.open(BranchCreationComponent, { width: '70rem', height: '80rem', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.branchCreation(item, result, 'YES');
      }
    });
  }

  //FOR CREATING BRANCHES FOR SELECTED PARAMETERS
  branchCreation(node: any, branchData: any[], condition: any) {
    this.spinnerLoad = true;

    let preIdList: number[] = []
    let targetNodeId: any
    let convertNo: number = +node.id;
    this.links.forEach(link => {
      if (link.source == node.id) {
        targetNodeId = +link.target;
      }
    })
    let conditionNode: object[] = [{ "name": "Condition", "prevTaskId": [convertNo], "flow_type": "CONDITION" }]
    let condittionTask: FlowTask = new FlowTask(conditionNode)
    this.decisionService.getTaskId(condittionTask, this.flowId).subscribe(conditionData => {
      this.tasks.push(conditionData)
      branchData.forEach(branch => {
        let branchNodeData: object[] = [{ "name": branch.branchIndex, "prevTaskId": [conditionData.id], "condition_branch": condition, objectModel: branch.parameterType }]
        let branchTask: FlowTask = new FlowTask(branchNodeData)
        this.decisionService.getTaskId(branchTask, this.flowId).pipe(
          finalize(() => {
            if (branchData.length == preIdList.length) {
              this.endBranch(node, preIdList, targetNodeId)
            }
          })
        ).subscribe(res => {
          preIdList.push(res.id);
          this.tasks.push(res);
          this.loadNodesAndLinks(this.tasks);
        });
      })
    })
  }
  //FOR CREATING END BRANCH WHICH CONNECTS CREATED BRANCHES
  endBranch(node: any, previdlist: any, targetNodeId: number) {
    let taskendData: object[] = [{ "name": "default_node", "prevTaskId": previdlist }]
    let taskend: FlowTask = new FlowTask(taskendData)
    this.decisionService.getTaskId(taskend, this.flowId).subscribe(endBranchData => {
      this.tasks.push(endBranchData)
      this.tasks.forEach(task => {
        if (task.id == targetNodeId) {
          task.prevTaskId = task.prevTaskId.filter(taskPreId => taskPreId != node.id)
          task.prevTaskId.push(endBranchData.id)
          this.decisionService.updateFlowTask(task, task.id).subscribe()
          this.loadNodesAndLinks(this.tasks)
          this.spinnerLoad = false;
        }
      })
    });
  }
  // FOR CREATING EXTRA BRANCHES IN EXISTING CONDITION NODE
  extraBranchCreation(node: any) {
    let convertNo: number = +node.id;
    const dialogRef = this.dialog.open(BranchCreationComponent, { width: '70rem', height: '80rem', });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.forEach((data: any) => {
          let taskData: object[] = [{ "name": data.branchIndex, "prevTaskId": [convertNo], "condition_branch": "YES", objectModel: data.parameterType }]
          let task: FlowTask = new FlowTask(taskData)
          this.decisionService.getTaskId(task, this.flowId).subscribe(resultData => {
            this.tasks.push(resultData)
            this.tasks.forEach(task => {
              if (task.name == 'End') {
                task.prevTaskId.push(resultData.id);
                this.decisionService.updateFlowTask(task, task.id).subscribe()
              }
            })
            this.loadNodesAndLinks(this.tasks)
          })
        })
      }
    });
  }
  //FOR APPLY CONDITION TO FLOWTASKS
  assignBranchCondition(node: any) {
    const dialogRef = this.dialog.open(AssignConditionComponent, { data: node });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasks.forEach(task => {
          if (task.id == node.id) {
            task.temp_condition = result.result;
            task.temp_condition_type = result.type;
            this.decisionService.updateFlowTask(task, node.id).subscribe()
          }
        })
        // this.editFlowData(node);
        this._snackBar.open("Condition Assigned Sucessfully", "close", { duration: 5000 });
      }
    });
  }
  // FOR SAVE DECISION FLOW
  saveDecisionFlowData() {
    this.disableSave = true;
    this.decisionService.updateDecisionTaskByFlowId(this.flowId, this.flowById).subscribe(data => {
      this.disableSave = false;
      this.router.navigateByUrl('/desicion-engine/explorer/decisionFlow/decisionFlowList')
      // data['name']=this.flowById.name
      // data['description']=this.flowById.description
      // data['scenario'] =this.flowById.scenario
      // this.versionService.saveDecisionFlow(this.flowId, data).subscribe(data => { this.showNotification('success', 'Flow Saved Successfully.') })
    },
      (err) => {
        this.loading = false;
        console.log(err);
        this.showNotification('error', 'Oops! Something Went Wrong.');
      })
  }
  // FOR RUN DECISION FLOW
  runDecisionFlowData() {
    this.flowtestService.getoneflow(this.flowId).subscribe(data => {
      this.flowtestService.decisionExecution(data).subscribe(response => {
      })
    })
  }
  // GET VERSIONS FOR SPECIFIC DECISIONFLOW BY ID
  getVersionList() {
    let formData = new FormData();
    formData.append('type', 'FLOW')
    this.versionService.getVersionHistory(this.flowId, formData).subscribe(
      (response: any) => {
        this.flowData = response
        let len: any = this.flowData.length
        this.versions = []
        this.flowData.forEach(t => {
          let v: VersionList = { 'config': '', 'version': 0, 'id': 0 };
          v.version = t.current_version;
          v.config = t.config
          v.id = t.id
          this.versions.push(v)
        })
      })
  }
  //LIST DROPDOWN WHICH CONTAINS LIST OF VERSIONS FOR SPECIFIC FLOW
  onVersionChange() {
    let flowTasksData: any = JSON.parse(this.selectedVersion.config)
    this.tasks = []
    flowTasksData.forEach((task: FlowTasks) => {
      this.tasks.push(task)
      this.loadNodesAndLinks(this.tasks)
    })
  }
  selectedNode(node: any) {
    if(this.ac.super || this.ac.items?.DF003K_DECISION_FLOW_EDIT_NODE){
    this.sideNav.toggle();
    this.editSelectedNode = node;
    this.selectedFlowId = this.editSelectedNode.id;
    }
  }
  //FOR OPEN  POPUP WHERE CAN ASSIGN TREE TO FLOWTASK 
  editSelectedTree() {
    const dialogRef = this.dialog.open(DecisionTreeConfigurationComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      // this.editSelectedNode.data.configName = jsonFormat.name;
      // this.editSelectedNode.data.configId = jsonFormat.id;
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'TREE';

    });
  }

  //FOR OPEN  POPUP WHERE CAN ASSIGN TABLE TO FLOWTASK 
  editSelectedTable() {
    const dialogRef = this.dialog.open(DecisionTableConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'TABLE';
    });
  }

  //FOR OPEN  POPUP WHERE CAN ASSIGN STANDARD TO FLOWTASK 
  editSelectedStandard() {
    const dialogRef = this.dialog.open(StandardConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'STANDARD';
    });
  }
  //FOR OPEN  POPUP WHERE CAN ASSIGN VARIABLES TO FLOWTASK 
  editSelectedVariable() {
    const dialogRef = this.dialog.open(VariablesConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      // this.editSelectedNode.data.configName = jsonFormat.name;
      // this.editSelectedNode.data.configId = jsonFormat.id;
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'VARIABLES';
    });
  }
  //FOR OPEN  POPUP WHERE CAN ASSIGN FUNCTIONS TO FLOWTASK 
  editSelectedFunctions() {
    const dialogRef = this.dialog.open(FunctionConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      // this.editSelectedNode.data.configName = jsonFormat.name;
      // this.editSelectedNode.data.configId = jsonFormat.id;
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'FUNCTIONS';
    });
  }
  //FOR OPEN  POPUP WHERE CAN ASSIGN RULESET TO FLOWTASK 
  editSelectedRuleSet() {
    const dialogRef = this.dialog.open(RuleEngineConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      // this.editSelectedNode.data.configName = jsonFormat.name;
      // this.editSelectedNode.data.configId = jsonFormat.id;
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'RULE_SET';
    });
  }

  //FOR OPEN  POPUP WHERE CAN ASSIGN QUERYVARIABLE TO FLOWTASK 
  editSelectedQueryVariable() {
    const dialogRef = this.dialog.open(QueryVariableConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      // this.editSelectedNode.data.configName = jsonFormat.name;
      // this.editSelectedNode.data.configId = jsonFormat.id;
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'QUERY_VARIABLE';
    });
  }
  //FOR OPEN  POPUP WHERE CAN ASSIGN Variable library TO FLOWTASK 
  editSelectedvariableLib() {
    const dialogRef = this.dialog.open(VariableLibConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      // this.editSelectedNode.data.configName = jsonFormat.name;
      // this.editSelectedNode.data.configId = jsonFormat.id;
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'VARIABLE_LIB';
    });
  }
  //FOR OPEN  POPUP WHERE CAN ASSIGN Variable library TO FLOWTASK 
  editSelectedScoreCardLib() {
    const dialogRef = this.dialog.open(ScoreCardConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      // this.editSelectedNode.data.configName = jsonFormat.name;
      // this.editSelectedNode.data.configId = jsonFormat.id;
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'SCORECARD';
    });
  }
  //FOR OPEN  POPUP WHERE CAN ASSIGN Tables TO FLOWTASK 
  editSelectedTables() {
    const dialogRef = this.dialog.open(DecisionTablesConfigComponent, this.popupSize);
    dialogRef.afterClosed().subscribe(result => {
      let jsonFormat = JSON.parse(result);
      this.editSelectedNode.data.tempName = jsonFormat.name;
      this.editSelectedNode.data.tempId = jsonFormat.id;
      this.editSelectedNode.data.tempType = 'TABLES';
    });
  }
  //Export Flow
  exportFlow(){
    this.flowtestService.getoneflow(this.flowId).subscribe(
      (response: any) => {
        if (response){        
          let flow_json = JSON.stringify(response);
          console.log(flow_json);
          let flow_name = response[0].name
          this.downloadFile(flow_json,flow_name);
          this.notifierService.notify('success', 'Your download should start soon.');
        }
        else{
          this.notifierService.notify('error', 'Failed to load data.');
        }      
      },
      err => {
        this.notifierService.notify('error', 'Failed to download file. Refer console for more details.');
        console.error(err);
      }
    )
  }
  downloadFile(res,name:any) {
    let data = [res];
    let date = new Date();
    let format = 'json'
    let flow_name = name;  
    var blob = new Blob([res], { type: 'application/json' });    
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = `Flow_${flow_name}.${format}`;
    anchor.href = url;
    anchor.click();
  }
}

