import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Workflow } from '../models/models-v2';
import { FlowManagerDataService } from '../services/flow-manager-data.service';

@Component({
  selector: 'app-mat-menu-workflow',
  templateUrl: './mat-menu-workflow.component.html',
  styleUrls: ['./mat-menu-workflow.component.scss']
})
export class MatMenuWorkflowComponent implements OnInit {

  @Output("parentWorkflowFun") parentWorkflowFun: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPositionWorkflow = { x: '0px', y: '0px' };

  workflow: Workflow = null;


  constructor(
    private flowManagerDataService: FlowManagerDataService,
    private snackBar: MatSnackBar
  ) {

  }


  ngOnInit(): void {
    // console.log('Component Works')
  }

  onContextMenuWorkFlow(event: MouseEvent, workflow: Workflow) {
    this.workflow = workflow;
    this.contextMenuPositionWorkflow.x = event.clientX + 'px';
    this.contextMenuPositionWorkflow.y = event.clientY + 'px';
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  cloneWorkflow() { 
    // console.log(this.workflow);
    // this.flowManagerDataService.cloneWorflow(this.workflow).subscribe(
    //   res => {
    //     this.openSnackBar('Workflow has cloned successfully!', null);
    //   }
    // );
    this.parentWorkflowFun.emit();
  }
  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
