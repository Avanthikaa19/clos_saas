import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanOriginationRoutingModule } from './loan-origination-routing.module';
import { QuickDataEntryComponent } from './component/loan-processes/quick-data-entry/quick-data-entry.component';
import { FullDataEntryComponent } from './component/loan-processes/full-data-entry/full-data-entry.component';
import { LoanDashboardComponent } from './component/loan-dashboard/loan-dashboard.component';
import { LoanMainComponent } from './component/loan-main/loan-main.component';
import { LoanProcessesComponent } from './component/loan-processes/loan-processes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { DocumentationComponent } from './component/loan-processes/documentation/documentation.component';
import * as echarts from 'echarts';
import 'echarts/theme/macarons.js';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApplicantDetailComponent } from './component/loan-processes/full-data-entry/pop-up/applicant-detail/applicant-detail.component';
import { IdentificationDetailComponent } from './component/loan-processes/full-data-entry/pop-up/identification-detail/identification-detail.component';
import { ContactDetailComponent } from './component/loan-processes/full-data-entry/pop-up/contact-detail/contact-detail.component';
import { EmploymentDetailComponent } from './component/loan-processes/full-data-entry/pop-up/employment-detail/employment-detail.component';
import { IncomeDetailComponent } from './component/loan-processes/full-data-entry/pop-up/income-detail/income-detail.component';
import { AddressDetailComponent } from './component/loan-processes/full-data-entry/pop-up/address-detail/address-detail.component';
import { LoanScorecardComponent } from './component/loan-scorecard/loan-scorecard.component';
import { ScorecardDetailsComponent } from './component/loan-scorecard/scorecard-details/scorecard-details.component';
import { UnsecuredLoanDetailsComponent } from './component/loan-processes/full-data-entry/unsecured-loan-details/unsecured-loan-details.component';
import { MainApplicationListComponent } from './component/main-application-list/main-application-list.component';
import { GeneralModule } from '../general/general.module';
import { CreateApplicantComponent } from './component/loan-processes/full-data-entry/create-applicant/create-applicant.component';
import { DuplicateDashboardComponent } from './component/duplicate-dashboard/duplicate-dashboard.component';
import { DuplicateViewDetailsComponent } from './component/duplicate-view-details/duplicate-view-details.component';
import { CreditCardComponent } from './component/credit-card/credit-card.component';
import { PersonalInformationComponent } from './component/credit-card/personal-information/personal-information.component';
import { WorkAndFinanceComponent } from './component/credit-card/work-and-finance/work-and-finance.component';
import { AdditionalInformationComponent } from './component/credit-card/additional-information/additional-information.component';

@NgModule({
  declarations: [
    LoanMainComponent,
    LoanDashboardComponent,
    QuickDataEntryComponent,
    FullDataEntryComponent,
    LoanProcessesComponent,
    DocumentationComponent,
    ApplicantDetailComponent,
    IdentificationDetailComponent,
    ContactDetailComponent,
    EmploymentDetailComponent,
    IncomeDetailComponent,
    AddressDetailComponent,
    LoanScorecardComponent,
    ScorecardDetailsComponent,
    UnsecuredLoanDetailsComponent,
    MainApplicationListComponent,
    CreateApplicantComponent,
    DuplicateDashboardComponent,
    DuplicateViewDetailsComponent,
    CreditCardComponent,
    PersonalInformationComponent,
    WorkAndFinanceComponent,
    AdditionalInformationComponent,
  ],
  imports: [
    CommonModule,
    LoanOriginationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GeneralModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ]
})
export class LoanOriginationModule { }
