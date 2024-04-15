import { COMMA } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnDefinition } from 'src/app/c-los/models/clos-table';

@Component({
  selector: 'app-clos-common-filter',
  templateUrl: './clos-common-filter.component.html',
  styleUrls: ['./clos-common-filter.component.scss']
})
export class ClosCommonFilterComponent implements OnInit {
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

  @Input()
  set columns(val: ColumnDefinition[]) { this.cols = val; this.applyFieldSearchFilter(); }
  get columns() { return this.cols; }

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @Output() onChange: EventEmitter<ColumnDefinition[]> = new EventEmitter<ColumnDefinition[]>();
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    public dialogRef: MatDialogRef<ClosCommonFilterComponent>,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public dialogueData: any,
  ) {
    this.columns = JSON.parse(JSON.stringify(dialogueData.colData));
  }

  ngOnInit(): void {
    this.dateChangeEvent();
  }

  dateChangeEvent() {
    this.columns.forEach(column => {
      if (column.dateFormat) {
        column.dateFrom = this.datepipe.transform(column.dateFrom, 'yyyy-MM-dd')
        column.dateTill = this.datepipe.transform(column.dateTill, 'yyyy-MM-dd')
      }
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
  
  selected(event: MatAutocompleteSelectedEvent, column: ColumnDefinition): void {
    this.fruits.push(event.option.viewValue);
    let tempValue: any;
    tempValue = event.option.value;
    if (typeof (tempValue) == 'number') {
      tempValue = +tempValue;
    }
    column.searchText.filter(column => column != tempValue)
    column.searchText.push(tempValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    this.fruitInput.nativeElement.blur();
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

  onCloseClick() {
    this.dialogRef.close();
  }

  onFilterDropDown(columnDetails: ColumnDefinition, search: string) {
    this.onFilterChange.emit({ column: columnDetails, search: search });
  }

  onColumnSelection(columnDetail?: ColumnDefinition, searchText?) {
    let data = { column: columnDetail, search: searchText };
    this.onFilterChange.emit(data);
  }

  onSearchTextChanged() {
    console.log("search text changed")
  }

  onApplyClick() {
    let stringfy = JSON.stringify(this.columns);
    this.dialogRef.close(stringfy);
    this.onFilter.emit(true)
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
  }
}
