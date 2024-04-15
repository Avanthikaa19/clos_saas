import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ServiceService } from '../../service.service';
import { ApplicantDetail, ApplicationObject, CollateralDetail, CompanyDetail, FilterSortApplicationModel, FullDataCapture, InitialDataCapture } from '../loan-processes/model';
import { LoanServiceService } from '../loan-processes/service/loan-service.service';

@Component({
  selector: 'app-main-application-list',
  templateUrl: './main-application-list.component.html',
  styleUrls: ['./main-application-list.component.scss']
})
export class MainApplicationListComponent implements OnInit {

  applicationHeader: string[] = ['Applicant Name', 'Application Id', 'Application Date', 'Initial Data Capture', 'Full Data Capture', 'Documentation', 'Status'];

  applicationArrayList: any[] = [];
  pageNo: number = 0;
  pageSize: number = 20;
  applicationFilterSortList: FilterSortApplicationModel = new FilterSortApplicationModel({
    "applicantName": null,
    "applicationId": null,
    "applicationDate": null,
    "idc": [],
    "fdc": [],
    "doc": [],
    "applicationDateFrom": null,
    "applicationDateTo": null,
    "applicationStage": []
  }, 'desc', 'id');

  applicantName = null;
  applicationId = null;
  applicationDate = null;
  applicationStage: [];
  idc = []; fdc = []; doc = [];
  loadingApplications: boolean = false;
  entryCount: number;

  // Date Filter
  openCustomDate: boolean = false;
  openToggle :boolean = true;
  dateValue: string='All'
  dateFormat: string;
  timer = null;
  startDate = null;
  endDate = null;

  constructor(
    public loanService: ServiceService,
    public notifierService: NotifierService,
    public datepipe: DatePipe,
    public ac: AccessControlData,
    public encryptDecryptService: EncryptDecryptService,
    public dataEntryService: LoanServiceService,
    public dataCaptureService: LoanServiceService,
    public router: Router
  ) {
    this.ac.items = this.encryptDecryptService.getACItemsFromSession()
    this.ac.super = this.encryptDecryptService.getACSuperFromSession();
  }

  ngOnInit(): void {
    this.clearSessionStorageAppID();
    this.getApplicationList();
  }

  /**********************************************
  Initially checks for the last stored Application ID in the session storage,
  If Application ID found, it clear it off from the session storage.
  *********************************************/
  clearSessionStorageAppID() {
    let appID: any = sessionStorage.getItem('CURR_APPLICATION_ID');
    if (appID) {
      sessionStorage.removeItem('CURR_APPLICATION_ID')
    }
  }

  // Resets to default pagination on filtering/sorting
  resetPagination() {
    this.pageNo = 0;
    this.pageSize = 20;
  }

  // Fetches the list of application
  getApplicationList(pageNav?: PageEvent) {
    this.loadingApplications = true;
    if (pageNav) {
      this.pageSize = pageNav.pageSize;
      this.pageNo = pageNav.pageIndex;
    }
    this.dataEntryService.getApplications(this.pageNo + 1, this.pageSize, this.applicationFilterSortList).subscribe(
      res => {
        this.loadingApplications = false;
        this.applicationArrayList = res['data'];
        this.entryCount = res['count'];
      },
      err => {
        this.loadingApplications = false;
        this.notifierService.notify('error', 'Error: Failed to load applications');
      }
    )
  }

  // Filters each application fields and fetches the result
  applyAllFilters() {
    let applicationDateFrom = this.datepipe.transform(this.startDate, 'dd/MM/yyyy 00:00:00');
    let applicationDateTo = this.datepipe.transform(this.endDate, 'dd/MM/yyyy 23:59:59');
    this.applicationFilterSortList.applicationDataFilter = {
      "applicantName": this.applicantName,
      "applicationId": this.applicationId,
      "applicationDate": this.applicationDate,
      "idc": this.idc?.length > 0 ? [this.idc] : [],
      "fdc": this.fdc?.length > 0 ? [this.fdc] : [],
      "doc": this.doc?.length > 0 ? [this.doc] : [],
      "applicationStage": this.applicationStage?.length > 0 ? [this.applicationStage] : [],
      "applicationDateFrom": applicationDateFrom,
      "applicationDateTo": applicationDateTo
    }
    this.resetPagination();
    this.getApplicationList();
  }

  // Clear all the filter/Sort values and resets the result
  clearsAllFilterSort() {
    this.applicantName = null;;
    this.applicationId = null;
    this.applicationDate = null;
    this.applicationStage = null;
    this.idc = []; this.fdc = []; this.doc = [];
    this.applicationFilterSortList = new FilterSortApplicationModel({
      "applicantName": null,
      "applicationId": null,
      "applicationDate": null,
      "idc": [],
      "fdc": [],
      "doc": [],
      "applicationDateFrom": null,
      "applicationDateTo": null,
      "applicationStage": null
    }, 'desc', 'id');
    this.resetPagination();
    this.getApplicationList();
  }

