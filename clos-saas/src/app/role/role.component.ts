import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  userHeaders:any=['NAME','DESCRIPTION','CREATED BY','CREATED','ORIGIN ID','EDIT']
  component_height:any;
  @HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor() { this.updateComponentSize() }

  ngOnInit(): void {
  }

}
