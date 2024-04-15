import { Component, HostListener, OnInit } from '@angular/core';
// import { app_header_height } from 'src/app/app.constants';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  component_height;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - 80;
  }

  constructor() { 
    this.updateComponentSize();
  }

  ngOnInit(): void {
  }

}
