import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { CellFormat } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { CellFormat } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';

@Component({
  selector: 'app-cell-format-editor',
  templateUrl: './cell-format-editor.component.html',
  styleUrls: ['./cell-format-editor.component.scss']
})
export class CellFormatEditorComponent implements OnInit {

  cellData: string;
  cellFormat: CellFormat;

  defaultBorderColor: string = '#F5F5F5';

  fontFamilyNames: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<CellFormatEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CellFormatEditorComponent,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    private reportDataService: ReportPortalDataService
  ) {
    this.cellData = data.cellData;
    this.cellFormat = data.cellFormat;
    if(!this.cellFormat) {
      this.notifierService.notify('error', 'No cell format data to work with.');
      this.onClose();
    }
  }

  ngOnInit(): void {
    this.refreshFontFamilyNames();
  }

  refreshFontFamilyNames() {
    this.reportDataService.getFontFamilyNames().subscribe(
      res => {
        this.fontFamilyNames = res;
        this.notifierService.notify('default', 'Loaded ' + res.length + ' font names.');
      },
      err => {
        this.notifierService.notify('error', err.error);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onApply() {
    this.cellFormat.borders.top.thickness = this.fixBorderWidths(this.cellFormat.borders.top.thickness);
    this.cellFormat.borders.bottom.thickness = this.fixBorderWidths(this.cellFormat.borders.bottom.thickness);
    this.cellFormat.borders.left.thickness = this.fixBorderWidths(this.cellFormat.borders.left.thickness);
    this.cellFormat.borders.right.thickness = this.fixBorderWidths(this.cellFormat.borders.right.thickness);
    this.dialogRef.close(this.cellFormat);
  }

  //fixes the border thicknesses to max value of 3 and min value of 0
  //assuming the values 0 for NONE, 1 for THIN, 2 for MEDIUM, 3 for THICK
  fixBorderWidths(input: number): number {
    if(input < 0) {
      return 0;
    }
    if(input > 3) {
      return 3;
    }
    return input;
  }

}
