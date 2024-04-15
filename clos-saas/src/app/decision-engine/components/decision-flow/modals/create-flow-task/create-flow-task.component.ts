import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlowTasks } from '../../../../models/DecisionFlow';
import { DecisionTreeConfigurationComponent } from '../../task-configurations/decision-tree-configuration/decision-tree-configuration.component';
import { DecisionTableConfigComponent } from '../../task-configurations/decision-table-config/decision-table-config.component';
import { QueryVariableConfigComponent } from '../../task-configurations/query-variable-config/query-variable-config.component';
import { RuleEngineConfigComponent } from '../../task-configurations/rule-engine-config/rule-engine-config.component';
import { VariableLibConfigComponent } from '../../task-configurations/variable-lib-config/variable-lib-config.component';
import { VariablesConfigComponent } from '../../task-configurations/variables-config/variables-config.component';
import { FunctionConfigComponent } from '../../task-configurations/function-config/function-config.component';
import { DecisionTablesConfigComponent } from '../../task-configurations/decision-tables-config/decision-tables-config.component';
import { StandardConfigComponent } from '../../task-configurations/standard-config/standard-config.component';
import { ScoreCardConfigComponent } from '../../task-configurations/score-card-config/score-card-config.component';


@Component({
  selector: 'app-create-flow-task',
  templateUrl: './create-flow-task.component.html',
  styleUrls: ['./create-flow-task.component.scss']
})
export class CreateFlowTaskComponent implements OnInit {

  flowNode: FlowTasks;
  flowNodeString: string = 'sample';



  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateFlowTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateFlowTaskComponent
  ) {
    this.flowNode = JSON.parse(JSON.stringify(data));
   }

  ngOnInit(): void {
    console.log(this.flowNode);
  }

  onOkClick(){
    this.flowNodeString = JSON.stringify(this.flowNode);
    console.log(this.flowNodeString);
    this.dialogRef.close(this.flowNodeString);
  }

  onCancelClick(){
    this.dialogRef.close();
  }

  openStandardConfig() {
    const dialogRef = this.dialog.open(StandardConfigComponent,{
      width: '1300px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);
      console.log(jsonFormat);
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;  
      this.flowNode.tempType='STANDARD'  
    });
  }

  openDecisionTreeConfig() {
    const dialogRef = this.dialog.open(DecisionTreeConfigurationComponent,{
      width: '1300px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);
      console.log(jsonFormat);
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;  
      this.flowNode.tempType='TREE'  
    });
  }
  openDecisionTableConfig() {
    const dialogRef = this.dialog.open(DecisionTableConfigComponent,{
      width: '1300px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);
      console.log(jsonFormat);
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;
      this.flowNode.tempType='TABLE'
    });
  }
  openDecisionTablesConfig() {
    const dialogRef = this.dialog.open(DecisionTablesConfigComponent,{
      width: '1300px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);
      console.log(jsonFormat);
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;
      this.flowNode.tempType='TABLES'
    });
  }
  openDecisionVariableConfig(){
    const dialogRef = this.dialog.open(VariablesConfigComponent,{
      width: '1300px',
      height: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);
      console.log(jsonFormat);
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;
      this.flowNode.tempType='VARIABLES'
    });
  }
  openQueryRuleConfig(){
    const dialogRef = this.dialog.open(VariablesConfigComponent,{
      width: '1300px',
      height: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);
      console.log(jsonFormat);
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;
      this.flowNode.tempType='VARIABLES'
    });
    
  }
  openDecisionFunctionConfig(){
    const dialogRef = this.dialog.open(FunctionConfigComponent,{
      width: '1300px',
      height: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);
      console.log(jsonFormat);
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;
      this.flowNode.tempType='FUNCTIONS'
    });
  }
  
  openRuleSetConfig(){
    const dialogRef = this.dialog.open(RuleEngineConfigComponent,{
      width: '1300px',
      height: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);     
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;   
      this.flowNode.tempType='RULE_SET'   
    });
  }
    
  openQueryVariableConfig(){
    const dialogRef = this.dialog.open(QueryVariableConfigComponent,{
      width: '1300px',
      height: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);     
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;  
      this.flowNode.tempType='QUERY_VARIABLE'    
    });
  } 
  openVariableLibConfig(){
    const dialogRef = this.dialog.open(VariableLibConfigComponent,{
      width: '1300px',
      height: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);     
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;  
      this.flowNode.tempType='VARIABLE_LIB'    
    });
  }
  openScoreLibConfig(){
    const dialogRef = this.dialog.open(ScoreCardConfigComponent,{
      width: '1300px',
      height: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let jsonFormat = JSON.parse(result);     
      this.flowNode.configName = jsonFormat.name;
      this.flowNode.configId = jsonFormat.id;  
      this.flowNode.tempType='SCORECARD'    
    });
  }
  }


