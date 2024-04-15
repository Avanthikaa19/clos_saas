import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScorecardService } from '../../services/scorecard.service';

@Component({
  selector: 'app-edit-partialscore',
  templateUrl: './edit-partialscore.component.html',
  styleUrls: ['./edit-partialscore.component.scss']
})
export class EditPartialscoreComponent implements OnInit {

  partialScore: number;

  constructor(
    public dialogRef: MatDialogRef<EditPartialscoreComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    public decision: ScorecardService
  ) { console.log('3',data);this.partialScore= data.partialValue;}

  ngOnInit(): void {
  }

  updatePartialScore (){
    this.decision.updatePartialScore(this.data.score,this.partialScore).subscribe(
      res =>{
        console.log(res);
      }
    )
  }

}
