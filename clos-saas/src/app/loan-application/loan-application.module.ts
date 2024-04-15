import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoanApplicationRoutingModule } from './loan-application-routing.module';
import { MaterialModule } from '../material/material.module';
import { LoanApplicationListComponent } from './components/loan-application-list/loan-application-list.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { ScoreLimitListComponent } from './components/score-limit-list/score-limit-list.component';
import { DatabaseConfigListComponent } from './components/database-config-list/database-config-list.component';
import { AlgorithmConfigListComponent } from './components/algorithm-config-list/algorithm-config-list.component';
import { FilterComponent } from './common/filter/filter.component';
import { DataTableComponent } from './common/data-table/data-table.component';
import { AlertComponent } from './common/alert/alert.component';
import { ShareDataTableComponent } from './common/share-data-table/share-data-table.component';
import { DisplayAllFieldsComponent } from './common/display-all-fields/display-all-fields.component';
import { ConfigurationsComponent } from './components/database-config-list/configurations/configurations.component';
import { ExportPopupComponent } from './common/export-popup/export-popup.component';
import { DuplicateViewComponent } from './common/duplicate-view/duplicate-view.component';
import { GeneralModule } from '../general/general.module';
import { RulesImportExportComponent } from './common/rules-import-export/rules-import-export.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LoantypeConfigListComponent } from './components/loantype-config-list/loantype-config-list.component';
import { LoantypeConfigDetailsComponent } from './components/loantype-config-list/loantype-config-details/loantype-config-details.component';
import { UserDefinedFieldsComponent } from './components/user-defined-fields/user-defined-fields.component';
import { AddUserDefinedFieldsComponent } from './components/user-defined-fields/add-user-defined-fields/add-user-defined-fields.component';
import { CurrencyConfigComponent } from './components/currency-config/currency-config.component';
import { CreateCurrencyConfigComponent } from './components/currency-config/create-currency-config/create-currency-config.component';
import { DocChecklistComponent } from './components/loantype-config-list/doc-checklist/doc-checklist.component';
import { CollateralConfigListComponent } from './components/collateral-config-list/collateral-config-list.component';
import { CollateralConfigDetailComponent } from './components/collateral-config-list/collateral-config-detail/collateral-config-detail.component';

@NgModule({
  declarations: [
    LoanApplicationListComponent,
    MainNavComponent,
    ScoreLimitListComponent,
    DatabaseConfigListComponent,
    AlgorithmConfigListComponent,
    FilterComponent,
    DataTableComponent,
    AlertComponent,
    ShareDataTableComponent,
    DisplayAllFieldsComponent,
    ConfigurationsComponent,
    ExportPopupComponent,
    DuplicateViewComponent,
    RulesImportExportComponent,
    LoantypeConfigListComponent,
    LoantypeConfigDetailsComponent,
    UserDefinedFieldsComponent,
    AddUserDefinedFieldsComponent,
    CurrencyConfigComponent,
    CreateCurrencyConfigComponent,
    DocChecklistComponent,
    CollateralConfigListComponent,
    CollateralConfigDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoanApplicationRoutingModule,
    MaterialModule,
    GeneralModule,
    NgxPaginationModule,
    NgxMatSelectSearchModule,
  ]
})
export class LoanApplicationModule { }
