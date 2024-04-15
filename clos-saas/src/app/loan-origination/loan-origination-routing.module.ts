import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanDashboardComponent } from './component/loan-dashboard/loan-dashboard.component';
import { LoanMainComponent } from './component/loan-main/loan-main.component';
import { DocumentationComponent } from './component/loan-processes/documentation/documentation.component';
import { FullDataEntryComponent } from './component/loan-processes/full-data-entry/full-data-entry.component';
import { UnsecuredLoanDetailsComponent } from './component/loan-processes/full-data-entry/unsecured-loan-details/unsecured-loan-details.component';
import { LoanProcessesComponent } from './component/loan-processes/loan-processes.component';
import { QuickDataEntryComponent } from './component/loan-processes/quick-data-entry/quick-data-entry.component';
import { LoanScorecardComponent } from './component/loan-scorecard/loan-scorecard.component';
import { MainApplicationListComponent } from './component/main-application-list/main-application-list.component';
import { CreateApplicantComponent } from './component/loan-processes/full-data-entry/create-applicant/create-applicant.component';
import { DuplicateDashboardComponent } from './component/duplicate-dashboard/duplicate-dashboard.component';
import { CreditCardComponent } from './component/credit-card/credit-card.component';
import { PersonalInformationComponent } from './component/credit-card/personal-information/personal-information.component';
import { WorkAndFinanceComponent } from './component/credit-card/work-and-finance/work-and-finance.component';
import { AdditionalInformationComponent } from './component/credit-card/additional-information/additional-information.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loan/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'loan/loan-processes',
    redirectTo: 'loan/loan-processes/process/1',
    pathMatch: 'full'
  },
      {path:'loan', component: LoanMainComponent,children:[
      {path:'dashboard', component: LoanDashboardComponent},
      {path:'main-app-list', component: MainApplicationListComponent},
      {path:'duplicate',component: DuplicateDashboardComponent},
      {path:'credit-card',component: CreditCardComponent,children:[
        {path:'', pathMatch: 'full', redirectTo: 'personal'},
        {path:'personal', component: PersonalInformationComponent},
        {path:'workandfinance', component: WorkAndFinanceComponent},
        {path:'additional', component: AdditionalInformationComponent}
      ]},
      {path:'loan-scorecard', component: LoanScorecardComponent},
      {path:'main-app-list/loan-processes', component: LoanProcessesComponent,children:[
      {path:'unsecured-loan-details',component: UnsecuredLoanDetailsComponent},
      {path:'process/1',component: QuickDataEntryComponent},
      {path:'process/2',component: FullDataEntryComponent},
      {path:'process/2/create-apps',component: CreateApplicantComponent},
      {path:'process/11',component: DocumentationComponent}
      ]
  }]}
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanOriginationRoutingModule { }
