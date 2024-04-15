import { Component, OnInit, EventEmitter, Output, Input, SecurityContext, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fadeInOut } from 'src/app/app.animations';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-mail-sender-configuration',
  templateUrl: './mail-sender-configuration.component.html',
  styleUrls: ['./mail-sender-configuration.component.scss'],
  animations: [fadeInOut]
})
export class MailSenderConfigurationComponent implements OnInit, AfterViewInit {
  //monaco editor options
  editorOptions = {
    theme: 'vs', 
    language: 'html', 
    suggestOnTriggerCharacters: false,
    roundedSelection: true,
	  scrollBeyondLastLine: false,
    autoIndent: "full"
  };

  // options1: any = { minLines: 1, maxLines: 5000, printMargin: false, useWorker: false };
  // options2: any = { minLines: 10, maxLines: 5000, printMargin: false, useWorker: false };
  //two way binding to parent component
  configValue: MailSender;
  @Output() configChange = new EventEmitter<any>();
  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  preview: boolean = true;
  loading: boolean = true;

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('MAIL_SENDER').subscribe(
        res => {
          // console.log(res.connection.acknowledgeMode)
          this.config = res;
          this.config.message.content = this.sanitizer.sanitize(SecurityContext.HTML, this.config.message.content)
          console.log(this.config);
        },
        err => {
          console.error(err.error);
        }
      );
    }
  }
  ngAfterViewInit(): void {
    //temporary fix to show monaco editors on load
    //TODO
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
  trackByIndex(index: number): number {
    return index;
  }

  debug() {
    console.log(this.config);
  }

}
export class MailSender {
  passThrough: boolean;
  task: {
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number
  };
  includeSystemProperties: boolean;
  properties: {
    name: string,
    type: string,
    enabled: boolean,
    value: string
  }[];
  addresses: {
    to: string[],
    cc: string[],
    bcc: string[]
  };
  message: {
    subject: string,
    content: string,
    attachments: string[]
  };
}