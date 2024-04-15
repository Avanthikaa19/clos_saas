import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fadeInOut } from 'src/app/app.animations';
import { ComputationQuery, ComputationStage } from 'src/app/reports/report-portal/models/Models';
import { ReportPortalDataService } from 'src/app/reports/report-portal/services/report-portal-data.service';
// import { ComputationQuery, ComputationStage } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { UrlService } from 'src/app/services/http/url.service';
import { ComputationQueryChooserComponent } from '../../computation-query-chooser/computation-query-chooser.component';

@Component({
  selector: 'app-computation-stage-details',
  templateUrl: './computation-stage-details.component.html',
  styleUrls: ['./computation-stage-details.component.scss', '../../theme-detail/theme-detail.component.scss', '../../extraction-query-chooser/extraction-query-chooser.component.scss'],
  animations: [fadeInOut]
})
export class ComputationStageDetailsComponent implements OnInit {

  stage: ComputationStage;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 1;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  nameSearch: string = '';

  computations: ComputationQuery[] = [];
  
  constructor(
    // private url: UrlService,
    public dialogRef: MatDialogRef<ComputationStageDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComputationStageDetailsComponent,
    private reportPortalDataService: ReportPortalDataService,
    public dialog: MatDialog,
  ) { 
    this.stage = data.stage;
    if(!this.stage.computationQueries){
      this.stage.computationQueries = [];
    }
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
  }


  onClose(): void {
    this.dialogRef.close();
  }

  onSelect(stage : ComputationStage): void {
    if(stage.computationQueries?.length> 0){
    this.dialogRef.close(stage);
  }}


  openComputationQueryChooser(event) {
    if(event) {
      event.stopPropagation();
    }
    const dialogRef = this.dialog.open(ComputationQueryChooserComponent, {
      width: '1300px',
      height: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log(result);
        this.stage.computationQueries.push(result.query);
      }
    });
  }

  removeComputationQuery(){
    this.stage.computationQueries.pop();
  }

}
