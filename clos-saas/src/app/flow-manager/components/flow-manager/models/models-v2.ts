export class Workflow {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public tag: string,
        public worksheets: Worksheet[],
        public created: Date,
        public lastUpdated: Date
    ) { }
}

export class Worksheet {
    refreshing: boolean = false;
    loadingStatus: boolean = false;
    status: QMSStatus = null;

    constructor(
        public id: number,
        public workflowId: number,
        public name: string,
        public description: string,
        public tag: string,
        public tasks: Task[],
        public created: Date,
        public lastUpdated: Date,
        public alertEnabled: boolean,
    ) { }
}

export class Task {

    id: number;
    prevTaskId: number;
    nextTask: Task;
    worksheetId: number;
    name: string;
    type: string;
    layer: string;
    description: string;
    config: any;
    autoStart: string;
    created: Date;
    lastUpdated: Date;
    status: TaskStatusResponse;
    instances: number;
    prevTaskInstance: number;
    systemName: string;

    constructor() {
        this.status = new TaskStatusResponse(this.id, 'LOADING', '');
    }
}

export class TaskStatusResponse {
    constructor(
        public taskId: number,
        public status: string,
        public jobName: string
    ) { }
}

export class Entry {
    queueTask: Task;
    loadingQueueTask: boolean = false;
    payloadJson: any = {};
    selected: boolean = false;

    constructor(
        public id: number,
        public rootEntryId: number,
        public batchId: number,
        public bucketId: number,
        public version: number,
        public dataType: string,
        public sourceId: number,
        public queueId: number,
        public queueInstance: number,
        public searchKey: string,
        public processed: string,
        public body: EntryBody,
        public error: EntryError,
        public created: Date,
        public lastUpdated: Date
    ) { }
}

export class EntryBody {
    constructor(
        public id: number,
        public version: number,
        public dataType: string,
        public payload: string
    ) { }
}

export class EntryError {
    constructor(
        public id: number,
        public version: number,
        public error: string
    ) { }
}

export class Bucket {
    aggregatesJson: any = {};
    rulesJson: any = {};
    releasePayloadJson: any = {};
    id: number;
    groupKey: string;
    releasedEntryId: number;
    released: string;
    releaseReason: string;
    releasedOn: Date;
    rules: string;
    aggregates: string;
    aggregateCount: number;
    contributorKeys: string;
    contributorKeyType: string;
    body: string;
    seconds: number;
    queueId: number;
    queueInstance: number;
    created: Date;
    lastUpdated: Date;

    constructor(
        public id_: number,
        public groupKey_: string,
        public releasedEntryId_: number,
        public released_: string,
        public releaseReason_: string,
        public releasedOn_: Date,
        public rules_: string,
        public aggregates_: string,
        public aggregateCount_: number,
        public contributorKeys_: string,
        public contributorKeyType_: string,
        public body_: string,
        public seconds_: number,
        public queueId_: number,
        public queueInstance_: number,
        public created_: Date,
        public lastUpdated_: Date,
    ) { }
}

export class TaskType {
    type: string;
    layer: string;
    displayName?: string;
    description?: string;
    purpose?: string;
}

export class TaskLog {
    constructor(
        public timestamp: Date,
        public taskId: number,
        public logType: string,
        public source: string,
        public message: string
    ) { }
}

export class WorksheetStatus {
    constructor(
        public totalEntriesProcessed: number,
        public unresolvedErrorEntries: number,
        public tasksCount: number,
        public runningTasksCount: number,
        public taskEntriesStatuses: TaskEntriesStatus[]
    ) { }
}

export class TaskEntriesStatus {
    constructor(
        public taskId: number,
        public unProcessedCount: number,
        public processedCount: number,
        public errorCount: number
    ) { }
}

export class BucketStatus {
    constructor(
        public bucket: Bucket,
        public groupingKey: string,
        public quantityPct: number,
        public quantityLimit: number,
        public quantity: number,
        public timePct: number,
        public timeLimit: number,
        public time: number,
        public closestRule: AggregateRule
    ) { }
}

export class AggregateRule {
    constructor(
        public field: string,
        public fieldValue: string,
        public aggregateOutput: string,
        public bucketLimit: number,
        public timeLimitSec: number,
    ) { }
}

export class Table {
    constructor(
        public type: string,
        public name: string
    ) { }
}

export class TableField {
    constructor(
        public name: string,
        public sqlType: string,
        public decimalDigits: number,
        public dataType: string,
        public isAutoincrement: string,
        public isNullable: string
    ) { }
}


export class Routes {
    constructor(
        public instance: number,
        public name: string,
        public match: string
    ) { }
}

export class EntryFilter {
    constructor(
        public id: number,
        public queueId: number,
        public queueInstance: number,
        public batchId: number,
        public searchKey: string,
        public processed: string,
        public errored: string
    ) { }
}

