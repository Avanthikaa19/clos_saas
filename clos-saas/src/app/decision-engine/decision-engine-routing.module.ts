import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecisionEngineHomeComponent } from './components/decision-engine-home/decision-engine-home.component';
import { DesicionDashboardComponent } from './components/desicion-dashboard/desicion-dashboard.component';
import { DecisionExplorerComponent } from './components/decision-explorer/decision-explorer.component';
import { ScorecardComponent } from './components/scorecard/scorecard.component';
import { ScorecardVariablesComponent } from './components/scorecard/scorecardview-tables/scorecard-variables/scorecard-variables.component';
import { ScorecardviewTablesComponent } from './components/scorecard/scorecardview-tables/scorecardview-tables.component';
import { ListFlowComponent } from './components/decision-flow/list-flow/list-flow.component';
import { DecisionFlowComponent } from './components/decision-flow/decision-flow.component';
import { QueryVariableComponent } from './components/query-variable/query-variable.component';
import { ViewQueryVariableComponent } from './components/query-variable/view-query-variable/view-query-variable.component';
import { ListQueryVariableComponent } from './components/query-variable/list-query-variable/list-query-variable.component';
import { VariablesComponent } from './components/variables/variables.component';
import { ListVariablesComponent } from './components/variables/list-variables/list-variables.component';
import { ViewVariablesComponent } from './components/variables/view-variables/view-variables.component';
import { DecisionTreesComponent } from './components/decision-trees/decision-trees.component';
import { ListTreeComponent } from './components/decision-trees/list-tree/list-tree.component';
import { ScorecardlistTablesComponent } from './components/scorecard/scorecardlist-tables/scorecardlist-tables.component';
import { ListRuleSetComponent } from './components/rule-set/list-rule-set/list-rule-set.component';
import { ViewRulesSetComponent } from './components/rule-set/view-rules-set/view-rules-set.component';
import { RuleSetComponent } from './components/rule-set/rule-set.component';
import { ListRulesComponent } from './components/rules/list-rules/list-rules.component';
import { RulesComponent } from './components/rules/rules.component';
import { ViewRulesComponent } from './components/rules/view-rules/view-rules.component';
import { DecisionTablesComponent } from './components/decision-tables/decision-tables.component';
import { ListTablesComponent } from './components/decision-tables/list-tables/list-tables.component';
import { CreateDecisionTablesComponent } from './components/decision-tables/modals/create-decision-tables/create-decision-tables.component';
import { ViewTablesComponent } from './components/decision-tables/view-tables/view-tables.component';
import { ViewTreeComponent } from "./components/decision-trees/view-tree/view-tree.component";
import { TreeGraphComponent } from './components/decision-trees/tree-graph/tree-graph.component'
import { DecisionGraphComponent } from './components/decision-flow/decision-graph/decision-graph.component';
import { FlowExecutionComponent } from './components/test-executions/flow-execution/flow-execution.component';
import { ConfigNavBarComponent } from './components/decision-configration/config-nav-bar/config-nav-bar.component';
import { ConfigNavigationComponent } from './components/decision-configration/config-navigation/config-navigation.component';
import { DecisionObjectModelComponent } from './components/decision-configration/decision-object-model/decision-object-model.component';
import { DefaultModelComponent } from './components/decision-configration/default-model/default-model.component';
import { DbConnectionComponent } from './components/decision-configration/db-connection/db-connection.component';
import { DbConnectionDetailComponent } from './components/decision-configration/db-connection/db-connection-detail/db-connection-detail.component';
import { DbConnectionListComponent } from './components/decision-configration/db-connection/db-connection-list/db-connection-list.component';
import { ListProfilingComponent } from './components/profiling-variable/list-profiling/list-profiling.component';
import { ViewProfilingComponent } from './components/profiling-variable/view-profiling/view-profiling.component';
import { TableExecutionComponent } from './components/test-executions/table-execution/table-execution.component';
import { TestMainComponent } from './components/test-executions/test-main/test-main.component';
import { TestComponent } from './components/test/test.component';
import { TabletestComponent } from './components/tabletest/tabletest.component';
import { VariabletestComponent } from './components/variabletest/variabletest.component';
import { ActionNavBarComponent } from './components/decision-action/action-nav-bar/action-nav-bar.component';
import { FieldActionComponent } from './components/decision-action/field-action/field-action.component';

