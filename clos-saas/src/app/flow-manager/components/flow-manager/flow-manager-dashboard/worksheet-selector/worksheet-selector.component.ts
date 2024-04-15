import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkflowNode, WorksheetNode } from '../../models/models-v2';

@Component({
  selector: 'app-worksheet-selector',
  templateUrl: './worksheet-selector.component.html',
  styleUrls: ['./worksheet-selector.component.scss']
})
export class WorksheetSelectorComponent implements OnInit {

  search: string = '';

  @Output() selectionChanged: EventEmitter<WorkflowNode[]> = new EventEmitter<WorkflowNode[]>();
  @Output() closeRequested: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() workflows: WorkflowNode[] = [];

  filteredWorkflows: WorkflowNode[] = [];

  constructor() { }

  ngOnInit(): void {
    this.search = '';
    this.filterList();
  }

  filterList() {
    let upSearch: string = this.search.trim().toUpperCase();
    this.filteredWorkflows.length = 0;
    for (let wflow of this.workflows) {
      let addThis: boolean = false;
      if(wflow.name.trim().toUpperCase().includes(upSearch)) {
        addThis = true;
      } else {
        for (let worksheet of wflow.worksheets) {
          if(worksheet.name.trim().toUpperCase().includes(upSearch)) {
            addThis = true;
            break;
          }
        }
      }
      if(addThis) {
        this.filteredWorkflows.push(wflow);
      }
    }
  }

  onWorkflowSelectionChange(workflow: WorkflowNode, event) {
    for (let wflow of this.workflows) {
      if (wflow === workflow) {
        for (let worksheet of wflow.worksheets) {
          worksheet.selected = event.checked;
        }
      }
    }
  }

  onWorksheetSelectionChange(workflow: WorkflowNode, worksheet: WorksheetNode, event) {
    for (let wflow of this.workflows) {
      if (wflow === workflow) {
        let checkedCount: number = 0;
        for (let wsheet of wflow.worksheets) {
          if (wsheet.selected) {
            checkedCount++;
          }
        }
        let allChecked: boolean = (wflow.worksheets.length === checkedCount);
        if (allChecked) {
          wflow.someSelected = false;
          wflow.selected = true;
        } else {
          if (checkedCount > 0) {
            wflow.someSelected = true;
          } else {
            wflow.someSelected = false;
          }
          wflow.selected = false;
        }
      }
    }
  }

  apply() {
    this.selectionChanged.next(this.workflows);
  }

  ok() {
    this.selectionChanged.next(this.workflows);
    this.closeRequested.next(true);
  }

  discard() {
    for (let wflow of this.workflows) {
      wflow.selected = false;
      for (let worksheet of wflow.worksheets) {
        worksheet.selected = false;
      }
    }
    this.ok();
  }

}
