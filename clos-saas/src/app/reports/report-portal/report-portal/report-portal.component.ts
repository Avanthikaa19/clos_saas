import { Component, HostListener, OnInit } from '@angular/core';
// import { app_header_height } from 'src/app/app.constants';

@Component({
  selector: 'app-report-portal',
  templateUrl: './report-portal.component.html',
  styleUrls: ['./report-portal.component.scss']
})
export class ReportPortalComponent implements OnInit {
  component_height;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - 10;
  }

  constructor() { 
    this.updateComponentSize();
  }

  ngOnInit(): void {
  }

}