const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: 'home' },

  {
    path: '', component: DecisionEngineHomeComponent, children: [
      { path: 'home', component: DesicionDashboardComponent },
      { path: 'test', component: TestComponent },
      { path: 'test/tabletest', component: TabletestComponent },
      { path: 'test/flowtest', component: FlowExecutionComponent },
      { path: 'test/flowtest/:id', component: FlowExecutionComponent },
      { path: 'test/variabletest', component: VariabletestComponent },

      {
        path: 'explorer', component: DecisionExplorerComponent, data: { reuse: true }, children: [
          { path: "", pathMatch: 'full', redirectTo: 'decisionFlow' },
          {
            path: 'decisionFlow', component: DecisionFlowComponent,
            children: [
              { path: "", pathMatch: 'full', redirectTo: 'decisionFlowList' },
              { path: 'decisionFlowList', component: ListFlowComponent, },
               { path: 'decisionFlowView/:id', component: DecisionGraphComponent }
            ]
          },
          {
            path: 'decisionTables', component: DecisionTablesComponent,
            children: [
              { path: "", pathMatch: 'full', redirectTo: 'decisionTableList' },
              { path: 'decisionTableList', component: ListTablesComponent, },
              { path: 'decisionTableView/:id', component: ViewTablesComponent, }
            ]
          },
          {
            path: 'decisionTree', component: DecisionTreesComponent,
            children: [
              { path: "", pathMatch: 'full', redirectTo: 'decisionTreeList' },
              { path: 'decisionTreeList', component: ListTreeComponent, },
               { path: 'decisionTreeView/:id', component: ViewTreeComponent, },
              { path: 'decisionTreeGraph/:id', component: TreeGraphComponent, outlet: 'graph', },
            ]
          },
          {
            path: 'rules', component: RulesComponent,
            children: [
              { path: "", pathMatch: 'full', redirectTo: 'rules-list' },
              { path: 'rules-list', component: ListRulesComponent },
              { path: 'rules-change/:id', component: ViewRulesComponent},
            ]
          },
          {
            path: 'rule-set', component: RuleSetComponent,
            children: [
              { path: "", pathMatch: 'full', redirectTo: 'rule-set-list' },
              { path: 'rule-set-list', component: ListRuleSetComponent, },
              { path: 'rule-set-view/:id', component: ViewRulesSetComponent, }
            ]
          },
          {
            path: 'variables', component: VariablesComponent,
            children: [
              { path: "", pathMatch: 'full', redirectTo: 'variablesList' },
              { path: 'variablesList', component: ListVariablesComponent, },
              { path: 'variableView/:id', component: ViewVariablesComponent }
            ]
          },
          {
            path: 'query-variable', component: QueryVariableComponent,
            children: [
              { path: "", pathMatch: 'full', redirectTo: 'query-variable-list' },
              { path: 'query-variable-list', component: ListQueryVariableComponent, },
              { path: 'query-variable-view/:id', component: ViewQueryVariableComponent, }
            ]
          },
          {
            path: 'scoreCard', component: ScorecardComponent,
            children: [
              { path: "", pathMatch: 'full', redirectTo: 'scoreCardList' },
              { path: 'scoreCardList', component: ScorecardlistTablesComponent, },
              { path: 'scoreCardView/:id', component: ScorecardviewTablesComponent },
              { path: 'scoreCardVariables', component: ScorecardVariablesComponent }
            ]
          },
        ]
      },
      {
        path: 'config', component: ConfigNavBarComponent, data: { reuse: true }, children: [
         { path: "", pathMatch: 'full', redirectTo: 'config-nav' },
         { path: 'config-nav', component: ConfigNavigationComponent },
         { path: 'config-nav/object-model-configuration', component: DecisionObjectModelComponent },
         { path: 'config-nav/default-model', component: DefaultModelComponent },
         { path: 'config-nav/db-connection', component: DbConnectionComponent },
         { path: 'config-nav/profile-list', component: ListProfilingComponent },
         { path: 'config-nav/profileView/:id', component: ViewProfilingComponent },
         { path: 'config-nav/db-details', component: DbConnectionDetailComponent },
         { path: 'config-nav/db-list', component: DbConnectionListComponent },
       ]
      },
      {
        path: 'test-execution', component: TestMainComponent, data: { reuse: true }, children: [
          { path: 'table-execution', component: TableExecutionComponent },
          { path: 'flow-execution', component: FlowExecutionComponent },
        ]
      },
      {
        path: 'decisionAction', component: ActionNavBarComponent,
        children: [
          { path: "", pathMatch: 'full', redirectTo: 'fieldEditor' },
          { path: 'fieldEditor', component: FieldActionComponent, },
          //  { path: 'decisionTreeView/:id', component: ViewTreeComponent, },
          // { path: 'decisionTreeGraph/:id', component: TreeGraphComponent, outlet: 'graph', },
        ]
      },
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DecisionEngineRoutingModule { }
