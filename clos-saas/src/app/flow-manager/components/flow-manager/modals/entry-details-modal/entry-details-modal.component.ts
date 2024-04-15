import { Component, OnInit, Inject, ViewChild, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Entry } from '../../models/models-v2';
import { BucketDetailsModalComponent } from '../bucket-details-modal/bucket-details-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { AccessControlData } from 'src/app/app.access';
// import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
// import { UrlService } from 'src/app/services/http/url.service';

@Component({
  selector: 'app-entry-details-modal',
  templateUrl: './entry-details-modal.component.html',
  styleUrls: ['./entry-details-modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(200, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class EntryDetailsModalComponent implements OnInit {
  mobile: boolean = false;
  objectKeys = Object.keys;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    if(window.innerWidth <= 1400){
      this.mobile = true;
     }else{
      this.mobile = false;
    }
  }
  selectedTabIndex: number = 1;

  loadingEntry: boolean = false;
  trackingEntry: boolean = false;
  resolving: boolean = false;
  filter: boolean = false;

  entryId: number;
  entry: Entry;
  entryTrack: Entry[];
  indarray: number[] = [];
  value: number = 1;
  payload: string;
  trackUIShowData: boolean = false;
  entryTrack2: Entry[];

  public options: JsonEditorOptions;
  public editableBody: any;
  @ViewChild('editor') editor: JsonEditorComponent;

  entryFieldSearch: string = '';
  entryTrackFieldSearch: string = '';

  allFieldKeys: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EntryDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntryDetailsModalComponent,
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public ac: AccessControlData
    // private url: UrlService
  ) {
    this.entryId = data.entryId;
    this.options = new JsonEditorOptions()
    this.options.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.options.mode = 'code'; //set only one mode
    this.options.statusBar = false;
    this.editableBody = null;
    this.updateComponentSize();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // public updateUrl(): Promise<Object> {
  //   return this.url.getUrl().toPromise();
  // }

  async ngOnInit() {
    // let response = await this.updateUrl();
    // UrlService.API_URL = response.toString();
    // if (UrlService.API_URL.trim().length == 0) {
    //   console.warn('FALLING BACK TO ALTERNATE API URL.');
    //   UrlService.API_URL = UrlService.FALLBACK_API_URL;
    // }
    //init component
    this.refreshEntry();
  }

  refreshEntry() {
    this.loadingEntry = true;
    this.flowManagerDataService.getEntryById(this.entryId).subscribe(
      res => {
        this.entry = res;
        console.log('Entries Body',JSON.parse(this.entry.body.payload));
        this.entry.payloadJson = JSON.parse(this.entry.body.payload);
        this.loadingEntry = false;
        this.refreshEntryTrack();
        // if(this.entry.bucketId != null){
        //   this.openBucket(this.entry.bucketId);
        // }
      },
      err => {
        console.error(err.error);
        this.loadingEntry = false;
      }
    );
  }

  refreshEntryTrack() {
    this.trackingEntry = true;
    this.flowManagerDataService.trackEntryById(this.entryId).subscribe(
      res => {
        this.entryTrack = res;
        console.log('Entries Track', this.entryTrack);
        //sort entry track by entry version
        this.entryTrack = this.entryTrack.sort(
          (a, b) => a.version > b.version ? 1 : (a.id < b.id ? -1 : 0)
        );
        for (let i = 0; i < this.entryTrack.length; i++) {
          this.entryTrack[i].payloadJson = JSON.parse(this.entryTrack[i].body.payload);
          //consolidation
          for(let key in this.entryTrack[i].payloadJson.data) {
            if(!this.allFieldKeys.includes(key)) {
              this.allFieldKeys.push(key);
            }
          }
          //respective task details
          this.entryTrack[i].loadingQueueTask = true;
          this.flowManagerDataService.getTaskById(this.entryTrack[i].queueId).subscribe(
            res => {
              this.entryTrack[i].queueTask = res;
              this.entryTrack[i].loadingQueueTask = false;
            },
            err => {
              console.error(err.error);
              this.entryTrack[i].loadingQueueTask = false;
            }
          );
        }
        //sort keys list
        this.allFieldKeys = this.allFieldKeys.sort(
          (a, b) => a > b ? 1 : (a < b ? -1 : 0)
        );
        this.trackingEntry = false;
      },
      err => {
        console.error(err.error);
        this.trackingEntry = false;
      }
    );
  }

  forceResolveError(id: number, reason: string) {
    this.resolving = true;
    this.flowManagerDataService.forceEntryErrorResolved(id, reason).subscribe(
      res => {
        this.entry = res;
        this.resolving = false;
        this.refreshEntry();
      },
      err => {
        this.resolving = false;
      }
    );
  }

  resendEntry(id: number, newEntryBody: string) {
    this.resolving = true;
    this.flowManagerDataService.resendErroredEntry(id, newEntryBody).subscribe(
      res => {
        this.openSnackBar(`Entry resent to queue. New entry ID is ${res.id} and version is ${res.version}.`, null);
        this.closeEditEntryWindow();
        this.resolving = false;
        this.refreshEntry();
      },
      err => {
        this.resolving = false;
        this.closeEditEntryWindow();
        if (err.error.text == undefined) {
          this.openSnackBar('Error occurred,Please try again..', null)
        }
        else
          this.openSnackBar(err.error, null);
      }
    );
  }

  openEditEntryWindow() {
    this.editableBody = JSON.parse(this.entry.body.payload);
  }

  closeEditEntryWindow() {
    this.editableBody = null;
  }

  showJson(d) {
    return JSON.stringify(d, null, 2);
  }
  showData;
  changeLog($event) {
    this.showData = this.editor.get();
  }

  saveAndResend(id: number) {
    let newBodyString: string = JSON.stringify(this.editableBody);
    this.resendEntry(id, newBodyString);
  }

  //BUCKET DETAILS MODAL

  openBucket(bucketIdToOpen: number) {
    const dialogRef = this.dialog.open(BucketDetailsModalComponent, {
      width: '850px',
      data: { bucketId: bucketIdToOpen }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log(result);
      }
    });
  }

  showDoubleClickMessage() {
    this.openSnackBar('Click again (double click) to proceed.', null);
  }

  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  applyFilter(index) {
    this.value = index + 1;
  }

  indexarray(i) {
    this.indarray.push(i);
    console.log("indarray");
  }

  copiedKey: string = '';

  copyValueToClipboard(key, value, event) {
    this.copiedKey = null;
    event.stopPropagation();
    if (value) {
      this.copiedKey = key;
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
      this.openSnackBar('Value copied to clipboard.', '');
      return;
    }
    this.openSnackBar('No value to copy.', '');
  }


}
