import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QueryVariable } from '../../../../models/QueryVariable';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { QueryvariableService } from '../../../../services/queryvariable.service';

@Component({
  selector: 'app-query-variable-config',
  templateUrl: './query-variable-config.component.html',
  styleUrls: ['./query-variable-config.component.scss']
})
export class QueryVariableConfigComponent implements OnInit {
  filteredColumns: any[] = [];
  searchText: string=""
  constructor(   
    private QueryVariableService: QueryvariableService,
    public dialogRef: MatDialogRef<QueryVariableConfigComponent>,
    private selectedProject: DecisionEngineIdService,) { }
  
 
    QueryVariables:QueryVariable[]=[]
    selectedQueryVariable: number;
    onSelectQueryVariable: QueryVariable = null as any;
    onSelectQueryVariableString: string = '';  
    loading: boolean = false;
  ngOnInit(): void {
    this.getQueryVariablesList();
  }

  getQueryVariablesList() {
    this.loading=true;
    this.QueryVariableService.getQueryList(this.selectedProject.selectedProjectId).subscribe(
      (res)=>{
        console.log(res);
        this.QueryVariables = res;
        this.filteredColumns =res;
        this.loading = false
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }
  selectQueryVariable(QueryVariable: QueryVariable) {
    this.selectedQueryVariable = QueryVariable.id;
    this.onSelectQueryVariable = QueryVariable;
  }
  oncancelClick() {
    this.dialogRef.close();

  }

  onSelectQueryVariableClick() {
    this.onSelectQueryVariableString = JSON.stringify(this.onSelectQueryVariable);
    this.dialogRef.close(this.onSelectQueryVariableString);
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
  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.QueryVariables
  }

}
