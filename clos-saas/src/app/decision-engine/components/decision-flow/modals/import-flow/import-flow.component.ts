import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DecisionFlow, Scenario } from 'src/app/decision-engine/models/DecisionFlow';
import { CsvuploadService } from 'src/app/decision-engine/services/csvupload.service';
import { DecisionFlowService } from 'src/app/decision-engine/services/decision-flow.service';
import { ProjectIdService } from '../../../query-variable/services/project-id.service';

@Component({
  selector: 'app-import-flow',
  templateUrl: './import-flow.component.html',
  styleUrls: ['./import-flow.component.scss']
})
export class ImportFlowComponent implements OnInit {
  loading: boolean = false;
  scenarios: Scenario[] = []
  uploading: boolean = false;
  file: File = null as any;
  Extension1 = RegExp("^.*\.(json)$");
  fileError: any;
  fileExtStats: boolean = false;
  loading_file: boolean = false;
  fileStatus: any;
  filepath: any;
  flowList: DecisionFlow[] = [];
  decisionFlow: DecisionFlow = new DecisionFlow();
  flowData: DecisionFlow = null as any;
  constructor(
    private decisionService: DecisionFlowService,
    private csvuploadService: CsvuploadService,
    private decisionFlowService: DecisionFlowService,
    public dialogRef: MatDialogRef<ImportFlowComponent>,
    private notifierService: NotifierService,
    private selectedProject: ProjectIdService,
    @Inject(MAT_DIALOG_DATA) public serviceId: any
  ) { }

  ngOnInit(): void {
    // this.getScenariosList()
     this.getFlowList()
  }
  getScenariosList() {
    this.decisionService.getScenariosList().subscribe(
      res => {
        this.scenarios = res
      }
    )
  }

  getFlowList() {
    this.decisionFlowService.getListFlows().subscribe(
      res => {
        this.flowList = res
      }
    )
  }

  handleFileInput(event: any) {
    this.uploading = true;
    this.file = event.target.files[0];
    if (!this.Extension1.test(this.file.name)) {
      this.fileExtStats = true
      throw new Error("Unsupported file types")
    }
    this.loading_file = !this.loading_file;
    this.decisionFlow.name = this.file.name;
    this.decisionFlow.name = this.decisionFlow.name.replace('.json', '')
  }

  importFlowConfig() {
    let filterFlow = this.flowList.filter(flow => flow.name == this.decisionFlow.name)
    if (filterFlow.length > 0) {
      this.showNotification('error', 'Flow Name already exists.')
    }
    else {
      let formData = new FormData();
      formData.append('name', this.decisionFlow.name);
      formData.append('path', this.file);
      // formData.append('scenario', String(this.decisionFlow.scenario));
      console.log(this.decisionFlow.scenario)
      this.decisionService.importDecisionFlow(formData).subscribe(
        res => {
          this.flowData = res;
          this.showNotification('success', 'Created Successfully.')
          let stringData = JSON.stringify(this.flowData);
          // this.dialogRef.close(res);      
          this.onCloseClick();
        },
        (err) => {
          this.showNotification('error', 'Oops! Something Went Wrong.')
        }
      )
    }
  }
  onCloseClick() {
    this.dialogRef.close();
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  errMsg(): any {
    if (!this.decisionFlow.name) {
      return '* Name is a required field'
    }
    // if (!this.decisionFlow.scenario) {
    //   return '* Scenario is a required field'
    // }
    return '';
  }

}
