import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  component_height:any;
  logoutconfirm:boolean=false;
	@HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor() {this.updateComponentSize() }

  ngOnInit(): void {
  }

}
