import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AccessControlData } from 'src/app/app.access';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LoanServiceService } from '../loan-processes/service/loan-service.service';

@Component({
  selector: 'app-loan-dashboard',
  templateUrl: './loan-dashboard.component.html',
  styleUrls: ['./loan-dashboard.component.scss']
})
export class LoanDashboardComponent implements OnInit {

  // SME Loan Products
  pieOption: EChartsOption;
  colorPalette = ['#343090', '#5f59f7', '#6592fd', '#44c2fd', '#8c61ff'];
  loanProducts;

  // Bar Graph
  barOption: EChartsOption;

  // Applicant Count Details
  completed: number;
  new: number;
  pending: number;
  total: number;
  amount:number;
  cardContent = [];

  // custom date
  startDate = null;
  endDate = null;
  openCustomDate: boolean = false;
  openToggle :boolean = true;
  dateValue: string='All'
  dateFormat: string;
  timer = null;
 
  constructor(    
    public ac: AccessControlData,
    public datepipe: DatePipe,
    public encryptDecryptService:EncryptDecryptService,
    private loanService: LoanServiceService
    ) { 
      this.ac.items=this.encryptDecryptService.getACItemsFromSession()
      this.ac.super=this.encryptDecryptService.getACSuperFromSession();
    }
    
  ngOnInit(): void {
    this.getAppCount();
  }

  // Applicant Count
  getAppCount() {
    let fromDate = this.datepipe.transform(this.startDate, 'dd/MM/yyyy 00:00:00');
    let toDate = this.datepipe.transform(this.endDate, 'dd/MM/yyyy 23:59:59');
    this.loanService.getAppCounts(fromDate,toDate).subscribe(
      res =>{
        this.completed = res['completedApplication']
        this.new = res['newApplication']
        this.pending = res['pendingApplication']
        this.total = res['totalApplication']
        this.amount = res['amountGranted']

        this.cardContent = [{ count: this.total, name: 'Total Applications', icon: 'Apps', bg: 'rgb(38 120 175)' },
        { count: this.new, name: 'New Applications', icon: 'Library_Add', bg: '#263e8c' },
        { count: this.pending, name: 'Pending', icon: 'Pending', bg: '#ffaf7a' },
        { count: this.completed, name: 'Completed', icon: 'Verified', bg: '#58D68D' },
        { count: '$'+this.amount, name: 'Amount of Loan Granted', icon: 'Account_Balance', bg: '#6562ab' }];
      }
    )
    this.getSMELoanProducts(fromDate,toDate);
  }

  // SME Loan Products
  getSMELoanProducts(fromDate,toDate) {
    this.loanService.getLoanProducts(fromDate,toDate).subscribe(
      res =>{
        console.log(res);
        this.loanProducts = res;
        this.pieOption = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            bottom: '0%',
            left: 'center'
          },
          series: [
            {
              name: 'SME Loan Products',
              type: 'pie',
              color: this.colorPalette,
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                formatter: `{b}: {c}%`
              },
              emphasis: {
                label: {
                  show: true,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: res[0].percentage, name: res[0].loanType },
                { value: res[1].percentage, name: res[1].loanType },
                { value: res[2].percentage, name: res[2].loanType },
                { value: res[3].percentage, name: res[3].loanType },
                { value: res[4].percentage, name: res[4].loanType },
              ]
            }
          ]
        };
      }
    )
    this.getBarGraph(fromDate,toDate);
  }

  // Bar Graph
  getBarGraph(fromDate,toDate) {
    this.loanService.getBarGraph(fromDate,toDate).subscribe(
      res=>{
        console.log(res);
         this.barOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // Use axis to trigger tooltip
              type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
          legend: {},
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
            data: ['Numbers of Application', 'Numbers of Document Upload', 'Numbers of Verifications', 'Numbers of Credit Assessment']
          },
          series: [
            {
              name: 'Pending',
              type: 'bar',
              color: 'rgb(255, 175, 122)',
              label: {
                  show: true,
                  position: 'right'
              },
              data: [res['pendingApplication'], res['documentPending'], res['verifierPending'], res['creditPending']],
            },
            {
              name: 'In Progress',
              type: 'bar',
              color: '#ffc1079e',
              label: {
                  show: true,
                  position: 'right'
              },
              data: [res['inprogressApplication'], res['documentInProgress'], res['verifierInprogress'], res['creditInprogress']]
            },
            {
              name: 'Completed',
              type: 'bar',
              color: 'rgb(88, 214, 141)',
              label: {
                  show: true,
                  position: 'right'
              },
              data: [res['completedApplication'], res['documentCompleted'], res['verifierCompleted'], res['creditCompleted']]
            }
          ]
        };
      }
    )
  }

  onKeyup(){
    clearTimeout(this.timer); 
    this.timer = setTimeout(() =>{this.getAppCount()}, 100)
  }

  // Filtering Date
  FilterDate(e){
    this.openCustomDate=false;
    this.startDate = new Date();
    this.endDate = new Date();
    switch (e.value){   
      case 'T':
        this.endDate.setDate(this.endDate.getDate());
        break;
    
      case 'YES':
        var startDate = new Date();
        this.startDate.setDate(startDate.getDate() - 1);
        this.endDate.setDate(startDate.getDate() - 1)
        break;

        case '1W':
          this.endDate = new Date();
          var start = this.endDate.getDate() - (this.endDate.getDay());
          this.startDate = new Date(this.startDate.setDate(start));
          break;               

      case '1M':
        var month = this.startDate.getMonth(); 
        var year = this.startDate.getFullYear();
        this.startDate = new Date(year, month, 1);
        this.endDate = new Date();
        break;

      case '1Y':
        var year = this.startDate.getFullYear();
        this.startDate = new Date(year, 0, 1);
        this.endDate = new Date();
        break;
                
      case 'All':
        this.startDate = null;
        this.endDate = null;
         break;
      }
      this.onKeyup();
    }

// Clear Date
clearDate(event) {
   event.stopPropagation();
   this.startDate = null;
   this.endDate = null;
   this.onKeyup();
}
}
