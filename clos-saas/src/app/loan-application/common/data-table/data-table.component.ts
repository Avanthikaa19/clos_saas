import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { ColumnDefinition, PageData } from '../share-data-table/share-data-table.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],

})
export class DataTableComponent implements OnInit {
  applicationColumns: ColumnDefinition[] = []
  pageData: PageData = new PageData();
  applicationLogData :any[];
  loadingItems:boolean;
 
  constructor(

    private defaultService:LoanServiceService,
  ) {
    this.applicationColumns = []
    this.initializeColumns()
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.applicationLogData =[];
   }

  ngOnInit(): void {
    //this.getShareDetailsData()
  }
  initializeColumns() {
    for (let column of this.applicationColumns) {
      column.searchText = [];
    }
    this.applicationColumns = [
    
      {
        fieldName: "id",
        displayName: "ID",
        lockColumn: false,
        sortAsc: null,
        searchText: null,
        isExport: false,
     
      },
      {
        fieldName: "fsId",
        displayName: "FS ID",
        lockColumn: false,
        sortAsc: null,
        searchText: null,
        isExport: false,
     
      },
      {
        fieldName: "bankNumber",
        displayName: "BankNumber",
        lockColumn: false,
        sortAsc: null,
        searchText: null,
        isExport: false,
     
      },
      {
        fieldName: "applicationid",
        displayName: "Applicationid",
        lockColumn: false,
        sortAsc: null,
        searchText: null,
        isExport: false,

      },
      {
        fieldName: "applReference",
        displayName: "ApplReference",
        lockColumn: false,
        sortAsc: null,
        searchText: null,
        isExport: false,
      },
      {
        fieldName: "prodNumber",
        displayName: "ProdNumber",
        lockColumn: false,
        sortAsc: null,
        searchText: null,
        isExport: false,
      },
      {
        fieldName: "criteriaNumber",
        displayName: "CriteriaNumber",
        lockColumn: false,
        sortAsc: null,
        searchText: null,
        isExport: false,
      },
     
    ];
    // this.filterC
  }
//   getShareDetailsData() {
//     this.defaultService.getList(this.applicationColumns, this.pageData.currentPage, this.pageData.pageSize  ).subscribe(res => {
      
// console.log("res",res);
//       this.applicationLogData=res['data']
//     })

//   }


}
