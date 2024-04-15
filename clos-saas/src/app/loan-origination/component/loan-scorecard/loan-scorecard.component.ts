import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from '../../service.service';
import { ScorecardDetailsComponent } from './scorecard-details/scorecard-details.component';

@Component({
  selector: 'app-loan-scorecard',
  templateUrl: './loan-scorecard.component.html',
  styleUrls: ['./loan-scorecard.component.scss']
})
export class LoanScorecardComponent implements OnInit {

  loanScoreCard: any[] = [
    {SNo: ' ', name: 'scorecard',createdDate:' ', createdBy:' ', lastUpdated:' ' , inUse: ' '}
  ];

  constructor(
    public dialog: MatDialog,
    public loanService: ServiceService
  ) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('LOAN_SCORECARD') == undefined){
      sessionStorage.setItem('LOAN_SCORECARD',JSON.stringify(this.loanScoreCard));
    }
    this.loanService.loanScoreCard = JSON.parse(sessionStorage.getItem('LOAN_SCORECARD'));
  }

  openDialog() {
    const dialogRef = this.dialog.open(ScorecardDetailsComponent, {
        width: '65%'
    });
}
}
