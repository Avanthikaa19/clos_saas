import { Component, OnInit } from '@angular/core';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';

@Component({
  selector: 'app-nfis-list',
  templateUrl: './nfis-list.component.html',
  styleUrls: ['./nfis-list.component.scss']
})
export class NfisListComponent implements OnInit {

  nfisColumnList: ColumnDefinition[] = [];
  pageData: PageData = new PageData();

  constructor() { 

    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.pageData.count;

    this.nfisColumnList = [
      {
        fieldName: "",
        displayName: "S.No",
        lockColumn: false,
        // columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: true,
        hideExport: false,
        filterDisable: false,

      },
      {
        fieldName: "",
        displayName: "Preview",
        lockColumn: false,
        // columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: true,
        hideExport: false,
        filterDisable: false,

      },
      {
        fieldName: "",
        displayName: "GET DATA Preview",
        lockColumn: false,
        // columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: true,
        hideExport: false,
        filterDisable: false,

      },

    ];
    console.log("columns", this.nfisColumnList)
  }

  ngOnInit(): void {
  }

}
