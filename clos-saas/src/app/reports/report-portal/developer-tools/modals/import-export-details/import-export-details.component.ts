import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fadeInOut } from 'src/app/app.animations';
// import { UrlService } from 'src/app/services/http/url.service';

@Component({
  selector: 'app-import-export-details',
  templateUrl: './import-export-details.component.html',
  styleUrls: ['./import-export-details.component.scss'],
  animations: [fadeInOut]
})
export class ImportExportDetailsComponent implements OnInit {

  
  editingTemplateName: boolean = false;
  editingTemplateDesc:boolean = false;
  selectIcon: boolean[] = [];

  constructor(
    // private url: UrlService,
    public dialogRef: MatDialogRef<ImportExportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImportExportDetailsComponent,
    public dialog: MatDialog,
  ) { }

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

  selected(selectedItem){
    this.selectIcon=[];
    this.selectIcon[selectedItem] = !this.selectIcon[selectedItem];
  }

}
