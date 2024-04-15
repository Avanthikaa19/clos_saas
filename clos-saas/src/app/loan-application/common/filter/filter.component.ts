import { COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnDefinition } from '../share-data-table/share-data-table.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  filteredColumns: ColumnDefinition[];
  column: ColumnDefinition;
  fruits: string[] = [];
  separatorKeysCodes: number[] = [COMMA];
  fruitCtrl = new FormControl('');

  dateFrom: string = '';
  dateTill: string = '';
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
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogueData: any,
  ) {
    this.columns = JSON.parse(JSON.stringify(dialogueData.colData));
  }

  ngOnInit(): void {
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
    // column.searchItem.push(event.option.viewValue);
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
    //this.onChange.emit(this.filteredColumns);
  }
  onApplyClick() {
    let stringfy = JSON.stringify(this.columns);
    this.dialogRef.close(stringfy);
    this.onFilter.emit(true)
  }
}
