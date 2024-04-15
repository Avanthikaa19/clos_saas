import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DiffEditorModel } from 'ngx-monaco-editor';
import { fadeInOut } from 'src/app/app.animations';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { ComputationQuery } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { ComputationQuery } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';

@Component({
  selector: 'app-computation-query-detail',
  templateUrl: './computation-query-detail.component.html',
  styleUrls: ['../extraction-query-detail/extraction-query-detail.component.scss', './computation-query-detail.component.scss'],
  animations: [ fadeInOut ]
})
export class ComputationQueryDetailComponent implements OnInit {

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
  
  computationQuery: ComputationQuery;
  unsavedSql: string;

  saving: boolean = false;

  visibilities: { displayName: string, value: string }[] = [
    { displayName: 'Myself Only', value: 'OWNER_ONLY' },
    { displayName: 'Everyone', value: 'EVERYONE' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ComputationQueryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComputationQueryDetailComponent,
    private reportPortalDataService: ReportPortalDataService,
    private authenticationService: JwtAuthenticationService,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) {
    this.computationQuery = data.computationQuery;
    if (!this.computationQuery) {
      this.computationQuery = new ComputationQuery();
      this.computationQuery.id = null;
      this.computationQuery.name = '';
      this.computationQuery.description = '';
      // this.computationQuery.owner = this.authenticationService.userProfile.user.username;
      this.computationQuery.visibleTo = 'OWNER_ONLY';
      this.computationQuery.editableBy = 'OWNER_ONLY';
      this.computationQuery.sql = '';
      this.computationQuery.required = 'Y';
      this.unsavedSql = '';
    } else {
      this.unsavedSql = this.computationQuery.sql;
      this.originalModel.code = this.computationQuery.sql;
      this.modifiedModel.code = this.unsavedSql;
    }
  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  createComputationQuery() {
    this.computationQuery.sql = this.unsavedSql;
    this.saving = true;
    this.reportPortalDataService.createComputation(this.computationQuery).subscribe(
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

  updateComputationQuery() {
    this.computationQuery.sql = this.unsavedSql;
    this.saving = true;
    this.reportPortalDataService.updateComputation(this.computationQuery).subscribe(
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

  deleteComputationQuery() {
    if (confirm('Are you sure you want to delete this computation query? \nThis process is irreversible!')) {
      this.saving = true;
      this.reportPortalDataService.deleteComputation(this.computationQuery.id).subscribe(
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
    if(!this.computationQuery.name.trim()) {
      return 'Name cannot be empty.';
    }
    return null;
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
