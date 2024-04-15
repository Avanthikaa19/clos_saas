import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { DeveloperToolsComponent } from './report-portal/developer-tools/developer-tools.component';
import { ComputationQueriesListComponent } from './report-portal/developer-tools/computation-queries-list/computation-queries-list.component';
import { ComputationQueryDetailComponent } from './report-portal/developer-tools/modals/computation-query-detail/computation-query-detail.component';
import { ExtractionQueryDetailComponent } from './report-portal/developer-tools/modals/extraction-query-detail/extraction-query-detail.component';
import { ExtractionQueriesListComponent } from './report-portal/developer-tools/extraction-queries-list/extraction-queries-list.component';
import { LayoutsListComponent } from './report-portal/developer-tools/layouts-list/layouts-list.component';
import { CellFormatEditorComponent } from './report-portal/developer-tools/modals/cell-format-editor/cell-format-editor.component';
import { LayoutCardComponent } from './report-portal/developer-tools/modals/layout-card/layout-card.component';
import { LayoutContextElementCardComponent } from './report-portal/developer-tools/modals/layout-context-element-card/layout-context-element-card.component';
import { LayoutDetailComponent } from './report-portal/developer-tools/modals/layout-detail/layout-detail.component';
import { ThemeCardComponent } from './report-portal/developer-tools/modals/theme-card/theme-card.component';
import { ThemeChooserComponent } from './report-portal/developer-tools/modals/theme-chooser/theme-chooser.component';
import { ThemeDetailComponent } from './report-portal/developer-tools/modals/theme-detail/theme-detail.component';
import { ReportsImportExportWizardComponent } from './report-portal/developer-tools/reports-import-export-wizard/reports-import-export-wizard.component';
import { ReportsListComponent } from './report-portal/developer-tools/reports-list/reports-list.component';
import { ThemesListComponent } from './report-portal/developer-tools/themes-list/themes-list.component';
import { LandingPageComponent } from './report-portal/landing-page/landing-page.component';
import { ReportPortalComponent } from './report-portal/report-portal/report-portal.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { ComputationQueryChooserComponent } from './report-portal/developer-tools/modals/computation-query-chooser/computation-query-chooser.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { ExtractionQueryChooserComponent } from './report-portal/developer-tools/modals/extraction-query-chooser/extraction-query-chooser.component';
import { ImportExportDetailsComponent } from './report-portal/developer-tools/modals/import-export-details/import-export-details.component';
import { LayoutChooserComponent } from './report-portal/developer-tools/modals/layout-chooser/layout-chooser.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditFormulaPopupComponent } from './report-portal/developer-tools/modals/layout-detail-grid/edit-formula-popup/edit-formula-popup.component';
import { LayoutDetailGridComponent } from './report-portal/developer-tools/modals/layout-detail-grid/layout-detail-grid.component';
import { ComputationStageDetailsComponent } from './report-portal/developer-tools/modals/reports-details/computation-stage-details/computation-stage-details.component';
import { ReportCardComponent } from './report-portal/developer-tools/modals/report-card/report-card.component';
import { ReportsDetailsComponent } from './report-portal/developer-tools/modals/reports-details/reports-details.component';
import { ReportGenerateComponent } from './report-portal/report-generate/report-generate.component';
import { SelectedJobDetailsComponent } from './report-portal/view-all-jobs/selected-job-details/selected-job-details.component';
import { ViewAllJobsComponent } from './report-portal/view-all-jobs/view-all-jobs.component';
import { LayoutSingleCardComponent } from './report-portal/developer-tools/modals/layout-single-card/layout-single-card.component';
import { LayoutEditorHintsComponent } from './report-portal/developer-tools/modals/layout-detail-grid/layout-editor-hints/layout-editor-hints.component';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets', // configure base path for monaco editor default: './assets'
  // defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};

@NgModule({
  declarations: [
    DeveloperToolsComponent,
     ReportPortalComponent,
    // VisibilityComponent,
    DeveloperToolsComponent,
    LandingPageComponent,
    ReportsListComponent,
    ExtractionQueriesListComponent,
    ComputationQueriesListComponent,
    LayoutsListComponent,
    ThemesListComponent,
    ThemeDetailComponent,
    ReportsImportExportWizardComponent,
    ThemeCardComponent,
    CellFormatEditorComponent,
    LayoutCardComponent,
    LayoutDetailComponent,
    ThemeChooserComponent,
    LayoutContextElementCardComponent,
    ExtractionQueryDetailComponent,
    ComputationQueryDetailComponent,
    // EditFormulaComponent,
    ComputationQueryChooserComponent,
    ExtractionQueryChooserComponent,
    ImportExportDetailsComponent,
    LayoutChooserComponent,
    EditFormulaPopupComponent,
    LayoutDetailGridComponent,
    ComputationStageDetailsComponent,
    ReportCardComponent,
    ReportsDetailsComponent,
    ReportGenerateComponent,
    SelectedJobDetailsComponent,
    ViewAllJobsComponent,
    LayoutSingleCardComponent,
    LayoutEditorHintsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    CdkStepperModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
  ]
})
export class ReportsModule { }
