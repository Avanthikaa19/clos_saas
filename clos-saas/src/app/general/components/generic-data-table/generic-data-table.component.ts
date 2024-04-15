import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { I } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { CustomiseDashboard, SearchScope } from 'src/app/dynamic-dashboard/dynamic-dashboard/models/model';
import { CustomServiceService } from 'src/app/dynamic-dashboard/dynamic-dashboard/service/custom-service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { GenericDisplayAllfieldsPopupComponent } from '../generic-display-allfields-popup/generic-display-allfields-popup.component';
import { GenericExportPopupComponent } from '../generic-export-popup/generic-export-popup.component';
import { GenericFilterPopupComponent } from '../generic-filter-popup/generic-filter-popup.component';

@Component({
  selector: 'app-generic-data-table',
  templateUrl: './generic-data-table.component.html',
  styleUrls: ['./generic-data-table.component.scss'] 

})
export class GenericDataTableComponent implements OnInit {
name: string;
customLayout = new CustomiseDashboard();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public encryptDecryptService: EncryptDecryptService,
    private closService: CLosService,
    public customService:CustomServiceService,
    public jwtAuthenticationService:JwtAuthenticationService,
  ) {
    this.customLayout = JSON.parse(sessionStorage.getItem('grid-layout'));
    this.loadingItems = false;
    
  }
  data: any[];
  dataTable: any[] =[];
  cols: ColumnDefinition[];
  filterColumns: ColumnDefinition[];
  loadingItems: boolean;
  fromFilter: boolean = false;
  searchValue = '';
  duplicateData: any[] = [];
  allKeys: any[] = [];
  filteredData: any[] = [];
  fieldSearchText: string = '';
  isDisplayAllFieldsColumns: boolean = false;

  // dataTable: any[];
  // INTERNAL SCORING CHECK BOX 

  allSelect: boolean = false;
  selectCheckBox: boolean = false;
  selectedfisurgeid: any[] = [];
  duplicateIDList: any[] = [];
  datatabs:any;
  copyCol: any;

  @Input()
  set tableData(val: any[]) { this.dataTable = val; }
  get tableData() { return this.dataTable; }
  @Input() fastAutoColumns: boolean;
  @Input() selectCheck: any[] = [];
  @Input() selectedIndex: number;
  @Input() pageData: PageData;
  @Input() filterButton: boolean;
  @Input() clearButton: boolean;
  @Input() copyButton: boolean;
  @Input() exportButton: boolean;
  @Input() displayAllButton: boolean;
  @Input() newTemplate: boolean;
  @Input() newRoles: boolean;
  @Input() newGroups: boolean;
  @Input() loading: boolean;
  @Input() filterInput: boolean;
  @Input() addNewUser: boolean;
  @Input() deleteNewUser: boolean;
  @Input() disableEdit: boolean;
  @Input() newFields: boolean;
  @Input() reprocess: boolean;


  @Output() onChange: EventEmitter<ColumnDefinition[]> = new EventEmitter<ColumnDefinition[]>();
  @Output() onClick: EventEmitter<ClickEvent> = new EventEmitter<ClickEvent>();
  @Output() onMatSelectChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPageChange: EventEmitter<PageData> = new EventEmitter<PageData>();
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onApplyBtn: EventEmitter<any> = new EventEmitter<any>();
  @Output() onExportChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectAllDuplicatPreview: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectAllSelfAssign: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectAllReprocess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectAllCheckbox: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCreateNewUserClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteNewUserClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddNewFieldClick: EventEmitter<any> = new EventEmitter<any>();
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
  getUserName:any='';
  searchscope:SearchScope=new SearchScope(10,'clos')
  pageNumber:number=1;
  allTemplate:any=[];
  totalCount:number;
  screens:any=[];
  keyword:any='';

  ngOnInit(): void {
    this.getUserName=this.jwtAuthenticationService.getAuthenticatedUser();
    this.getTemplate();
  }
  ngOnChanges() {
    this.datatabs = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
    console.log("datatabs",this.datatabs)
    if (this.datatabs === null || this.datatabs === 'undefined') {
      console.log("datatabs is null or undefined, setting to 0");
      this.datatabs = 0;
      this.selectCheckBox=false;
  } 
  else if(this.datatabs === 1){
    this.selectCheckBox=false;
  }
  else {
      console.log("datatabs has a value:", this.datatabs);
  }
    // if (this.datatabs =='undefined' || this.datatabs == 'null') {
    //   console.log("tabs ")
    //   this.datatabs = 0;
    // }
    if (this.encryptDecryptService.decryptData(sessionStorage.getItem('tabChange'))) {
      this.selectedfisurgeid = []
      this.emptyFiledOnTab();
    }
  }
  getMapping(name){
		this.loading = true
		sessionStorage.setItem('dashName',name);
		this.customService.getMapping(name, this.getUserName,this.pageNumber,this.searchscope.pageSize,'').subscribe(res=>{
		//   this.allTemplate = res['result'];
		  let data=res['result']
		  this.totalCount=res['count']
		  this.screens = [];
		  this.allTemplate?.forEach(e => {
			this.screens?.push(e.selectedScreen);
		  })
		  data?.forEach(e=>{
			  this.allTemplate?.push(e)
		  })
		  this.loading = false;
		})
	  }
	  Id:any;
	
	viewDashboard(id){
	  this.Id=id;
	  this.loading = true;
      this.customService.getTemplateWithId(id).subscribe(res =>{
      let layout = res;
      this.loading = false;
      layout.widget.map((element)=>{
        element.actualData = JSON.parse(element.data);
      });
      sessionStorage.setItem('gridlayout',JSON.stringify(res));
	//   window.location.reload();
	  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/dynamic/dynamic/dashboardMapping']);
    })
	}

	getTemplate(){
		this.loading = true
		this.customService.getTypesOfTemplate(this.searchscope.pageSize, this.pageNumber,this.keyword,'desc','id').subscribe(res=>{
		  this.allTemplate = res['data'];
		  this.loading = false;
		  this.totalCount = res['count'];
      for(let i=0;i<this.allTemplate?.length;i++){
        this.Id=this.allTemplate[i].id
        console.log(this.allTemplate[i].id)
      }
		})
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

  searchByColumn() {
    let srchTxt: string = this.fieldSearchText.toUpperCase().trim();

      if (this.isDisplayAllFieldsColumns === true) {
        this.filteredColumns = this.copyCol.filter((col) => {
          if (
            col.displayName === 'View Details' ||
            col.displayName === 'Document Preview' ||
            col.displayName === 'View Result Status' ||
            col.displayName === 'Status' ||
            col.displayName === 'Self Assign' ||
            col.displayName === 'Internal Kyc Preview'||
            col.displayName === 'No Fraud'||
            col.displayName === 'Fraud'
          ) {
            return true; // Include these columns even if the search text is not empty.
          } else {
            return (
              !srchTxt || 
              col.displayName.toUpperCase().startsWith(srchTxt) ||
              col.lockColumn
            );
          }
        });
      }
      else {
        this.filteredColumns = this.columns.filter((col) => {
          if (
            col.displayName === 'View Details' ||
            col.displayName === 'Document Preview' ||
            col.displayName === 'View Result Status' ||
            col.displayName === 'Status' ||
            col.displayName === 'Self Assign' ||
            col.displayName === 'Internal Kyc Preview'||
            col.displayName === 'No Fraud'||
            col.displayName === 'Fraud'
          ) {
            return true; // Include these columns even if the search text is not empty.
          } else {
            return (
              !srchTxt || 
              col.displayName.toUpperCase().startsWith(srchTxt) ||
              col.lockColumn
            );
          }
        });
      }


  }

  clearSearch() {
    this.fieldSearchText = ''
    this.searchByColumn();
  }


  emptyFiledOnTab(){
    this.fieldSearchText=''
    this.filteredColumns = this.cols;
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
  
  onSubmenuCellClicked(column: ColumnDefinition, index: number, data: any, event,name:string) {
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
    clickEvent.name = name; 
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
    const dialogRef = this.dialog.open(GenericFilterPopupComponent, {
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

  createTemplate() {
    sessionStorage.removeItem('access_data');
    this.router.navigateByUrl('admin/admin/access-template/access-detail');
  }
  createRoles() {
    sessionStorage.removeItem('roles_data');
    this.router.navigateByUrl('admin/admin/roles/role-detail');

  }
  
  createGroups(){
    sessionStorage.removeItem('groups_data');
    this.router.navigateByUrl('admin/admin/groups/group-detail');
  }
  getStatusBackgroundColor(status: string): string {
    const statusColors = {
      'DRAFT': '#0e2954',
      'UI_INITIATED': '#000080', 
      'LOAN_APPROVAL_QUEUE': '#43AA8B', 
      'DOCUMENT_VERIFIER_QUEUE': '#C0C0C0', 
      'KYC_COMPLETED': '#228B22',
      'KYC_APPROVED': '#50C878',
      'KYC_REJECTED': '#d80032',
      'INTERNAL_KYC_COMPLETED': '#808000',
      'INTERNAL_KYC_REJECTED': '#d80032', 
      'ROLL_OVER': '#FFA500',
      'EXTENSION_OF_LOAN': '#3498db',
      'LOAN_APPROVED': '#0033CC',
      'LOAN_REJECTED': '#d80032', 
      'BASIC_CHECK_COMPLETED': '#008080',
      'UNDERWRITING_QUEUE': '#e67e22',
      'UNDERWRITING_IN_PROGRESS': '#814141',
      'UNDERWRITING_REJECT': '#d80032',
      'EXTERNAL_KYC_REJECTED': '#d80032',
      'PENDING': '#FFBF00',
      'ETB_MATCHED':'#DE3163',
      'REJECT': '#d80032' 
    };       
    if (statusColors.hasOwnProperty(status)) {
        return statusColors[status];
    }
    return '#17a2b8'; // You can change this to a default color of your choice
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
    const dialogRef = this.dialog.open(GenericExportPopupComponent, {
      height: '75vh',
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

  //Display  All fields functions
  displayAllClick() {
    const dialogRef = this.dialog.open(GenericDisplayAllfieldsPopupComponent, {
      height: '90vh',
      width: '41vw',
      hasBackdrop: true,
      data: {
        colData: this.filteredColumns,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.filteredColumns = result.modifiedColumns;
        this.copyCol = JSON.parse(JSON.stringify(this.filteredColumns))
        this.isDisplayAllFieldsColumns = result.displayAll;
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
    const tableID = document.getElementById('table');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.onPageChange.emit(this.pageData);
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

  // INTERNAL SCORING SELECT ALL CHECKBOX FUNCTIONS 
  selectAll(event) {
    this.selectedfisurgeid = [];
    this.selectCheckBox = true;
    if (event.checked == true) {
      this.selectCheckBox = true;
      this.tableData.forEach((Id) => {
        this.selectedfisurgeid.push(Id.id);
        //this.selectedfisurgeid.filter(event => event.checked == true)
        console.log('filteredColumns', this.selectedfisurgeid);

        this.onSelectAllCheckbox.emit(this.selectedfisurgeid)
        //sessionStorage.setItem('FINSURGE_IDS', this.encryptDecryptService.encryptData(this.selectedfisurgeid))
      })
    }
    else {
      this.selectCheckBox = false;
      this.selectedfisurgeid = [];
    }

  }

  //  PREVIEW BUTTON CONDITION 
  internalScoringchecked(event, data) {
    if (event.checked == true) {
      this.selectedfisurgeid.push(data.id);
      this.onSelectAllCheckbox.emit(this.selectedfisurgeid)

    }
    else {
      let removeid = this.selectedfisurgeid.indexOf(data.id);
      this.selectedfisurgeid.splice(removeid, 1);
      console.log('filteredColumns', this.selectedfisurgeid);
      this.onSelectAllCheckbox.emit(this.selectedfisurgeid)

    }
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

  formatDate1(dateString: string): string | null {
    if (dateString !== "0") {
      const dateObject = new Date(dateString);
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = this.getMonthName(dateObject.getMonth());
      const year = dateObject.getFullYear();
      if (!isNaN(year)) {
        const formattedDate = `${day} ${month} ${year}`;
        return formattedDate;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
   
  getMonthName(month: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  }

  //Multi check Duplicate 
  onDuplicatePreviewClick(event: any) {
    console.log("duplicate event", event)
    this.onSelectAllDuplicatPreview.emit(this.duplicateIDList)
  }

  //Multi check  Self Assign 
  onSelfAssignClick(event: any) {
    this.onSelectAllSelfAssign.emit(this.selectedfisurgeid);
  }

  //Multi reprocess 
  onReprocessClick(event:any){
    console.log("reprocess event", event)
    this.onSelectAllReprocess.emit(this.duplicateIDList)
  }

  //Add New User
  onCreateBtnClick($event) {
    console.log("duplicate event", event)
    this.onCreateNewUserClick.emit(event)
  }

  //DELETE USER
  onDeleteBtnClick(event: any) {
    this.onDeleteNewUserClick.emit(event)
  }

  // Add field click
  onAddFieldClick(event:any) {
    this.onAddNewFieldClick.emit(event)
  }
  
  //Download attachment
  getAttachementFileDownload(id: number) {
    this.closService.getAttachmentDetails([id]).subscribe(attachment => {
      if (attachment) {
        let fileName = attachment[0].fileName
        this.closService.getAttachmentDownload(id).subscribe(res => {
          var blob = new Blob([res])
          var url = window.URL.createObjectURL(blob);
          var anchor = document.createElement("a");
          anchor.download = fileName;
          anchor.href = url;
          anchor.click();
        })
      }
    })
  }

  onAdditionalLoanClick(column: ColumnDefinition, index: number, data: any, event,name:string){
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
    clickEvent.name = name; 
    this.onClick.emit(clickEvent);
  }
  getColorByLoanStatus(loanStatus: string): string {
    if (loanStatus === 'ADDITIONAL_LOAN') {
      const intensity = 0.5; 
      const rgbaColor = `rgba(255, 192, 203, ${intensity})`; 
      return rgbaColor; 
    } 
    else {
      return 'inherit'; 
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
  public isExport: boolean;
  public hideExport?: boolean;
  public dateTill?: any;
  public filterDisable?: boolean;
  public inOrder?: boolean;
  public viewSticky?: boolean;
  public isBoolean?: boolean;
  public isList?: boolean;
  public initialStatus?: boolean;
}

export class ClickEvent {
  [x: string]: any;
  public clientX: number;
  public clientY: number;
  public screenX: number;
  public screenY: number;
  public index: number;
  public data: any;
  public col: ColumnDefinition;
  public checked?: any;
  public name?: string;
}

export class PageData {
  public currentPage: number;
  public pageSize: number;
  public totalPages: number;
  public totalRecords: number;
  public comma: string;
  public count: string;
}
export class ExportFile {
  columnDefinitions: ColumnDefinition[];
}



