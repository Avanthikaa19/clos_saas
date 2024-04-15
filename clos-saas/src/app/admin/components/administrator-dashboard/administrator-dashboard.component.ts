import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccessControlData } from 'src/app/app.access';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { DuplicateFinderComponent } from '../duplicate-finder/duplicate-finder.component';
import { AdminDashboardService } from './services/admin-dashboard.service';
@Component({
  selector: 'app-administrator-dashboard',
  templateUrl: './administrator-dashboard.component.html',
  styleUrls: ['./administrator-dashboard.component.scss']
})
export class AdministratorDashboardComponent implements OnInit {

  userGroupRoleProportion: any = null;
  approvalCount: any = null;
  // Counts
  userCount: number = 0;
  rolesCount: number = 0;
  groupsCount: number = 0;
  // Approval Status
  todayRequest: number = 0;
  todayPendingRequest: any = 0;
  overallRequest: number = 0;
  overallPendingRequest: any = 0;
  // Monthly Status
  monthlyApproval: any = null;
 pending:any
  templateCount: number;

  constructor(
    private adminDashboardService: AdminDashboardService,
    public encryptDecryptService:EncryptDecryptService,
    public ac: AccessControlData,
    public dialog: MatDialog, 
    private router: Router
  ) { 
    this.ac.items=this.encryptDecryptService.getACItemsFromSession()
    this.ac.super=this.encryptDecryptService.getACSuperFromSession();
  }


  ngOnInit(): void {
    this.getCounts();
    this.getMonthlyUserCount();
  }