  // Sorts the Application fields by ascending or descending order
  onSortBtnClick(sort: Sort) {
    this.applicationFilterSortList.orderBy = this.renameSortHeaders(sort.active);
    if (sort.direction == 'asc') {
      this.applicationFilterSortList.order = 'desc'
    } else if (sort.direction == 'desc') {
      this.applicationFilterSortList.order = 'desc';
    } else {
      this.applicationFilterSortList.order = 'asc';
    }
    this.getApplicationList();
  }

  // Converts the header as request body requires
  renameSortHeaders(header) {
    switch (header) {
      case 'APPLICANT NAME':
        return 'applicantName';
      case 'APPLICATION ID':
        return 'id';
      case 'APPLICATION DATE':
        return 'createdTime';
      case 'INITIAL DATA CAPTURE':
        return 'idc_status'
      case 'FULL DATA CAPTURE':
        return 'fdc_status';
      case 'DOCUMENTATION':
        return 'doc_status';
      default:
        return 'id';
    }
  }

  addNewApplication() {
    this.loanService.applicationObject = new ApplicationObject(
      new InitialDataCapture(null, null, null, null, null, null, null, null, null, null, null),
      new FullDataCapture(new CompanyDetail(null, null, null, null, null, null, {
        "id": null,
        "unitNo": null,
        "streetAddress": null,
        "city": null,
        "district": null,
        "zipCode": null
      }),
        new ApplicantDetail(null,null, null, null, null,null, null,false, null,false),
        new CollateralDetail([], null, null, null, null, null, {
          "id": null,
          "unitNo": null,
          "streetAddress": null,
          "city": null,
          "district": null,
          "zipCode": null
        })), null);
  }
  /* Fetches the captured data with ID */
  viewExistingApplication(encryptAppID) {
      let decryptAppID = this.encryptDecryptService.decryptData(encryptAppID) //CONVERT ENCRYPTED DATA INTO ORIGIAL DATA USING DECRYPT METHOD
      this.dataCaptureService.getApplicationDataWithId(decryptAppID).subscribe(
        res => {
          this.loanService.applicationObject = res;
          this.router.navigate(['/loan-org/loan/main-app-list/loan-processes/process/1']);
        },
        err => {
          this.notifierService.notify('error', 'Unexpected Error! Failed to fetch the existing data');
        }
      );
  }

  // Stores the existing application Id to the session and gets the existing data
  editApplication(applicationId) {
    this.loanService.applicationObject.initialData.id = applicationId;
    if (applicationId) {
      let encryptAppID = this.encryptDecryptService.encryptData(applicationId) //CONVERT  ORIGIAL DATA INTO ENCRYPTED DATAUSING ENCRYPT METHOD
      sessionStorage.setItem('CURR_APPLICATION_ID', encryptAppID);
      this.viewExistingApplication(encryptAppID)
    }
  }

  // Opens confirmation popup to delete the selected application
  deleteConfirmation(id: number) {
    if (confirm("Are you sure to delete the application ID #" + id)) {
      this.deleteApplication(id);
    }
  }

  // Deletes the application with selected ID
  deleteApplication(appId) {
    this.dataEntryService.deleteApplication(appId).subscribe(
      res => {
        this.notifierService.notify('success', 'Success! The application ID #' + appId + ' has been deleted');
        this.resetPagination();
        this.getApplicationList();
      },
      err => {
        this.notifierService.notify('error', 'Unexpected Error! Failed to delete');
      }
    )

  }

  onKeyup(){
    clearTimeout(this.timer); 
    this.timer = setTimeout(() =>{this.applyAllFilters()}, 100)
  }

  // Filtering Date
  FilterDate(e){
    this.openCustomDate=false;
    this.startDate = new Date();
    this.endDate = new Date();
    switch (e.value){   
      case 'T':
        this.endDate.setDate(this.endDate.getDate());
        break;
    
      case 'YES':
        var startDate = new Date();
        this.startDate.setDate(startDate.getDate() - 1);
        this.endDate.setDate(startDate.getDate() - 1)
        break;

      case '1W':
        this.endDate = new Date();
        var start = this.endDate.getDate() - (this.endDate.getDay());
        this.startDate = new Date(this.startDate.setDate(start));
        break;              

      case '1M':
        var month = this.startDate.getMonth(); 
        var year = this.startDate.getFullYear();
        this.startDate = new Date(year, month, 1);
        this.endDate = new Date();
        break;
  
      case '1Y':
        var year = this.startDate.getFullYear();
        this.startDate = new Date(year, 0, 1);
        this.endDate = new Date();
        break;
                
      case 'All':
        this.startDate = null;
        this.endDate = null;
        break;
      }
      this.onKeyup();
    }

// Clear Date
clearDate(event) {
   event.stopPropagation();
   this.startDate = null;
   this.endDate = null;
   this.onKeyup();
}
}
