import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoanCaseManagerRoutingModule } from './loan-case-manager-routing.module';
import { LoanCaseManagerMainComponent } from './loan-case-manager-main/loan-case-manager-main.component';
import { VerifierQueueComponent } from './verifier-queue/verifier-queue.component';
import { UnderwriterQueueComponent } from './underwriter-queue/underwriter-queue.component';
import { MaterialModule } from '../material/material.module';
import { VerifierQueueOpenComponent } from './verifier-queue/verifier-queue-open/verifier-queue-open.component';
import { VerifierQueueInprogressComponent } from './verifier-queue/verifier-queue-inprogress/verifier-queue-inprogress.component';
import { VerifierQueueVerifiedComponent } from './verifier-queue/verifier-queue-verified/verifier-queue-verified.component';
import { VerifierQueueDetailComponent } from './verifier-queue/verifier-queue-detail/verifier-queue-detail.component';
import { UnderwriterQueueOpenComponent } from './underwriter-queue/underwriter-queue-open/underwriter-queue-open.component';
import { UnderwriterQueueInprogressComponent } from './underwriter-queue/underwriter-queue-inprogress/underwriter-queue-inprogress.component';
import { UnderwriterQueueDocumentComponent } from './underwriter-queue/underwriter-queue-document/underwriter-queue-document.component';
import { UnderwriterQueueAcceptedComponent } from './underwriter-queue/underwriter-queue-accepted/underwriter-queue-accepted.component';
import { UnderwriterQueueDeclinedComponent } from './underwriter-queue/underwriter-queue-declined/underwriter-queue-declined.component';
import { UnderwriterQueueEsclatedComponent } from './underwriter-queue/underwriter-queue-esclated/underwriter-queue-esclated.component';
import { UnderwriterQueueDetailComponent } from './underwriter-queue/underwriter-queue-detail/underwriter-queue-detail.component';
// import { AddSectionComponent } from './queue-common/add-section/add-section.component';
// import { AddFieldComponent } from './queue-common/add-field/add-field.component';
import { VerifierQueueFinancialsComponent } from './verifier-queue/verifier-queue-financials/verifier-queue-financials.component';
import { DuplicatePopupComponent } from './verifier-queue/duplicate-popup/duplicate-popup.component'
// import { DetailsComponent } from './duplicate-list/details/details.component';
// import { DuplicateListComponent } from './duplicate-list/duplicate-list/duplicate-list.component';
import { CalculatorComponent } from './calculator/calculator.component';
// import { ShortcutIconComponent } from './shortcut-icon/shortcut-icon.component';
// import { EmiCalculatorComponent } from './emi-calculator/emi-calculator.component';
// import { NotepadComponent } from './notepad/notepad.component';
import { Ng5SliderModule } from 'ng5-slider';
import { AcceptedDetailComponent } from './underwriter-queue/underwriter-queue-accepted/accepted-detail/accepted-detail.component';
import { VerifierQueueAssignComponent } from './verifier-queue/verifier-queue-assign/verifier-queue-assign.component';
import { UnderwriterQueueAssignComponent } from './underwriter-queue/underwriter-queue-assign/underwriter-queue-assign.component';
import { CaseManagerMainComponent } from './components/case-manager-main/case-manager-main.component';
import { InternalScoringComponent } from './components/internal-scoring/internal-scoring.component';
import { FinalDecisionComponent } from './components/final-decision/final-decision.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeneralModule } from '../general/general.module';
import { ViewDetailsListComponent } from './components/view-details-list/view-details-list.component';
import { DuplicatePreviewPopupComponent } from './components/duplicate-preview-popup/duplicate-preview-popup.component';
import { SelfClaimComponent } from './components/self-claim/self-claim.component';
import { PRBSpecialHandlingComponent } from './components/prb-special-handling/prb-special-handling.component';
import { DepositerBaseComponent } from './components/depositer-base/depositer-base.component';
import { NTBApproveStageComponent } from './components/ntb-approve-stage/ntb-approve-stage.component';
import { TuStageComponent } from './components/tu-stage/tu-stage.component';
import { NfisStageComponent } from './components/nfis-stage/nfis-stage.component';
import { DepositerbaseViewdetailsPopupComponent } from './components/depositerbase-viewdetails-popup/depositerbase-viewdetails-popup.component';
import { DuplicatematchingViewdetailsPopupComponent } from './components/duplicatematching-viewdetails-popup/duplicatematching-viewdetails-popup.component';
import { DuplicatePreviewMultirowComponent } from './components/duplicate-preview-multirow/duplicate-preview-multirow.component';
import { NthCammAddressComponent } from './components/nth-camm-address/nth-camm-address.component';
import { NthTuAddressVerificationComponent } from './components/nth-tu-address-verification/nth-tu-address-verification.component';
import { EmployeeCardStageComponent } from './components/employee-card-stage/employee-card-stage.component';
import { CiApplicationsListComponent } from './components/ci-application/ci-applications-list/ci-applications-list.component';
import { CreditReviewComponent } from './components/credit-review/credit-review.component';
import { CiApplicationPreviewComponent } from './components/ci-application-preview/ci-application-preview.component';
import { ListBasedStageComponent } from './list-based-stage/list-based-stage.component';
import { ToVerifypopupComponent } from './to-verifypopup/to-verifypopup.component';
import { BureauScreenComponent } from './components/credit-review/modals/bureau-screen/bureau-screen.component';
import { ReprocessApplicationComponent } from './components/reprocess-application/reprocess-application.component';
import { ApplicationVerificationComponent } from './components/clos/application-verification/application-verification.component';
import { UnderwritingComponent } from './components/clos/underwriting/underwriting.component';
import { LoanApprovalComponent } from './components/clos/loan-approval/loan-approval.component';
import { DocumentVerificationComponent } from './components/clos/document-verification/document-verification.component';
import { RejectionConfirmationComponent } from './components/rejection-confirmation/rejection-confirmation.component';
import { UnderwritingPreviewPopupComponent } from './components/clos/underwriting-preview-popup/underwriting-preview-popup.component';
import { LoanApprovalPreviewComponent } from './components/clos/loan-approval-preview/loan-approval-preview.component';
import { LoanApprovalEditComponent } from './components/clos/loan-approval-edit/loan-approval-edit.component';
import { CreditMemoPopupComponent } from './components/clos/credit-memo-popup/credit-memo-popup.component';
import { KycPreviewComponent } from './components/clos/application-verification/kyc-preview/kyc-preview.component';
import { RatioPreviewPopupComponent } from './components/clos/ratio-preview-popup/ratio-preview-popup.component';