  getCounts() {
    this.adminDashboardService.getCount().subscribe(
      (res) => {
        console.log(res);
        this.userCount = res.users;
        this.rolesCount = res.roles;
        this.templateCount = res.templates;
        this.getProportion();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // getApprovals() {
  //   this.adminDashboardService.getApproval().subscribe(
  //     (res) => {
  //       console.log("res",res);
  //       this.todayRequest = res.approvalPending.todayRequest;
  //       this.overallRequest = res.approvalPending.overallRequest;
  //       this.overallPendingRequest=res.approvalPending.overallPendingRequest;
  //       this.todayPendingRequest=res.approvalPending.todayPendingRequest;
  //       this.monthlyApproval = res.monthlyApproval;
  //       this.getMonthlyApprovalCount();
  //       this.getPendingStatus()
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  getProportion() {
    let pieDataCount = [];
    pieDataCount.push(
      { value: this.userCount, name: 'Users' },
      { value: this.rolesCount, name: 'Roles' },
      { value: this.templateCount, name: 'Template' }
    )
    const gaugeData = [
      {
        value:  this.userCount,
        name: 'Users',
        title: {
          offsetCenter: ['0%', '-35%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '-20%']
        }
      },
      {
        value: this.rolesCount,
        name: 'Roles',
        title: {
          offsetCenter: ['0%', '-2%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '15%']
        }
      },
      {
        value: this.templateCount,
        name: 'Access Templates',
        title: {
          offsetCenter: ['0%', '35%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '50%']
        }
      },
    ];
    // this.userGroupRoleProportion = {
    //   title: {
    //     text: ' Proportions',
    //     textStyle:{
    //       color: 'grey'
    //     },
    //   },
    //   series: [
    //     {
    //       type: 'gauge',
    //       startAngle: 90,
    //       endAngle: -270,
    //       pointer: {
    //         show: false
    //       },
    //       progress: {
    //         show: true,
    //         overlap: false,
    //         roundCap: true,
    //         clip: false,
    //         itemStyle: {
    //           borderWidth: 1,
    //           // borderColor: '#464646'
    //         }
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           width: 40
    //         }
    //       },
    //       splitLine: {
    //         show: false,
    //         distance: 0,
    //         length: 10
    //       },
    //       axisTick: {
    //         show: false
    //       },
    //       axisLabel: {
    //         show: false,
    //         distance: 50
    //       },
    //       data: gaugeData,
    //       title: {
    //         fontSize: 12
    //       },
    //       detail: {
    //         width: 30,
    //         height: 8,
    //         fontSize: 10,
    //         color: 'auto',
    //         borderColor: 'auto',
    //         borderRadius: 20,
    //         borderWidth: 1,
    //         formatter: '{value}'
    //       }
    //     }
    //   ]
    // };
    this.userGroupRoleProportion = {
      angleAxis: {
        show: false,
        max: 10
      },
      radiusAxis: {
        show: false,
        type: 'category',
        data: ['Users', 'Roles', 'Templates']
      },
      polar: {
        tooltip: {
          show: true
        }
      },
      series: [
        {
          type: 'bar',
          data: [this.userCount, this.rolesCount, this.templateCount],
          colorBy: 'data',
          roundCap: true,
          label: {
            show: true,
            // Try changing it to 'insideStart'
            position: 'start',
            formatter: '{b} : {c}'
          },
          coordinateSystem: 'polar'
        }
      ]
    };
    //   tooltip: {
    //     trigger: 'item'
    //   },
    //   legend: {
    //     orient: 'horizontal',
    //     left: 'center'
    //   },
    //   series: [
    //     {
    //       // name: 'Access From',
    //       type: 'pie',
    //       radius: ['40%', '70%'],
    //       data: pieDataCount,
    //       emphasis: {
    //         itemStyle: {
    //           shadowBlur: 10,
    //           shadowOffsetX: 0,
    //           shadowColor: 'rgba(0, 0, 0, 0.5)'
    //         }
    //       }
    //     }
    //   ]
    // };
  }


  getMonthlyUserCount() {
    this.adminDashboardService.getMonthyUserReportChart().subscribe(
          (res) => {
    // let monthName = [];
    let dataValues =[];
    // monthName = res.headers;
    dataValues = res;
    // let datas = [];
    // let colorPalette = ['#003f5c',
    //   '#2f4b7c',
    //   '#665191',
    //   '#a05195',
    //   '#d45087',
    //   '#f95d6a',
    //   '#ff7c43',
    //   '#ffa600',
    //   '#004c6d',
    //   '#255e7e',
    //   '#3d708f',
    //   '#5383a1',
    //   '#6996b3',
    //   '#7faac6',
    //   '#94bed9',
    //   '#abd2ec',
    //   '#c1e7ff'];
    // dataValues.forEach((value,index)=>{
    //   datas.push({ value: value,
    //     itemStyle: {
    //       color: colorPalette[index]
    //     }})
    // });

    this.approvalCount = {
      title: {
        text: 'Daily User-Count Stats',
        textStyle:{
          color: 'grey'
        },
      },
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: {
        type: 'time',
        // data: Object.keys(this.monthlyApproval),
        // data: monthName,
        axisLabel: {
          color: '#00'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        }
      },
      series: [
        {
          name: 'Daily User-Count Stats',
          type: 'line',
          data: dataValues,
          // barWidth: 30,
          showBackground: true,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }]
          }
        },

      ]
    };
  });
    console.log("approval",this.approvalCount)
  }

 getPendingStatus() {
   this.pending={
    title: {
      text: 'Approval Pending Status',
      textStyle:{
        color: 'grey'
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    // legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['Today',"OverAll"]
    },
    series: [
      {
        name: 'Pending Requests',
        type: 'bar',
        stack: 'total',
        barWidth:'150px',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [this.todayPendingRequest,this.overallPendingRequest]
      },
      // {
      //   name: 'OverAll ',
      //   type: 'bar',
      //   stack: 'total',
      //   label: {
      //     show: true
      //   },
      //   emphasis: {
      //     focus: 'series'
      //   },
      //   data: [this.overallPendingRequest]
      // }
    ]
  };
  console.log(this.pending)
 }

 openDialog() {
  const dialogRef = this.dialog.open(DuplicateFinderComponent, {
    width: '20%'
});

  dialogRef.afterClosed().subscribe((result: any) => {
    console.log(`Dialog result: ${result}`);
  });
  this.router.events.subscribe(() => {
    dialogRef.close();
  });
}

}
