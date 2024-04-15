import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Variables, VariablesList } from '../../../../models/Variables';
import { DecisionFlowService } from '../../../../services/decision-flow.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-variables-config',
  templateUrl: './variables-config.component.html',
  styleUrls: ['./variables-config.component.scss']
})
export class VariablesConfigComponent implements OnInit {
  loading: boolean=false;

  constructor(private decisionflowService: DecisionFlowService, 
    public dialogRef: MatDialogRef<VariablesConfigComponent>,
    private selectedProject: DecisionEngineIdService,

    ) { }
  selectedVariable: number;
  onSelectVariable: Variables = null as any;
  onSelectVariableString: string = '';
  variableList: Variables[] = [];

  filteredColumns: Variables[] = [];
  searchText: string=""
    
  ngOnInit(): void {
    this.getVariablesList();
  }

  getVariablesList() {
    this.loading = true;
    this.decisionflowService.getVariablesList().subscribe((result:any) => {
      console.log(result);
      this.variableList = result;
      this.filteredColumns=result;
      console.log(this.variableList)
      this.loading=false;
    })
  }
  selectVariable(variable: Variables) {
    this.selectedVariable = variable.id;
    this.onSelectVariable = variable;
  }
  oncancelClick() {
    this.dialogRef.close();

  }
  filterColumns(event: any) {
    console.log("Filter", event)
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.variableList.length; i++) {
      if (this.variableList[i].name != null) {
        if (this.variableList[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.variableList[i]);
        }
      }
    }
  }
  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.variableList
  }
  onSelectVariableClick() {
    this.onSelectVariableString = JSON.stringify(this.onSelectVariable);
    this.dialogRef.close(this.onSelectVariableString);
  }
}
