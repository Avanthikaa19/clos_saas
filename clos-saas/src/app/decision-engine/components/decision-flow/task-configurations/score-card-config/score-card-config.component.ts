import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Scorecard } from '../../../../models/scorecard';
import { DecisionFlowService } from '../../../../services/decision-flow.service';

@Component({
  selector: 'app-score-card-config',
  templateUrl: './score-card-config.component.html',
  styleUrls: ['./score-card-config.component.scss']
})
export class ScoreCardConfigComponent implements OnInit {

  loading: boolean = false;
  filterList: Scorecard[] = [];
  QueryVariables:Scorecard[]=[]
  selectedQueryVariable: number;
  onSelectQueryVariable: Scorecard = null as any;
  filteredColumns: any[] = [];
  searchText: string="";
  onSelectQueryVariableString: string = '';  
  
  constructor(
    private decisionFlowService:DecisionFlowService,
    public dialogRef: MatDialogRef< ScoreCardConfigComponent>,
  ) { }

  ngOnInit(): void {
    this.getTableList();
  }

   //Get List of Tables
   getTableList() {
    this.loading = true;
    this.decisionFlowService.getListOfTable().subscribe(
      res => {
        this.loading = false;
        this.QueryVariables = res;
        this.filteredColumns =res;
      }
    )
  }

  selectQueryVariable(QueryVariable: Scorecard) {
    this.selectedQueryVariable = QueryVariable.id;
    this.onSelectQueryVariable = QueryVariable;
  }

  oncancelClick() {
    this.dialogRef.close();

  }

  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.QueryVariables
  }

  filterColumns(event: any) {
    console.log("Filter", event)
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.QueryVariables.length; i++) {
      if (this.QueryVariables[i].name != null) {
        if (this.QueryVariables[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.QueryVariables[i]);
        }
      }
    }
  }

  onSelectQueryVariableClick() {
    this.onSelectQueryVariableString = JSON.stringify(this.onSelectQueryVariable);
    this.dialogRef.close(this.onSelectQueryVariableString);
  }
}
