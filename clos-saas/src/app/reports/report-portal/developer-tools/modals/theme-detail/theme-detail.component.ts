import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { CellFormat, Theme, ThemeSpec } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { CellFormat, Theme, ThemeSpec } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';
import { CellFormatEditorComponent } from '../cell-format-editor/cell-format-editor.component';

@Component({
  selector: 'app-theme-detail',
  templateUrl: './theme-detail.component.html',
  styleUrls: ['./theme-detail.component.scss']
})
export class ThemeDetailComponent implements OnInit {

  theme: Theme;
  message :string;

  public static defaultBorderColor: string = '#DCDCDC';

  saving: boolean = false;

  visibilities: { displayName: string, value: string }[] = [
    { displayName: 'Myself Only', value: 'OWNER_ONLY' },
    { displayName: 'Everyone', value: 'EVERYONE' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ThemeDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeDetailComponent,
    private reportPortalDataService: ReportPortalDataService,
    private authenticationService: JwtAuthenticationService,
    public dialog: MatDialog
  ) {
    this.theme = data.theme;
    if (!this.theme) {
      this.theme = new Theme();
      this.theme.name = '';
      this.theme.description = '';
      this.theme.id = null;
      // this.theme.owner = this.authenticationService.userProfile.user.username;
      this.theme.visibleTo = 'OWNER_ONLY';
      this.theme.editableBy = 'OWNER_ONLY';
      this.theme.specification = new ThemeSpec();
      this.theme.specification.titleCell = ThemeDetailComponent.getDefaultCellFormat();
      this.theme.specification.titleCell.fontStyle = 'BOLD_ITALIC';
      this.theme.specification.subTitleCell = ThemeDetailComponent.getDefaultCellFormat();
      this.theme.specification.subTitleCell.fontColor = '#696969';
      this.theme.specification.subTitleCell.fontStyle = 'ITALIC';
      this.theme.specification.headerCell = ThemeDetailComponent.getDefaultCellFormat();
      this.theme.specification.fieldHeaderCell = ThemeDetailComponent.getDefaultCellFormat();
      this.theme.specification.fieldHeaderCell.fontColor = '#4169E1';
      this.theme.specification.fieldHeaderCell.fontStyle = 'BOLD';
      this.theme.specification.fieldDataCell = ThemeDetailComponent.getDefaultCellFormat();
      this.theme.specification.footerCell = ThemeDetailComponent.getDefaultCellFormat();
    }
  }

  ngOnInit(): void {
    // TESTING
    // this.openCellToEdit(this.theme.specification.titleCell, 'Report Title');
  }

  onClose(): void {
    this.dialogRef.close();
  }

  createTheme() {
    if(!this.disable()){
    this.saving = true;
    this.reportPortalDataService.createTheme(this.theme).subscribe(
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

  updateTheme() {
    if(!this.saving){
    this.saving = true;
    this.reportPortalDataService.updateTheme(this.theme).subscribe(
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

  deleteTheme() {
    if (confirm('Are you sure you want to delete this theme? \nThis process is irreversible!')) {
      this.saving = true;
      this.reportPortalDataService.deleteTheme(this.theme.id).subscribe(
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
  }

  openCellToEdit(cell: CellFormat, title?: string) {
    const dialogRef = this.dialog.open(CellFormatEditorComponent, {
      width: '700px',
      data: { cellData: title ? title : 'Cell Content', cellFormat: JSON.parse(JSON.stringify(cell)) }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        switch(title) {
          case 'Report Title': {
            this.theme.specification.titleCell = result;
            break;
          }
          case 'Report Title 2': {
            this.theme.specification.subTitleCell = result;
            break;
          }
          case 'Header Item': {
            this.theme.specification.headerCell = result;
            break;
          }
          case 'Field Header': {
            this.theme.specification.fieldHeaderCell = result;
            break;
          }
          case 'Field Data': {
            this.theme.specification.fieldDataCell = result;
            break;
          }
          case 'Footer Item': {
            this.theme.specification.footerCell = result;
            break;
          }
        }
      }
    });
  }

  public static getDefaultCellFormat(): CellFormat {
    return {
      textAlign: 'CENTER',
      font: 'Calibri',
      fontStyle: 'NORMAL',
      fontSize: 14,
      fontColor: '#000000',
      backgroundColor: '#FFFFFF',
      left: 0,
      borders: {
        top: {
          thickness: 1,
          color: ThemeDetailComponent.defaultBorderColor
        },
        bottom: {
          thickness: 1,
          color: ThemeDetailComponent.defaultBorderColor
        },
        left: {
          thickness: 1,
          color: ThemeDetailComponent.defaultBorderColor
        },
        right: {
          thickness: 1,
          color: ThemeDetailComponent.defaultBorderColor
        }
      }
    };
  }

 disable(){
    if((this.theme.name.length == 0 || this.theme.description.length == 0 )){
        return true;
    }
    else{
      return false;
    }
 }
}
