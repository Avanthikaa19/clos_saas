import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss']
})
export class TemplateDetailComponent implements OnInit
 {
  templateName: string = '';
    description: string = '';
 selectedTabIndex = 0;
 
  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
  }
  constructor() { }

  ngOnInit(): void {
   
  }

}
