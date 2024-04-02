import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  userHeaders:any=['ISSUED DATE','INVOICE ID','DUE DATE','AMOUNT','STATUS','DOWNLOAD']
  component_height:any;
  @HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor() { this.updateComponentSize() }

  ngOnInit(): void {
  }

}
