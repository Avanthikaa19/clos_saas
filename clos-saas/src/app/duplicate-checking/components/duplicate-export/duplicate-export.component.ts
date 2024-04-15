import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { DownloadJob } from 'src/app/admin/components/users/services/download-data.service';
import { displayFields } from '../../models/models';
import { DuplicateCheckingService } from '../../services/duplicate-checking.service';

@Component({
  selector: 'app-duplicate-export',
  templateUrl: './duplicate-export.component.html',
  styleUrls: ['./duplicate-export.component.scss']
})
export class DuplicateExportComponent implements OnInit {
  allKeys: any[] = [];
  duplicateData: any[] = [];
  duplicateCount: number;
  loadingApplications: boolean = false;
  filterValue: string;
  pageNum: number = 1;
  pageSize: number = 10;
  columns = [];
  selectAll:boolean = false;
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;

  displayFields:displayFields = new displayFields(null,null,null,null,null,null,null)  

  constructor(public dialogRef: MatDialogRef<DuplicateExportComponent>,
    public notifierService: NotifierService,
    private duplicateService: DuplicateCheckingService,
    public datepipe: DatePipe,
    ) { }

  ngOnInit(): void {
    this.getAllApps();
  }


  getAllApps(){
    this.loadingApplications = true;
    this.duplicateService.getAllApps(this.pageNum,this.pageSize,this.displayFields).subscribe(
      res => {
        this.loadingApplications = false;
        this.duplicateData = res['data'];
        this.duplicateCount = res['count'];
        // Array merge and pushing into new array
        this.allKeys = [];
  
        // Loop through each object in the duplicateData array
        for (let i = 0; i < this.duplicateData.length; i++) {
          // Get the keys for the current object
          const keys = Object.keys(this.duplicateData[i]);
          // Loop through each key and add it to the allKeys array if it's not already there
          for (let j = 0; j < keys.length; j++) {
            if (!this.allKeys.includes(keys[j])) {
              this.allKeys.push(keys[j]);
            }
          }
        }
       },
      err => {
        this.loadingApplications = false;
        this.notifierService.notify('error', 'Error: Failed to load applications');
      }
    )
  }
  
  
  // Add or Remove Fields
  // fields(field,event){
  //   if(event.checked == true){
  //     this.columns.push(field.replace(/\s/g, ""));
  //   }else{
  //     this.columns.splice(this.columns.indexOf(field.replace(/\s/g, "")), 1)
  //   }
  // }
  selectAllFields: any = {};
  selectAllChanged() {
    for (let key of this.allKeys) {
      this.selectAllFields[key] = this.selectAll;
      console.log(this.selectAllFields[key])

    }
  }
  
  // check fields
  fieldArray:any[] =[];
  fields(field, event) {
      this.selectAllFields[field] = event.checked;
      console.log(this.selectAllFields[field])
      this.selectAll = Object.values(this.selectAllFields).every((value) => value);
      console.log('selectAllFields:', this.selectAllFields);

      this.fieldArray = Object.keys(this.selectAllFields);

  }

displayarray;
  // Export
  exportAllApps(format: string) {
    this.selectAllFields = this.displayFields;
    let tempArray = [];
    for(let i=0;i<this.fieldArray.length;i++){
      tempArray.push({
        fieldName: this.fieldArray[i],
        subFieldName:null,
        displayName:this.fieldArray[i].toUpperCase(),
        lockColumn: false,
        sortAsc: null,
        sortOrder: 0,
        searchText: null})
    }
    this.displayarray = tempArray;
    this.duplicateService.postExportFields(format,this.pageNum,this.displayarray).subscribe(
      (res) => {
        console.log(res)

        this.currentDownloadJob = res;
        if (this.downloadStatusSubscription) {
          this.downloadStatusSubscription.unsubscribe();
        }
        // let downloadIntervalSeconds: number = 1
        this.downloadStatusSubscription = timer(0, 2000)
          .pipe(
            switchMap(() => {
              return this.duplicateService.getJob(res.id)
                .pipe(catchError(err => {
                  // Handle errors
                  console.error(err);
                  return of(undefined);
                }));
            }),
            filter(data => data !== undefined)
          )
          .subscribe(data => {
            console.log('Updating download status.');
            this.currentDownloadJob = data;
            if (data.isReady) {
              this.downloadStatusSubscription.unsubscribe();
              this.currentDownloadJob = null;
              //Download file API
              this.duplicateService.getFilebyJob(res.id).subscribe(
                (response: any) => {
                  this.downloadFile(response, format);
                  this.notifierService.notify('success', 'Your download should start soon.');
                },
                err => {
                  this.notifierService.notify('error', 'Failed to download file. Refer console for more details.');
                  console.error(err);
                }
              )
            }
          });
      },
      (err) => {
        console.log(err);
        this.notifierService.notify('error', 'Failed to download file. Refer console for more details.','notification');
      }
    )
  }

  downloadFile(res, format: string) {
    let data = [res];
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyyMMdd hhmmss');
    if (format == 'xlsx') {
      var blob = new Blob(data, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else if (format == 'csv') {
      var blob = new Blob([res], { type: 'text/csv' });
    } else if (format == 'xls') {
      var blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    } else if (format == 'pdf') {
      var blob = new Blob([res], { type: 'application/pdf' });
    } else {
      var blob = new Blob(data, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = `Credit card Applications _${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

  // filter export input
  filterItems() {
    const userInput = this.filterValue.toLowerCase();

    if (userInput === '') {
      this.allKeys = Object.keys(this.duplicateData[0]);
    } else {
      // Filter the headers based on the user's input
      this.allKeys = Object.keys(this.duplicateData[0]).filter(header => header.toLowerCase().includes(userInput));
    }
  }
}

export interface DisplayFields {
  fieldName: [];
  subFieldName: string;
  displayName: string;
  lockColumn: boolean;
  sortAsc: boolean;
  sortOrder: number;
  searchText: any[];
}
