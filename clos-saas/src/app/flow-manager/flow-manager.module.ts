import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowManagerRoutingModule } from './flow-manager-routing.module';
import { FlowManagerComponent } from './components/flow-manager/flow-manager.component';
import { FlowManagerDashboardComponent } from './components/flow-manager/flow-manager-dashboard/flow-manager-dashboard.component';
import { WorksheetSelectorComponent } from './components/flow-manager/flow-manager-dashboard/worksheet-selector/worksheet-selector.component';
import { SystemsOverviewDashboardComponent } from './components/flow-manager/flow-manager-dashboard/systems-overview-dashboard/systems-overview-dashboard.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlowManagerMainComponent } from './components/flow-manager/flow-manager-main/flow-manager-main.component';
import { MatMenuWorkflowComponent } from './components/flow-manager/mat-menu-workflow/mat-menu-workflow.component';
import { MatMenuWorksheetComponent } from './components/flow-manager/mat-menu-worksheet/mat-menu-worksheet.component';
import { BucketDetailsModalComponent } from './components/flow-manager/modals/bucket-details-modal/bucket-details-modal.component';
import { BucketStatusModalComponent } from './components/flow-manager/modals/bucket-status-modal/bucket-status-modal.component';
import { EditFormulaComponent } from './components/flow-manager/modals/edit-formula/edit-formula.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { EntryDetailsModalComponent } from './components/flow-manager/modals/entry-details-modal/entry-details-modal.component';
import { ImportExportWizardComponent } from './components/flow-manager/modals/import-export-wizard/import-export-wizard.component';
import { LogViewerComponent } from './components/flow-manager/modals/log-viewer/log-viewer.component';
import { MatchStatusModalComponent } from './components/flow-manager/modals/match-status-modal/match-status-modal.component';
import { OutputEntriesQueueComponent } from './components/flow-manager/modals/queues/output-entries-queue/output-entries-queue.component';
import { SystemsDetailComponent } from './components/flow-manager/modals/systems-detail/systems-detail.component';
import { SystemsListComponent } from './components/flow-manager/modals/systems-list/systems-list.component';
import { AggregatorActionsComponent } from './components/flow-manager/modals/task-actions/aggregator-actions/aggregator-actions.component';
import { FileWatcherActionsComponent } from './components/flow-manager/modals/task-actions/file-watcher-actions/file-watcher-actions.component';
import { FileWriterActionsComponent } from './components/flow-manager/modals/task-actions/file-writer-actions/file-writer-actions.component';
import { TaskConfigurationValidationComponent } from './components/flow-manager/modals/task-configuration-validator/task-configuration-validator.component';
import { TaskDetailsModalComponent } from './components/flow-manager/modals/task-details-modal/task-details-modal.component';
import { TaskTypesModalComponent } from './components/flow-manager/modals/task-types-modal/task-types-modal.component';
import { WorkflowDetailsModalComponent } from './components/flow-manager/modals/workflow-details-modal/workflow-details-modal.component';
import { WorksheetDetailsModalComponent } from './components/flow-manager/modals/worksheet-details-modal/worksheet-details-modal.component';
import { AggregatorConfigurationComponent } from './components/flow-manager/modals/task-configurations/aggregator-configuration/aggregator-configuration.component';
import { CommandExecutorConfigurationComponent } from './components/flow-manager/modals/task-configurations/command-executor-configuration/command-executor-configuration.component';
import { DataFilterConfigurationComponent } from './components/flow-manager/modals/task-configurations/data-filter-configuration/data-filter-configuration.component';
import { DataInjectorTradesConfigurationComponent } from './components/flow-manager/modals/task-configurations/data-injector-trades-configuration/data-injector-trades-configuration.component';
import { DirectoryWatcherConfigurationComponent } from './components/flow-manager/modals/task-configurations/directory-watcher-configuration/directory-watcher-configuration.component';
import { FieldMapperFragmentComponent } from './components/flow-manager/modals/task-configurations/field-mapper-fragment/field-mapper-fragment.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FieldMapperConfigurationComponent } from './components/flow-manager/modals/task-configurations/field-mapper-configuration/field-mapper-configuration.component';
import { FileBatchListenerConfigurationComponent } from './components/flow-manager/modals/task-configurations/file-batch-listener-configuration/file-batch-listener-configuration.component';
import { FileWatcherConfigurationComponent } from './components/flow-manager/modals/task-configurations/file-watcher-configuration/file-watcher-configuration.component';
import { FileWatcherMDConfigurationComponent } from './components/flow-manager/modals/task-configurations/file-watcher-md-configuration/file-watcher-md-configuration.component';
import { FileWatcherSftpConfigurationComponent } from './components/flow-manager/modals/task-configurations/file-watcher-sftp-configuration/file-watcher-sftp-configuration.component';
import { FileWriterConfigurationComponent } from './components/flow-manager/modals/task-configurations/file-writer-configuration/file-writer-configuration.component';
import { FixListenerComponent } from './components/flow-manager/modals/task-configurations/fix-listener/fix-listener.component';
import { FixSenderConfigurationComponent } from './components/flow-manager/modals/task-configurations/fix-sender-configuration/fix-sender-configuration.component';
import { FXDataInjectorConfigurationComponent } from './components/flow-manager/modals/task-configurations/fxdata-injector-configuration/fxdata-injector-configuration.component';
import { FXDealProcessorConfigurationComponent } from './components/flow-manager/modals/task-configurations/fxdeal-processor-configuration/fxdeal-processor-configuration.component';
import { HoldReleaseConfigurationComponent } from './components/flow-manager/modals/task-configurations/hold-release-configuration/hold-release-configuration.component';
import { MailSenderConfigurationComponent } from './components/flow-manager/modals/task-configurations/mail-sender-configuration/mail-sender-configuration.component';
import { MatcherConfigurationComponent } from './components/flow-manager/modals/task-configurations/matcher-configuration/matcher-configuration.component';
import { MQListenerActiveMQConfigurationComponent } from './components/flow-manager/modals/task-configurations/mq-listener-active-mq-configuration/mq-listener-active-mq-configuration.component';
import { MqListnerConfigurationComponent } from './components/flow-manager/modals/task-configurations/mq-listner-configuration/mq-listner-configuration.component';
import { MQSenderActiveMQConfigurationComponent } from './components/flow-manager/modals/task-configurations/mq-sender-active-mq-configuration/mq-sender-active-mq-configuration.component';
import { MqSenderConfigurationComponent } from './components/flow-manager/modals/task-configurations/mq-sender-configuration/mq-sender-configuration.component';
import { PLSDataInjectorConfigurationComponent } from './components/flow-manager/modals/task-configurations/plsdata-injector-configuration/plsdata-injector-configuration.component';
import { PLSDealProcessorConfigurationComponent } from './components/flow-manager/modals/task-configurations/plsdeal-processor-configuration/plsdeal-processor-configuration.component';
import { RestApiHandlerConfigurationComponent } from './components/flow-manager/modals/task-configurations/rest-api-handler-configuration/rest-api-handler-configuration.component';
import { RouterConfigurationComponent } from './components/flow-manager/modals/task-configurations/router-configuration/router-configuration.component';
import { SCFDataInjectorConfigurationComponent } from './components/flow-manager/modals/task-configurations/scfdata-injector-configuration/scfdata-injector-configuration.component';
import { SCFDealProcessorConfigurationComponent } from './components/flow-manager/modals/task-configurations/scfdeal-processor-configuration/scfdeal-processor-configuration.component';
import { SplitterConfigurationComponent } from './components/flow-manager/modals/task-configurations/splitter-configuration/splitter-configuration.component';
import { StaticDataProcessorComponent } from './components/flow-manager/modals/task-configurations/static-data-processor/static-data-processor.component';
import { TableInserterConfigurationComponent } from './components/flow-manager/modals/task-configurations/table-inserter-configuration/table-inserter-configuration.component';
import { TableListnerConfigurationComponent } from './components/flow-manager/modals/task-configurations/table-listner-configuration/table-listner-configuration.component';
import { TradesDealProcessorConfigurationComponent } from './components/flow-manager/modals/task-configurations/trades-deal-processor-configuration/trades-deal-processor-configuration.component';
import { XSLTProcessorConfigurationComponent } from './components/flow-manager/modals/task-configurations/xslt-processor-configuration/xslt-processor-configuration.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RabbitMqListenerConfigurationComponent } from './components/flow-manager/modals/task-configurations/rabbit-mq-listener-configuration/rabbit-mq-listener-configuration.component';
import { RabbitMqSenderConfigurationComponent } from './components/flow-manager/modals/task-configurations/rabbit-mq-sender-configuration/rabbit-mq-sender-configuration.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { DecisionEngineJobConfigurationComponent } from './components/flow-manager/modals/task-configurations/decision-engine-job-configuration/decision-engine-job-configuration.component';
import { AlertAssessmentMapperConfigurationComponent } from './components/flow-manager/modals/task-configurations/alert-assessment-mapper-configuration/alert-assessment-mapper-configuration.component';
import { MultipleDatabaseConfigurationComponent } from './components/flow-manager/modals/task-configurations/multiple-database-configuration/multiple-database-configuration.component';
import { EditEtlFormulaComponent } from './components/flow-manager/modals/edit-etl-formula/edit-etl-formula.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollectorConfigrationComponent } from './components/flow-manager/modals/task-configurations/collector-configration/collector-configration.component';
import { EtlTaskConfigurationComponent } from './components/flow-manager/modals/task-configurations/etl-task-configuration/etl-task-configuration.component';
import { HoldReleaseConfigurationversion2Component } from './components/flow-manager/modals/task-configurations/hold-release-configurationversion2/hold-release-configurationversion2.component';
import { DynamicDataInjectorConfigurationComponent } from './components/flow-manager/modals/task-configurations/dynamic-data-injector-configuration/dynamic-data-injector-configuration.component';
import { GeneralModule } from "../general/general.module";

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: './assets', // configure base path for monaco editor default: './assets'
  // defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};

