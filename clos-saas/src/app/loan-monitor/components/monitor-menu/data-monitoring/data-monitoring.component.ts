import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import * as echarts from 'echarts';
import { ErrorLogModalComponent } from 'src/app/loan-monitor/modals/error-log-modal/error-log-modal.component';
import { Monitor } from 'src/app/loan-monitor/models/monitor';
import { DataMonitoringService } from 'src/app/loan-monitor/service/data-monitoring.service';

const fadeAnimation = trigger('fade', [
  state('in', style({ opacity: 1 })),
  transition(':enter', [style({ opacity: 0 }), animate(600)]),
  transition(':leave', animate(600, style({ opacity: 0 })))
]);

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);

@Component({
  selector: 'app-data-monitoring',
  templateUrl: './data-monitoring.component.html',
  styleUrls: ['./data-monitoring.component.scss'],
  animations: [fadeAnimation, listAnimation]
})
export class DataMonitoringComponent implements OnInit {

  Summarycards: string[] = []; // SUMMARY VIEW CARDS NAMES ARRAY VARIABLE
  selectedTab: number = 1; // DEFAULT SELECTED TAB INDEX
  selectedtabName: string = 'File'; // INITIALLY SELECTED TAB AS 'FILE'

  // DATE PROPERTIES
  fromDate: string = "";
  toDate: string = "";
  fromTime: string = "";
  toTime: string = "";

  // PAGINATION PROPERTIES INSIDE DATA TRACING CARDS
  pageNum: number = 1;
  pageSize: number = 10;

  // TO SHOW ( NO ITEMS FOUND ) LABEL IN THE UI
  isDataComing: boolean = false;
  isGraphDataAvailable: boolean = false;
  
  // TO SHOW ( LOADING...PLEASE WAIT ) CARD WHEN FETCHING DATA FROM API
  chartLoading: boolean = false;
  dataLoading: boolean = false;

  // MONITOR MODEL CLASS
  monitoring: Monitor[] = [];

