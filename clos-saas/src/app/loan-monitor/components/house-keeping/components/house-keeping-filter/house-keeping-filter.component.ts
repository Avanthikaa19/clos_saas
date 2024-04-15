import { COMMA } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { HouseKeepingService } from 'src/app/loan-monitor/service/house-keeping.service';

@Component({
  selector: 'app-house-keeping-filter',
  templateUrl: './house-keeping-filter.component.html',
  styleUrls: ['./house-keeping-filter.component.scss']
})
export class HouseKeepingFilterComponent implements OnInit {

  filteredColumns: ColumnDefinition[];
  column: ColumnDefinition;
  fruits: string[] = [];
  separatorKeysCodes: number[] = [COMMA];
  fruitCtrl = new FormControl('');

  dateFrom: string = '';
  dateTill: string = '';
  fromDate: string = '';
  toDate: string = '';
  fieldSearchText: string = '';
  searchText: any;

  cols: ColumnDefinition[];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @Output() onChange: EventEmitter<ColumnDefinition[]> = new EventEmitter<ColumnDefinition[]>();
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    public dialogRef: MatDialogRef<HouseKeepingFilterComponent>,
    public datepipe: DatePipe,
    public houseKeepingService:HouseKeepingService,
    @Inject(MAT_DIALOG_DATA) public dialogueData: any,
  ) { 
    this.filteredColumns = this.declareInitialColumns();
  }

  ngOnInit(): void {
  }
  declareInitialColumns() {
    let column = [
      {
        fieldName: "dataBase",
        displayName: "Data Base",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "tableName",
        displayName: "Table Name",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "logic",
        displayName: "Choose Logic",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "process",
        displayName: "Choose Process",
        lockColumn: false,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "dateFrom",
        displayName: "Choose Date",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        dateFormat: "dd MMM yyyy",
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      // {
      //   fieldName: "dateTo",
      //   displayName: "Date To",
      //   lockColumn: true,
      //   sortAsc: null,
      //   searchText: "",
      //   isExport: true,
      //   dateFormat: "dd MMM yyyy",
      //   columnDisable: true,
      //   dropDownList: [],
      //   searchItem: [],
      // },
      {
        fieldName: "method",
        displayName: "Choose Method",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "archiveTable",
        displayName: "Archive Table",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        filterDisable: true,
        columnDisable: false,
        dropDownList: [],
        searchItem: [],
      },
    ]
    return column;
  }
  onFilterDropDown(columnDetails: ColumnDefinition, search: string) {
    this.houseKeepingService.getFilterDropdown(1,20,columnDetails.fieldName,search).subscribe(res=>{
      console.log("Dropdown Response",res)
    })
  }
  onfromDateSelection(column, date) {
    if (column.dateFormat) {
      column.fromDate = this.datepipe.transform(date, 'yyyyMMdd');
    }
  }

  ontoDateSelection(column, date) {
    if (column.dateFormat) {
      column.toDate = this.datepipe.transform(date, 'yyyyMMdd');
    }
  }
  add(event: MatChipInputEvent, column): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
      column.searchText?.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.fruitCtrl.setValue(null);
  }
  remove(fruit: string, column): void {
    const index = column.searchText.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      column.searchText?.splice(index, 1);
    }
  }
  applyFieldSearchFilter() {
    let srchTxt: string = this.fieldSearchText.toUpperCase().trim();
    this.filteredColumns = [];
    for (let col of this.cols) {
      if (!col.fieldName || col.fieldName.toUpperCase().includes(srchTxt) ||
        col.displayName.toUpperCase().includes(srchTxt) ||
        col.lockColumn) {
        this.filteredColumns.push(col);
      }
    }
  }
  selected(event: MatAutocompleteSelectedEvent, column: ColumnDefinition): void {
    this.fruits.push(event.option.viewValue);
    let tempValue: any;
    tempValue = event.option.value;
    if (typeof (tempValue) == 'number') {
      tempValue = +tempValue;
    }
    // column.searchItem.push(event.option.viewValue);
    column.searchText.filter(column => column != tempValue)
    column.searchText.push(tempValue);
    // this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    // this.fruitInput.nativeElement.blur();
  }
  onCloseClick() {
    this.dialogRef.close();
  }

  onSearchTextChanged() {
    console.log("search text changed")
    //this.onChange.emit(this.filteredColumns);
  }
  onColumnSelection(columnDetail?: ColumnDefinition, searchText?) {
    let data = { column: columnDetail, search: searchText };
    // this.onFilterChange.emit(data);
  }
  dateTimeChangeEvent(column: ColumnDefinition, searchItem: string) {
    let colFieldName = '';
    searchItem = this.datepipe.transform(searchItem, 'yyyy-MM-dd HH:MM:SS');
    if (column.dateFrom) {
      console.log("date from", column.dateFrom)
      column.fromDate = this.datepipe.transform(column.dateFrom, 'yyyy-MM-dd HH:mm:ss')
      console.log("date after change", column.dateFrom)

      if (column.fieldName.endsWith('Date')) {
        colFieldName = column.fieldName + 'From';
      } else {
        colFieldName = column.fieldName + 'DateFrom';
      }
    }
    if (column.dateTill) {
      column.toDate = this.datepipe.transform(column.dateTill, 'yyyy-MM-dd HH:mm:ss')
      if (column.fieldName.endsWith('Date')) {
        colFieldName = column.fieldName + 'Till';
      } else {
        colFieldName = column.fieldName + 'DateTill';
      }
    }
    //  this.columns.push(dateField);  
  }
  onApplyClick() {
    let stringfy = JSON.stringify(this.column);
    this.houseKeepingService.getFilterHouseKeeping(1,20,this.filteredColumns).subscribe(res=>{
      console.log("GetFilterList",res)
    })
    this.dialogRef.close(stringfy);
    this.onFilter.emit(true)
  }
}
