import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecisionEngineRoutingModule } from './decision-engine-routing.module';
import { DecisionEngineHomeComponent } from './components/decision-engine-home/decision-engine-home.component';
import { DecisionDetailsComponent } from './components/decision-details/decision-details.component';
import { DesicionDashboardComponent } from './components/desicion-dashboard/desicion-dashboard.component';
import { MaterialModule } from "../material/material.module";
import { MatNativeDateModule } from "@angular/material/core";
import { DecisionExplorerComponent } from './components/decision-explorer/decision-explorer.component';
import { DecisionObjectModelComponent } from './components/decision-configration/decision-object-model/decision-object-model.component';
import { ListFlowComponent } from './components/decision-flow/list-flow/list-flow.component';
import { NotifierModule } from "angular-notifier";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateDecisionFlowComponent } from './components/decision-flow/modals/create-decision-flow/create-decision-flow.component';
import { CreateScorecardComponent } from './components/scorecard/create-scorecard/create-scorecard.component';
import { ScorecardComponent } from './components/scorecard/scorecard.component';
import { DeletePopupComponent } from './components/scorecard/scorecardview-tables/delete-popup/delete-popup.component';
import { EditPartialscoreComponent } from './components/scorecard/scorecardview-tables/edit-partialscore/edit-partialscore.component';
import { ScorecardVariablesComponent } from './components/scorecard/scorecardview-tables/scorecard-variables/scorecard-variables.component';
import { ScorecardviewTablesComponent } from './components/scorecard/scorecardview-tables/scorecardview-tables.component';
import { DecisionFlowComponent } from './components/decision-flow/decision-flow.component';
import { QueryVariableComponent } from './components/query-variable/query-variable.component';
import { ExampleHeaderComponent } from './components/query-variable/example-header/example-header.component';
import { QueryparamsComponent } from './components/query-variable/queryparams/queryparams.component';
import { ViewQueryVariableComponent } from './components/query-variable/view-query-variable/view-query-variable.component';
import { CustomRangePanelComponent } from './components/query-variable/example-header/custom-range-panel/custom-range-panel.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ListQueryVariableComponent } from './components/query-variable/list-query-variable/list-query-variable.component';
import { DecisionTreesComponent } from './components/decision-trees/decision-trees.component';
import { ListTreeComponent } from './components/decision-trees/list-tree/list-tree.component';
import { CreateDecisionTreeComponent } from './components/decision-trees/modals/create-decision-tree/create-decision-tree.component';
import { VariablesComponent } from './components/variables/variables.component';
import { ListVariablesComponent } from './components/variables/list-variables/list-variables.component';
import { ViewVariablesComponent } from './components/variables/view-variables/view-variables.component';
import { ScorecardlistTablesComponent } from './components/scorecard/scorecardlist-tables/scorecardlist-tables.component';
import { RuleSetComponent } from './components/rule-set/rule-set.component';
import { ListRuleSetComponent } from './components/rule-set/list-rule-set/list-rule-set.component';
import { AddConditionalRuleComponent } from './components/rule-set/modals/add-conditional-rule/add-conditional-rule.component';
import { CreateRuleComponent } from './components/rule-set/modals/create-rule/create-rule.component';
import { CreateRuleSetComponent } from './components/rule-set/modals/create-rule-set/create-rule-set.component';
import { RuleEditorComponent } from './components/rule-set/modals/rule-editor/rule-editor.component';
import { ViewRulesSetComponent } from './components/rule-set/view-rules-set/view-rules-set.component';
import { ModernTableComponent } from './common-css/modern-table/modern-table.component';
import { RulesComponent } from './components/rules/rules.component';
import { ListRulesComponent } from './components/rules/list-rules/list-rules.component';
import { ViewRulesComponent } from './components/rules/view-rules/view-rules.component';
import { DecisionTablesComponent } from './components/decision-tables/decision-tables.component';
import { ListTablesComponent } from './components/decision-tables/list-tables/list-tables.component';
import { CreateDecisionTablesComponent } from './components/decision-tables/modals/create-decision-tables/create-decision-tables.component';
import { EditTableCellsComponent } from './components/decision-tables/modals/edit-table-cells/edit-table-cells.component';
import { TableValueComponent } from './components/decision-tables/modals/table-value/table-value.component';
import { ViewTablesComponent } from './components/decision-tables/view-tables/view-tables.component';
import { ViewTreeComponent } from "./components/decision-trees/view-tree/view-tree.component";
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import 'echarts/theme/macarons.js';
import { SplitConditionComponent } from "./components/decision-trees/modals/split-condition/split-condition.component";
import { ActionnodeCreateComponent } from "./components/decision-trees/modals/actionnode-create/actionnode-create.component";
import { EditModalComponent } from "./components/decision-trees/modals/edit-modal/edit-modal.component"
import { ActionFunctionComponent } from "./components/decision-trees/modals/action-function/action-function.component"
import { ChildNodeComponent } from "./components/decision-trees/modals/child-node/child-node.component";
import { TreeGraphComponent } from './components/decision-trees/tree-graph/tree-graph.component';
import { DecisionGraphComponent } from './components/decision-flow/decision-graph/decision-graph.component';
import { CreateFlowTaskComponent } from './components/decision-flow/modals/create-flow-task/create-flow-task.component';
import { DecisionTableConfigComponent } from './components/decision-flow/task-configurations/decision-table-config/decision-table-config.component';
import { DecisionTablesConfigComponent } from './components/decision-flow/task-configurations/decision-tables-config/decision-tables-config.component';
import { DecisionTreeConfigurationComponent } from './components/decision-flow/task-configurations/decision-tree-configuration/decision-tree-configuration.component';
import { FunctionConfigComponent } from './components/decision-flow/task-configurations/function-config/function-config.component';
import { QueryVariableConfigComponent } from './components/decision-flow/task-configurations/query-variable-config/query-variable-config.component';
import { RuleEngineConfigComponent } from './components/decision-flow/task-configurations/rule-engine-config/rule-engine-config.component';
import { ScoreCardConfigComponent } from './components/decision-flow/task-configurations/score-card-config/score-card-config.component';
import { StandardConfigComponent } from './components/decision-flow/task-configurations/standard-config/standard-config.component';
import { VariableLibConfigComponent } from './components/decision-flow/task-configurations/variable-lib-config/variable-lib-config.component';
import { VariablesConfigComponent } from './components/decision-flow/task-configurations/variables-config/variables-config.component';
import { BranchCreationComponent } from './components/decision-flow/modals/branch-creation/branch-creation.component';
import { AssignConditionComponent } from './components/decision-flow/modals/assign-condition/assign-condition.component'
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CombineOperationModalComponent } from './components/decision-flow/modals/combine-operation-modal/combine-operation-modal.component';
import { ConditionAlertboxComponent } from './components/decision-flow/modals/condition-alertbox/condition-alertbox.component';
import { MessagePopupComponent } from './components/scorecard/scorecardview-tables/message-popup/message-popup.component';
import { FlowExecutionComponent } from './components/test-executions/flow-execution/flow-execution.component';
import { ApplyFilterComponent } from './components/test-executions/flow-execution/modals/apply-filter/apply-filter.component';
import { AgGridModule } from "ag-grid-angular";
import { FlowtestConfigModalComponent } from './components/test-executions/flow-execution/modals/flowtest-config-modal/flowtest-config-modal.component';
import { TableExecutionComponent } from './components/test-executions/table-execution/table-execution.component';
import { TestMainComponent } from './components/test-executions/test-main/test-main.component';
import { VariableLibExecutionComponent } from './components/test-executions/variable-lib-execution/variable-lib-execution.component';
import { ObjectTableComponent } from './components/decision-configration/decision-object-model/object-table/object-table.component';
import { ConfigNavBarComponent } from './components/decision-configration/config-nav-bar/config-nav-bar.component';
import { ConfigNavigationComponent } from './components/decision-configration/config-navigation/config-navigation.component';
import { DbConnectionComponent } from './components/decision-configration/db-connection/db-connection.component';
import { DbConnectionDetailComponent } from './components/decision-configration/db-connection/db-connection-detail/db-connection-detail.component';
import { QueryBuilderComponent } from './components/decision-configration/db-connection/modals/query-builder/query-builder.component';
import { DbConnectionListComponent } from './components/decision-configration/db-connection/db-connection-list/db-connection-list.component';
import { DefaultModelComponent } from './components/decision-configration/default-model/default-model.component';
import { DecisionVariableComponent } from './components/decision-configration/decision-variable/decision-variable.component';
import { ListVariableComponent } from './components/decision-configration/decision-variable/list-variable/list-variable.component';
import { ConfigVariablesComponent } from './components/decision-configration/decision-variable/modals/config-variables/config-variables.component';
import { ViewVariableComponent } from './components/decision-configration/decision-variable/view-variable/view-variable.component';
import { ProjectVariablesComponent } from './components/decision-configration/project-variables/project-variables.component';
import { AddHeaderComponent } from './components/decision-configration/project-variables/modals/add-header/add-header.component';
import { AddParamComponent } from './components/decision-configration/project-variables/modals/add-param/add-param.component';
import { ConfigVariableComponent } from './components/decision-configration/project-variables/modals/config-variable/config-variable.component';
import { CreateEditVariableComponent } from './components/decision-configration/project-variables/modals/create-edit-variable/create-edit-variable.component';
import { PythonEditorComponent } from './components/decision-configration/project-variables/modals/python-editor/python-editor.component';
import { ProfilingVariableComponent } from './components/profiling-variable/profiling-variable.component';
import { ListProfilingComponent } from './components/profiling-variable/list-profiling/list-profiling.component';
import { ViewProfilingComponent } from './components/profiling-variable/view-profiling/view-profiling.component';
import { TestComponent } from './components/test/test.component';
import { TabletestComponent } from './components/tabletest/tabletest.component';
import { VariabletestComponent } from './components/variabletest/variabletest.component';
import { ActionNavBarComponent } from './components/decision-action/action-nav-bar/action-nav-bar.component';
import { FieldActionComponent } from './components/decision-action/field-action/field-action.component';
import { GeneralModule } from '../general/general.module';
import { AddnewfieldDialogComponent } from './components/decision-action/addnewfield-dialog/addnewfield-dialog.component';
import { ImportFlowComponent } from './components/decision-flow/modals/import-flow/import-flow.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    DecisionEngineHomeComponent,
    DecisionDetailsComponent,
    DesicionDashboardComponent,
    DecisionExplorerComponent,
    DecisionObjectModelComponent,
    ListFlowComponent,
    CreateDecisionFlowComponent,
    ScorecardComponent,
    CreateScorecardComponent,
    ScorecardviewTablesComponent,
    DeletePopupComponent,
    EditPartialscoreComponent,
    ScorecardVariablesComponent,
    DecisionFlowComponent,
    QueryVariableComponent,
    ExampleHeaderComponent,
    QueryparamsComponent,
    ViewQueryVariableComponent,
    CustomRangePanelComponent,
    ListQueryVariableComponent,
    DecisionTreesComponent,
    ListTreeComponent,
    CreateDecisionTreeComponent,
    VariablesComponent,
    ListVariablesComponent,
    ViewVariablesComponent,
    ScorecardlistTablesComponent,
    RuleSetComponent,
    ListRuleSetComponent,
    AddConditionalRuleComponent,
    CreateRuleComponent,
    CreateRuleSetComponent,
    RuleEditorComponent,
    ViewRulesSetComponent,
    ModernTableComponent,
    RulesComponent,
    ListRulesComponent,
    ViewRulesComponent,
    DecisionTablesComponent,
    ListTablesComponent,
    CreateDecisionTablesComponent,
    EditTableCellsComponent,
    TableValueComponent,
    ViewTablesComponent,
    ViewTreeComponent,
    SplitConditionComponent,
    ActionnodeCreateComponent,
    EditModalComponent,
    ActionFunctionComponent,
    ChildNodeComponent,
    TreeGraphComponent,
    DecisionGraphComponent,
    CreateFlowTaskComponent,
    DecisionTableConfigComponent,
    DecisionTablesConfigComponent,
    DecisionTreeConfigurationComponent,
    FunctionConfigComponent,
    QueryVariableConfigComponent,
    RuleEngineConfigComponent,
    ScoreCardConfigComponent,
    StandardConfigComponent,
    VariableLibConfigComponent,
    VariablesConfigComponent,
    BranchCreationComponent,
    AssignConditionComponent,
    CombineOperationModalComponent,
    ConditionAlertboxComponent,
    MessagePopupComponent,
    FlowExecutionComponent,
    ApplyFilterComponent,
    FlowtestConfigModalComponent,
    TableExecutionComponent,
    TestMainComponent,
    VariableLibExecutionComponent,
    ObjectTableComponent,
    ConfigNavBarComponent,
    ConfigNavigationComponent,
    DbConnectionComponent,
    DbConnectionDetailComponent,
    QueryBuilderComponent,
    DbConnectionListComponent,
    DefaultModelComponent,
    DecisionVariableComponent,
    ListVariableComponent,
    ConfigVariablesComponent,
    ViewVariableComponent,
    ProjectVariablesComponent,
    AddHeaderComponent,
    AddParamComponent,
    ConfigVariableComponent,
    CreateEditVariableComponent,
    PythonEditorComponent,
    ProfilingVariableComponent,
    ListProfilingComponent,
    ViewProfilingComponent,
    TestComponent,
    TabletestComponent,
    VariabletestComponent,
    ActionNavBarComponent,
    FieldActionComponent,
    AddnewfieldDialogComponent,
    ImportFlowComponent
    ],
  imports: [
    CommonModule,
    DecisionEngineRoutingModule,
    MaterialModule,
    MatNativeDateModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MonacoEditorModule.forRoot(),
    MatInputModule,
    NgxGraphModule,
    AgGridModule,
    GeneralModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgxMatSelectSearchModule,
    NgxEchartsModule.forRoot({
      echarts,
  }),
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'bottom',
          distance: 50,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 5000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 300,
          easing: 'ease'
        },
        overlap: 150
      }
    }),
    NotifierModule.withConfig({
      // Custom options in here
      position: {
          horizontal: {
              position: 'right',
              distance: 12
          },
          vertical: {
              position: 'bottom',
              distance: 12,
              gap: 10
          }
      },
      theme: 'material',
      behaviour: {
          autoHide: 5000,
          onClick: 'hide',
          onMouseover: 'pauseAutoHide',
          showDismissButton: true,
          stacking: 4
      },
      animations: {
          enabled: true,
          show: {
              preset: 'slide',
              speed: 300,
              easing: 'ease'
          },
          hide: {
              preset: 'fade',
              speed: 300,
              easing: 'ease',
              offset: 50
          },
          shift: {
              speed: 300,
              easing: 'ease'
          },
          overlap: 150
      }
  }),
  ]
})
export class DecisionEngineModule { }
