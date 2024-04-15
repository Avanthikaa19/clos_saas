import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClosCommonExportComponent } from 'src/app/c-los/components/common/clos-common-export/clos-common-export.component';
import { ClosCommonFilterComponent } from 'src/app/c-los/components/common/clos-common-filter/clos-common-filter.component';
import { ColumnDefinition } from '../../models/admin-table';
@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss']
})
export class AdminTableComponent implements OnInit {

  fieldSearchText: string = '';
  data: any[];
  @Input() newUsers: boolean;
  @Input() filterButton: boolean;
  @Input() clearButton: boolean;
  @Input() exportButton:boolean;
  @Input()
  set tableData(val: any[]) { this.data = val;}
  get tableData() { return this.data; }
  cols: ColumnDefinition[];
  adminColumns: ColumnDefinition[];
  
  constructor(public dialog:MatDialog) { }

  @Input()
  set columns(val: ColumnDefinition[]) { this.cols = val; this.applyFieldSearchFilter(); }
  get columns() {
    return this.cols;
  }
  @Output() onAddNewUserClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChange: EventEmitter<ColumnDefinition[]> = new EventEmitter<ColumnDefinition[]>();
  @Output() onExportChange: EventEmitter<any> = new EventEmitter<any>();

  applyFieldSearchFilter() {
    let srchTxt: string = this.fieldSearchText.toUpperCase().trim();
    this.adminColumns = [];
    for (let col of this.cols) {
      if (!col.fieldName || col.fieldName.toUpperCase().includes(srchTxt) ||
        col.displayName.toUpperCase().includes(srchTxt) ||
        col.lockColumn) {
        this.adminColumns.push(col);
      }
    }
  }

  ngOnInit(): void {
  }
    // Add field click
    onAddFieldClick(event:any) {
      this.onAddNewUserClick.emit(event)
    }

    // on filter click
    openFilter() {
      const dialogRef = this.dialog.open(ClosCommonFilterComponent, {
        height: '85vh',
        width: '32vw',
        hasBackdrop: true,
        data: {
          colData: this.adminColumns
        },
  
      });
      // const sub = dialogRef.componentInstance.onFilterChange.subscribe(
      //   (res) => {
      //     this.onFilterChange.emit(res);
      //   }
      // )
      // const forSelectAll = dialogRef.componentInstance.onFilter.subscribe(
      //   (res) => {
      //     if (res) {
      //     }
      //   }
      // )
      dialogRef.afterClosed().subscribe(result => {
        console.log('closed')
      }); 
    }

    // on clear btn clicked
    clearClick() {
      console.log('clear')
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

  // TO CLEAR APPLIED FILTERS
  onClearFilterClick(column: any, searchText: string, type: string) {
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
    this.onChange.emit(this.adminColumns);
  }

 // EXPORT COMMON functions
 exportClick() {
  const dialogRef = this.dialog.open(ClosCommonExportComponent, {
    height: '65vh',
    width: '25vw',
    hasBackdrop: true,
    data: {
      colData: this.adminColumns,
    },
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      let data = JSON.parse(result);
      this.onExportChange.emit(data);
    }
  });
}
}
