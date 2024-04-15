import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RuleSet } from '../../../../models/RuleEngine';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { RuleEngineService } from '../../../../services/rule-engine.service';

@Component({
  selector: 'app-rule-engine-config',
  templateUrl: './rule-engine-config.component.html',
  styleUrls: ['./rule-engine-config.component.scss']
})
export class RuleEngineConfigComponent implements OnInit {

  constructor(
    private ruleEngineService: RuleEngineService,
    public dialogRef: MatDialogRef<RuleEngineConfigComponent>,
    private selectedProject: DecisionEngineIdService,
  ) { }

  selectedRuleSet: number;
  onSelectRuleSet: RuleSet = null as any;
  onSelectRuleSetString: string = '';
  ruleSetList: any[] = [];
loading: boolean = false;
filteredColumns: any[] = [];
searchText: string=""
  
  ngOnInit(): void {
    this.getRuleSetsList();
  }

  getRuleSetsList() {
    this.loading=true;
    this.ruleEngineService.getRuleSetList(this.selectedProject.selectedProjectId).subscribe(
      (res)=>{
        console.log(res);
        this.ruleSetList = res;
        this.filteredColumns=res;
        this.loading=false
      },
      (err)=>{
        console.log(err);
      }
    )
  }
  selectRuleSet(RuleSet: RuleSet) {
    this.selectedRuleSet = RuleSet.id;
    this.onSelectRuleSet = RuleSet;
  }
  oncancelClick() {
    this.dialogRef.close();

  }

  onSelectRuleSetClick() {
    this.onSelectRuleSetString = JSON.stringify(this.onSelectRuleSet);
    this.dialogRef.close(this.onSelectRuleSetString);
  }

  filterColumns(event: any) {
    console.log("Filter", event)
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.ruleSetList.length; i++) {
      if (this.ruleSetList[i].name != null) {
        if (this.ruleSetList[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.ruleSetList[i]);
        }
      }
    }
  }
  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.ruleSetList
  }

}
