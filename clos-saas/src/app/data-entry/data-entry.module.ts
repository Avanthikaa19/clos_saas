import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataEntryRoutingModule } from './data-entry-routing.module';
import { InitialDisplayComponent } from './initial-display/initial-display.component';
import { DataEntryHomeComponent } from './initial-display/data-entry-home/data-entry-home.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TexttypeValidationDirective } from '../general/shared-directives/texttype-validation.directive';
import { PhonenumberValidationDirective } from '../general/shared-directives/phonenumber-validation.directive';
import { MaterialModule } from '../material/material.module';
import { StepperMainComponent } from './initial-display/data-entry-home/stepper-main/stepper-main.component';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadStepComponent } from './initial-display/data-entry-home/stepper-main/file-upload-step/file-upload-step.component';
import { ApplicationInformationComponent } from './initial-display/data-entry-home/stepper-main/application-information/application-information.component';
import { PersonalInformationComponent } from './initial-display/data-entry-home/stepper-main/personal-information/personal-information.component';
import { AddressInformationComponent } from './initial-display/data-entry-home/stepper-main/address-information/address-information.component';
import { EmploymentInformationComponent } from './initial-display/data-entry-home/stepper-main/employment-information/employment-information.component';
import { EvaluationProcessComponent } from './initial-display/data-entry-home/stepper-main/evaluation-process/evaluation-process.component';
import { CardDetailsComponent } from './initial-display/data-entry-home/stepper-main/card-details/card-details.component';
import { LoanDetailsComponent } from './initial-display/data-entry-home/stepper-main/loan-details/loan-details.component';
import { SpouseInformationComponent } from './initial-display/data-entry-home/stepper-main/spouse-information/spouse-information.component';
import { PersonalReferenceInformationComponent } from './initial-display/data-entry-home/stepper-main/personal-reference-information/personal-reference-information.component';
import { SupplementaryInformationComponent } from './initial-display/data-entry-home/stepper-main/supplementary-information/supplementary-information.component';
import { ViewApplicationOldComponent } from './initial-display/data-entry-home/view-application-old/view-application-old.component';
import { GeneralModule } from '../general/general.module';
import { TwoDigitLimitationDirective } from '../general/shared-directives/two-digit-limitation.directive';
import { ViewApplicationComponent } from './initial-display/view-application/view-application.component';
import { ViewResultStatusComponent } from './initial-display/view-result-status/view-result-status.component';
import { ApplicationDetailPopupComponent } from './initial-display/application-detail-popup/application-detail-popup.component';
import { NfisListComponent } from './initial-display/data-entry-home/nfis-list/nfis-list.component';
import { TuListComponent } from './initial-display/data-entry-home/tu-list/tu-list.component';
import { ImportComponent } from './initial-display/data-entry-home/import-export/import/import/import.component';
import { ExportComponent } from './initial-display/data-entry-home/import-export/export/export/export.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    InitialDisplayComponent,
    DataEntryHomeComponent,
    TexttypeValidationDirective,
    PhonenumberValidationDirective,
    TwoDigitLimitationDirective,
    StepperMainComponent,
    FileUploadStepComponent,
    ApplicationInformationComponent,
    PersonalInformationComponent,
    AddressInformationComponent,
    EmploymentInformationComponent,
    EvaluationProcessComponent,
    CardDetailsComponent,
    LoanDetailsComponent,
    SpouseInformationComponent,
    PersonalReferenceInformationComponent,
    SupplementaryInformationComponent,
    ViewApplicationOldComponent,
    ViewApplicationComponent,
    ViewResultStatusComponent,
    ApplicationDetailPopupComponent,
    NfisListComponent,
    TuListComponent,
    ImportComponent,
    ExportComponent,
  ],
  imports: [
    CommonModule,
    DataEntryRoutingModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialModule,
    MatRadioModule,
    GeneralModule,
  ],
})
export class DataEntryModule { }

