import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClickEvent, ColumnDefinition, PageData } from 'src/app/c-los/models/clos-table';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ClosCommonExportComponent } from '../clos-common-export/clos-common-export.component';
import { ClosCommonFilterComponent } from '../clos-common-filter/clos-common-filter.component';

@Component({
  selector: 'app-clos-common-table',
  templateUrl: './clos-common-table.component.html',
  styleUrls: ['./clos-common-table.component.scss']
})
export class ClosCommonTableComponent implements OnInit {

  dataTable: any[] = [];
  cols: ColumnDefinition[];
  filterColumns: ColumnDefinition[];
  loadingItems: boolean;

  filteredData: any[] = [];
  fieldSearchText: string = '';
  fromFilter: boolean = false;
  searchValue = '';
  filteredColumns: ColumnDefinition[];
  allFilteredColumn: ColumnDefinition[];


  @Input() fastAutoColumns: boolean;
  @Input() pageData: PageData;
  @Input() selectCheck: any[] = [];
  @Input() filterButton: boolean;
  @Input() clearButton: boolean;
  @Input() exportButton: boolean;
  @Input() addButton: boolean;

  @Input()
  set tableData(val: any[]) { this.dataTable = val; }
  get tableData() { return this.dataTable; }

  @Input()
  set columns(val: ColumnDefinition[]) { this.cols = val; this.applyFieldSearchFilter(); }
  get columns() {
    return this.cols;
  }

  @Output() onAddNewClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onExportChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPageChange: EventEmitter<PageData> = new EventEmitter<PageData>();
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClick: EventEmitter<ClickEvent> = new EventEmitter<ClickEvent>();
  @Output() onChange: EventEmitter<ColumnDefinition[]> = new EventEmitter<ColumnDefinition[]>();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public encryptDecryptService: EncryptDecryptService
  ) {
    this.loadingItems = false;
  }

  ngOnInit(): void {
  }

  // Add field click
  onAddFieldClick(event: any) {
    this.onAddNewClick.emit(event)
  }
  //Clear field click
  clearClick() {
    this.pageData.currentPage = 1;
    for (let colData of this.columns) {
      colData.searchText = [];
      colData.dateFrom = null;
      colData.dateTill = null;
      colData.fromDate = null;
      colData.toDate = null;
      colData.timeFrom = null;
      colData.timeTill = null;
      colData.rangeFrom = null;
      colData.rangeTo = null;
    }
    this.onChange.emit(this.cols);
  }
  // EXPORT COMMON functions
  exportClick() {
    const dialogRef = this.dialog.open(ClosCommonExportComponent, {
      height: '65vh',
      width: '25vw',
      hasBackdrop: true,
      data: {
        colData: this.filteredColumns,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let data = JSON.parse(result);
        this.onExportChange.emit(data);
      }
    });
  }
  // TO CLEAR APPLIED FILTERS
  onClearFilterClick(column: any, searchText: string, type: string) {
    console.log("columnfromdate", column.fromDate)
    if (type == 'searchText') {
      column.searchText = column.searchText.filter(search => search != searchText)
    }
    else {
      if (type == 'fromDate') {
        column.dateFrom = null;
        column.fromDate = '';
      }
      else if (type == 'toDate') {
        column.dateTill = null;
        column.toDate = '';
      }
      else if (type == 'timeFrom') {
        column.timeFrom = null;
      }
      else if (type == 'timeTill') {
        column.timeTill = null;
      }
      else if (type == 'rangeFrom') {
        column.rangeFrom = null;
      }
      else if (type == 'rangeTo') {
        column.rangeTo = null;
      }
    }
    this.onChange.emit(this.filteredColumns);
  }
  getMonthName(month: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  }
  //DATE
  formatDate(dateString: string): string {
    if (dateString !== "0") {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${day} ${this.getMonthName(Number(month))} ${year}`;
    }
    else {
      return null;
    }
  }
  autosetColumns() {
    this.cols = [];
    for (let dataRec of this.dataTable) {
      key_loop:
      for (let key in dataRec) {
        if (dataRec.hasOwnProperty(key)) {
          for (let col of this.cols) {
            if (col.fieldName === key) {
              continue key_loop;
            }
          }
          let columnDef: ColumnDefinition = new ColumnDefinition();
          columnDef.fieldName = key;
          columnDef.displayName = key.replace(/([A-Z])/g, ' $1').trim();
          columnDef.lockColumn = false;
          columnDef.searchText = '';
          if (key.includes('id') || key.includes('Id')) {
            columnDef.lockColumn = true;
          }
          if (key.includes('instrument') || key.includes('tradeInsertionDatetime')) {
            columnDef.lockColumn = true;
          }
          if (key.includes('tradeInsertionDatetime')) {
            columnDef.lockColumn = true;
          }
          columnDef.sortAsc = null;
          this.cols.push(columnDef);
        }
      }
      if (this.fastAutoColumns) {
        break;
      }
    }
    this.applyFieldSearchFilter();
  }

  applyFieldSearchFilter() {
    let srchTxt: string = this.fieldSearchText.toUpperCase().trim();
    this.filteredColumns = [];
    if (this.cols) {
      for (let col of this.cols) {
        if (!col.fieldName || col.fieldName.toUpperCase().includes(srchTxt) ||
          col.displayName.toUpperCase().includes(srchTxt) ||
          col.lockColumn) {
          this.filteredColumns.push(col);
        }
      }
    }
  }

  clearSearch() {
    this.fieldSearchText = ''
  }

  onRowClicked(index: number, data: any, event) {
    sessionStorage.setItem('ID', data.id)
    event.stopPropagation();
    let clickEvent: ClickEvent = new ClickEvent();
    clickEvent.clientX = event.clientX;
    clickEvent.clientY = event.clientY;
    clickEvent.screenX = event.screenX;
    clickEvent.screenY = event.screenY;
    clickEvent.index = index;
    clickEvent.col = null;
    clickEvent.data = data;
    this.onClick.emit(clickEvent);
  }

  onCellClicked(column: ColumnDefinition, index: number, data: any, event) {
    event.stopPropagation();
    let clickEvent: ClickEvent = new ClickEvent();
    clickEvent.clientX = event.clientX;
    clickEvent.clientY = event.clientY;
    clickEvent.screenX = event.screenX;
    clickEvent.screenY = event.screenY;
    clickEvent.index = index;
    clickEvent.col = column;
    clickEvent.data = data;
    clickEvent.checked = event.target.checked;
    this.onClick.emit(clickEvent);
  }

  openFilter() {
    const dialogRef = this.dialog.open(ClosCommonFilterComponent, {
      height: '85vh',
      width: '32vw',
      hasBackdrop: true,
      data: {
        colData: this.filteredColumns
      },

    });
    const sub = dialogRef.componentInstance.onFilterChange.subscribe(
      (res) => {
        this.onFilterChange.emit(res);
      }
    )
    const forSelectAll = dialogRef.componentInstance.onFilter.subscribe(
      (res) => {
        if (res) {
        }
      }
    )
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fromFilter = true;
        this.pageData.currentPage = 1;
        let jsonData = result;
        this.filteredColumns = JSON.parse(jsonData);
        this.filterColumns = JSON.parse(jsonData);
        this.onChange.emit(this.filterColumns);
        this.selectCheck = [];
      }
    });

  }

}
