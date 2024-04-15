import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanCaseManagerMainComponent } from './loan-case-manager-main/loan-case-manager-main.component';
import { VerifierQueueComponent } from './verifier-queue/verifier-queue.component';
import { VerifierQueueDetailComponent } from './verifier-queue/verifier-queue-detail/verifier-queue-detail.component'
import { UnderwriterQueueComponent } from './underwriter-queue/underwriter-queue.component'
import { UnderwriterQueueDetailComponent } from './underwriter-queue/underwriter-queue-detail/underwriter-queue-detail.component'
// import { DetailsComponent } from './duplicate-list/details/details.component';
// import { DuplicateListComponent } from './duplicate-list/duplicate-list/duplicate-list.component';
import { CaseManagerMainComponent } from './components/case-manager-main/case-manager-main.component';
import { InternalScoringComponent } from './components/internal-scoring/internal-scoring.component';
import { FinalDecisionComponent } from './components/final-decision/final-decision.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewDetailsListComponent } from './components/view-details-list/view-details-list.component';
import { PRBSpecialHandlingComponent } from './components/prb-special-handling/prb-special-handling.component';
import { DepositerBaseComponent } from './components/depositer-base/depositer-base.component';
import { NTBApproveStageComponent } from './components/ntb-approve-stage/ntb-approve-stage.component';
import { TuStageComponent } from './components/tu-stage/tu-stage.component';
import { NfisStageComponent } from './components/nfis-stage/nfis-stage.component';
import { NthCammAddressComponent } from './components/nth-camm-address/nth-camm-address.component';
import { NthTuAddressVerificationComponent } from './components/nth-tu-address-verification/nth-tu-address-verification.component';
import { EmployeeCardStageComponent } from './components/employee-card-stage/employee-card-stage.component';
import { CiApplicationsListComponent } from './components/ci-application/ci-applications-list/ci-applications-list.component';
import { CreditReviewComponent } from './components/credit-review/credit-review.component';
import { ListBasedStageComponent } from './list-based-stage/list-based-stage.component';
import { ReprocessApplicationComponent } from './components/reprocess-application/reprocess-application.component';
import { ApplicationVerificationComponent } from './components/clos/application-verification/application-verification.component';
import { UnderwritingComponent } from './components/clos/underwriting/underwriting.component';
import { LoanApprovalComponent } from './components/clos/loan-approval/loan-approval.component';
import { DocumentVerificationComponent } from './components/clos/document-verification/document-verification.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'loan-case-manager-main/application-verification',
    pathMatch: 'full'
  },
  {
    path: 'loan-case-manager-main', component: CaseManagerMainComponent, children: [
      { path: 'internal-scoring-list', component: InternalScoringComponent },
      { path: 'Prb-special-handling-list', component: PRBSpecialHandlingComponent },
      { path: 'nfis-matching-stage', component: NfisStageComponent },
      { path: 'ntp-approve-list', component: NTBApproveStageComponent },
      { path: 'tu-stage-list', component: TuStageComponent },
      { path: 'nth-camm-stage-list', component: NthCammAddressComponent },
      { path: 'nth-tu-stage-list', component: NthTuAddressVerificationComponent },
      { path: 'fraud-review-stage', component: FinalDecisionComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'depositerBase', component: DepositerBaseComponent },
      { path: 'employee-card-stage', component: EmployeeCardStageComponent },
      { path: 'credit-review', component: CreditReviewComponent },
      { path: 'List-stage', component:ListBasedStageComponent },
      { path: 'ci-application-list', component: CiApplicationsListComponent },
      { path: 'reprocess-application', component: ReprocessApplicationComponent },
      { path: 'application-verification', component: ApplicationVerificationComponent },
      { path: 'underwriting', component: UnderwritingComponent },
      { path: 'loan-approval', component: LoanApprovalComponent },
      { path: 'document-verification', component: DocumentVerificationComponent },



      { path: ':fsId', component: ViewDetailsListComponent },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanCaseManagerRoutingModule { }
