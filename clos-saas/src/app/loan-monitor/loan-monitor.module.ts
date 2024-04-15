import { CommonModule } from "@angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GeneralModule } from "../general/general.module";
import { LoanApplicationRoutingModule } from "../loan-application/loan-application-routing.module";
import { MaterialModule } from "../material/material.module";
import { DataMonitoringComponent } from "./components/monitor-menu/data-monitoring/data-monitoring.component";
import { MonitorMenuComponent } from "./components/monitor-menu/monitor-menu.component";
import * as echarts from 'echarts';
import 'echarts/theme/macarons.js';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorLogModalComponent } from './modals/error-log-modal/error-log-modal.component';
import { FileEditorComponent } from './components/file-editor/file-editor.component';
import { HouseKeepingComponent } from './components/house-keeping/house-keeping.component';
import { ApplicationCoreComponent } from './components/application-core/application-core.component';
import { HouseKeepingJobCreateComponent } from './components/house-keeping/components/house-keeping-job-create/house-keeping-job-create.component';
import { HouseKeepingLandingComponent } from './components/house-keeping/components/house-keeping-landing/house-keeping-landing.component';
import { HouseKeepingFilterComponent } from './components/house-keeping/components/house-keeping-filter/house-keeping-filter.component';
import { HouseKeepingExportComponent } from './components/house-keeping/components/house-keeping-export/house-keeping-export.component';

@NgModule({
  declarations: [
    MonitorMenuComponent,
    DataMonitoringComponent,
    ErrorLogModalComponent,
    FileEditorComponent,
    HouseKeepingComponent,
    ApplicationCoreComponent,
    HouseKeepingJobCreateComponent,
    HouseKeepingLandingComponent,
    HouseKeepingFilterComponent,
    HouseKeepingExportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoanApplicationRoutingModule,
    MaterialModule,
    GeneralModule,
    NgxPaginationModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  schemas: [NO_ERRORS_SCHEMA] 
})
export class LoanMonitorModule { }