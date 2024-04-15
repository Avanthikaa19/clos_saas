import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CLosRoutingModule } from './c-los-routing.module';
import { ApplicationEntryComponent } from './components/application-entry/application-entry.component';
import { ApplicationDetailsComponent } from './components/application-entry/application-details/application-details.component';
import { ApplicationMainComponent } from './components/application-entry/application-main/application-main.component';
import { CorporateDetailsComponent } from './components/application-entry/corporate-details/corporate-details.component';
import { LoanDetailsComponent } from './components/application-entry/loan-details/loan-details.component';
import { CollateralDetailsComponent } from './components/application-entry/collateral-details/collateral-details.component';
import { MaterialModule } from '../material/material.module';
import { RiskComplianceDetailsComponent } from './components/application-entry/risk-compliance-details/risk-compliance-details.component';
import { ReferenceDetailsComponent } from './components/application-entry/reference-details/reference-details.component';
import { UploadsComponent } from './components/application-entry/uploads/uploads.component';
import { ApplicationViewComponent } from './components/application-view/application-view.component';
import { ApplicationViewListingComponent } from './components/application-view/application-view-listing/application-view-listing.component';
import { ClosCommonTableComponent } from './components/common/clos-common-table/clos-common-table.component';
import { ClosCommonExportComponent } from './components/common/clos-common-export/clos-common-export.component';
import { ClosCommonFilterComponent } from './components/common/clos-common-filter/clos-common-filter.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { ClosAdminModule } from '../clos-admin/clos-admin.module';
import { GeneralModule } from '../general/general.module';
import { ApplicationEntryPopupComponent } from './components/application-view/application-entry-popup/application-entry-popup.component';
import { CommaSeparatedInputDirective } from './components/application-entry/Directives/comma-separated-input.directive';
import { ProxyDetailsComponent } from './components/application-entry/proxy-details/proxy-details.component';
import { RolloverApplicationComponent } from './components/rollover-application/rollover-application.component';
import { RolloverApplicationListingComponent } from './components/rollover-application/rollover-application-listing/rollover-application-listing.component';
import { RolloverApplicationPopupComponent } from './components/rollover-application/rollover-application-popup/rollover-application-popup.component';
import { ExtensionOfLoanComponent } from './components/extension-of-loan/extension-of-loan.component';
import { ExtensionOfLoanListingComponent } from './components/extension-of-loan/extension-of-loan-listing/extension-of-loan-listing.component';
import { ExtensionOfLoanPopupComponent } from './components/extension-of-loan/extension-of-loan-popup/extension-of-loan-popup.component';
import { FinancialInformationComponent } from './components/application-view/financial-information/financial-information.component';
import { PreventSpaceDirective } from './prevent-space.directive';
import { ProxyFinancialInformationComponent } from './components/application-view/proxy-financial-information/proxy-financial-information.component';
import { DecimalPlacesDirective } from './decimal-places.directive';
import { InputseperatecommaDirective } from './components/application-entry/Directives/inputseperatecomma.directive';
@NgModule({
  declarations: [
    ApplicationEntryComponent,
    ApplicationDetailsComponent,
    ApplicationMainComponent,
    CorporateDetailsComponent,
    LoanDetailsComponent,
    CollateralDetailsComponent,
    RiskComplianceDetailsComponent,
    ReferenceDetailsComponent,
    UploadsComponent,
    ApplicationViewComponent,
    ApplicationViewListingComponent,
    ClosCommonTableComponent,
    ClosCommonExportComponent,
    ClosCommonFilterComponent,
    ApplicationEntryPopupComponent,
    CommaSeparatedInputDirective,
    ProxyDetailsComponent,
    RolloverApplicationComponent,
    RolloverApplicationListingComponent,
    RolloverApplicationPopupComponent,
    ExtensionOfLoanComponent,
    ExtensionOfLoanListingComponent,
    ExtensionOfLoanPopupComponent,
    FinancialInformationComponent,
    PreventSpaceDirective,
    ProxyFinancialInformationComponent,
    DecimalPlacesDirective,
    InputseperatecommaDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    GeneralModule,
    NgxPaginationModule,
    HttpClientModule,
    ClosAdminModule,
    CLosRoutingModule,
  ]
})
export class CLosModule { }
