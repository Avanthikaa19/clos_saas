import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { AccessService } from '../../access-templates/services/access.service';
import { AuditTrailDetail } from '../../audit-trail/models/AuditTrail';
import { DownloadJob } from '../../users/services/download-data.service';
import { UsersService } from '../../users/services/users.service';

@Component({
  selector: 'app-audit-trail-listing',
  templateUrl: './audit-trail-listing.component.html',
  styleUrls: ['./audit-trail-listing.component.scss']
})
export class AuditTrailListingComponent implements OnInit {
  auditLogData: AuditTrailDetail[] = []
  pageData: PageData;
  activeStepIndex: number;
  activeSubStepIndex: number;
  activeTabName: string;
  activeSubTabName: string;
  auditcolumns: ColumnDefinition[];
  auditcolumnsData: [];
  loadingItems: boolean = false;
  selectedTabName: string;
  selectedTabModule:string;
  currentUser:any='';
  matTabHeader: MatTabHeaders[] = [
    { name: 'Application Data Entry', icon: 'assignment' },
    // { name: 'Decision Engine', icon: 'directions_alt' },
    { name: 'Case Manager', icon: 'cases' },
    { name: 'Configuration Manager', icon: 'join_inner' },
    // { name: 'Generate Reports', icon: 'assignment' },
    // { name: 'Dashboard', icon: 'dashboard_customize' },
    // { name: 'Administrator', icon: 'admin_panel_settings' },
  ];
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;

  constructor(private accessDetailDataService: AccessService,
    public datepipe: DatePipe,private userDataService: UsersService,
    public encryptDecryptService:EncryptDecryptService,

    ) { 
    this.auditcolumns = []
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.auditcolumns = [
          {
            fieldName: "created",
            displayName: "Date",
            lockColumn: true,
            sortAsc: null,
            searchText: null,
            isExport: true,
            filterDisable:true,
            dateFormat: "dd MMM yyyy",
            searchItem:[]
          },
          {
            fieldName: "createdTime",
            displayName: "Time",
            lockColumn: true,
            sortAsc: null,
            searchText: null,
            isExport: true,
            filterDisable:true,
            searchItem:[]
          },
          {
            fieldName: "user",
            displayName: "User",
            lockColumn: true,
            sortAsc: null,
            searchText: null,
            isExport: true,
            searchItem:[]
          },
          {
            fieldName: "module",
            displayName: "Module",
            lockColumn: true,
            sortAsc: null,
            searchText: null,
            isExport: true,
            searchItem:[]
          },
          {
            fieldName: "object",
            displayName: "Screen",
            lockColumn: true,
            sortAsc: null,
            searchText: null,
            isExport: true,
            searchItem:[]
          },
          {
            fieldName: "action",
            displayName: "Activity",
            lockColumn: true,
            sortAsc: null,
            searchText: null,
            isExport: true,
            searchItem:[]
          },
          {
            fieldName: "info1",
            displayName: "Description",
            lockColumn: true,
            sortAsc: null,
            searchText: null,
            isExport: true,
            searchItem:[]
          },
          {
            fieldName: "auditBodies",
            displayName: "Parameters",
            lockColumn: true,
            sortAsc: null,
            searchText: null,
            isExport: true,
            searchItem:[]
          },
        ]
      }

      ngOnInit() {
        this.activeStepIndex = 0;
        this.selectedTabModule = 'DATA_ENTRY'
        this.getAuditColumnsData(this.pageData);
      }
    
