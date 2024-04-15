import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewDetailsComponent } from '../duplicate-checking/components/view-details/view-details.component';
import { DataEntryModule } from './data-entry.module';
import { DataEntryHomeComponent } from './initial-display/data-entry-home/data-entry-home.component';
import { ExportComponent } from './initial-display/data-entry-home/import-export/export/export/export.component';
import { ImportComponent } from './initial-display/data-entry-home/import-export/import/import/import.component';
import { NfisListComponent } from './initial-display/data-entry-home/nfis-list/nfis-list.component';
import { AddressInformationComponent } from './initial-display/data-entry-home/stepper-main/address-information/address-information.component';
import { ApplicationInformationComponent } from './initial-display/data-entry-home/stepper-main/application-information/application-information.component';
import { CardDetailsComponent } from './initial-display/data-entry-home/stepper-main/card-details/card-details.component';
import { EmploymentInformationComponent } from './initial-display/data-entry-home/stepper-main/employment-information/employment-information.component';
import { EvaluationProcessComponent } from './initial-display/data-entry-home/stepper-main/evaluation-process/evaluation-process.component';
import { FileUploadStepComponent } from './initial-display/data-entry-home/stepper-main/file-upload-step/file-upload-step.component';
import { LoanDetailsComponent } from './initial-display/data-entry-home/stepper-main/loan-details/loan-details.component';
import { PersonalInformationComponent } from './initial-display/data-entry-home/stepper-main/personal-information/personal-information.component';
import { PersonalReferenceInformationComponent } from './initial-display/data-entry-home/stepper-main/personal-reference-information/personal-reference-information.component';
import { SpouseInformationComponent } from './initial-display/data-entry-home/stepper-main/spouse-information/spouse-information.component';
import { StepperMainComponent } from './initial-display/data-entry-home/stepper-main/stepper-main.component';
import { SupplementaryInformationComponent } from './initial-display/data-entry-home/stepper-main/supplementary-information/supplementary-information.component';
import { TuListComponent } from './initial-display/data-entry-home/tu-list/tu-list.component';
import { ViewApplicationOldComponent } from './initial-display/data-entry-home/view-application-old/view-application-old.component';
import { InitialDisplayComponent } from './initial-display/initial-display.component';
import { ViewApplicationComponent } from './initial-display/view-application/view-application.component';

const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: 'dataentry-home/stepper-main/application-info' },
  {
    path: '', component: InitialDisplayComponent, children: [
      {
        path: 'dataentry-home', component: DataEntryHomeComponent, children: [
          {
            path: 'stepper-main', component: StepperMainComponent, children: [
              { path: 'fileupload-step', component: FileUploadStepComponent },
              { path: 'application-info', component: ApplicationInformationComponent },
              { path: 'personal-info', component: PersonalInformationComponent },
              { path: 'address-info', component: AddressInformationComponent },
              { path: 'employment-info', component: EmploymentInformationComponent },
              { path: 'evaluation-info', component: EvaluationProcessComponent },
              { path: 'card-info', component: CardDetailsComponent },
              { path: 'loan-info', component: LoanDetailsComponent },
              { path: 'spouse-info', component: SpouseInformationComponent },
              { path: 'personal-ref-info', component: PersonalReferenceInformationComponent },
              { path: 'supplementary-info', component: SupplementaryInformationComponent },
            ],
          },
          {path: 'nfis-list', component: NfisListComponent},
          {path: 'tu-list', component: TuListComponent},
          { path: 'view-application-old', component: ViewApplicationOldComponent },
          { path: 'view-application', component: ViewApplicationComponent },
          { path: 'export', component: ExportComponent },
          { path: 'import', component: ImportComponent },
          // { path: ':fsId', component: ViewDetailsComponent},
          { path: ':fsIds', component: StepperMainComponent }
        ]
      },
    ]
  },

];

console.log("url");
console.log(routes)

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataEntryRoutingModule {

}
