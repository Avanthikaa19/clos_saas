import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { timer, switchMap, catchError, of, filter, Subscription } from 'rxjs';
import { DownloadJob } from 'src/app/admin/components/users/services/download-data.service';
import { displayFields, DuplicateModel } from '../../models/models';
import { DuplicateCheckingService } from '../../services/duplicate-checking.service';
import { DocumentViewComponent } from '../document-view/document-view.component';
import { DuplicateColumnFilterComponent } from '../duplicate-column-filter/duplicate-column-filter.component';
import { DuplicateExportComponent } from '../duplicate-export/duplicate-export.component';
import { DuplicateFilterPopupComponent } from '../duplicate-filter-popup/duplicate-filter-popup.component';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit {
  filteredData: any[] = []; 
  allKeys: any[] = [];
  modifiedKeys: any[]=[];
  searchValue = '';
  headerSearch: { name: string }[] = [];
  duplicateData: any[] = [];
  duplicateCount: number;
  Header: any[] = [];
  keysHeaders: any[] = [];
  HeaderData: any[] = [];
  values: any[] = [];
  valuesData: any[] = [];
  loadingApplications: boolean = false;
  pageNum: number = 1;
  pageSize: number = 10;
  fileContent: any;
  docPreviewWindow: any;
  currentDownloadJob: DownloadJob;
  downloadStatusSubscription: Subscription;
  mergedObj: any[] = [];
  mergedData: any[] = [];
  tableDisplay: boolean = false;
  tablePage: number;
  tablePageSize: number;
  tableColumns;
  duplicateIdentify = ['Y', 'Y', 'N', 'Y', 'N', 'Y', 'Y', 'N', 'Y', 'N']
  displayFields: displayFields = new displayFields(null, null, null, null, null, null, null)

  duplicateModel: DuplicateModel = new DuplicateModel({
    "id": null,
    "ewbUploadDate": null,
    "sourceCode": null,
    "firstName": null,
    "middleName": null,
    "lastName": null

  }, 'asc', 'id', this.pageNum, this.pageSize)



  constructor(
    private duplicateService: DuplicateCheckingService,
    public notifierService: NotifierService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getAllApps();
    this.condition();
  }


  // Fetches the list of application
  idstore;
  getAllApps() {
    this.loadingApplications = true;
    this.duplicateService.getAllApps(this.pageNum, this.pageSize, this.displayFields).subscribe(
      res => {
        this.loadingApplications = false;
        this.duplicateData = res['data'];
        this.duplicateCount = res['count'];
        this.allKeys = [];
        for (let i = 0; i < this.duplicateData.length; i++) {
          // Get the keys for the current object
           const keys = Object.keys(this.duplicateData[i]);
            this.modifiedKeys = keys.map(key => key.replace(/([a-z])([A-Z])/g, '$1 $2'));
          // Loop through each key and add it to the allKeys array if it's not already there
          for (let j = 0; j < keys.length; j++) {
            
            if (!this.allKeys.includes(keys[j])) {
              this.allKeys.push(keys[j]);
            }
          }

          this.conditions();
        }
        this.notifierService.notify('success', 'Fields Loaded Successfully');
      },
      err => {
        this.loadingApplications = false;
        this.notifierService.notify('error', 'Error: Failed to load applications');
      }
    )
  }

  // binary
  conditions() {
    for (let i = 0; i < this.duplicateData.length; i++) {

      if (this.duplicateData[i]['sex'] == '0') {
        this.duplicateData[i].sex = 'Male';
      }
      else if (this.duplicateData[i]['sex'] == '1') {
        this.duplicateData[i].sex = 'Female';
      }

      if (this.duplicateData[i]['maritalStatus'] == '0') {
        this.duplicateData[i].maritalStatus = 'Single';
      }
      else if (this.duplicateData[i]['maritalStatus'] == '1') {
        this.duplicateData[i].maritalStatus = 'Married';
      }
      else if (this.duplicateData[i]['maritalStatus'] == '2') {
        this.duplicateData[i].maritalStatus = 'Divorced';
      }
      else if (this.duplicateData[i]['maritalStatus'] == '3') {
        this.duplicateData[i].maritalStatus = 'Widow';
      }

      if (this.duplicateData[i]['qualification'] == '0') {
        this.duplicateData[i].qualification = 'High School';
      }
      else if (this.duplicateData[i]['qualification'] == '1') {
        this.duplicateData[i].qualification = 'College';
      }
      else if (this.duplicateData[i]['qualification'] == '2') {
        this.duplicateData[i].qualification = 'Some College';
      }
      else if (this.duplicateData[i]['qualification'] == '3') {
        this.duplicateData[i].qualification = 'Post Graduate';
      }
      else if(this.duplicateData[i]['qualification'] == '4'){
        this.duplicateData[i].qualification = 'Others';
      }
      else if(this.duplicateData[i]['qualification'] == '5'){
        this.duplicateData[i].qualification = 'Others';
      }
    }
  }

  // Condition Values
  condition() {
    for (let i = 0; i < this.duplicateData.length; i++) {
      // Assign value for sex
      if (this.duplicateData[i].sex == '0') {
        this.duplicateData[i].sex = 'Male';

      } else {
        this.duplicateData[i].sex = 'Female';
      }
      // Assign value for marital status
      if (this.mergedData[i].maritalStatus == '0') {
        this.mergedData[i].maritalStatus = 'Single';
      } else if (this.mergedData[i].maritalStatus == '1') {
        this.mergedData[i].maritalStatus = 'Married';
      } else if (this.mergedData[i].maritalStatus == '2') {
        this.mergedData[i].maritalStatus = 'Divorced';
      } else {
        this.mergedData[i].maritalStatus = 'Widow';
      }
      // Assign value for educational
      if (this.mergedData[i].educational == '0') {
        this.mergedData[i].educational = 'High School';
      } else if (this.mergedData[i].educational == '1') {
        this.mergedData[i].educational = 'College';
      } else if (this.mergedData[i].educational == '2') {
        this.mergedData[i].educational = 'Some College';
      } else if (this.mergedData[i].educational == '3') {
        this.mergedData[i].educational = 'Post Graduate';
      } else {
        this.mergedData[i].educational = 'Others';
      }
      // Assign value for Years of Stay
      let arr = Array.from(String(this.mergedData[i].yearsOfStay), Number)
      this.mergedData[i].yearsOfStay = arr[0] + '' + arr[1] + ' ' + 'Years' + ' ' + ' ' + arr[2] + '' + arr[3] + ' ' + 'Months';
      // Assign Value for Birth Date
      let birth = Array.from(String(this.mergedData[i].birthDate), Number)
      this.mergedData[i].birthDate = birth[4] + '' + birth[5] + '/' + birth[6] + '' + birth[7] + '/' + birth[0] + '' + birth[1] + '' + birth[2] + '' + birth[3];
      // Assigning Ewb Upload Date
      let date = Array.from(String(this.mergedData[i].ewbUploadDate), Number)
      this.mergedData[i].ewbUploadDate = date[4] + '' + date[5] + '/' + date[6] + '' + date[7] + '/' + date[0] + '' + date[1] + '' + date[2] + '' + date[3];
      // Mapping Values
      // this.getDatas(this.mergedData[i]);
      console.log(this.mergedData[i])
    }

  }


  // Pagination
  getPagination(event) {
    this.mergedData = [];
    this.values = [];
    this.duplicateModel.page = event.pageIndex + 1;
    this.duplicateModel.pageSize = event.pageSize;
    this.getAllApps();
  }

  // Pagination for Multiple Fields
  getPagination2(event) {
    this.tablePage = event.pageIndex + 1;
    this.tablePageSize = event.pageSize;
    this.displayItems();
  }

  // Preview Document
  previewDocs(event) {
    const doc = event.find(event => event.documentId);
    this.duplicateService.previewDocs(doc.documentId, event[0]).subscribe(
      res => {
        this.fileContent = new Blob([res], {
          type: 'application/pdf'
        });
        this.docPreviewWindow = URL.createObjectURL(this.fileContent);
        window.open(this.docPreviewWindow, '_blank', "height=600,width=1000");
      },
      err => {
        this.notifierService.notify('error', 'Whoops! something went wrong.');
      }
    )
  }

  // allField Dialog
  openAllFieldDialog() {
    const dialogRef = this.dialog.open(DuplicateFilterPopupComponent, {
      width: '700px', height: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      let headers: any[] = Object.values(result.result[0]);
      this.HeaderData = [];
      this.HeaderData.push({ name: 'ID' });
      headers.forEach(head => {
        let headerData = { name: head.replace(/([A-Z])/g, ' $1').trim() }
     
        this.HeaderData.push(headerData);
        console.log(this.HeaderData)
      })
      this.add(this.HeaderData, result.result[1][0])
      this.tablePage = result.result[1][2];
      this.tablePageSize = result.result[1][1];
      this.tableDisplay = true;
      this.tableColumns = headers;
      this.notifierService.notify('success', 'Fields Loaded Successfully');
    });

  }

  add(head, data) {
    this.HeaderData = head;
    this.valuesData = data;
  }


  // Filter Dialog
  openFilterDialog() {
    const dialogRef = this.dialog.open(DuplicateColumnFilterComponent, {
      width: '700px', height: '600px'    });
  }

  // View Details
  viewDetails(fsId) {
    let viewUrl = 'duplicate-checking/duplicate-checking/view-details';
    this.router.navigate([viewUrl], { queryParams: { fsId: fsId } })
  }

  // Display Items
  displayItems() {
    this.duplicateService.displayFields({
      "choosenColumns": this.tableColumns,
      "order": 'asc',
      "orderBy": 'id',
      "page": this.tablePage,
      "pageSize": this.tablePageSize
    }).subscribe(
      res => {
        this.valuesData = res['data'];
      }, err => {
        this.notifierService.notify('error', 'Whoops! something went wrong.');
      }
    )
  }

  // Export Dialog
  openExportDialog() {
    const dialogRef = this.dialog.open(DuplicateExportComponent, {
      width: '700px', height: '600px'
    });
  }


  // duplicate preview
  duplicatePreview(applicationid) {
    let viewUrl = 'duplicate-checking/duplicate-checking/duplicate';
    this.router.navigate([viewUrl], { queryParams: { id: applicationid } })
  }


   //  filter main input

  // filterData() {
  //   const userInput = this.searchValue.toLowerCase();
  
  //   if (userInput === '') {
  //     this.allKeys = Object.keys(this.duplicateData[0]);
  //     this.filteredData = this.duplicateData;
  //   } else {
  //     this.allKeys = Object.keys(this.duplicateData[0]).filter(header => header.toLowerCase().includes(userInput));
  //       this.filteredData = this.duplicateData.filter(row => {
  //       return Object.values(row).some(value => {
  //         return typeof value === 'string' && value.toLowerCase().includes(userInput);
  //       });
  //     });
  //   }
  // }
  
  filterData() {
    const userInput = this.searchValue.toLowerCase();
  
    if (userInput === '') {
      this.allKeys = Object.keys(this.duplicateData[0]);
      this.filteredData = this.duplicateData;
    } else {
      this.allKeys = Object.keys(this.duplicateData[0]).filter(header => header.toLowerCase().includes(userInput));
      this.filteredData = this.duplicateData.filter(row => {
        const filteredRow = {};
        Object.entries(row).forEach(([key, value]) => {
          if (this.allKeys.includes(key) && typeof value === 'string' && value.toLowerCase().includes(userInput)) {
            filteredRow[key] = value;
          }
        });
        return Object.keys(filteredRow).length > 0 ? filteredRow : null;
      });
    }
  }
  
  
  // clear filter
  clearSearchFilter() {
    this.searchValue = '';
    this.filterData();
  }

  // Document Details
  getDocumentDetails(id){
    const dialogRef = this.dialog.open(DocumentViewComponent, {
      width: '700px', height: '420px',data : id
    });
  }
}
