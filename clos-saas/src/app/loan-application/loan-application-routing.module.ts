import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanApplicationListComponent } from './components/loan-application-list/loan-application-list.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { AlgorithmConfigListComponent } from './components/algorithm-config-list/algorithm-config-list.component';
import { DatabaseConfigListComponent } from './components/database-config-list/database-config-list.component';
import { ScoreLimitListComponent } from './components/score-limit-list/score-limit-list.component';
import { DataTableComponent } from './common/data-table/data-table.component';
import { DatabaseConnectionComponent } from '../duplicate-checking/components/configurations/database-connection/database-connection.component';
import { DuplicateViewComponent } from './common/duplicate-view/duplicate-view.component';
import { GenericDataTableComponent } from '../general/components/generic-data-table/generic-data-table.component';
import { ViewDetailsComponent } from '../duplicate-checking/components/view-details/view-details.component';
import { LoantypeConfigListComponent } from './components/loantype-config-list/loantype-config-list.component';
import { UserDefinedFieldsComponent } from './components/user-defined-fields/user-defined-fields.component';
import { CurrencyConfigComponent } from './components/currency-config/currency-config.component';
import { CollateralConfigListComponent } from './components/collateral-config-list/collateral-config-list.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'main-nav/currency-config',
    pathMatch: 'full'
  },
  {
    path: 'main-nav', component: MainNavComponent, children: [
      { path: 'application-list', component: LoanApplicationListComponent },
      { path: 'score-limit-config', component: ScoreLimitListComponent },
      { path: 'duplicate-check-config', component: DatabaseConfigListComponent },
      { path: 'loan-type-config', component: LoantypeConfigListComponent },
      { path: 'collateral-config', component: CollateralConfigListComponent },
      { path: 'currency-config', component: CurrencyConfigComponent },
      { path: 'user-defined-fields', component: UserDefinedFieldsComponent },
      { path: 'algorithm-config', component: AlgorithmConfigListComponent },
      { path: 'general-table', component: DataTableComponent },
      { path: 'duplicate-view', component: DuplicateViewComponent},
      { path: 'generic-compo', component: GenericDataTableComponent},
      { path: ':fsId', component: ViewDetailsComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanApplicationRoutingModule { }
