import { Component, Input, OnInit } from '@angular/core';
import { Layout } from '../../../models/Models';
// import { Layout } from 'src/app/report-portal/models/Models';

@Component({
  selector: 'app-layout-card',
  templateUrl: './layout-card.component.html',
  styleUrls: ['./layout-card.component.scss', '../theme-card/theme-card.component.scss']
})
export class LayoutCardComponent implements OnInit {

  @Input() layout: Layout;

  @Input() showHeader: boolean;

  @Input() hoverEffect: boolean;

  constructor() { 
    if(this.showHeader === null || this.showHeader === undefined) {
      this.showHeader = true;
    }
    if(this.hoverEffect === null || this.hoverEffect === undefined) {
      this.hoverEffect = true;
    }
  }

  ngOnInit(): void {
  }

}
