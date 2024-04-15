import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AccessTemplate } from 'src/app/admin/components/access-templates/models/AccessTemplate';
import { AccessService } from 'src/app/admin/components/access-templates/services/access.service';
import { fadeInOut } from 'src/app/app.animations';

@Component({
  selector: 'app-group-access-details',
  templateUrl: './group-access-details.component.html',
  styleUrls: ['./group-access-details.component.scss'],
  animations: [fadeInOut]
})
export class GroupAccessDetailsComponent implements OnInit {

  //pagnation
  templateName: string='';
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  templates: AccessTemplate[] = [];
  selectedTemplates: AccessTemplate[] = [];
  defaultChecked: AccessTemplate[] = [];

  isChecked: string = '';

  constructor(
    public templateservice: AccessService,
    public dialogRef: MatDialogRef<GroupAccessDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccessTemplate[],
    private notifierService: NotifierService,
  ) {
    console.log('Data updated', data);
    this.defaultChecked = data;
  }

  ngOnInit(): void {
    this.getTemplateList();
  }

  getTemplateList() {
    this.templateservice.getAccessTemplateByName(this.templateName,this.pageNum + 1, this.pageSize).subscribe(
      res => {
        this.templates = res.data;
        this.totalPages = res.totalPages;
        this.entryCount = res.count;
        this.currentPageStart = this.pageNum + 1;
        this.currentPageEnd = ((this.pageNum + 1) * this.pageSize) > this.entryCount ? this.entryCount : ((this.pageNum + 1) * this.pageSize);
        this.resetSelectedTemplate();
      },
      err => {
        console.log(err);
      }
    )
  }

  prevPage() {
    if ((this.pageNum + 1) <= 1) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum--;
    this.getTemplateList();
  }

  nextPage() {
    if ((this.pageNum + 1) >= this.totalPages) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum++;
    this.getTemplateList();
  }

  onCheckBoxChecked(template, index) {
    if (this.selectedTemplates.includes(template)) {

    }
    else {
      if (template.isChecked) {
        this.selectedTemplates.push(template);
      } else {
        var index: any = this.selectedTemplates.findIndex(x => x.name === template.name);
        this.selectedTemplates.splice(index, 1);
      }
    }
    console.log(this.selectedTemplates);
  }

  resetSelectedTemplate() {
    console.log(this.defaultChecked);
    console.log(this.templates);
    for (let template of this.templates) {
      for (let defaultCheck of this.defaultChecked) {
        this.selectInTemplatesList(template, defaultCheck);
      }
    }
    this.selectedTemplates = this.defaultChecked;
  }

  selectInTemplatesList(template: AccessTemplate, defaultCheck: AccessTemplate): boolean {
    if (template.name == defaultCheck.name) {
      template.isChecked = true;
      return true;
    } else {
      return false;
    }
  }

  onYesClick(): void {
    console.log('Selected Template', this.selectedTemplates);
    let templateString = JSON.stringify(this.selectedTemplates);
    this.dialogRef.close(templateString);
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
