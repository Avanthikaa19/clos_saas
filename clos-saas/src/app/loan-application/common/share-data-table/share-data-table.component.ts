import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisplayAllFieldsComponent } from '../display-all-fields/display-all-fields.component';
import { ExportPopupComponent } from '../export-popup/export-popup.component';
import { FilterComponent } from '../filter/filter.component';


@Component({
  selector: 'app-share-data-table',
  templateUrl: './share-data-table.component.html',
  styleUrls: ['./share-data-table.component.scss']
})
export class ShareDataTableComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) {
    this.loadingItems = false;
  }


  data: any[];
  dataTable: any[];
  cols: ColumnDefinition[];
  filterColumns: ColumnDefinition[];
  loadingItems: boolean;
  fromFilter: boolean = false;
  searchValue = '';
  duplicateData: any[] = [];
  allKeys: any[] = [];
  filteredData: any[] = [];
  fieldSearchText: string = '';
  // dataTable: any[];

  @Input()
  set tableData(val: any[]) { this.dataTable = val; }
  get tableData() { return this.dataTable; }

  @Input() fastAutoColumns: boolean;
  @Input() selectCheck: any[] = [];
  @Input() pageData: PageData;
  @Input() filterButton: boolean;
  @Input() clearButton: boolean;
  @Input() copyButton: boolean;
  @Input() exportButton: boolean;
  @Input() displayAllButton: boolean;
  @Input() loading: boolean;


  @Output() onChange: EventEmitter<ColumnDefinition[]> = new EventEmitter<ColumnDefinition[]>();
  @Output() onClick: EventEmitter<ClickEvent> = new EventEmitter<ClickEvent>();
  @Output() onMatSelectChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPageChange: EventEmitter<PageData> = new EventEmitter<PageData>();
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onApplyBtn: EventEmitter<any> = new EventEmitter<any>();
  @Output() onExportChange: EventEmitter<any> = new EventEmitter<any>();


  @Input()
  set columns(val: ColumnDefinition[]) { this.cols = val; this.applyFieldSearchFilter(); }
  get columns() {
    return this.cols;
  }

  showFilters: boolean = false;
  filteredColumns: ColumnDefinition[];
  allFilteredColumn: ColumnDefinition[];
  pages: number[] = [20, 40, 60, 80, 100];

  //computed page vars
  public currentPageStart: number = 1;
  public currentPageEnd: number = 1;
  orderNumber: number = 0;

  ngOnInit(): void {

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

  onChangeEvent(event, column: ColumnDefinition) {
    event.data = column;
    if (event.checked == true) {
      this.selectCheck.push(column)
    }
    else {
      this.selectCheck.pop();
    }
    this.onMatSelectChange.emit(event)
  }

  prevPage() {
    if (this.pageData.currentPage <= 1) {
      return;
    }
    this.pageData.currentPage--;
    this.onPageChange.emit(this.pageData);
  }

  nextPage() {
    if (this.pageData.currentPage >= this.pageData.totalPages) {
      return;
    }
    this.pageData.currentPage++;
    this.onPageChange.emit(this.pageData);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FilterComponent, {
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
    console.log('fc', this.filteredColumns)
    console.log('cc', this.columns)
      const dialogRef = this.dialog.open(ExportPopupComponent, {
        height: '65vh',
        width: '25vw',
        hasBackdrop: true,
        data: {
          colData: this.filteredColumns, 
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          let data = JSON.parse(result);
          console.log('result', data);
          this.onExportChange.emit(data);
        }
      });
  

  }

  // Display  All fields functions

  displayAllClick() {
    console.log('fc', this.filteredColumns)
    console.log('cc', this.columns)
    const dialogRef = this.dialog.open(DisplayAllFieldsComponent, {
      height: '65vh',
      width: '25vw',
      hasBackdrop: true,
      data: {
        colData: this.filteredColumns,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log('result', result);
        this.filteredColumns = result;
        this.onApplyBtn.emit(this.filteredColumns);
      }
    });
  }

  sortClicked(columnDef: ColumnDefinition) {
    if (columnDef.sortAsc === null) {
      columnDef.sortAsc = true;
      this.orderNumber = this.orderNumber + 1;
      columnDef.sortOrder = this.orderNumber;
    } else if (columnDef.sortAsc) {
      columnDef.sortAsc = false;
      this.orderNumber = this.orderNumber + 1;
      columnDef.sortOrder = this.orderNumber;
    } else {
      columnDef.sortAsc = null;
      columnDef.sortOrder = null;
    }
    this.onChange.emit(this.cols);
  }

  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('tableID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.onPageChange.emit(this.pageData);
  }

  // TO CLEAR APPLIED FILTERS

  onClearFilterClick(column: any, searchText: string, type: string) {
    if (type == 'searchText') {
      column.searchText = column.searchText.filter(search => search != searchText)
    }
    else {
      if (type == 'fromDate') {
        column.dateFrom = null;
        column.fromDate = null;
      }
      else if (type == 'toDate') {
        column.dateTill = null;
        column.toDate = null;
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

  filterData() {

  }

  // clear filter

  clearSearchFilter() {
    this.searchValue = '';
    this.filterData();
  }


// COPY TO CLIPBOARD COMMON FUNCTION 
  async copyTokenToClipboard(node) {
    if (node) {
      var urlField = document.getElementById(node);
      var range = document.createRange();
      range.selectNode(urlField);
      window.getSelection().removeAllRanges();
      // aging=new Date().getDate() - new Date(fromDate).getDate();
      window.getSelection().addRange(range);
      await document.execCommand('copy');
      return;
    }
  }

}

export class ColumnDefinition {
  public fieldName: string;
  public subFieldName?: string;
  public displayName: string;
  public lockColumn: boolean;
  public sortAsc: boolean;
  public sortOrder?: number;
  public searchText: any;
  public dateFormat?: string;
  public dateFrom?: any;
  public searchItem?: any[];
  public columnDisable?: boolean;
  public dropDownList?: string[];
  public fromDate?: string;
  public toDate?: string;
  public timeFrom?: string;
  public timeTill?: string;
  public rangeFrom?: any;
  public rangeTo?: any;
  public isExport:boolean;
  public hideExport?:boolean;
  public dateTill?:any;
  public filterDisable?: boolean;
}

export class ClickEvent {
  public clientX: number;
  public clientY: number;
  public screenX: number;
  public screenY: number;
  public index: number;
  public data: any;
  public col: ColumnDefinition;
  public checked?: any;
}

export class PageData {
  public currentPage: number;
  public pageSize: number;
  public totalPages: number;
  public totalRecords: number;
  public comma: string;
}
export class ExportFile {
  columnDefinitions: ColumnDefinition[];
}