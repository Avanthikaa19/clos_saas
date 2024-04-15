import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ECharts } from 'echarts';
import { interval, Subscription } from 'rxjs';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { app_header_height } from './app.constants';
import { SystemStatus } from './models/SystemStatus';
import { AppCoreDataService } from './services/app-core-data.service';

@Component({
  selector: 'app-application-core',
  templateUrl: './application-core.component.html',
  styleUrls: ['./application-core.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(150, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(150, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ApplicationCoreComponent implements OnInit, OnDestroy {

  component_height;
  NgxEchartsDirective: any;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - app_header_height - 60;
  }
  // @HostListener('window:focus', ['$event'])
  // onFocus(event: FocusEvent): void {
  //   this.fetchSystemStatuses();
  // }

  timer: any;

  lastStartTime: Date = null;
  restarting: boolean = false;
  restartPassword: string = '';
  dcpRunning: boolean = null;
  metricLoggerRunning: boolean = null;

  refreshingMDIMSI: boolean = false;
  refreshingMDIMSC: boolean = false;

  loadBBFilePath: string = '';
  loadBBSampleMinutes: number = 60;
  loadBBFWDSampleMinutes: number = 60;
  loadBBFWDFilePath: string = '';
  loadingBBFile: boolean = false;

  cpu_usage: number = 0;
  used_memory_mb: number = 0;
  memory_usage: number = 0;
  processors: number = 0;
  total_memory_mb: number = 0;
  active_connections: number = 0;
  idle_connections: number = 0;
  max_connections_allowed: number = 0;

  //refreshing metrics
  loadingMetrics: boolean = false;
  autoRefreshMetricsSubscription: Subscription = null;
  autoRefreshMetrics: boolean = true;
  autoRefreshMetricsSeconds: number = 2;

  timezoneOffset: number = (new Date().getTimezoneOffset()) * 60 * 1000;

  statusData: SystemStatus[] = [];
  dataTotalThreads: any[] = [];
  dataUsedMemoryMb: any[] = [];
  dataUsedCPU: any[] = [];
  updateOptions: any = {};

  windowEnabled: boolean = true;
  windowSize: number = 10000;

  colors: string[] = ['#FF9933', '#4169E1', '#FF3333'];
  
  loadingChartData: boolean = false;
  options: any = {
    color: this.colors,
    title: {
      text: 'System Analyticsoptions'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: true,
        label: {
          backgroundColor: '#6a7985'
        }
      },
      feature: {
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    grid: {
      right: '20%'
    },
    legend: {
      data: ['Total Threads', 'Used Memory', 'CPU Usage']
    },
    xAxis: [{
      type: 'time',
      splitLine: {
        show: false
      }
    }],
    yAxis: [
      {
        type: 'value',
        name: 'Count',
        boundaryGap: [0, '100%'],
        axisLine: {
          show: true,
          lineStyle: {
            color: this.colors[0]
          }
        },
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        position: 'right',
        name: 'MB',
        axisLine: {
          show: true,
          lineStyle: {
            color: this.colors[1]
          }
        },
        axisLabel: {
          formatter: '{value} MB'
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        position: 'right',
        name: '%',
        min: 0,
        max: 100,
        axisLine: {
          show: true,
          lineStyle: {
            color: this.colors[2]
          }
        },
        axisLabel: {
          formatter: '{value} %'
        },
        offset: 60,
        splitLine: {
          show: false
        }
      }
    ],
    series: [
    {
      name: 'Total Threads',
      type: 'line',
      step: true,
      tooltip: {
        valueFormatter: value => value + ' Threads'
      },
      emphasis: {
        focus: 'series'
      },
      showSymbol: false,
      hoverAnimation: true,
      yAxisIndex: 0,
      data: this.dataTotalThreads
    },{
      name: 'Used Memory',
      type: 'line',
      areaStyle: {},
      tooltip: {
        valueFormatter: value => value + ' MB'
      },
      emphasis: {
        focus: 'series'
      },
      showSymbol: false,
      hoverAnimation: true,
      yAxisIndex: 1,
      data: this.dataUsedMemoryMb
    },{
      name: 'CPU Usage',
      type: 'line',
      areaStyle: {},
      tooltip: {
        valueFormatter: value => value + ' %'
      },
      emphasis: {
        focus: 'series'
      },
      showSymbol: false,
      hoverAnimation: true,
      yAxisIndex: 2,
      data: this.dataUsedCPU
    }
  ]
  };
  chartInstance: ECharts;

  constructor(
    private snackBar: MatSnackBar,
    private url: UrlService,
    private appCoreDataService: AppCoreDataService
  ) {
    this.updateComponentSize();
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.refreshStatuses();
    this.refreshMetrics();
    this.refreshCPUMetrics();
    this.loadingChartData = true;
  }

  ngOnDestroy() {
    if (this.autoRefreshMetricsSubscription != undefined) {
      this.autoRefreshMetricsSubscription.unsubscribe();
    }
    clearInterval(this.timer);
  }

  onChartInit(event) {
    this.chartInstance = event;
    //get status data for graph
    this.fetchSystemStatuses();
  }

  fetchSystemStatuses() {
    this.loadingChartData = true;
    this.chartInstance.showLoading();
    let fromTime: number = new Date().getUTCMilliseconds() - (3600 * 1000);
    this.appCoreDataService.getSystemStatuses(fromTime).subscribe(
      res => {
        this.statusData = res;
        this.dataTotalThreads.length = 0;
        this.dataUsedMemoryMb.length = 0;
        this.dataUsedCPU.length = 0;
        for(let data of this.statusData) {
          data.timestampDate = new Date(data.timestamp.epochMilli + this.timezoneOffset);
          this.dataTotalThreads.push(
            {
              name: data.timestampDate.toString(),
              value: [
                data.timestampDate, 
                data.totalThreads
              ]
            }
          );
          this.dataUsedMemoryMb.push(
            {
              name: data.timestampDate.toString(),
              value: [
                data.timestampDate, 
                data.memoryUsedMb
              ]
            }
          );
          this.dataUsedCPU.push(
            {
              name: data.timestampDate.toString(),
              value: [
                data.timestampDate, 
                data.cpuUsagePercent
              ]
            }
          );
        }
        this.loadingChartData = false;
        this.chartInstance.hideLoading();
      },
      err => {
        this.loadingChartData = false;
        this.chartInstance.hideLoading();
        console.error(err.error);
      }
    );
  }

  fetchLatestSystemStatus() {
    if(this.loadingChartData) {
      return;
    }
    this.appCoreDataService.getLatestSystemStatus().subscribe(
      res => {
        let sysData: SystemStatus = res;
        if(sysData.timestamp.epochMilli > this.statusData[this.statusData.length - 1].timestamp.epochMilli) {
          sysData.timestampDate = new Date(sysData.timestamp.epochMilli + this.timezoneOffset);
          this.statusData.push(sysData);
          if(this.windowEnabled) {
            while(this.dataUsedMemoryMb.length > this.windowSize) {
              this.dataUsedMemoryMb.shift();
            }
            while(this.dataTotalThreads.length > this.windowSize) {
              this.dataTotalThreads.shift();
            }
            while(this.dataUsedCPU.length > this.windowSize) {
              this.dataUsedCPU.shift();
            }
          }
          this.dataTotalThreads.push(
            {
              name: sysData.timestampDate.toString(),
              value: [
                sysData.timestampDate, 
                sysData.totalThreads]
            }
          );
          this.dataUsedMemoryMb.push(
            {
              name: sysData.timestampDate.toString(),
              value: [
                sysData.timestampDate, 
                sysData.memoryUsedMb
              ]
            }
          );
          this.dataUsedCPU.push(
            {
              name: sysData.timestampDate.toString(),
              value: [
                sysData.timestampDate, 
                sysData.cpuUsagePercent
              ]
            }
          );
          // update series data
          this.updateOptions = {
            yAxis: [
              {},
              {
                max: this.total_memory_mb
              },
              {}
            ],
            series: [
              {
                data: this.dataTotalThreads
              },
              {
                data: this.dataUsedMemoryMb
              },
              {
                data: this.dataUsedCPU
              }
            ]
          };
        }
      }
    );
  }

  refreshStatuses() {
    this.appCoreDataService.getDCPStatus().subscribe(
      res => {
        this.dcpRunning = res.running;
      },
      err => {
        console.error(err.error);
      }
    );
  }

  startDCP() {
    this.appCoreDataService.startDCP().subscribe(
      res => {
        this.openSnackBar(res.message, null);
        this.refreshStatuses();
      },
      err => {
        console.error(err.error);
      }
    );
  }

  stopDCP() {
    this.appCoreDataService.stopDCP().subscribe(
      res => {
        this.openSnackBar(res.message, null);
        this.refreshStatuses();
      },
      err => {
        console.error(err.error);
      }
    );
  }

  restartApplication() {
    if(this.restartPassword.trim().length == 0) {
      this.openSnackBar("Password is required.", null);
      return;
    }
    this.restarting = true;
    this.appCoreDataService.restartApplication(this.restartPassword).subscribe(
      res => {
        this.openSnackBar(res.message, null);
        this.lastStartTime = null;
        this.restarting = false;
      },
      err => {
        console.log(err);
        this.openSnackBar(err.error, null);
        this.restarting = false;
      }
    );
  }

  refreshMDIMSI() {
    this.refreshingMDIMSI = true;
    this.appCoreDataService.refreshMDIMSIntradayData().subscribe(
      res => {
        this.openSnackBar(res.message, null);
        this.refreshingMDIMSI = false;
      },
      err => {
        console.log(err);
        this.openSnackBar(err.error, null);
        this.refreshingMDIMSI = false;
      }
    );
  }

  refreshMDIMSC() {
    this.refreshingMDIMSC = true;
    this.appCoreDataService.refreshMDIMSClosingData().subscribe(
      res => {
        this.openSnackBar(res.message, null);
        this.refreshingMDIMSC = false;
      },
      err => {
        console.log(err);
        this.openSnackBar(err.error, null);
        this.refreshingMDIMSC = false;
      }
    );
  }

  loadBBFile() {
    this.loadingBBFile = true;
    this.appCoreDataService.loadBBFile(this.loadBBFilePath, this.loadBBSampleMinutes).subscribe(
      res => {
        this.openSnackBar(res.message, null);
        this.loadingBBFile = false;
      },
      err => {
        console.log(err);
        this.openSnackBar(err.error, null);
        this.loadingBBFile = false;
      }
    );
  }

  loadBBFWDFile() {
    this.loadingBBFile = true;
    this.appCoreDataService.loadBBFWDFile(this.loadBBFWDFilePath, this.loadBBFWDSampleMinutes).subscribe(
      res => {
        this.openSnackBar(res.message, null);
        this.loadingBBFile = false;
      },
      err => {
        console.log(err);
        this.openSnackBar(err.error, null);
        this.loadingBBFile = false;
      }
    );
  }

  refreshMetrics() {
    //unsubscribe
    if (this.autoRefreshMetricsSubscription != null && !this.autoRefreshMetricsSubscription.closed) {
      this.autoRefreshMetricsSubscription.unsubscribe();
    }
    //resubscribe
    if (this.autoRefreshMetrics && (this.autoRefreshMetricsSubscription == null || this.autoRefreshMetricsSubscription.closed)) {
      this.autoRefreshMetricsSubscription = interval(this.autoRefreshMetricsSeconds * 1000).subscribe(x => {
        if (this.autoRefreshMetrics && !this.loadingMetrics && !document.hidden) {
          this.refreshCPUMetrics();
          this.fetchLatestSystemStatus();
        }
      });
      console.log(`Refreshing metrics every ${this.autoRefreshMetricsSeconds} seconds.`);
    }
  }

  refreshCPUMetrics() {
    this.loadingMetrics = true;
    this.appCoreDataService.getCPULoad().subscribe(
      res => {
        this.cpu_usage =  Number(res.cpu_usage.toFixed(0));
        this.used_memory_mb = Number(res.used_memory_mb.toFixed(0));
        this.memory_usage = Number(res.memory_usage.toFixed(0));
        this.processors = Number(res.processors.toFixed(0));
        this.total_memory_mb = Number(res.total_memory_mb.toFixed(0));
        if(this.cpu_usage > 100) {
          this.cpu_usage = 100;
        } else if (this.cpu_usage < 0) {
          this.cpu_usage = 0;
        }
        if(this.memory_usage > 100) {
          this.memory_usage = 100;
        } else if (this.memory_usage < 0) {
          this.memory_usage = 0;
        }
        this.active_connections = res.active_connections;
        this.idle_connections = res.idle_connections;
        this.max_connections_allowed = res.max_connections_allowed;
        this.loadingMetrics = false;
      },
      err => {
        this.loadingMetrics = false;
      }
    );
  }

  generatingThreadDump: boolean = false;
  getThreadDump() {
    this.generatingThreadDump = true;
    this.openSnackBar('Generating thread dump... Please wait.', null);
    this.appCoreDataService.getThreadDump().subscribe(res => {
      const file = new window.Blob([res.threadDump], { type: 'plain/text' });
      const downloadAncher = document.createElement("a");
      downloadAncher.style.display = "none";
      const fileURL = URL.createObjectURL(file);
      downloadAncher.href = fileURL;
      downloadAncher.download = 'dot_thread_dump.txt';
      downloadAncher.click();
      this.generatingThreadDump = false;
    }, err => {
      console.error(err.error);
      this.openSnackBar('Failed to generate thread dump. Refer console / logs for more details.', null);
      this.generatingThreadDump = false;
    });
  }

  generatingHeapDump: boolean = false;
  getHeapDump(live: boolean) {
    this.generatingHeapDump = true;
    this.openSnackBar(`Generating heap dump (live?: ${live})... Please wait.`, null);
    this.appCoreDataService.getHeapDump(live).subscribe(res => {
      const file = new window.Blob([res], { type: 'plain/text' });
      const downloadAncher = document.createElement("a");
      downloadAncher.style.display = "none";
      const fileURL = URL.createObjectURL(file);
      downloadAncher.href = fileURL;
      downloadAncher.download = 'dot_heap_dump.hprof';
      downloadAncher.click();
      this.generatingHeapDump = false;
    }, err => {
      console.error(err.error);
      this.openSnackBar('Failed to generate heap dump. Refer console / logs for more details.', null);
      this.generatingHeapDump = false;
    });
  }

  performingGC: boolean = false;
  performGC() {
    this.performingGC = true;
    this.appCoreDataService.performGC().subscribe(
      res => {
        this.performingGC = false;
        this.openSnackBar('Performing garbage collection..', null);
      },
      err => {
        this.performingGC = false;
        console.error(err.error);
        this.openSnackBar('Error requesting garbage collection. Refer console / logs for more details.', null);
      }
    );
  }

  // open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
