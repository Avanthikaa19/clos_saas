import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  userHeaders:any=['ISSUED DATE','INVOICE ID','DUE DATE','AMOUNT','STATUS','DOWNLOAD']

  constructor() { }

  ngOnInit(): void {
  }

}
