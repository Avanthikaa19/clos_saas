import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';

@Component({
  selector: 'app-alert-assessment-mapper-configuration',
  templateUrl: './alert-assessment-mapper-configuration.component.html',
  styleUrls: ['./alert-assessment-mapper-configuration.component.scss']
})
export class AlertAssessmentMapperConfigurationComponent implements OnInit {
  //two way binding to parent component
  configValue: AlertAssesmentMapperModel = new AlertAssesmentMapperModel();
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }
  constructor(
    private flowManagerDataService: FlowManagerDataService
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('ALERT_ASSESSMENT_MAPPER').subscribe(
        res => {
          this.config = res;

        },
        err => {
          console.error(err.error);
        }
      );
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  debug() {
    console.log(this.config);
  }

  addInput() {
    this.config.assessmentMapping.mappings.push(
      {
        template: null,
        scenario: null
      }
    );
  }

  removeInput(index: number) {
    this.config.assessmentMapping.mappings.splice(index, 1);
  }
}

export class AlertAssesmentMapperModel {
  task: {
    processingWindow: number,
    maxThreads: number
  };
  assessmentMapping: {
    overwrite: boolean,
    decisionEngineJobId: string,
    mappings:
    {
      scenario: any,
      template: any
    }[];
  }
}
