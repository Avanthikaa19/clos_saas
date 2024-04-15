import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { scoreCardTable, ScoreCardVariables } from '../models/scorecard-models';
import { ScorecardService } from '../services/scorecard.service';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { EditPartialscoreComponent } from './edit-partialscore/edit-partialscore.component';
import { MessagePopupComponent } from './message-popup/message-popup.component';
import { ScorecardVariablesComponent } from './scorecard-variables/scorecard-variables.component';


@Component({
  selector: 'app-scorecardview-tables',
  templateUrl: './scorecardview-tables.component.html',
  styleUrls: ['./scorecardview-tables.component.scss']
})
export class ScorecardviewTablesComponent implements OnInit {

  
  disableSave: boolean = false;
  tableList: scoreCardTable[] = [];
  scoreCardVariables: ScoreCardVariables[] = [];
  id: number = null as any;
  loading:boolean = false;
  noAccess:boolean = false;

  constructor(
    public dialog: MatDialog,
    public decisionFlowService:ScorecardService,
    private notifierService: NotifierService,
    private router: Router,
    private route: ActivatedRoute,
    public ac:AccessControlData
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
   }

  ngOnInit(): void {
    // To get the Score Card Values
    this.getScoreCard();
  } 

  // Notification Message
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  // Create Variables
  createVariables() {
    let id: any = this.id;
    sessionStorage.setItem('id',id)
    const dialogRef = this.dialog.open(ScorecardVariablesComponent,{
      data: this.id,
      height: '83%',
      width: '43%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
      setTimeout(()=> { this.getScoreCard();}, 100)
    });
  }

  // Update Score Card
  updateScoreCard() {
    this.decisionFlowService.updateScoreCard(this.id,this.tableList).subscribe(
      res => {
        history.back();
        sessionStorage.removeItem('scorecardId');
        this.showNotification('success', "Tables Saved Successfully.");
      },
      err => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  // Fetch Score Card
  getScoreCard() {
    this.loading = true;
    this.decisionFlowService.getScoreCard(this.id).subscribe(
      res => {
        this.tableList = res;
        this.scoreCardVariables = this.tableList['scorecardvariables'].reverse();
      },
      err => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
        if(err.status == 401){
          this.noAccess = true;
        }
      }
    )
  }
  
  // Back to Score Card List
  back(){
    history.back();
    sessionStorage.removeItem('scorecardId');
  }

  // Delete Bins
  deleteBins(id) {
    this.decisionFlowService.deleteBins(id).subscribe(
      res =>{
        console.log(res)
        this.showNotification('success', "Variables Deleted Successfully");
        setTimeout(()=> { this.getScoreCard();}, 3000)
      },
      err => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  // Put Values in Score Card Table
  putVariables(id,value){
    let table = {
      data:value.split(',')
    }
    this.decisionFlowService.getValues(id,table).subscribe(
      res =>{
        console.log(res);
        this.messagePopup(res)
        setTimeout(()=> { this.getScoreCard();}, 100)
      },err =>{
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  // Message Popup
  messagePopup(res) {
    const dialogRef = this.dialog.open(MessagePopupComponent, {
      width: '19%',
      data: res
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      setTimeout(()=> { this.getScoreCard();}, 3000)
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  // Delete Dialog Popup
  deleteDialog(id) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '19%',
      data: id
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      setTimeout(()=> { this.getScoreCard();}, 3000)
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  // Edit Partial Score
  editpartialScore(score,partialValue) {
   console.log('1', score)
   console.log('2', partialValue)

    const dialogRef = this.dialog.open(EditPartialscoreComponent, {
      width: '19%',
      data: {score,partialValue}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
      setTimeout(()=> { this.getScoreCard();}, 100)
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }  
}