    // on tab selection
    onStepSelectionChange(event: any) {
      const selectedTabIndex = event.index;
      this.selectedTabName = this.matTabHeader[selectedTabIndex].name;
      if(this.selectedTabName == 'Application Data Entry'){
        this.selectedTabModule = 'DATA_ENTRY'
        this.getAuditColumnsData(this.pageData);
       }
       else if(this.selectedTabName == 'Case Manager'){
        this.selectedTabModule = 'CASE_MANAGER'
        this.getAuditColumnsData(this.pageData);
       }
       else if(this.selectedTabName === 'Configuration Manager'){
        this.selectedTabModule = 'CONFIGURATION_MANAGER'
        this.getAuditColumnsData(this.pageData);
       }
    }
    getCurrentUser():string{
      if(sessionStorage.getItem(AUTHENTICATED_USER)){
      let user=sessionStorage.getItem(AUTHENTICATED_USER)
      this.currentUser=this.encryptDecryptService.decryptData(user)}
      return this.currentUser
     }
   

      //LISTING FUNCTION
      getAuditColumnsData(pageData: PageData) {
        this.loadingItems = true;
        this.accessDetailDataService.auditColumnList(this.auditcolumns,this.pageData.currentPage, this.pageData.pageSize,this.selectedTabModule,false).subscribe(res => {
          this.auditcolumnsData = res['data'];
          this.auditLogData = res['data'];
          this.auditLogData = this.formatActivityLogData()
          this.loadingItems=false;
          this.pageData.count = res['count']
          this.pageData.totalPages = res['count']
        })
      }
    
