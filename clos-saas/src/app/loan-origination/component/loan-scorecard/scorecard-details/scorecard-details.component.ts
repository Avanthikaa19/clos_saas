import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/loan-origination/service.service';

@Component({
  selector: 'app-scorecard-details',
  templateUrl: './scorecard-details.component.html',
  styleUrls: ['./scorecard-details.component.scss']
})
export class ScorecardDetailsComponent implements OnInit {

  loanScoreCard: any[] = [
    {SNo: ' ', name: 'scorecard',createdDate:' ', createdBy:' ', lastUpdated:' ' , inUse: ' '}
  ];
  temp: any;

  constructor(
    public dialog: MatDialog,
    public loanService: ServiceService
  ) { }

  ngOnInit(): void {
    this.loanScoreCard = JSON.parse(sessionStorage.getItem('LOAN_SCORECARD'));
  }

  store(){
    for(let i=0;i<1;i++){
      this.temp = this.loanService.loanScoreCard[i]
    }
    this.loanService.loanScoreCard.push(this.temp);
    sessionStorage.setItem('LOAN_SCORECARD',JSON.stringify(this.loanService.loanScoreCard));
    this.dialog.closeAll();
  }

  close(){
    this.dialog.closeAll();
  }
}
