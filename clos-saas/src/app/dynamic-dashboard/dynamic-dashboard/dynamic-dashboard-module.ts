import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DynamicDashboardRoutingModule } from './dynamic-dashboard-routing';
import { CustomMappingComponent } from './custom-mapping/custom-mapping.component';
import { CustomComponent } from './custom/custom.component';
import { NewLayoutComponent } from './custom/new-layout/new-layout.component';
import { DynamicDashboardComponent } from './dynamic-dashboard.component';
import { DynamicLandingPageComponent } from './dynamic-landing-page/dynamic-landing-page.component';
import { WidgetsSettingsComponent } from './widgets/widgets-settings/widgets-settings.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { TemplateWidgetsComponent } from './custom-mapping/template-widgets/template-widgets.component';
import { QueryBuliderComponent } from './widgets/query-bulider/query-bulider.component';
import { TableQueryFilterComponent } from './widgets/table-query-filter/table-query-filter.component';
import { WidgetsScreenComponent } from './widgets/widgets-screen/widgets-screen.component';
import { TemplateMappingComponent } from './custom-mapping/template-mapping/template-mapping.component';
import { BodyColorPickerComponent } from './dynamic-landing-page/body-color-picker/body-color-picker.component';
import { ColorPickerDialogComponent } from './dynamic-landing-page/color-picker-dialog/color-picker-dialog.component';
import { FontDialogComponent } from './dynamic-landing-page/font-dialog/font-dialog.component';
import { TextEditorDialogComponent } from './dynamic-landing-page/text-editor-dialog/text-editor-dialog.component';
import { ExistingWidgetComponent } from './widgets/existing-widget/existing-widget.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SearchFilterPipe } from '../search-filter-pipe';
import { NewSearchFilterPipe } from '../new-filter';
import { SnackbarComponent } from '../snackbar';
import { NgxEchartsModule } from 'ngx-echarts';
import { MaterialModule } from 'src/app/material/material.module';
import { DashboardMappingComponent } from './dashboard-mapping/dashboard-mapping.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { QueryDetailComponent } from './query-detail/query-detail.component';
const monacoConfig: NgxMonacoEditorConfig = {
    baseUrl: './assets', // configure base path for monaco editor default: './assets'
    // defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
    onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
  };
@NgModule({
    declarations:[
       CustomMappingComponent,
       CustomComponent,
       NewLayoutComponent,
       DynamicDashboardComponent,
       DynamicLandingPageComponent,
       WidgetsSettingsComponent,
       WidgetsComponent,
       TemplateWidgetsComponent,
       QueryBuliderComponent,
       TableQueryFilterComponent,
       WidgetsScreenComponent,
       TemplateMappingComponent,
       BodyColorPickerComponent,
       ColorPickerDialogComponent,
       FontDialogComponent,
       TextEditorDialogComponent,
       ExistingWidgetComponent,
       SearchFilterPipe,NewSearchFilterPipe,
       SnackbarComponent,DashboardMappingComponent,QueryDetailComponent,
    ],
    exports:[],
    imports:[MatIconModule,FormsModule,ReactiveFormsModule,MatDividerModule,MatSidenavModule,MatCardModule,MatTooltipModule,MatDialogModule,CommonModule,MatMenuModule,DynamicDashboardRoutingModule,
    MatPaginatorModule,MaterialModule,NgxPaginationModule,
    MonacoEditorModule.forRoot(),
    NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
      }),
],
    providers:[DatePipe,{provide:MatDialogRef,useValue:{}},{provide:MAT_DIALOG_DATA,useValue:[]}],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class DynamicDashboardModule{ }