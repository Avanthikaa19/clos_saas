import {  Component, OnInit, Input, Output, EventEmitter,NgModule  } from '@angular/core';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';

@Component({
  selector: 'app-task-configuration-validator',
  templateUrl: './task-configuration-validator.component.html',
  styleUrls: ['./task-configuration-validator.component.scss']
})

export class TaskConfigurationValidationComponent implements OnInit {

    configValidateValue: any;
    @Output() configValidate = new EventEmitter<MouseEvent>();

    creating: boolean = false;

    @Input()
    get validate() {
      return this.configValidateValue;
    }
  
    set validate(val) {
      this.configValidateValue = val;
    }

    constructor(
       private flowManagerDataService: FlowManagerDataService,
       
    ) { }
  
    ngOnInit() {
        
    }

    validateConfig(config:any){
        this.configValidate.emit(config);
    }
  
  }