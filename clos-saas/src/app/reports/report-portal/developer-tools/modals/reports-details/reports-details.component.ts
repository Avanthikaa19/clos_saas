import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ComputationStage, Report, Sheet } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';
import { fadeInOut } from 'src/app/app.animations';
// import { UrlService } from 'src/app/services/http/url.service';
import { LayoutChooserComponent } from '../layout-chooser/layout-chooser.component';
import { ComputationStageDetailsComponent } from './computation-stage-details/computation-stage-details.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ComputationStage, Parameter, Report, ReportParamSpec, Sheet } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
@Component({
  selector: 'app-reports-details',
  templateUrl: './reports-details.component.html',
  styleUrls: ['./reports-details.component.scss'],
  animations: [fadeInOut]
})
export class ReportsDetailsComponent implements OnInit {

  selectedMainTabIndex: number = 0;
  selectedSheetsTabIndex: number = 0;

  report: Report;
  saving: boolean = false;
  customFormat: boolean = false;
  editingSheetName: boolean[] = [false];
  loadingItems: boolean = false;
  deleteStageId: number[] = [];
  addCount: number = 1;
  paraDetails: any[] = [];
  Ftype: any;
  count: any;
  parameter: Parameter[] = [];
  paramArray: any;

  showSupportedFormatsPopup: boolean = false;
  spCSV: boolean = true;
  spXLS: boolean = true;
  spXLSX: boolean = true;
  spPDF: boolean = true;
  spTXT: boolean = true;

  visibilities: { displayName: string, value: string }[] = [
    { displayName: 'Myself Only', value: 'OWNER_ONLY' },
    { displayName: 'Everyone', value: 'EVERYONE' }
  ];


  constructor(
    // private url: UrlService,
    public dialogRef: MatDialogRef<ReportsDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportsDetailsComponent,
    private reportPortalDataService: ReportPortalDataService,
    private authenticationService: JwtAuthenticationService,
    public dialog: MatDialog
  ) {
    this.report = data.report;
    console.log('On Load', this.report);
    if (!this.report) {
      this.report = new Report();
      this.report.name = '';
      this.report.nickname = '';
      this.report.description = '';
      this.report.outputFileName = '',
        this.report.outputFolder = '',
        this.report.outputFormat = 'xlsx',
        this.report.supportedFormats = ['csv', 'xls', 'xlsx', 'pdf'];
      // this.report.owner = this.authenticationService.userProfile.user.username;
      this.report.visibleTo = 'OWNER_ONLY';
      this.report.editableBy = 'OWNER_ONLY';
      this.report.sheets = [];
      this.report.sheets[0] = new Sheet();
      this.report.sheets[0].name = 'Sheet 1';
      this.report.sheets[0].sheetOrder = 1;
      this.report.computationStages = [];
    } else {
      this.report.computationStages = [];
      this.getLayout();
      this.getComputationStages();
    }
    if (this.report.supportedFormats) {
      this.spCSV = this.report.supportedFormats.includes('csv');
      this.spXLS = this.report.supportedFormats.includes('xls');
      this.spXLSX = this.report.supportedFormats.includes('xlsx');
      this.spPDF = this.report.supportedFormats.includes('pdf');
      this.spTXT = this.report.supportedFormats.includes('txt');
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
    //TESTING
    // this.
  }

  onClose(): void {
    this.dialogRef.close();
  }

  createReport() {
    if(!(this.saving || !this.report.name || !this.report.outputFolder || !this.report.outputFileName)){
    this.saving = true;
    console.log(this.report);
    this.report.supportedFormats = [];
    if (this.spCSV) {
      this.report.supportedFormats.push('csv');
    }
    if (this.spXLS) {
      this.report.supportedFormats.push('xls');
    }
    if (this.spXLSX) {
      this.report.supportedFormats.push('xlsx');
    }
    if (this.spPDF) {
      this.report.supportedFormats.push('pdf');
    }
    if (this.spTXT) {
      this.report.supportedFormats.push('txt');
    }
    console.log('Report Creation', this.report);
    this.reportPortalDataService.createReport(this.report).subscribe(
      res => {
        this.saving = false;
        this.dialogRef.close('Created successfully!');
      },
      err => {
        this.saving = false;
        console.error(err.error);
      }
    );
  }}

  updateReport() {
    if(!(this.saving || !this.report.name || !this.report.outputFolder || !this.report.outputFileName)){
    this.saving = true;
    console.log(this.report);
    this.deleteStageId?.forEach(element => {
      if (element)
        this.deleteStage(element)
    });
    this.report.supportedFormats = [];
    if (this.spCSV) {
      this.report.supportedFormats.push('csv');
    }
    if (this.spXLS) {
      this.report.supportedFormats.push('xls');
    }
    if (this.spXLSX) {
      this.report.supportedFormats.push('xlsx');
    }
    if (this.spPDF) {
      this.report.supportedFormats.push('pdf');
    }
    if (this.spTXT) {
      this.report.supportedFormats.push('txt');
    }
    this.reportPortalDataService.updateReport(this.report).subscribe(
      res => {
        this.saving = false;
        this.dialogRef.close('Updated successfully!');
      },
      err => {
        this.saving = false;
        console.error(err.error);
      }
    );
  }}

  deleteReport() {
    if(!this.saving){
    if (confirm('Are you sure you want to delete this Report? \nThis process is irreversible!')) {
      this.saving = true;
      this.reportPortalDataService.deleteReport(this.report).subscribe(
        res => {
          this.saving = false;
          this.dialogRef.close('Deleted successfully!');
        },
        err => {
          this.saving = false;
          console.error(err.error);
        }
      );
    }
  }}

  getLayout() {
    this.loadingItems = true;
    this.report.sheets?.forEach(element => {
      element.selectedLayout = null;
      this.reportPortalDataService.getLayout(element.layout).subscribe(
        res => {
          element.selectedLayout = res;
          this.getParamFields(this.report);
          this.loadingItems = false;
        }, err => {
          console.log(err.error);
          this.loadingItems = false;
        }
      )
    });
  }

  openLayoutChooserComponent(item: number) {
    // let selectedLayout = this.report.sheets[item].selectedLayout;
    // this.report.sheets[item].selectedLayout = null;
    const dialogRef = this.dialog.open(LayoutChooserComponent, {
      panelClass: 'no-pad-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.report.sheets[item].layout = result.layout.id;
        console.log('Selected Layout', result.layout);
        this.report.sheets[item].selectedLayout = result.layout;
        // this.paraDetails = result.layout.specification.extractionBands[0].parameters;
        this.getParamFields(this.report);
      }
      // else {
      //   this.report.sheets[item].selectedLayout = selectedLayout;
      // }
    })
  }