export class FileBatch {
    constructor(
        public id: number,
        public fileName: string,
        public username: string,
        public tag: string,
        public created: Date,
        public status: FileBatchStatus
    ) { }
}

export class FileBatchStatus {
    constructor(
        public batchId: number,
        public rootEntries: number,
        public entries: number,
        public unprocessedEntries: number,
        public errorEntries: number,
        public openErrorEntries: number
    ) { }
}

export class AssignableClassField {
    constructor(
        public assign: boolean,
        public classField: ClassField,
        public assignValue: string
    ) { }
}

export class ClassField {
    constructor(
        public name: string,
        public columnName: string,
        public dataType: string
    ) { }
}
//Match status
export class MatchStatus {
    constructor(
        public id: number,
        public matchKeyType: string,
        public matchKey: string,
        public matchedEntryId: number,
        public matched: string,
        public rules: string,
        public setSize: number,
        public parentId: number,
        public contributorKeyType: string,
        public contributorKeys: string,
        public contributorEntries: string,
        public body: string,
        public queueId: number,
        public queueInstance: number,
        public created: string,
        public lastUpdated: string
    ) { }
}

export class DFMFieldMapperTesterConfig {
    //output
    formula: string;
    value: string;
    dataType: string;
    length: number;
    //input
    inputs: {name: string, value: string}[];
}

export class QMSStatus {
    enabled: boolean;
    storeName: string;
    storeMode: string;
    queues: {
        name: string,
        task: number,
        instance: number,
        size: number
    }[];
    store: {
        cacheSize: number,
        cacheHits: number,
        cacheHitsMissed: number,
        databaseHits: number,
    };
    //others
    totalHits: number;
    cacheHitRatio: number;
    databaseHitRatio: number;
}

export class DFMSystem {
    id: number;
    systemName: string;
    systemDescription: string;
    systemCategory: string;
    displayName: string;
    displayColor: string;
    critical: boolean;
    alertConfig: TrafficLightAlertConfig;

    //temp vars
    deleting?: boolean;
}

export class TrafficLightAlertConfig {
    id: number;
    configName: string;
    configDescription: string;
    alertMode: string;
    alertTargets: string;
    subjectTemplates: string;
    messageTemplates: string;
}

//dashboard & analytics
export class DFMAnalytics {
    id : number;
    dataDate: Date;
    workflowId: number;
    worksheetId: number;
    entriesCreatedRoot: number;
    entriesCreatedTotal: number;
    entriesCreatedSuccessRoot: number;
    entriesCreatedSuccessTotal: number;
    entriesCreatedErrorRoot: number;
    entriesCreatedErrorTotal: number;
    entriesProcessed: number;
    entriesUnprocessedSuccess: number;
    entriesUnprocessedError: number;
    filesReadCount: number;
    filesWriteCount: number;
    fileBatchesCreatedCount: number;
    messagesReadCount: number;
    messagesSendCount: number;
    databaseInsertCount: number;
    lastUpdated: Date;
}

export class DFMAnalyticsL4Hourly extends DFMAnalytics {
    dataHour: number;
}

export class DFMAnalyticsDataRequest {
    workflowId: number;
    worksheetId: number;
    strDates: string[];
}

export class WorkflowNode {
    id: number;
    name: string;
    description: string;
    worksheets: WorksheetNode[];
    //temp
    someSelected?: boolean;
    selected?: boolean;
}

export class WorksheetNode {
    id: number;
    name: string;
    description: string;
    //temp
    selected?: boolean;
}

export class DFMTLStatus {
    systemStatuses: DFMTLSystemStatus[];
    timestamp: number[]; //time in [0:year ,1:month ,2:day ,3:hour ,4:minutes ,5:seconds ,6:milliseconds ]
}

export class DFMTLSystemStatus {
    systemName: string;
    system: DFMSystem;
    inputTaskStatuses: DFMTLTaskStatus[];
    inputStatus: "NA" | "DOWN" | "PARTIAL_UP" | "UP";
    totalInputTasks: number;
    runningInputTasks: number;
    processingTaskStatuses: DFMTLTaskStatus[];
    processingStatus: "NA" | "DOWN" | "PARTIAL_UP" | "UP";
    totalProcessingTasks: number;
    runningProcessingTasks: number;
    outputTaskStatuses: DFMTLTaskStatus[];
    outputStatus: "NA" | "DOWN" | "PARTIAL_UP" | "UP";
    totalOutputTasks: number;
    runningOutputTasks: number;
}

export class DFMTLTaskStatus {
    taskId: number;
    taskName: string;
    taskLayer: "INPUT" | "PROCESSING" | "OUTPUT";
    task: Task;
    running: boolean;
    stopReason: string;
    stoppedByUser: string;
    stopErrorLog: string;

    //temp
    workflowName?: string;
    worksheetName?: string;
}