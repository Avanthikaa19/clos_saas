import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationDetailsComponent } from './components/application-entry/application-details/application-details.component';
import { ApplicationEntryComponent } from './components/application-entry/application-entry.component';
import { ApplicationMainComponent } from './components/application-entry/application-main/application-main.component';
import { CollateralDetailsComponent } from './components/application-entry/collateral-details/collateral-details.component';
import { CorporateDetailsComponent } from './components/application-entry/corporate-details/corporate-details.component';
import { LoanDetailsComponent } from './components/application-entry/loan-details/loan-details.component';
import { ProxyDetailsComponent } from './components/application-entry/proxy-details/proxy-details.component';
import { ReferenceDetailsComponent } from './components/application-entry/reference-details/reference-details.component';
import { RiskComplianceDetailsComponent } from './components/application-entry/risk-compliance-details/risk-compliance-details.component';
import { UploadsComponent } from './components/application-entry/uploads/uploads.component';
import { ApplicationViewListingComponent } from './components/application-view/application-view-listing/application-view-listing.component';
import { RolloverApplicationListingComponent } from './components/rollover-application/rollover-application-listing/rollover-application-listing.component';
import { ExtensionOfLoanListingComponent } from './components/extension-of-loan/extension-of-loan-listing/extension-of-loan-listing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'application-entry/application-details',
    pathMatch: 'full'
  },
  {
    path: '', component: ApplicationMainComponent, children: [
      { 
        path: '', component: ApplicationEntryComponent , children: [
          { path: 'application-details', component: ApplicationDetailsComponent },
          { path: 'corporate-details', component: CorporateDetailsComponent },
          { path: 'proxy-details', component: ProxyDetailsComponent },
          { path: 'loan-details', component: LoanDetailsComponent },
          { path: 'collateral-details', component: CollateralDetailsComponent },
          { path: 'risk&compliance-details', component: RiskComplianceDetailsComponent },
          { path: 'reference-details', component: ReferenceDetailsComponent },
          { path: 'uploads', component: UploadsComponent },
        ]
      },
      { path: 'application-view', component: ApplicationViewListingComponent },
      {path: 'rollover-listing', component: RolloverApplicationListingComponent},
      {path: 'extension-of-loan', component: ExtensionOfLoanListingComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CLosRoutingModule { }
