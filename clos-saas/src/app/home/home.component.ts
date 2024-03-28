import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  component_height:any;
	@HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor() { this.updateComponentSize() }
  ngOnInit(): void {
  }
  endtoend:boolean=false;
  openchat:boolean=false;

}
