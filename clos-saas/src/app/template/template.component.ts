import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  userHeaders:any=['NAME','DESCRIPTION','CREATED BY','CREATED','EDITED BY','EDIT']
  component_height:any;
  @HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor() { this.updateComponentSize() }

  ngOnInit(): void {
  }

}
