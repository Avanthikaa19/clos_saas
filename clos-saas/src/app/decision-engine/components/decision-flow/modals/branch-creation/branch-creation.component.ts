import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DecisionFlowBranch } from '../../../../models/DecisionFlow';
import { ObjectModelService } from '../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { Datatype } from '../../../../models/ObjectModel';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-branch-creation',
  templateUrl: './branch-creation.component.html',
  styleUrls: ['./branch-creation.component.scss']
})
export class BranchCreationComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<BranchCreationComponent>,
    private objectModelService: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.projectId = this.selectedProject.selectedProjectId;
    this.getDefaultObject()
  }
  projectId: number = null as any;
  params: Datatype[] = [];

  flowParams: DecisionFlowBranch[] = [
    {
      "branchIndex": "Branch",
      "parameterType": "",
    },
    {
      "branchIndex": "Branch",
      "parameterType": "",
    },
  ];

  //FOR ADD PARAMETERS FOR CREATING BRANCHES
  addParameter() {
    this.flowParams.push({
      "branchIndex": "Branch",
      "parameterType": "",
    })
  }

  //API CALL TO GET DEFAULT OBJECTMODEL DATA USING SELECTED PROJECT ID
  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        let children = res[0].schema.children;
        this.params = children;
        
      },
    )
  }
//CLOSE POPUP WITH SELECTED PARAMETERS
  createBranch() {
    console.log(this.flowParams)
    this.dialogRef.close(this.flowParams)
  }
//FOR NOTIFIICATION SNACKBAR
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
