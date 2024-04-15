import { Component, OnInit  } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { FieldEditorService } from '../field-editor.service';
import { MatDialog } from '@angular/material/dialog';
import { AddnewfieldDialogComponent } from '../addnewfield-dialog/addnewfield-dialog.component';
import { ActionFieldDetail } from 'src/app/decision-engine/models/DecisionAction';
import { DatePipe } from '@angular/common';
import { DownloadJob } from 'src/app/loan-application/common/download.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-field-action',
  templateUrl: './field-action.component.html',
  styleUrls: ['./field-action.component.scss']
})
export class FieldActionComponent implements OnInit {
  fieldColumns: ColumnDefinition[];
  pageData: PageData;
  fieldcolumnsData: { id: number }[] = [];
  loadingItems: boolean = false;
  tableFieldId: any;
  objectModelField: ActionFieldDetail = {} as ActionFieldDetail;
  currentDownloadJob: DownloadJob;
  downloadStatusSubscription: Subscription;

  constructor(public dialog: MatDialog,
    private notifierService: NotifierService,
    public fieldEditorService: FieldEditorService,
    public datepipe: DatePipe,
  ) {
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.pageData.count;
    this.fieldColumns = [
      {
        fieldName: "id",
        displayName: "ID",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "field_name",
        displayName: "Field_Name",
        lockColumn: false,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "field_type",
        displayName: "Field_Type",
        lockColumn: false,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "description",
        displayName: "Description",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "tag",
        displayName: "Tag",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "in_use",
        displayName: "In_use",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "source",
        displayName: "Source",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "others",
        displayName: "Others",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
        isList: true,
      },
      {
        fieldName: "",
        displayName: "Edit Field",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: false,
        hideExport: true,
        filterDisable: true
      },
      {
        fieldName: "",
        displayName: "Delete",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: false,
        hideExport: true,
        filterDisable: true
      },
    ];
  }

  ngOnInit(): void {
    this.getFieldListingeData(this.pageData);
  }

  // Add New Field Dialog 
  addNewFieldClick(event: any) {
    const dialogRef = this.dialog.open(AddnewfieldDialogComponent, {
      width: '60%',
      height: '50%'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getFieldListingeData(this.pageData);
    });
  }

  // LISTING FUNCTION
  getFieldListingeData(pageData: PageData) {
    this.loadingItems = true;
    this.fieldEditorService.fieldDataList(this.fieldColumns, this.pageData.currentPage, pageData.pageSize).subscribe(res => {
      this.fieldcolumnsData = res['result'];
      this.loadingItems = false;
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  //BUTTON CLICK FUNCTION
  buttonClick(event: any) {
    // on Delete click
    if (event.col && event.col.displayName === 'Delete') {
      let confirmation = confirm("Are you sure to delete?");
      if (confirmation == true) {
        this.fieldEditorService.DeleteAddedFields(event.data.id).subscribe(
          (res) => {
            this.showNotification('success', 'Deleted successfully.');
            this.fieldcolumnsData = this.fieldcolumnsData.filter((item: any) => item.id !== event.data.id) as { id: number }[];
          },
          (err) => {
            console.log(err);
            this.showNotification('error', 'Oops! something went wrong.');
          }
        )
      }
    }

    // on edit click
    if (event.col && event.col.displayName === 'Edit Field') {
      const dialogRef = this.dialog.open(AddnewfieldDialogComponent, {
        data: { editableData: event.data },
        width: '60%',
        height: '50%'
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.getFieldListingeData(this.pageData);
      });
    }
  }

  // EXPORT FUNCTION 
  rolesListDataExport(event: any) {
    this.fieldEditorService.fieldEditorExport(event.columns, this.pageData.currentPage, event.format).subscribe(res => {
      this.currentDownloadJob = res;
      this.downloadFile(res,event.format)      
    },
      (err) => {
        console.log(err);
      }
    )
  }

  downloadFile(res, format: string) {
    let data = [res];
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyyMMdd hhmmss');
    if (format == 'xlsx') {
      var blob = new Blob(data, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else if (format == 'csv') {
      var blob = new Blob([res], { type: 'text/csv' });
    } else if (format == 'xls') {
      var blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    } else if (format == 'pdf') {
      var blob = new Blob([res], { type: 'application/pdf' });
    } else {
      var blob = new Blob(data, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = `FIELD_ITEMS _${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

  // filter Dropdown 
  onApplyFilter(columnDetail: any) {
    this.fieldEditorService.fieldEditorDropdown(this.pageData.currentPage, this.pageData.pageSize, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
      columnDetail.column.dropDownList = res;
    })
    this.changeColumnData(columnDetail.column)
  }

  // FILTER  FUNCTIONS
  changeColumnData(columnDefinition) {
    this.fieldColumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition;
      }
    })
  }

  columnChange(event: ColumnDefinition[]) {
    this.fieldColumns = event;
    this.getFieldListingeData(this.pageData);
  }

}
