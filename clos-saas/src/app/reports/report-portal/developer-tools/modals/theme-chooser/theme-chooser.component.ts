import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { Theme } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { Theme } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';

@Component({
  selector: 'app-theme-chooser',
  templateUrl: './theme-chooser.component.html',
  styleUrls: ['./theme-chooser.component.scss'],
  animations: [ fadeInOut ]
})
export class ThemeChooserComponent implements OnInit {

  title: string = '';

  propagate: boolean = false;

  loadingItems: boolean = false;
  themes: Theme[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 1;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  nameSearch: string = '';

  selectedTheme: Theme;

  constructor(
    public dialogRef: MatDialogRef<ThemeChooserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeChooserComponent,
    private reportPortalDataService: ReportPortalDataService,
    private authenticationService: JwtAuthenticationService,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) { 
    this.title = data.title;
    this.propagate = data.propagate;
  }

  ngOnInit(): void {
    this.refreshItems();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSearchClicked() {
    this.currentPage = 1;
    this.refreshItems();
  }

  refreshItems() {
    this.loadingItems = true;
    this.themes = [];
    this.reportPortalDataService.getAllThemesByPageAndName(this.pageSize, this.currentPage-1, this.nameSearch ? this.nameSearch : ' ').subscribe(
      res => {
        this.loadingItems = false;
        this.totalRecords = res.records;
        this.totalPages = res.totalPages;
        this.themes = res.content;

        //compute page vars
        this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
        this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);

        this.showNotification('default', this.themes.length ? 'Loaded ' + this.themes.length + ' themes.' : 'No themes found.');
      },
      err => {
        this.loadingItems = false;
        console.error(err.error);
      }
    );
  }

  prevPage() {
    if(this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.refreshItems();
  }

  nextPage() {
    if(this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.refreshItems();
  }

  onSelect(theme: Theme): void {
    if(this.selectedTheme){
    this.dialogRef.close(
      {
        propagate: this.propagate,
        theme: theme
      }
    );
  }}

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