@NgModule({
    declarations: [
        FlowManagerComponent,
        FlowManagerDashboardComponent,
        WorksheetSelectorComponent,
        SystemsOverviewDashboardComponent,
        FlowManagerMainComponent,
        MatMenuWorkflowComponent,
        MatMenuWorksheetComponent,
        BucketDetailsModalComponent,
        BucketStatusModalComponent,
        EditFormulaComponent,
        EntryDetailsModalComponent,
        ImportExportWizardComponent,
        LogViewerComponent,
        MatchStatusModalComponent,
        OutputEntriesQueueComponent,
        SystemsDetailComponent,
        SystemsListComponent,
        AggregatorActionsComponent,
        FileWatcherActionsComponent,
        FileWriterActionsComponent,
        TaskConfigurationValidationComponent,
        TaskDetailsModalComponent,
        TaskTypesModalComponent,
        WorkflowDetailsModalComponent,
        WorksheetDetailsModalComponent,
        //CONFIGURATIONS
        AggregatorConfigurationComponent,
        CommandExecutorConfigurationComponent,
        DataFilterConfigurationComponent,
        DataInjectorTradesConfigurationComponent,
        DirectoryWatcherConfigurationComponent,
        FieldMapperFragmentComponent,
        FieldMapperConfigurationComponent,
        FileBatchListenerConfigurationComponent,
        FileWatcherConfigurationComponent,
        FileWatcherMDConfigurationComponent,
        FileWatcherSftpConfigurationComponent,
        FileWriterConfigurationComponent,
        FixListenerComponent,
        FixSenderConfigurationComponent,
        FXDataInjectorConfigurationComponent,
        FXDealProcessorConfigurationComponent,
        HoldReleaseConfigurationComponent,
        MailSenderConfigurationComponent,
        MatcherConfigurationComponent,
        MQListenerActiveMQConfigurationComponent,
        MqListnerConfigurationComponent,
        MQSenderActiveMQConfigurationComponent,
        MqSenderConfigurationComponent,
        PLSDataInjectorConfigurationComponent,
        PLSDealProcessorConfigurationComponent,
        RestApiHandlerConfigurationComponent,
        RouterConfigurationComponent,
        SCFDataInjectorConfigurationComponent,
        SCFDealProcessorConfigurationComponent,
        SplitterConfigurationComponent,
        StaticDataProcessorComponent,
        TableInserterConfigurationComponent,
        TableListnerConfigurationComponent,
        TradesDealProcessorConfigurationComponent,
        XSLTProcessorConfigurationComponent,
        RabbitMqListenerConfigurationComponent,
        RabbitMqSenderConfigurationComponent,
        DecisionEngineJobConfigurationComponent,
        AlertAssessmentMapperConfigurationComponent,
        MultipleDatabaseConfigurationComponent,
        EditEtlFormulaComponent,
        CollectorConfigrationComponent,
        EtlTaskConfigurationComponent,
        HoldReleaseConfigurationversion2Component,
        DynamicDataInjectorConfigurationComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        FlexLayoutModule,
        FlowManagerRoutingModule,
        CdkStepperModule,
        DragDropModule,
        MonacoEditorModule.forRoot(),
        NgxGraphModule,
        NgxJsonViewerModule,
        NgJsonEditorModule,
        GeneralModule
    ]
})
export class FlowManagerModule { }
