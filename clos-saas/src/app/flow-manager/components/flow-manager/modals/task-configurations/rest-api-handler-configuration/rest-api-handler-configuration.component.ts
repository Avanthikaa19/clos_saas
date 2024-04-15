import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-rest-api-handler-configuration',
  templateUrl: './rest-api-handler-configuration.component.html',
  styleUrls: ['./rest-api-handler-configuration.component.scss']
})
export class RestApiHandlerConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: RestApiHandlerConfigModel;
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }

  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  loadingStatuses: boolean = false;
  statuses: string[] = [];
  loadingFields: boolean = false;


  constructor(
    private flowManagerDataService: FlowManagerDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('REST_API_HANDLER').subscribe(
        res => {
          this.config = res;
          this.loadingFields = true;
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

}

export class RestApiHandlerConfigModel {
  task: {
    retainRequestData: boolean,
    insertBatchSize: number,
    maxThreads:number
  };
  passThrough: boolean
  preProcessingPipeline: {
    varDefinitions: [
      {
        varName: string,
        varExpirySeconds: number,
        url: string,
        urlMethod: string,
        headers: [
          {
            name: string,
            value: string
          }
        ],
        requestBody: string,
        responseValueMapping: string
      }
    ]
  }
  processingPipeline: {
    enabled:boolean,
    url: string,
    urlMethod: string,
    headers: [
      {
        name: string,
        value: string
      }
    ],
    requestBody: string,
    responseValueBurstingKey: string,
    responseValueMappings: [
      {
        responseNode: string,
        outputFieldName: string,
        outputFieldType: string
      },
      {
        responseNode: string,
        outputFieldName: string,
        outputFieldType: string
      }
    ]
  }
  postProcessingPipeline: {
    fieldMapping: {
      fieldsAre: string,
      fill: string,
      definedBy: [
        {
          name: string,
          value: string,
          formula: string,
          giveAs: string
        }
      ]
    }
  }
}
