import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit , ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DecisionFlowValueTree, flowConfigData } from '../../../../../models/DecisionFlow';
import { Datatype } from '../../../../../models/ObjectModel';
import { outputConfigure } from '../../../../../models/DecisionFlow';
import { UrlService } from '../../../../../services/http/url.service';
import { ObjectModelService } from '../../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../../services/decision-engine-id.service';
import { FlowtestService } from '../../../../../services/flowtest.service';
import { ExampleHeaderComponent } from '../../../../../components/query-variable/example-header/example-header.component';
@Component({
  selector: 'app-flowtest-config-modal',
  templateUrl: './flowtest-config-modal.component.html',
  styleUrls: ['./flowtest-config-modal.component.scss']
})
export class FlowtestConfigModalComponent implements OnInit {
  readonly ExampleHeaderComponent = ExampleHeaderComponent;
  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  startDate: any;
  endDate: any;
  selectedInputNodes: any[] = [];
  selectedOutputNodes: any[] = [];
  inputData: any[] = [];
  outputData: string[] = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private url: UrlService,
    private objectModelService: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    public dialogRef: MatDialogRef<FlowtestConfigModalComponent>,
    public flowtestService: FlowtestService,
    @Inject(MAT_DIALOG_DATA) public flowId: number
  ) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.range = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19)),
    });
  }
  @ViewChild('tree') tree:any;

// ngAfterViewInit() {
//   this.tree.treeControl.expandAll();
// }



  treeControl = new NestedTreeControl<DecisionFlowValueTree>(node => node.children);

  dataSource = new MatTreeNestedDataSource<DecisionFlowValueTree>();
  treeData: DecisionFlowValueTree[] = [];
  selectedNodeName: string = '';
  projectId: number = null as any;
  selectedNodeData: any = { "nodeName": "", "nodeType": "" }

  selectedOutput: outputConfigure[] = [];
  outputconfigData: outputConfigure[] = []
  list: string[] = ["dat", "apple"];
  params: Datatype[] = [];
  configData: any = { 'inputColumn': [], 'outputColumn': [] }
  executedDate: Date;
  master_checked: boolean = false;
  master_indeterminate: boolean = false;
  output_data: any[] = []
  hasChild = (_: number, node: DecisionFlowValueTree) => !!node.children && node.children.length > 0;

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    console.log(this.flowId)
    this.getonfigData()
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    console.log('Selected Project', this.selectedProject.selectedProjectId);
    this.projectId = this.selectedProject.selectedProjectId;
    this.getDefaultObject();
  }

  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        console.log(res);
        let children = res[0].schema;
        this.params = children;
        // console.log('Children', this.params);
        this.treeCreation(this.params)
      }
    )
  }
  selectedInputNode(nodeName: string, nodeType: string, e: any) {
    if (!e.checked) {
      let i = this.selectedInputNodes.indexOf(nodeName);
      this.selectedInputNodes.splice(i, 1);
      if (this.selectedInputNodes) {
        this.inputData = this.selectedInputNodes;
      }
    } else {
      this.selectedInputNodes.push(nodeName);
      if (this.selectedInputNodes) {
        this.inputData = this.selectedInputNodes;
      }
    }
  }
  selectedOutputNode(nodeName: string, e: any) {
    if (!e.checked) {
      this.outputconfigData.forEach(out => {
        if (out.name === nodeName) {
          let i = this.outputconfigData.indexOf(out);
          this.outputconfigData.splice(i, 1);
          console.log("remove", this.outputconfigData)

        }
      })
      if (this.selectedOutputNodes) {

        this.outputData = this.selectedOutputNodes;
      }
    } else {
      let output = new outputConfigure(nodeName, false);
      this.outputconfigData.push(output);

      this.selectedOutputNodes.push(nodeName);
      if (this.selectedOutputNodes) {
        this.outputData = this.selectedOutputNodes;
      }
    }
  }

  getonfigData() {
    this.flowtestService.getConfigByFlowId(this.flowId).subscribe(config => {
      console.log(config);
      if (config.configure_data) {
        this.inputData = config.configure_data.inputColumn;
        // console.log(this.inputData);
        this.selectedInputNodes = config.configure_data.inputColumn;
        // console.log(this.selectedInputNodes);
        this.output_data = config.configure_data.outputColumn;
        this.startDate = new Date(config.start_date);
        this.endDate = new Date(config.end_date);
        config.configure_data.outputColumn.forEach(node => {
          let output = new outputConfigure(node, true);
          this.outputconfigData.push(output);
        })
      };
    })
  }



  treeCreation(params: any) {
    console.log(params)
    let parameterName = params.name + " - " + params.type;
    console.log(parameterName)
    if (params.children) {
      console.log('Parameter Children', params.children);
      params.children.forEach((e: { paramName: string; name: string; type: string; }) => {
        console.log(e)
        e.paramName = e.name + " - " + e.type;
        console.log(e.paramName)
        console.log(e)
      }
      )
    }
    this.treeData.push(
      {
        name: parameterName,
        children: params.children,
      }
    )
    console.log(this.treeData)
    this.dataSource.data = this.treeData;
  }



  master_change() {
    for (let value of Object.values(this.outputconfigData)) {
      this.selectedOutput = []
      value.checked = this.master_checked;
      console.log(this.outputconfigData)

    }
  }
  list_change() {
    let checked_count = 0;
    //Get total checked items
    for (let value of Object.values(this.outputconfigData)) {
      if (value.checked)
        checked_count++;
    }

    if (checked_count > 0 && checked_count < this.outputconfigData.length) {
      // If some checkboxes are checked but not all; then set Indeterminate state of the master to true.
      this.master_indeterminate = true;
    } else if (checked_count == this.outputconfigData.length) {
      //If checked count is equal to total items; then check the master checkbox and also set Indeterminate state to false.
      this.master_indeterminate = false;
      this.master_checked = true;
    } else {
      //If none of the checkboxes in the list is checked then uncheck master also set Indeterminate to false.
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }

  applyConfigureData() {
    console.log(this.startDate)
    let finalOutput: any[] = []
    this.selectedOutput = this.outputconfigData.filter(output => output.checked == true)
    this.selectedOutput.forEach(output => {
      finalOutput.push(output.name)
    })
    let configData: flowConfigData = { 'inputColumn': this.inputData, 'outputColumn': finalOutput }
    let formData = new FormData();
    formData.append("configData", JSON.stringify(configData));
    console.log(this.startDate.toISOString());
    formData.append("start_date", this.startDate.toLocaleDateString('en-us',{ month: 'numeric', day: 'numeric',year: 'numeric'} ))
    formData.append("end_date", this.endDate.toLocaleDateString('en-us',{ month: 'numeric', day: 'numeric',year: 'numeric'} ))
    this.flowtestService.saveConfig(this.flowId, formData).subscribe(data => {
      console.log(data);

    })
    this.dialogRef.close(this.flowId)


  }


}
