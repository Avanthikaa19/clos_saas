import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(
    public router:Router
  ) { this.updateComponentSize() }

  ngOnInit(): void {
  }
  navigateToPage(param){
    this.router.navigate([`${param}`])
  }

}
