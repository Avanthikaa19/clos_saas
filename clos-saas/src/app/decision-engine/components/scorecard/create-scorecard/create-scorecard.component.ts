import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Scorecard } from '../models/scorecard-models';
import { ScorecardService } from '../services/scorecard.service';

@Component({
  selector: 'app-create-scorecard',
  templateUrl: './create-scorecard.component.html',
  styleUrls: ['./create-scorecard.component.scss']
})
export class CreateScorecardComponent implements OnInit {
  tableDetails: Scorecard = new Scorecard();
  public dialogRef: MatDialogRef<CreateScorecardComponent>
  constructor(
    private decisionFlowService:ScorecardService,
  ) { }

  ngOnInit(): void {
  }

  createTableList() {
    this.decisionFlowService.createScorecard(this.tableDetails).subscribe(
      res => {
        console.log(res);
      }
    )
  }



}
