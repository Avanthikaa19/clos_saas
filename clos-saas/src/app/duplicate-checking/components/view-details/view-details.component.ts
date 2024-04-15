import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { displayFields, DuplicateModel } from '../../models/models';
import { DuplicateCheckingService } from '../../services/duplicate-checking.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {

  displayData;
  fsId: any;
  mergedData: any;
  mergedData1: any;
  mergedData2: any;
  mergedData3: any;
  mergedData4: any;

  objectValues: any[];
  objedtKey: any[]
  headerList: any[] = [];
  inputHeading: any[] = []
  selectedIndex: number;
  tabIndex: any = 0;
  getData: any;
  headings: any;
  values: any;
  tabGroup: any;
  selectedTabLabel: any;
  loading: boolean = false;


  constructor(
    private duplicateService: DuplicateCheckingService,
    private route: ActivatedRoute,
    public notifierService: NotifierService,
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.fsId = params['fsId']
      console.log("fs", this.fsId)
    });
    this.getHeaderList();
  }

  getHeaderList() {
    this.duplicateService.getHeaderDetailsById().subscribe(
      res => {
        this.headerList = Object.assign([], res);
      }
    )
  }

  // addSpacesToCamelCase(str: string): string {
  //   return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  // }
  // Display Details
  // displayDetails() {
  //   this.duplicateService.viewById(this.fsId).subscribe(
  //     res => {
  //       this.displayData = res;
  //       console.log(this.displayData)

  //       this.mergedData = Object.assign([], this.displayData);
  //       this.objectValues=Object.values(this.mergedData);
  //       this.objedtKey= Object.keys(this.mergedData);

  //       const mergedDataValues = Object.values(this.mergedData);
  //       const mergedDataKeys = Object.keys(this.mergedData);

  //       const chunkSize = 116;
  //       const chunks = [];
  //       const chunks1 = [];
  //       const chunks2 = [];

  //       for (let i = 0; i < mergedDataValues.length; i += chunkSize) {
  //         chunks.push(mergedDataValues.slice(i, i + chunkSize));
  //       }

  //       for (let i = 0; i < mergedDataKeys.length; i += chunkSize) {
  //         chunks1.push(mergedDataKeys.slice(i, i + chunkSize));
  //       }

  //       const mergedData11 = [];

  //       for (let i = 0; i < chunks.length; i++) {
  //         let obj = {};
  //         for (let j = 0; j < chunks[i].length; j++) {
  //           obj[chunks1[i][j]] = chunks[i][j];
  //           for (let j = 0; j < chunks[i].length; j++) {
  //             obj[chunks1[i][j]] = chunks[i][j];
  //             if (chunks1[i][j] === "appmSex") {
  //               const sexIndex = j;
  //               if (chunks[i][sexIndex] === '0') {
  //                 obj[chunks1[i][sexIndex]] = "MALE";
  //               } else if (chunks[i][sexIndex] === '1') {
  //                 obj[chunks1[i][sexIndex]] = "FEMALE";
  //               }
  //               console.log("sdwewerwer", sexIndex);
  //             } 
  //             else if (chunks1[i][j] === "appmMatst") {
  //               const maritalStatusIndex = j;
  //               console.log("maritalStatus value:", chunks[i][maritalStatusIndex]);
  //               if (chunks[i][maritalStatusIndex] === '0') {
  //                 obj[chunks1[i][maritalStatusIndex]] = "SINGLE";
  //               } else if (chunks[i][maritalStatusIndex] === '1') {
  //                 obj[chunks1[i][maritalStatusIndex]] = "MARRIED";
  //               } else if (chunks[i][maritalStatusIndex] === '2') {
  //                 obj[chunks1[i][maritalStatusIndex]] = "DIVORCED";
  //               }
  //             }
  //             else if (chunks1[i][j] === "appmQual") {
  //               const qualificationIndex = j;
  //               console.log("qualification value:", chunks[i][qualificationIndex]);
  //               if (chunks[i][qualificationIndex] === '0') {
  //                 obj[chunks1[i][qualificationIndex]] = "High School";
  //               } else if (chunks[i][qualificationIndex] === '1') {
  //                 obj[chunks1[i][qualificationIndex]] = "College";
  //               } else if (chunks[i][qualificationIndex] === '2') {
  //                 obj[chunks1[i][qualificationIndex]] = "Some College";
  //               } else if (chunks[i][qualificationIndex] === '3') {
  //                 obj[chunks1[i][qualificationIndex]] = "Post Graduate";
  //               } else if (chunks[i][qualificationIndex] === '4') {
  //                 obj[chunks1[i][qualificationIndex]] = "Others";
  //               } else if (chunks[i][qualificationIndex] === '5') {
  //                 obj[chunks1[i][qualificationIndex]] = "Others";
  //               }
  //             }
  //           }
  //         }
  //         console.log(obj);
  //         mergedData11.push(Object.assign({}, obj));
  //         console.log("last get data",mergedData11)

  //       }

  //       for (let i = 0; i < mergedData11.length; i += chunkSize) {
  //         chunks2.push(mergedData11.slice(i, i + chunkSize));
  //       }
  //       this.mergedData = Object.fromEntries(
  //         Object.entries(chunks2[0][0]).map(([key, value]) => [this.addSpacesToCamelCase(key), value])
  //       );
  //       this.mergedData1 = Object.fromEntries(
  //         Object.entries(chunks2[0][1]).map(([key, value]) => [this.addSpacesToCamelCase(key), value])
  //       );
  //       this.mergedData2 = Object.fromEntries(
  //         Object.entries(chunks2[0][2]).map(([key, value]) => [this.addSpacesToCamelCase(key), value])
  //       );
  //       this.mergedData3 = Object.fromEntries(
  //         Object.entries(chunks2[0][3]).map(([key, value]) => [this.addSpacesToCamelCase(key), value])
  //       );

  //     },
  //     err => {
  //       this.notifierService.notify('error', 'Error: Failed to load applications');
  //     }
  //   )
  // }


  // Display Details

  displayDetails() {
    this.loading=true;
    this.duplicateService.viewDetailsById(this.fsId, this.selectedTabLabel).subscribe(
      res => {
        console.log(res)
        this.displayData = res;
        this.mergedData = Object.assign([], this.displayData);
        this.objectValues = Object.values(this.mergedData);
        this.objedtKey = Object.keys(this.mergedData);
        this.loading=false;

      })
  }

  //TAB CHANGE FUNCTION

  selectTab(event) {
    this.tabIndex = event.index;
    this.selectedTabLabel = event.tab.textLabel;
    this.displayDetails();
  }
}
