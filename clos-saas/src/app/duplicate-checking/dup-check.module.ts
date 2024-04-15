import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { NgJsonEditorModule } from "ang-jsoneditor";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { FlowManagerRoutingModule } from "../flow-manager/flow-manager-routing.module";
import { MaterialModule } from "../material/material.module";
import { MainComponent } from './components/main/main.component';
import { AppsComponent } from './components/apps/apps.component';
import { ConfigurationsComponent } from './components/configurations/configurations.component';
import { DatabaseConnectionComponent } from './components/configurations/database-connection/database-connection.component';
import { DuplicateFilterPopupComponent } from './components/duplicate-filter-popup/duplicate-filter-popup.component';
import {  ReactiveFormsModule } from '@angular/forms';
// import { DuplicateViewComponent } from './components/duplicate-view/duplicate-view.component';
import { DuplicateColumnFilterComponent } from './components/duplicate-column-filter/duplicate-column-filter.component';
import { ViewDetailsComponent } from './components/view-details/view-details.component';
import { DuplicateExportComponent } from './components/duplicate-export/duplicate-export.component';
import { DocumentViewComponent } from './components/document-view/document-view.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";



@NgModule({
    declarations: [    
    MainComponent, AppsComponent, ConfigurationsComponent, DatabaseConnectionComponent, DuplicateFilterPopupComponent, DuplicateColumnFilterComponent, ViewDetailsComponent, DuplicateExportComponent, DocumentViewComponent
  ],
    imports: [
        CommonModule,
        MaterialModule,
        HttpClientModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        FlowManagerRoutingModule,
        CdkStepperModule,
        DragDropModule,
        MonacoEditorModule.forRoot(),
        NgxGraphModule,
        NgxJsonViewerModule,
        NgJsonEditorModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    providers: [],
})

export class DupCheckModule { }