    //  FILTER DROP DOWN FUNCTION 
    onApplyFilter(columnDetail: any) {
      this.accessDetailDataService.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
        columnDetail.column.dropDownList = res;
      })
      this.changeColumnData(columnDetail.column)
    }
    
    // FILTER  FUNCTIONS
    changeColumnData(columnDefinition) {
      this.auditcolumns.forEach(column => {
        if (column.fieldName == columnDefinition.fieldName) {
          column = columnDefinition
        }
      })
    }

    columnChange(event: ColumnDefinition[]) {
      this.auditcolumns = event;
      this.getAuditColumnsData(this.pageData);
    }
    formatActivityLogData() {
      this.auditLogData.forEach(audit => {
        audit.beforeValueList = [];
        audit.afterValueList = [];
        audit.filterValueList = [];
    
        if (audit.auditBodies && audit.auditBodies.length > 0) {
          audit.auditBodies.forEach(auditBody => {
            if (audit.action != 'Filter') {
              if (auditBody.afterValue) {
                this.processAuditValue(auditBody.afterValue, audit.afterValueList);
              }
              if (auditBody.beforeValue) {
                this.processAuditValue(auditBody.beforeValue, audit.beforeValueList);
              }
            } else if (audit.action === 'Filter' && auditBody.afterValue) {
              audit.filterValueList = this.createFormatAudit(auditBody.afterValue);
            }
          });
        }
      });
    
      return this.auditLogData;
    }
    processAuditValue(jsonValue: string, valueList: any[]) {
      try {
        let formatValue = JSON.parse(jsonValue);
    
        for (let key in formatValue) {
          if (
            !key.toString().endsWith('NullCheck') &&
            formatValue[key] !== '' &&
            formatValue[key] !== [] &&
            formatValue[key] !== null &&
            key !== 'accessibleItems' &&
            key !== 'countries'
          ) {
            let formatKey = this.formatStringSpacing(key);
            let formattedValue = this.capitalizeStringFormat(formatValue[key]);
    
            let createObj = { keyValue: formatKey, value: formattedValue };
            valueList.push(createObj);
          }
        }
      } catch (error: any) {
        valueList.push({ error: 'Error parsing JSON', originalValue: jsonValue });
      }
    }
      
    formatStringSpacing(stringData: string): string {
      if (stringData.toUpperCase().endsWith('ID') ||stringData.toUpperCase().endsWith('IQ')  ) {
        let sliceData=stringData.slice(0,stringData.length-2).replace(/([A-Z])/g, ' $1').trim()
        stringData = sliceData+" "+stringData.slice(stringData.length-2 ).toUpperCase()
      }
      else if(stringData.toLowerCase().startsWith('iq') || stringData.toLowerCase().startsWith('id')){
        let sliceData=stringData.slice(2).replace(/([A-Z])/g, ' $1').trim()
        stringData = stringData.slice(0, 2).toUpperCase()+" "+sliceData
        console.log(sliceData)
      }
      else{
        stringData=stringData.replace(/([A-Z])/g, ' $1').trim()
      }
    return stringData
  }

  createFormatAudit(formatJsonData: any) {
    let finalFormatList: any[] = []
    let formatAfter = JSON.parse(formatJsonData)
    for (let key in formatAfter) {
      if (!key.toString().endsWith("NullCheck") && formatAfter[key] != '' && formatAfter[key] != [] && formatAfter[key] != null && key != 'accessibleItems' && key != 'countries') {
        let createObj = { keyValue: key, value: formatAfter[key] }
        finalFormatList.push(createObj)
      }
    }
    return finalFormatList
  }

  capitalizeStringFormat(formatKeyValue: any) {
    let splitStringArr: string[] = [];
    if (formatKeyValue) {
      if (typeof formatKeyValue == 'string') {
        splitStringArr = formatKeyValue.toLowerCase().split(' ')
        for (let i = 0; i < splitStringArr.length; i++) {
          if (splitStringArr[i].startsWith('iq') || splitStringArr[i] == 'ID') {
            splitStringArr[i] = splitStringArr[i].toUpperCase()
          }
          else {
            splitStringArr[i] = splitStringArr[i].charAt(0).toUpperCase() + splitStringArr[i].slice(1)
          }
        }
        formatKeyValue = splitStringArr.join(' ')
      }
      else if (Array.isArray(formatKeyValue)) {
        let formatArray: any[] = []
        formatKeyValue.forEach(formatValue => {
          if (typeof formatValue == 'string') {
            let splitStringArr1 = formatValue.toLowerCase().split(' ');
            for (let i = 0; i < splitStringArr1.length; i++) {
              if (splitStringArr1[i].startsWith('iq') || splitStringArr1[i] == 'id') {
                splitStringArr1[i] = splitStringArr1[i].toUpperCase()
              }
              else {
                splitStringArr1[i] = splitStringArr1[i].charAt(0).toUpperCase() + splitStringArr1[i].slice(1)
              }
            }
            formatValue = splitStringArr1.join(' ')
            formatArray.push(formatValue)
          }
        })
        formatKeyValue = formatArray
      }
      else if (typeof formatKeyValue == 'boolean' || typeof formatKeyValue == 'number') {
        formatKeyValue = formatKeyValue
      }
      else {
        formatKeyValue = '[Object Object]'
      }
    }
    return formatKeyValue
  }

   // EXPORT FUNCTION 
 accessTemplateListExport(event: any) {
  this.accessDetailDataService.auditTrailListExport(event.columns, event.format,this.selectedTabModule).subscribe(res => {
    this.currentDownloadJob = res;
    if (this.downloadStatusSubscription) {
      this.downloadStatusSubscription.unsubscribe();
    }
    this.downloadStatusSubscription = timer(0, 2000)
      .pipe(
        switchMap(() => {
          return this.accessDetailDataService.getJob(res.id)
            .pipe(catchError(err => {
              return of(undefined);
            }));
        }),
        filter(data => data !== undefined)
      )
      .subscribe(data => {
        this.currentDownloadJob = data;
        if (data.isReady) {
          this.downloadStatusSubscription.unsubscribe();
          this.currentDownloadJob = null;
          //Download file API
          this.accessDetailDataService.getFilesByJob(res.id).subscribe(
            (response: any) => {
              this.downloadFile(response, event.format);
            },
            err => {
              console.error(err);
            }
          )
        }
      });
  })
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
  anchor.download = `Manage Access Template`;
  anchor.href = url;
  anchor.click();
}

}
export class MatTabHeaders {
  public name: string;
  public icon?: string;
  public matInfoSubTab?: MatInfoSubTab[];
}

export class MatInfoSubTab {
  public name: string;
  public icon?: string;
}
