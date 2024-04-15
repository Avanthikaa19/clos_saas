import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { GeneralModule } from "./general/general.module";
import { AdminModule } from "./admin/admin.module";
import { ErrorComponent } from './error/error.component';
import { FlowManagerModule } from "./flow-manager/flow-manager.module";
import { ConfigurationService } from "./services/configuration.service";
import { APP_BASE_HREF, CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AgGridModule } from 'ag-grid-angular';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { NotifierModule } from 'angular-notifier';
import { ReportsModule } from './reports/reports.module';
import 'gridstack/dist/h5/gridstack-dd-native';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { AccessControlData } from './app.access';
import { WebsocketService } from './services/websocket.service';
import { NotificationService } from './services/notification.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgxPaginationModule } from 'ngx-pagination';
 import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoanOriginationModule } from './loan-origination/loan-origination.module';
import { LoanCaseManagerModule } from './loan-case-manager/loan-case-manager.module';
import { DecisionEngineModule } from './decision-engine/decision-engine.module';
import { DupCheckModule } from './duplicate-checking/dup-check.module';
import { LoanApplicationModule } from './loan-application/loan-application.module';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { DuplicateViewComponent } from 'src/app/duplicate-checking/components/duplicate-view/duplicate-view.component';
import { LoanMonitorModule } from './loan-monitor/loan-monitor.module';
import { CLosModule } from './c-los/c-los.module';
import { ClosAdminModule } from './clos-admin/clos-admin.module';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DynamicDashboardModule } from './dynamic-dashboard/dynamic-dashboard/dynamic-dashboard-module';
import { SaasModule } from './saas/saas-module';

export function ConfigLoader(injector: Injector): () => Promise<any> {
  return () => injector.get(ConfigurationService).loadConfigurations();
}

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets', // configure base path for monaco editor default: './assets'
  // defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    DuplicateViewComponent,
  ],
  imports: [
    MatButtonModule,
    MatMenuModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    //Duplicate Checking Module
    DupCheckModule,
    BrowserAnimationsModule,
    //all angular material modules
    MaterialModule,
    //general components
    GeneralModule,
    //Decision-Engine Module
    DecisionEngineModule,
    //Administrator components
    AdminModule,
    //Flow Manager components
    FlowManagerModule,
    //Case Manager components
    //Reports components
    ReportsModule,
    //Loan Orginator Case Manager
    LoanCaseManagerModule,
    // Loan-Origination Module
    LoanOriginationModule,
    //Loan-application Module
    LoanApplicationModule,
    // Loan-Monitor Module
    LoanMonitorModule,
    //C-LOS Module
    CLosModule,
    //CLOS Admin
    ClosAdminModule,
    //Dynamic-Dashboard-Module
    DynamicDashboardModule,
    //SAAS-Module
    SaasModule,
    //External package
    AgGridModule.withComponents([]),
    NgxPaginationModule,
    NgMultiSelectDropDownModule,
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'bottom',
          distance: 12,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 5000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 300,
          easing: 'ease'
        },
        overlap: 150
      }
    }),
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [
    AccessControlData,
    WebsocketService,
    NotificationService,
    BnNgIdleService,
    Location,  { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [
        Injector
      ],
      multi: true
    },
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
