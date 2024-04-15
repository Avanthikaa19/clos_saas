import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-decision-flow',
  templateUrl: './decision-flow.component.html',
  styleUrls: ['./decision-flow.component.scss']
})
export class DecisionFlowComponent implements OnInit {

  selectedComponent: boolean = true;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.selectedComponent = true;
  }

  ngOnInit(): void {
  }


  onCardClick(){
    console.log(this.router.url)
    this.selectedComponent = false;
  }

}
