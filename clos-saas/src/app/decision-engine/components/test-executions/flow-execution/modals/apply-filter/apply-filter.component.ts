import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
@Component({
  selector: 'app-apply-filter',
  templateUrl: './apply-filter.component.html',
  styleUrls: ['./apply-filter.component.scss']
})
export class ApplyFilterComponent implements OnInit {

   gridApi: { setRowData: (arg0: any) => any; };
   gridColumnApi: any;

   columnDefs:any;
   defaultColDef:any;
   defaultColGroupDef:any;
   columnTypes: any;
   rowData: any[];

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: 'Athlete',
        field: 'athlete',
      },
      {
        headerName: 'Sport',
        field: 'sport',
      },
      {
        headerName: 'Age',
        field: 'age',
        type: 'numberColumn',
      },
      {
        headerName: 'Year',
        field: 'year',
        type: 'numberColumn',
      },
      {
        headerName: 'Date',
        field: 'date',
        type: ['dateColumn', 'nonEditableColumn'],
        width: 220,
      },
      {
        headerName: 'Medals',
        groupId: 'medalsGroup',
        children: [
          {
            headerName: 'Gold',
            field: 'gold',
            type: 'medalColumn',
          },
          {
            headerName: 'Silver',
            field: 'silver',
            type: 'medalColumn',
          },
          {
            headerName: 'Bronze',
            field: 'bronze',
            type: 'medalColumn',
          },
          {
            headerName: 'Total',
            field: 'total',
            type: 'medalColumn',
            columnGroupShow: 'closed',
          },
        ],
      },
    ];
    this.defaultColDef = {
      width: 150,
      editable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      resizable: true,
    };
    this.defaultColGroupDef = { marryChildren: true };
    this.columnTypes = {
      numberColumn: {
        width: 130,
        filter: 'agNumberColumnFilter',
      },
      medalColumn: {
        width: 100,
        columnGroupShow: 'open',
        filter: false,
      },
      nonEditableColumn: { editable: false },
      dateColumn: {
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: (filterLocalDateAtMidnight:any, cellValue:any) => {
            const dateParts = cellValue.split('/');
            const day = Number(dateParts[0]);
            const month = Number(dateParts[1]) - 1;
            const year = Number(dateParts[2]);
            const cellDate = new Date(year, month, day);
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            } else {
              return 0;
            }
          },
        },
      },
    };
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onGridReady(params: { api: { setRowData: (arg0: any) => any; }; columnApi: any; }) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .subscribe((data: any) => params.api.setRowData(data));
  }
}
