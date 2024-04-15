import { Component, HostListener, OnInit } from '@angular/core';
// import { UrlService } from 'src/app/services/http/url.service';
import { ReportPortalDataService } from '../services/report-portal-data.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { HttpClient, HttpEventType } from "@angular/common/http";
// import { app_header_height } from 'src/app/app.constants';
import { Router } from '@angular/router';
import { Report, ReportFolder } from '../models/Models';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-report-generate',
  templateUrl: './report-generate.component.html',
  styleUrls: ['./report-generate.component.scss'],
  animations: [ fadeInOut ]
})
export class ReportGenerateComponent implements OnInit {

  private _value: number = 0;
  enable: boolean = true;
  title: string = '';
  component_height;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - 10;
  }

  get value() {
    return this._value;
  }
  set value(value: number) {
    if (!isNaN(value) && value <= 100) {
      this._value = value;
    }
  }

  loadingFolders: boolean = false;
  folderSearch: string;
  reportFolders: ReportFolder[];
  dateFrom: string = '';
  dateTill: string = '';
  timeFrom: string = '';
  timeTill: string = '';
  
  //tree
  private _transformer = (node: ReportFolder, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      // path: node.path,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  //list of reports
  loadingItems: boolean = false;
  reports: Report[] = [];

  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalRecords: number = 1;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  nameSearch: string = '';

  selectedFolder: string = '';

  //selected report
  selectedReport: Report;

  //generation
  generatingReport: boolean = false;

  formats: string[] = ["xlsx","csv","pdf"];
  selectedFormat; string = '';

  constructor(
    // private url: UrlService,
    private reportPortalDataService: ReportPortalDataService,
    private http: HttpClient,
    private route: Router,
    private notifierService: NotifierService
  ) { }

  // public updateUrl(): Promise<Object> {
  //   return this.url.getUrl().toPromise();
  // }

  async ngOnInit() {
    // let response = await this.updateUrl();
    // UrlService.API_URL = response.toString();
    // if (UrlService.API_URL.trim().length == 0) {
    //   console.warn('FALLING BACK TO ALTERNATE API URL.');
    //   UrlService.API_URL = UrlService.FALLBACK_API_URL;
    // }
    //INIT COMPONENT
    this.getFolders();
    this.refreshItems();
  }

  getFolders() {
    if(!this.folderSearch) {
      this.selectedFolder = null;
      this.refreshItems(true);
    }
    this.loadingFolders = true;
    this.reportFolders = null;
    this.reportPortalDataService.getFoldersByName(this.folderSearch ? this.folderSearch : ' ').subscribe(
      res => {
        //loop through all folders
        for (let i = 0; i < res.length; i++) {
          if (!res[i]) {
            res[i] = 'Default';
          }
        }
        let result: ReportFolder[] = [];
        let level = { result };
        res.forEach(path => {
          path.split('.').reduce((r, name, i, a) => {
            if (!r[name]) {
              r[name] = { result: [] };
              r.result.push({ name, path, children: r[name].result })
            }
            return r[name];
          }, level)
        });
        this.reportFolders = result;
        //mat tree datasource init
        this.dataSource.data = this.reportFolders;
        this.filterChanged(this.folderSearch);
        this.loadingFolders = false;
      },
      err => {
        console.error(err);
        this.loadingFolders = false;
      }
    );
  }

  dummyRpt: Report = new Report();
  selectReport(rpt: Report, event?) {
    if(event) {
      event.stopPropagation();
    }
    console.log('Report',rpt);
    this.selectedReport = JSON.parse(JSON.stringify(rpt));
    console.log('Selected Report Parameters', this.selectedReport.parameters);
    this.selectedReport.generateOnServer = true;
    this.selectedReport.defaultFormat = this.selectedReport.outputFormat;
  }

  clearSelection(event?) {
    if(event) {
      event.stopPropagation();
    }
    this.selectedReport = null;
  }

  refreshItems(resetPage?: boolean) {
    if(resetPage) {
      this.currentPage = 1;
    }
    this.loadingItems = true;
    this.reports = [];
    console.log('Selected Folder', this.selectedFolder);
    if(this.selectedFolder) {
      this.reportPortalDataService.getAllReportsByPageAndNameAndFolders(this.pageSize, this.currentPage-1, { name: this.nameSearch ? this.nameSearch : ' ', folders: [this.selectedFolder]}).subscribe(
        res => {
          this.loadingItems = false;
          this.totalRecords = res.records;
          this.totalPages = res.totalPages;
          this.reports = res.content;
  
          //compute page vars
          this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
          this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
  
          this.showNotification('default', this.reports.length ? 'Loaded ' + this.reports.length + ' reports under folder ' + this.selectedFolder + '.' : 'No reports found.');
        },
        err => {
          this.loadingItems = false;
          console.error(err.error);
        }
      );
    } else {
      this.reportPortalDataService.getAllReportsByPageAndName(this.pageSize, this.currentPage-1, this.nameSearch ? this.nameSearch : ' ').subscribe(
        res => {
          this.loadingItems = false;
          this.totalRecords = res.records;
          this.totalPages = res.totalPages;
          this.reports = res.content;
  
          //compute page vars
          this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
          this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
  
          this.showNotification('default', this.reports.length ? 'Loaded ' + this.reports.length + ' reports.' : 'No reports found.');
        },
        err => {
          this.loadingItems = false;
          console.error(err.error);
        }
      );
    }
  }

  prevPage() {
    if(this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.refreshItems();
  }

  nextPage() {
    if(this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.refreshItems();
  }

  generateSelectedReport(overrideFormat?: string) {
    this.showNotification('default', 'Generating report..');
    this.generatingReport = true;
    let finalFormat: string = overrideFormat ? overrideFormat : this.selectedReport.outputFormat;
    // this.selectedReport.parameters[0].formulaValue = this.dateFrom + ' 00:00:00';
    // this.selectedReport.parameters[1].formulaValue = this.dateTill + ' 00:00:00';
    console.log('Selected Report', this.selectedReport ,  'Selected Parameter', this.selectedReport.parameters)
    if(this.selectedReport && this.selectedReport.parameters.length != 0){
      this.selectedReport.parameters[0].formulaValue = this.dateFrom + ' ' + (this.timeFrom ? this.timeFrom : '00:00:00');
      this.selectedReport.parameters[1].formulaValue = this.dateTill + ' ' + (this.timeTill ? this.timeTill : '00:00:00');
    }
    this.reportPortalDataService.fillReport(this.selectedReport.id, finalFormat, this.selectedReport.parameters).subscribe(
      res => {
        let fileId:number = res['id'];
        let fileName:string = res['fileName'];
        this.generatingReport = false;
        this.showNotification('success', 'Report download will start soon..');
          this.reportPortalDataService.getReportFile(fileId).subscribe(
            (response: any) => {
              let dataType = response.type;
              let binaryData = [];
              binaryData.push(response);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
              downloadLink.setAttribute('download', fileName);
              document.body.appendChild(downloadLink);
              downloadLink.click();
              this.showNotification('success', 'Report download has started.');
            },
            err => {
              console.error(err);
              this.showNotification('error', 'There was a problem generating this report. Refer console for more details.');
            }
          );
        },
      err => {
        this.generatingReport = false;
        console.error(err);
        this.showNotification('error', 'There was a problem generating this report. Refer console for more details.');
      }
    ); 
  }

  startTime: any;
  endTime: any;
  currTime: any;
  prevTime: any;
  speed: number = 0;
  bytesReceied: number = 0;
  oldbytes: number = 0;
  unit: string = "Mbps";
  time: any;

  download() {
    let download = { "date": "20210106", "path": null, "reportName": "Report for Reconciliation and Discrepancy IntraDay", "reportFormat": ".xlsx", "isRecalculate": false }
    this.reportPortalDataService.downloadReconReport(download).subscribe(
      (event) => {
        if (event.type === HttpEventType.DownloadProgress) {

          //tracking percent received and how much time has passed
          this.value = Math.round((100 * event.loaded) / event.total);
          this.currTime = new Date().getTime();

          //setting start time
          if (this.value === 0) {
            this.startTime = new Date().getTime();
            this.prevTime = this.startTime;
          }

          //tracking how much data is received
          this.bytesReceied = event.loaded / 1000000;

          //calculating download speed per percent data received
          this.speed =
            (this.bytesReceied - this.oldbytes) /
            ((this.currTime - this.prevTime) / 1000);
          if (this.speed < 1) {
            this.unit = "Kbps";
            this.speed *= 1000;
          } else this.unit = "Mbps";

          this.time = (event.total - event.loaded) / (event.loaded / (this.currTime - this.prevTime) / 1000);

          //updating previous values
          this.prevTime = this.currTime;
          this.oldbytes = this.bytesReceied;


          //calculating avg download speed
          if (this.value === 100) {
            this.endTime = new Date().getTime();
            let duration = (this.endTime - this.startTime) / 1000;
            let mbps = event.total / duration / 1000000;
            if (mbps < 1) {
              this.speed = event.total / duration / 1000;
              this.unit = "Kbps";
            } else {
              this.speed = mbps;
              this.unit = "Mbps";
            }
            this.time = (event.total - event.loaded) / mbps;
          }

          console.log(this.speed, this.unit, this.value, this.time);

        }
        //download file
        else if (event['body']) {
          var blob = new Blob([event['body']], { type: 'application/xlsx' });
          console.log(event, blob);
          var url = window.URL.createObjectURL(blob);
          var anchor = document.createElement("a");
          anchor.download = `Export.xlsx`;
          anchor.href = event['body'];
          anchor.click();
        }
      })
  }

  filterChanged(filterText: string) {
    // this.treeControl.collapseAll();
    // if (filterText && filterText.length > 0) {
    //   this.dataSource.data.forEach((node, item) => {
    //     if (node.name.toLowerCase().includes(filterText.toLowerCase())) {
    //       let dataNodeIndex = this.findIndex(node.name);
    //       this.treeControl.expand(this.treeControl.dataNodes[dataNodeIndex]);
    //     } else if (node.children) {
    //       this.childExpand(node, filterText);
    //     }
    //   })
    // }

  }

  findIndex(nodeName) {
    let Index = this.treeControl.dataNodes.findIndex(element => element.name.toLowerCase().includes(nodeName.toLowerCase()));
    return Index;
  }

  childExpand(node, filterText) {
    // If children match the searched string
    if (node.children && node.children.find(element => element.name.toLowerCase().includes(filterText.toLowerCase()))) {
      let dataNodeIndex = this.findIndex(node.name);
      this.treeControl.expand(this.treeControl.dataNodes[dataNodeIndex]);
      return dataNodeIndex;
    } else if (node.children && node.children.find(c => c.children)) {
      // else use recurssive to find any children of children matches are there
      node.children.forEach((item) => {
        let childIndex = this.childExpand(item, filterText);
        if (childIndex >= 0) {
          let dataNodeIndex = this.findIndex(node.name);
          this.treeControl.expand(this.treeControl.dataNodes[dataNodeIndex]);
        }
      })
    }
    return null;
  }

  isNan(data) {
    return !isNaN(data);
  }

  selectNode(node?) {
    if(node) {
      console.log('Node', node);
      this.selectedFolder = node.name;
      console.log('Selected Folder 2', this.selectedFolder);
      this.refreshItems(true);
    } else {
      if(this.selectedFolder) {
        this.clearSelection();
        this.selectedFolder = null;
        this.refreshItems(true);
      }
    }
  }

  goBack() {
    this.route.navigate(['/reports/home']);
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