  getParamField() {
    if (this.paraDetails.length != 0) {
      for (this.count = 0; this.count < this.paraDetails.length; this.count++) {
        if (this.paraDetails[this.count].includes(':s')) {
          this.Ftype = 'STATIC_TEXT'
        } else if (this.paraDetails[this.count].includes(':d')) {
          this.Ftype = 'DATE_SHIFT'
        } else if (this.paraDetails[this.count].includes(':n')) {
          this.Ftype = 'STATIC_TEXT'
        } else {
          this.Ftype = ''
        }
        this.parameter.push({
          name: '',
          formulaName: this.paraDetails[this.count],
          formulaType: this.Ftype,
          formulaValue: '',
          mandatory: false,
          userEditable: false,
          // sheetNumber: this.sheetCount
        })

      }
      this.paramArray = this.parameter;
      console.log('Param Array', this.paramArray);
      // return this.parameter
    }

  }

  getParamFields(reports: Report) {
    console.log('Reports', reports);
    let parameter: ReportParamSpec[] = [];
    let Fname: string = '';
    if (reports.sheets) {
      for (let sheet of reports.sheets) {
        if (sheet.selectedLayout) {
          if (sheet.selectedLayout.specification) {
            for (let extractionBand of sheet.selectedLayout.specification.extractionBands) {
              if (extractionBand.parameters) {
                for (let param of extractionBand.parameters) {
                  if (param.includes(':s')) {
                    this.Ftype = 'STATIC_TEXT';
                    Fname = 'TEXT';
                  } else if (param.includes(':d')) {
                    this.Ftype = 'DATE_SHIFT';
                    Fname = 'DATE'
                  } else if (param.includes(':n')) {
                    this.Ftype = 'STATIC_TEXT';
                    Fname = 'TEXT'
                  } else {
                    this.Ftype = '';
                    Fname = '';
                  }
                  parameter.push(
                    {
                      name: Fname,
                      formulaName: param,
                      formulaType: this.Ftype,
                      formulaValue: '',
                      mandatory: false,
                      userEditable: false,
                    }
                  )
                }
              }
            }
          }
        }
      }
    }
    console.log('Params', parameter);
    reports.parameters = parameter;
  }

  OpenComputationStageDetail(stage: ComputationStage, Index: number) {
    if (stage == null) {
      stage = new ComputationStage();
      stage.parallelize = false;
    }
    const dialogRef = this.dialog.open(ComputationStageDetailsComponent, {
      width: '1050px',
      data: { stage: stage }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log(result);
        this.report.computationStages[Index] = result;
      }
    });
  }


  addSheet(Index: number) {
    this.report.sheets[Index + 1] = new Sheet();
    this.report.sheets[Index + 1].name = 'Sheet ' + ++this.addCount;
    this.report.sheets[Index + 1].sheetOrder = Index + 2;
    this.selectedSheetsTabIndex = this.report.sheets.length - 1;
  }

  removeSheet(Index: number) {
    if(this.report.sheets?.length > 1){
    this.report.sheets.splice(Index, 1);
    this.selectedSheetsTabIndex = 0;
  }}

  spliceStages(stage: ComputationStage) {
    if(this.saving){
    if (confirm('Are you sure you want to delete this Stage? \nThis process is irreversible!')) {
      this.deleteStageId.push(stage.id);
      console.log('delete stage id', this.deleteStageId);
      this.report.computationStages.splice(this.report.computationStages.findIndex(element => element.id == stage.id), 1);
    }
  }}

  deleteStage(id) {
    this.reportPortalDataService.deleteComputationStage(id).subscribe(
      (res) => {
        console.log(res);
      }
    );
  }

  getComputationStages() {
    this.reportPortalDataService.getAllComputationStagesByReportId(this.report.id).subscribe(
      res => {
        this.report.computationStages = res.content;
      }
    )
  }

  drop(event: CdkDragDrop<string[]>, element) {
    var previousIndex = parseInt(event.previousContainer.id.replace("list-", ""));
    var currentIndex = parseInt(event.container.id.replace("list-", ""));
    if (previousIndex != NaN && currentIndex != NaN && previousIndex != undefined && currentIndex != undefined && previousIndex != currentIndex) {
      moveItemInArray(element, previousIndex, currentIndex);
      element.forEach((element, index) => {
        element.sheetOrder = index + 1;
      });
    }
  }

  getAllListConnections(index) {
    var connections = []
    for (var i = 0; i < this.report.sheets.length; i++) {
      if (i != index) {
        connections.push("list-" + i);
      }
    }
    return connections;
  }

}
