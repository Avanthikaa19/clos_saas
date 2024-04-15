import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
import { Entry, EntryFilter } from '../../../models/models-v2';
import { MatDialog } from '@angular/material/dialog';
import { EntryDetailsModalComponent } from '../../entry-details-modal/entry-details-modal.component';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
import { AccessControlData } from 'src/app/app.access';

@Component({
  selector: 'app-output-entries-queue',
  templateUrl: './output-entries-queue.component.html',
  styleUrls: ['./output-entries-queue.component.scss'],
  animations: [ fadeInOut ]
})
export class OutputEntriesQueueComponent implements OnInit {

  taskIdValue: number;
  queueInstanceValue: number;
  processedValue: string;
  erroredValue: string;

  @Input()
  get taskId() {
    return this.taskIdValue;
  }
  set taskId(val) {
    this.taskIdValue = val;
  }
  @Input()
  get queueInstance() {
    return this.queueInstanceValue;
  }
  set queueInstance(val) {
    this.queueInstanceValue = val;
  }
  @Input()
  get processed() {
    return this.processedValue;
  }
  set processed(val) {
    this.processedValue = val;
  }
  @Input()
  get errored() {
    return this.erroredValue;
  }
  set errored(val) {
    this.erroredValue = val;
  }

  @Output() trackEntry: EventEmitter<number> = new EventEmitter();

  //page controls
  currentPage: number = 1;
  pageSize: number = 50;
  totalSize: number = 0;
  totalPages: number = 1;

  //loading flags
  loadingEntries: boolean = false;
  reprocessing: boolean = false;

  //data
  entries: Entry[] = [];
  fields: string[] = ['id', 'created', 'processed', 'sourceId', 'version', 'queueInstance', 'batchId', 'searchKey'];

  //filter controls
  searchKeyMode: string = 'SEARCH_KEY';
  includeSearchKey: boolean = false;
  includeBatchId: boolean = false;
  filter: EntryFilter = new EntryFilter(null, null, null, null, null, 'N', '');

  //sort controls
  sortBy: string = 'id';
  sortOrder: string = 'desc';

  selectedIds: number[] = [];
  dialogarr: any[] = [];

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    public ac: AccessControlData
  ) { }

  ngOnInit(): void {
    this.filter.queueId = this.taskId;
    this.filter.queueInstance = this.queueInstance;
    this.filter.processed = this.processed;
    this.filter.errored = this.errored;
    this.refreshEntries();
  }

  ngOnDestroy() {
    this.closeAllOpenTabs();
  }
  closeAllOpenTabs() {
    for(let i=0;i<this.dialogarr.length;i++) {
      this.dialogarr[i].close();
    }
  }

  trackedEntryId: number;

  refreshEntries() {
    this.loadingEntries = true;
    //transform filter to backend standards
    let fetchFilter: EntryFilter = new EntryFilter(
      null,
      this.filter.queueId, 
      this.filter.queueInstance, 
      this.includeBatchId ? this.filter.batchId : null,
      this.includeSearchKey ? this.filter.searchKey : null,
      this.filter.processed == '' ? null : this.filter.processed, 
      this.filter.errored == '' ? null : this.filter.errored
    );
    //get data
    this.flowManagerDataService.getEntriesByFilter(this.currentPage-1, this.pageSize, fetchFilter, this.sortBy, this.sortOrder).subscribe(
      res => {
        this.totalSize = res.records;
        this.totalPages = res.pages;
        this.entries = res.data;
        for(let entry of this.entries) {
          entry.selected = false;
        }
        this.loadingEntries = false;
      },
      err => {
        this.loadingEntries = false;
        console.error(err.error);
      }
    );
  }

  toggleSelection(entry: Entry) {
    entry.selected = !entry.selected;
    this.selectedIds = [];
    for(let entr of this.entries) {
      if(entr.selected) {
        this.selectedIds.push(entr.id);
      }
    }
  }

  toggleAllSelection() {
    if(this.selectedIds.length === this.entries.length) {
      this.selectedIds = [];
      for(let entr of this.entries) {
        entr.selected = false;
      }
    } else {
      this.selectedIds = [];
      for(let entr of this.entries) {
        entr.selected = true;
        this.selectedIds.push(entr.id);
      }
    }
  }

  reprocessEntries() {
    if(this.selectedIds.length == 0) {
      return;
    }
    if(confirm('Are you sure you want to resend ' + this.selectedIds.length + ' entries? \nThis process is irreversible!')) {
      this.reprocessing = true;
      this.flowManagerDataService.reprocessEntries(this.selectedIds, 100, true).subscribe(
        res => {
          this.reprocessing = false;
          this.refreshEntries();
          this.showNotification('success', res.message);
        },
        err => {
          this.reprocessing = false;
          console.error(err);
          this.showNotification('error', 'Failed to reprocess. Use web console or the server logs for more details.');
        }
      );
    }
  }

  getFieldLabels(fieldName: string) {
    switch(fieldName) {
      case 'created': return 'Created';
      case 'processed': return 'Processed';
      case 'sourceId': return 'Source ID';
      case 'id': return 'ID';
      case 'version': return 'Version';
      case 'queueInstance': return 'Inst. No.';
      case 'dataType': return 'Data Type';
      case 'batchId': return 'Batch ID';
      case 'searchKey': return 'Search Key';
      case 'bucketId': return 'Bucket ID';
      default: return fieldName;
    }
  }

  //ENTRY DETAILS MODAL
  openEntry(entryIdToOpen: number, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(EntryDetailsModalComponent, {
      width: '1200px',
      hasBackdrop: false,
      // panelClass: 'no-pad-dialog',
      data: {entryId: entryIdToOpen}
    });
    this.dialogarr.push(dialogRef);
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log(result);
      }
    });
  }

  copyValueToClipboard(value, event) {
    event.stopPropagation();
    if(value){
      //create temporary element
      var copyElement = document.createElement("textarea");
      copyElement.style.position = 'fixed';
      copyElement.style.opacity = '0';
      //set the string
      copyElement.textContent = value;
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(copyElement);
      //select it
      copyElement.select();
      //execute copy command
      document.execCommand('copy');
      //remove temporary element
      body.removeChild(copyElement);
      this.showNotification('info', 'Value copied to clipboard.');
      return;
    }
    this.showNotification('warning', 'No value to copy.');
  }

  requestForTrack(entryId: number, event) {
    this.trackedEntryId = entryId;
    event.stopPropagation();
    this.trackEntry.emit(entryId);
  }

  requestForUntrack(){
    this.trackedEntryId=0;
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
