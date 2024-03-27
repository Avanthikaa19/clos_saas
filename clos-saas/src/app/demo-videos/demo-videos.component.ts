import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-videos',
  templateUrl: './demo-videos.component.html',
  styleUrls: ['./demo-videos.component.scss']
})
export class DemoVideosComponent implements OnInit {
  component_height:any;
	@HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor() { this.updateComponentSize() }

  ngOnInit(): void {
  }

}