@NgModule({
  declarations: [
    LoanCaseManagerMainComponent,
    VerifierQueueComponent,
    UnderwriterQueueComponent,
    VerifierQueueOpenComponent,
    VerifierQueueInprogressComponent,
    VerifierQueueVerifiedComponent,
    VerifierQueueDetailComponent,
    UnderwriterQueueOpenComponent,
    UnderwriterQueueInprogressComponent,
    UnderwriterQueueDocumentComponent,
    UnderwriterQueueAcceptedComponent,
    UnderwriterQueueDeclinedComponent,
    UnderwriterQueueEsclatedComponent,
    UnderwriterQueueDetailComponent,
    // AddSectionComponent,
    // AddFieldComponent,
    VerifierQueueFinancialsComponent,
    DuplicatePopupComponent,
    // DetailsComponent,
    // DuplicateListComponent,
    CalculatorComponent,
    // ShortcutIconComponent,
    // EmiCalculatorComponent,
    // NotepadComponent,
    AcceptedDetailComponent,
    VerifierQueueAssignComponent,
    UnderwriterQueueAssignComponent,
    CaseManagerMainComponent,
    InternalScoringComponent,
    FinalDecisionComponent,
    DashboardComponent,
    ViewDetailsListComponent,
    DuplicatePreviewPopupComponent,
    SelfClaimComponent,
    PRBSpecialHandlingComponent,
    DepositerBaseComponent,
    NTBApproveStageComponent,
    TuStageComponent,
    NfisStageComponent,
    DepositerbaseViewdetailsPopupComponent,
    DuplicatematchingViewdetailsPopupComponent,
    DuplicatePreviewMultirowComponent,
    NthCammAddressComponent,
    NthTuAddressVerificationComponent,
    EmployeeCardStageComponent,
    CiApplicationsListComponent,
    CreditReviewComponent,
    CiApplicationPreviewComponent,
    ListBasedStageComponent,
    ToVerifypopupComponent,
    BureauScreenComponent,
    ReprocessApplicationComponent,
    ApplicationVerificationComponent,
    UnderwritingComponent,
    LoanApprovalComponent,
    DocumentVerificationComponent,
    RejectionConfirmationComponent,
    UnderwritingPreviewPopupComponent,
    LoanApprovalPreviewComponent,
    LoanApprovalEditComponent,
    CreditMemoPopupComponent,
    KycPreviewComponent,
    RatioPreviewPopupComponent,
  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [
    CommonModule,
    LoanCaseManagerRoutingModule,
    MaterialModule,
    Ng5SliderModule,
    HttpClientModule,
    // NgxPaginationModule,
    FormsModule,
    GeneralModule
  ]
})
export class LoanCaseManagerModule { }
