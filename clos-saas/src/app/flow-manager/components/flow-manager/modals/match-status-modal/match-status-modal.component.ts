import { Component, OnInit, Input } from '@angular/core';
import { MatchStatus } from '../../models/models-v2';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-match-status-modal',
  templateUrl: './match-status-modal.component.html',
  styleUrls: ['./match-status-modal.component.scss'],
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
export class MatchStatusModalComponent implements OnInit {
  @Input()
  get taskId() {
    return this.tId;
  }
  set taskId(val) {
    this.tId = val;
  }
  matchStatus: MatchStatus[] = [];
  loading: boolean = false;
  tId: number;
  matched: string = 'N';
  listData: string[] = [];
  constructor(private flowManagerDataService: FlowManagerDataService) { }

  ngOnInit(): void {
    this.refreshStatus();
    console.log(this.taskId);
  }
  refreshStatus() {
    this.loading = true;
    console.log(this.taskId);
    this.flowManagerDataService.getMatchStatus(this.taskId, this.matched).subscribe(
      res => {
        this.matchStatus = res;
        console.log(this.matchStatus);
        for(let array of this.matchStatus){
          console.log(array.contributorKeys)
          let x = array.contributorKeys.split(";");
          this.listData = x
          console.log(this.listData)
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.loading = false;
      }
    );
  }
 }


