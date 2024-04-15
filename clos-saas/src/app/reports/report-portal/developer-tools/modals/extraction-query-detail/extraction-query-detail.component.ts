import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DiffEditorModel } from 'ngx-monaco-editor';
import { fadeInOut, fadeInOut250 } from 'src/app/app.animations';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { ExtractionQuery } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { ExtractionQuery } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';

@Component({
  selector: 'app-extraction-query-detail',
  templateUrl: './extraction-query-detail.component.html',
  styleUrls: ['./extraction-query-detail.component.scss'],
  animations: [ fadeInOut, fadeInOut250 ]
})
export class ExtractionQueryDetailComponent implements OnInit {
    //monaco editor options
    editorOptions = {
      theme: 'vs', 
      language: 'sql', 
      suggestOnTriggerCharacters: false,
      roundedSelection: true,
      scrollBeyondLastLine: false,
      autoIndent: "full"
    };
    diffOptions = {
      theme: 'vs',
      readOnly: true,
      scrollBeyondLastLine: false
    };
    originalModel: DiffEditorModel = {
      code: '',
      language: 'sql'
    };
    modifiedModel: DiffEditorModel = {
      code: '',
      language: 'sql'
    };
  
    selectedTabIndex: number = 0;
    onTabChanged($event) {
      let clickedIndex = $event.index;
      if(clickedIndex == 1) {
        this.modifiedModel = {
          code: this.unsavedSql,
          language: 'sql'
        };
        console.log('Tab selected: ' + clickedIndex);
      }
    }
    
    extraction: ExtractionQuery;
    unsavedSql: string;
  
    saving: boolean = false;
  
    visibilities: { displayName: string, value: string }[] = [
      { displayName: 'Myself Only', value: 'OWNER_ONLY' },
      { displayName: 'Everyone', value: 'EVERYONE' }
    ];
  
    constructor(
      public dialogRef: MatDialogRef<ExtractionQueryDetailComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ExtractionQueryDetailComponent,
      private reportPortalDataService: ReportPortalDataService,
      private authenticationService: JwtAuthenticationService,
      public dialog: MatDialog,
      private notifierService: NotifierService
    ) {
      this.extraction = data.extraction;
      if (!this.extraction) {
        this.extraction = new ExtractionQuery();
        this.extraction.id = null;
        this.extraction.name = '';
        this.extraction.description = '';
        this.extraction.owner = this.authenticationService.getAuthenticatedUser();
        this.extraction.visibleTo = 'OWNER_ONLY';
        this.extraction.editableBy = 'OWNER_ONLY';
        this.extraction.sql = '';
        this.extraction.fieldCount = 0;
        this.unsavedSql = '';
      } else {
        this.unsavedSql = this.extraction.sql;
        this.originalModel.code = this.extraction.sql;
        this.modifiedModel.code = this.unsavedSql;
      }
    }
  
    ngOnInit(): void {
    }
  
    onClose(): void {
      this.dialogRef.close();
    }
  
    createExtraction() {
      this.extraction.sql = this.unsavedSql;
      this.saving = true;
      this.reportPortalDataService.createExtraction(this.extraction).subscribe(
        res => {
          this.saving = false;
          this.dialogRef.close('Created successfully!');
        },
        err => {
          this.saving = false;
          console.error(err.error);
          this.showNotification('error', err.error);
        }
      );
    }
  
    confirmUpdate() {
      this.selectedTabIndex = 1;
    }
  
    updateExtraction() {
      this.extraction.sql = this.unsavedSql;
      this.saving = true;
      this.reportPortalDataService.updateExtraction(this.extraction).subscribe(
        res => {
          this.saving = false;
          this.dialogRef.close('Updated successfully!');
        },
        err => {
          this.saving = false;
          console.error(err.error);
          this.showNotification('error', err.error);
        }
      );
    }
  
    deleteExtraction() {
      if (confirm('Are you sure you want to delete this extraction query? \nThis process is irreversible!')) {
        this.saving = true;
        this.reportPortalDataService.deleteExtraction(this.extraction.id).subscribe(
          res => {
            this.saving = false;
            this.dialogRef.close('Deleted successfully!');
          },
          err => {
            this.saving = false;
            console.error(err.error);
            this.showNotification('error', err.error);
          }
        );
      }
    }
  
    cannotSaveMessage(): string {
      if(!this.extraction.name.trim()) {
        return 'Name cannot be empty.';
      }
      return null;
    }
  
    showNotification(type: string, message: string) {
      this.notifierService.notify(type, message);
    }
  

}