  // SUMMARY VIEW VARIABLES AS A OBJECt
  summaryView = new Summary();
  options: any;
  // options: EChartsOption;
  option: any = {
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'bar',
      }
    ]
  };
  chartData: any;

  constructor(
    private monitor: DataMonitoringService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    // INITIALLY SETTING ALL THE SUMMARY VIEW VALUES AS ZERO
    this.setSummaryView();
  }

  ngOnInit(): void {
    // SUMMARY VIEW CARDS NAMES ARRAY
    this.Summarycards = ['Applications', 'Data Base', "API"];
    // SETTING TODAY DATE TO FROM DATE AND TO DATE
    const todayDate = new Date();
    this.fromDate = this.formatDate(todayDate);
    this.toDate = this.formatDate(todayDate);
    this.dateChangeEvent();
  }

  // FORMATTING THE DATE FORMAT
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // INITIALLY SETTING ALL THE SUMMARY VIEW VALUES AS ZERO
  setSummaryView() {
    this.summaryView.fileLoaded = 0;
    this.summaryView.fileReceived = 0;
    this.summaryView.dbLoaded = 0;
    this.summaryView.dbReceived = 0;
    this.summaryView.apiLoaded = 0;
    this.summaryView.apiReceived = 0;
    this.summaryView.file = [];
    // this.summaryView.totalItems = 0;
    // this.summaryView.totalPages = 0;
  }

  // MAT-PAGINATOR => PAGE CHANGE EVENT FUNCTION
  onPageChange(event: PageEvent) {
    this.pageNum = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.dateChangeEvent();
  }

  // GETTING THE TAB NAME BASED ON SELECTED TAB NUMBER
  getTabName() {
    if (this.selectedTab === 1) {
      this.selectedtabName = 'File';
    }
    else if (this.selectedTab === 2) {
      this.selectedtabName = 'DB';
    }
    else {
      this.selectedtabName = 'API';
    }
  }

  // DATA TRACING - TAB CHANGE EVENT
  onTabChange(event: any) {
    this.selectedTab = event.index + 1;
    // GET THE TAB NAME BASED ON SELECTED TAB INDEX NUMBER
    this.getTabName();
    // this.fromDate = "";
    // this.toDate = "";
    // this.isDataComing = false;
    this.summaryView = new Summary();
    this.pageNum = 1;
    this.pageSize = 10;
    // this.setSummaryView();
    this.dateChangeEvent();
  }

  getChartDatas() {
    // ASSIGNING THIS TO SELF VARIABLE -> FOR ACCESS GLOBAL VARIABLES INSIDE THE CHART OPTIONS
    const self = this;
    this.chartLoading = true;
    this.monitor.getChartDetails(this.fromDate, this.toDate, this.selectedtabName).subscribe(
      response => {
        this.chartLoading = false;
        const dates = response['Dates'];
        this.isGraphDataAvailable = dates.length !== 0 ? true : false;
        // DYNAMICALLY ACCESS THE PROPERTIES BASED ON SELECTED_TAB_NAME
        const recordsReceivedProperty = `${this.selectedtabName}Received`;
        const recordsLoadedProperty = `${this.selectedtabName}Loaded`;
        const contentNameProperty = `${this.selectedtabName}Received`;

        const recordsReceived = response[recordsReceivedProperty].map(file => file.RecordsReceived);
        const recordsLoaded = response[recordsLoadedProperty].map(file => file.RecordsLoaded);
        const contentNames = response[contentNameProperty].map(file => file.ContentName);
        const statuses = response[recordsLoadedProperty].map(file => file.Status);
        const colors = statuses.map(status => (status === 'SUCCESS' ? 'green' : 'red'));

        const option = {
          xAxis: {
            type: 'category',
            data: dates
          },
          yAxis: {
            type: 'value'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              const dataIndex = params[0].dataIndex;
              let tooltipContent = '';

              if (self.selectedtabName === 'File') {
                tooltipContent = `
            <b>File Name:</b> ${contentNames[dataIndex]}<br>
            <b>Records Received:</b> ${recordsReceived[dataIndex]}<br>
            <b>Records Loaded:</b> ${recordsLoaded[dataIndex]}
          `;
              } else if (self.selectedtabName === 'DB') {
                tooltipContent = `
            <b>DB Name:</b> ${contentNames[dataIndex]}<br>
            <b>Records Received:</b> ${recordsReceived[dataIndex]}<br>
            <b>Records Loaded:</b> ${recordsLoaded[dataIndex]}
          `;
              } else {
                tooltipContent = `
            <b>API Name:</b> ${contentNames[dataIndex]}<br>
            <b>Records Received:</b> ${recordsReceived[dataIndex]}<br>
            <b>Records Loaded:</b> ${recordsLoaded[dataIndex]}
          `;
              }
              return tooltipContent;
            }
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              type: 'slider',
              start: 0,
              end: 100,
              showDetail: false
            }
          ],
          series: [
            {
              data: recordsLoaded,
              type: 'bar',
              itemStyle: {
                color: function (params) {
                  return colors[params.dataIndex];
                }
              }
            }
          ]
        };
        this.option = option;
      },
      err => {
      }
    )
  }

  // DATE CHANGE EVENT TO GET DATAS BASED ON THE DATE CHANGE
  dateChangeEvent() {
    if (this.fromDate && this.toDate) {
      this.dataLoading = true;
      this.getChartDatas();
      this.monitor.getDataMonitoringDatas(this.fromDate, this.toDate, this.selectedtabName, this.pageNum, this.pageSize).subscribe(
        response => {
          this.dataLoading = false;
          const responseObject = response as BackendResponse;
          this.summaryView.apiLoaded = responseObject.APILoaded;
          this.summaryView.dbReceived = responseObject.DBReceived;
          this.summaryView.fileLoaded = responseObject.FileLoaded;
          this.summaryView.apiReceived = responseObject.APIReceived;
          this.summaryView.dbLoaded = responseObject.DBLoaded;
          this.summaryView.fileReceived = responseObject.FileReceived;
          this.summaryView.file = responseObject.Data;
          this.summaryView.totalItems = responseObject.TotalItems;
          this.summaryView.totalPages = responseObject.TotalPages;
          // CALLING PAGINATION FUNCTION
          this.getPageSizeOptions();
          // CHANGE THE DATA ARRAY BASED ON ERROR STATUS FILES AT THE TOP THEN ONLY SUCCESS STATUS FILES
          this.summaryView.file.sort((a, b) => {
            if (a.Status === 'ERROR' && b.Status !== 'ERROR') {
              return -1; // 'A' COMES BEFORE 'B'
            } else if (a.Status !== 'ERROR' && b.Status === 'ERROR') {
              return 1; // 'B' COMES BEFORE 'A'
            } else {
              return 0; // MAINTAIN THE ORIGINAL ORDER
            }
          });
          // SETTING 'isDataComing' VARIABLE TRUE OR FALSE BASED ON THE RESPONSE IS COMING OR NOT
          this.isDataComing = this.summaryView?.file?.length === 0 ? false : true;
          // SETTING -> 'pageNum' AND 'pageSize' AS 1 AND 10 -> IF THE RESPONSE IS FALSE ( NO DATA RECEIVED )
          if (!this.isDataComing) {
            this.pageNum = 1;
            this.pageSize = 10;
          };
        },
        err => {
        }
      )
    }
  }

  // TO GET THE FORMATTED TIME TAKEN FOR HUMAN READABLE
  formatTimeDuration(duration: string): string {
    if (duration !== null) {
      const timeParts = duration.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      if (hours > 0) {
        return `${hours}hr ${minutes}min ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}min ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    }
    return '-'; // DEFAULT RETURN VALUE WHEN DURATION IS NULL
  }


  // TO GET THE FORMATTED TIME TAKEN FOR HUMAN READABLE
  formatTime(datetime: string): string {
    const date = new Date(datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  // SETTING MAT-PAGINATOR PAGESIZEOPTIONS DYNAMMICALLY
  getPageSizeOptions(): number[] {
    const totalItems = this.summaryView?.totalItems || 0;
    if (totalItems === 0) {
      return [0]; // SETTING PAGINATION -> ITEMS PER PAGE ARRAY
    }
    else if (totalItems <= 10) {
      return [10]; // SETTING PAGINATION -> ITEMS PER PAGE ARRAY
    }
    else if (totalItems <= 20) {
      return [10, 20]; // SETTING PAGINATION -> ITEMS PER PAGE ARRAY
    }
    else if (totalItems <= 30) {
      return [10, 20, 30]; // SETTING PAGINATION -> ITEMS PER PAGE ARRAY
    }
    else if (totalItems <= 50) {
      return [10, 20, 30, 50]; // SETTING PAGINATION -> ITEMS PER PAGE ARRAY
    }
    else {
      return [10, 20, 30, 50, 100]; // SETTING PAGINATION -> ITEMS PER PAGE ARRAY
    }
  }

  // VIEW ERROR LOG BUTTON MODAL POPUP FUNCTION
  openErrorLogModal(file: any) {
    const dialogRef = this.dialog.open(ErrorLogModalComponent, {
      data: file.ErrorLog, // PASSING THE ERRORLOG TO THE 'ErrorLogModalComponent'
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

// MODEL CLASS FOR SUMMARY VIEW
export class Summary {
  fileLoaded: number;
  fileReceived: number;
  dbLoaded: number;
  dbReceived: number;
  apiLoaded: number;
  apiReceived: number;
  file: any[];
  totalItems: number;
  totalPages: number
}

// INTERFACE FOR SUMMARY VIEW TO ASSIGN VALUES FROM THE BACKEND RESPONSE TO SUMMARY VIEW OBJECT
interface BackendResponse {
  APILoaded: number;
  DBReceived: number;
  FileLoaded: number;
  APIReceived: number;
  DBLoaded: number;
  Data: any[];
  FileReceived: number;
  TotalItems: number;
  TotalPages: number;
}