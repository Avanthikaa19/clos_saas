import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-xslt-processor-configuration',
  templateUrl: './xslt-processor-configuration.component.html',
  styleUrls: ['./xslt-processor-configuration.component.scss']
})
export class XSLTProcessorConfigurationComponent implements OnInit {
  //monaco editor options
  editorOptions = {
    theme: 'vs', 
    language: 'xml', 
    suggestOnTriggerCharacters: false,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    autoIndent: "full"
  };

  //two way binding to parent component
  configValue: XSLTProcessorConfigModel = new XSLTProcessorConfigModel();
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  dtdConfigs: string[] = [];
  content : string[] ;
  content1 : string[];

  //this component variables
  //none for now

  constructor(
    private flowManagerDataService: FlowManagerDataService
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('XSLT_PROCESSOR').subscribe(
        res => {
          this.config = res;
          
        },
        err => {
          console.error(err.error);
        }
      );
    }

      this.flowManagerDataService.getDTDConnectionConfigurations().subscribe(
        res => {
          this.dtdConfigs = res;
        },
        err => {
          console.log(err.error);
        }
      );
    
  }

  trackByIndex(index: number): number { 
    return index; 
  }

  debug() {
    console.log(this.config);
  }


showContent(value,decide){
  let  index =0;
  let contentArray=[];
  this.flowManagerDataService.getContent(value).subscribe(
    res =>{ 
       let resValue = ""
        for(let i=0 ;i<res.length ;i++){
          
          if(res[i] != '>'){
            resValue = resValue+ res[i];
           // console.log(resValue)
          }
          else{
            // console.log(resValue)
            contentArray[index] = resValue + '>';
            index = index + 1;
            resValue = "";
          }

        }
      // console.log(contentArray.length )
      // console.log(contentArray);
      if(decide == 'inputdata')
      this.content = contentArray;
      else{
        this.content1 = contentArray;
      }
    }
  )
}
}

export class XSLTProcessorConfigModel {
  task: {
    maxThreads:number,
    insertBatchSize: number,
    inputPollingMs: number,
  };
  passThrough : boolean;
  xml: {
    inputFieldName: string,
    inputDataDTD: string,
    xsl:string,
    outputFieldName: string,
    outputDataDTD: string
  };
}


