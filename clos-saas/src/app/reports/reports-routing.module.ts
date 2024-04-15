import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComputationQueriesListComponent } from './report-portal/developer-tools/computation-queries-list/computation-queries-list.component';
import { DeveloperToolsComponent } from './report-portal/developer-tools/developer-tools.component';
import { ExtractionQueriesListComponent } from './report-portal/developer-tools/extraction-queries-list/extraction-queries-list.component';
import { LayoutsListComponent } from './report-portal/developer-tools/layouts-list/layouts-list.component';
import { ReportsImportExportWizardComponent } from './report-portal/developer-tools/reports-import-export-wizard/reports-import-export-wizard.component';
import { ReportsListComponent } from './report-portal/developer-tools/reports-list/reports-list.component';
import { ThemesListComponent } from './report-portal/developer-tools/themes-list/themes-list.component';
import { LandingPageComponent } from './report-portal/landing-page/landing-page.component';
import { ReportGenerateComponent } from './report-portal/report-generate/report-generate.component';
import { ReportPortalComponent } from './report-portal/report-portal/report-portal.component';
import { ViewAllJobsComponent } from './report-portal/view-all-jobs/view-all-jobs.component';

const routes: Routes = [
  // {
  //   path: 'reports_portal', component: ReportPortalComponent, children: [
  //     { path: 'home', component: LandingPageComponent },
  //     { path: 'generate', component: ReportGenerateComponent },
  //     { path: 'view_generated_jobs', component: ViewAllJobsComponent },
  //     {
  //       path: 'developer', component: DeveloperToolsComponent, children: [
  //         { path: 'reports', component: ReportsListComponent },
  //         { path: 'extraction-queries', component: ExtractionQueriesListComponent },
  //         { path: 'computation-queries', component: ComputationQueriesListComponent },
  //         { path: 'layouts', component: LayoutsListComponent },
  //         { path: 'themes', component: ThemesListComponent },
  //         { path: 'package', component: ReportsImportExportWizardComponent },
  //         {
  //           path: '',
  //           redirectTo: 'reports',
  //           pathMatch: 'full'
  //         }
  //       ]
  //     },
  //     {
  //       path: '',
  //       redirectTo: 'home',
  //       pathMatch: 'full'
  //     }
  //   ]
  // },
  { path: 'home', component: LandingPageComponent },
  { path: 'generate', component: ReportGenerateComponent},
  { path: 'view_generated_jobs', component: ViewAllJobsComponent},
  { path: 'developer', component: DeveloperToolsComponent, children: [
    { path: 'reports', component: ReportsListComponent },
    { path: 'extraction-queries', component: ExtractionQueriesListComponent},
    { path: 'computation-queries', component: ComputationQueriesListComponent},
    { path: 'layouts', component: LayoutsListComponent},
    { path: 'themes', component: ThemesListComponent},
    { path: 'package', component: ReportsImportExportWizardComponent},
    {
      path: '',
      redirectTo: 'reports',
      pathMatch: 'full'
    }
  ] },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
