import { Component, Inject, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { DecisionTablesService } from '../../../../services/decision-tables.service';
import { UrlService } from '../../../../services/http/url.service';
import { ExampleHeaderComponent } from '../../../query-variable/example-header/example-header.component';

@Component({
  selector: 'app-edit-table-cells',
  templateUrl: './edit-table-cells.component.html',
  styleUrls: ['./edit-table-cells.component.scss']
})
export class EditTableCellsComponent implements OnInit {
  isDirty :boolean;
  cell_type: string;
  operator: string;
  custom_operand: string;
  standards: any[] = [];
  standard_operand: number;
  cell_name: string;
  editCellValue: any;
  editCellValueIntOne: any = null as any;
  editCellValueIntTwo: any = null as any;
  cell_types: any[] = [{ name: 'Custom', value: 'Custom' }
  // , { name: 'Standard Operand type', value: 'StdOptype' }
]
  name: string;
  type: string;
  var_type: string;
  string_symbols: any[] = [{ name: "equal to", value: "==" }, { name: "not equal to", value: "!=" },
  { name: "containswith", value: "containswith" }, { name: "startswith", value: "startswith" },{ name: "notstartswith", value: "notstartswith" },
  { name: "endswith", value: "endswith" },{ name: "any", value: "any" }
  ];
  int_symbols: any[] = [{ name: "equal to", value: "==" }, { name: "not equal to", value: "!=" },
  { name: "greater than or equal to", value: ">=" }, { name: "less than or equal to", value: "<=" },
  { name: "greater than", value: ">" }, { name: "less than", value: "<" }, { name: "between", value: ".." },{ name: "any", value: "any" },
  { name: "startswith", value: "startswith" },{ name: "notstartswith", value: "notstartswith" }
  ];
  bool_symbols: any[] = [{ name: "equal to", value: "==" }, { name: "not equal to", value: "!=" },{ name: "any", value: "any" }]
  readonly ExampleHeaderComponent = ExampleHeaderComponent;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  start: Date;
  end: Date;
  start_date: any
  end_date: any


  constructor(
    private url: UrlService, private decisionTableService: DecisionTablesService,
    public dialogRef: MatDialogRef<EditTableCellsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editCellValue = data['data'];
    this.name = data['name']
    this.type = data['type']
    this.var_type = data['var_type']
    this.isDirty = data['dirty']
    console.log(this.var_type)
    this.operator = this.editCellValue.operator
     if(this.editCellValue.data_type == 'integer' && this.editCellValue.custom_operand){
        this.editCellValue.custom_operand = this.editCellValue.custom_operand.replace(/,(?=\d{3})/g, '');
      }
      this.custom_operand = this.editCellValue.custom_operand
    if(this.editCellValue.cell_type == null){
      this.cell_type = 'Custom'  
    }
    else{
      this.cell_type = this.editCellValue.cell_type
    }
    if (this.type == 'string') {
      this.cell_name = 'Text'
    }
    if (this.type == 'integer' || this.type == 'float' || this.type == 'slashedinteger') {
      this.cell_name = 'number'
    }
    if (this.operator == '..' && (this.type == 'integer' || this.type == 'slashedinteger')) {
      let split: string;
      split = this.editCellValue.custom_operand.split('..')
      this.editCellValueIntOne = split[0]
      this.editCellValueIntTwo = split[1]

    }
    if (this.type == 'boolean') {
      this.cell_name = 'boolean'
    }
    if (this.type == 'dateTime') {
      this.cell_name = 'dateTime'
    }
    if (this.editCellValue.cell_type == null) {
      this.editCellValue.cell_type = 'Custom'
    }
    if (this.editCellValue.operator == null) {
      this.editCellValue.operator = "=="
    }
    if (this.editCellValue.standard_operand != null) {
      this.standard_operand = this.editCellValue.standard_operand.id
    }
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
// 
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    // this.getStandardsTable()
    this.editCellValue = this.data['data'];
    this.name = this.data['name']
    this.type = this.data['type']
  }

  isSelected() {
    console.log("Range", this.range.value);
    return false;

  }

  // To modify relative dates
  onChange(start: any, end: any) {
    this.start = new Date(start.value)
    this.end = new Date(end.value)
    console.log(start.value, end.value, this.start, this.end)

    if (sessionStorage.getItem('start') !== null) {
      this.start_date = sessionStorage.getItem('start')
      this.end_date = sessionStorage.getItem('end')
      sessionStorage.removeItem('start')
    } else if (sessionStorage.getItem('end') !== null) {
      this.end_date = sessionStorage.getItem('end')
      sessionStorage.removeItem('end')
    }
    else {
      this.start_date = formatDate(this.start, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      this.end_date = formatDate(this.end, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.editCellValue.cell_type = this.cell_type
    this.editCellValue.operator = this.operator
    if(this.custom_operand){
    this.editCellValue.custom_operand = this.custom_operand.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
    if (this.editCellValue.operator == '..') {
      this.editCellValue.custom_operand = (this.editCellValueIntOne + '..' + this.editCellValueIntTwo).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
    if (this.type == 'dateTime') {
      this.editCellValue.custom_operand = this.start_date + '..' + this.end_date
    }
    this.standards.forEach(e => {
      if (e.id == this.standard_operand) {
        this.editCellValue.standard_operand = e

      }
    })
    if (this.editCellValue.cell_type == 'StdOptype') {
      this.editCellValue.standard_operand_type = this.editCellValue.standard_operand
    }
    if(this.var_type=="actionVariable"){
      this.editCellValue.operator == "=="
    }
    this.dialogRef.close(this.isDirty);
  }

  onCloseClick() {
    this.onNoClick()
  }

  getStandardsTable() {
    this.decisionTableService.getstandardstable().subscribe((res) => {
      console.log(res)
      this.standards = res
    })
  }
  detectChange(){
    this.isDirty = true;
  }
  operatorAnyFieldChange(){
    if(this.operator=='any'){
      if(this.cell_type == 'Standard' || this.cell_type == 'StdOptype'){
        this.standard_operand=null;
      }
      else{
        this.custom_operand='-'
      }
     
  }}
}

