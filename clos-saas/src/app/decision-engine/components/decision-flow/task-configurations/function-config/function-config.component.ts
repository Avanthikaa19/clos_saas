import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Functions } from '../../../../models/Function';
import { FunctionService } from '../../../../services/function.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-function-config',
  templateUrl: './function-config.component.html',
  styleUrls: ['./function-config.component.scss']
})
export class FunctionConfigComponent implements OnInit {

  filteredColumns: any[] = [];
searchText: string=""
  
  constructor(
    private functionService: FunctionService,

    public dialogRef: MatDialogRef<FunctionConfigComponent>,
    private selectedProject: DecisionEngineIdService,
  ) { }
  selectedFunction: number;
  onSelectFunction: Functions = null as any;
  onSelectFunctionString: string = '';
  functionsList: Functions[] = [];
loading: boolean = false;
  ngOnInit(): void {
    this.getRuleSetsList();

  }
  getRuleSetsList() {
    this.loading=true;
    this.functionService.getFunctionsList(this.selectedProject.selectedProjectId).subscribe(
      (res:any)=>{
        console.log(res);
        this.functionsList = res;
        this.filteredColumns = res;
        this.loading= false;
      },
      (err)=>{
        console.log(err);
      }
    )
  }
  selectfunction(functionData: Functions) {
    this.selectedFunction = functionData.id;
    this.onSelectFunction = functionData;
  }
  oncancelClick() {
    this.dialogRef.close();

  }

  onSelectFunctionClick() {
    this.onSelectFunctionString = JSON.stringify(this.onSelectFunction);
    this.dialogRef.close(this.onSelectFunctionString);
  }

  filterColumns(event: any) {
    console.log("Filter", event)
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.functionsList.length; i++) {
      if (this.functionsList[i].name != null) {
        if (this.functionsList[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.functionsList[i]);
        }
      }
    }
  }
  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.functionsList
  }

}
