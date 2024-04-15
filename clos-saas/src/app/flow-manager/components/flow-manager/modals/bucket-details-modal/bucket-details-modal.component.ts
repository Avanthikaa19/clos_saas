import { Component, OnInit, Inject } from '@angular/core';
import { Bucket, Entry } from '../../models/models-v2';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { EntryDetailsModalComponent } from '../entry-details-modal/entry-details-modal.component';

@Component({
  selector: 'app-bucket-details-modal',
  templateUrl: './bucket-details-modal.component.html',
  styleUrls: ['./bucket-details-modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BucketDetailsModalComponent implements OnInit {

  loadingBucket: boolean = false;
  loadingContributors: boolean = false;

  bucketId: number;
  bucket: Bucket;
  contributors: Entry[];

  constructor(
    public dialogRef: MatDialogRef<BucketDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BucketDetailsModalComponent,
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog
  ) { 
    this.bucketId = data.bucketId;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.refreshBucket();
    this.refreshContributors();
  }

  refreshBucket() {
    this.loadingBucket = true;
    this.flowManagerDataService.getBucketById(this.bucketId).subscribe(
      res => {
        this.bucket = res;
        this.bucket.aggregatesJson = JSON.parse(this.bucket.aggregates);
        this.bucket.rulesJson = JSON.parse(this.bucket.rules);
        this.bucket.releasePayloadJson = JSON.parse(this.bucket.body);
        this.loadingBucket = false;
      },
      err => {
        console.error(err.error);
        this.loadingBucket = false;
        this.onClose();
      }
    );
  }

  refreshContributors() {
    this.loadingContributors = true;
    this.flowManagerDataService.getBucketContributors(this.bucketId).subscribe(
      res => {
        this.contributors = res;
        this.loadingContributors = false;
      },
      err => {
        console.error(err.error);
        this.loadingContributors = false;
      }
    );
  }

  // ENTRY DETAILS MODAL

  openEntry(entryIdToOpen: number) {
    const dialogRef = this.dialog.open(EntryDetailsModalComponent, {
      width: '900px',
      data: {entryId: entryIdToOpen}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log(result);
      }
    });
  }

}
