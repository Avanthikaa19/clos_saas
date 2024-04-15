import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-matcher-configuration',
  templateUrl: './matcher-configuration.component.html',
  styleUrls: ['./matcher-configuration.component.scss']
})
export class MatcherConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: MatcherConfigModel = new MatcherConfigModel();
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
      this.flowManagerDataService.getDefaultConfiguration('MATCHER').subscribe(
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

}

export class MatcherConfigModel {
  task: {
    inputPollingMs: number
  };
  matcher: {
    matchKeyType: string,
    matchKey: string,
    matchChildName: string,
    matchParentName: string,
    processReversals: boolean,
    processReversalsPostMatching: boolean,
    bdoneCleanup: boolean,
    matchAggregationVars: {
      fieldType: string,
      outputFieldName: string,
      inputFieldName: string
    }[],
    matchRules: {
        type: string,
        fieldType?: string,
        conditions?: string [],
        variableField?: string,
        parentField?: string,
        tolerance?: {
          if?: string,
          then?: string,
          else?: string
        },
        threshold?: {
          if?: string,
          then?: string,
          else?: string
        },
        ignoreIfKeyIs?: string,
        overridable: boolean
    }[],
    onFullMatch: {
      releaseMatchedParent: boolean,
      appendFinalAggregationValues: boolean,
      releaseMatchedChildren: boolean
    }
  };
}
