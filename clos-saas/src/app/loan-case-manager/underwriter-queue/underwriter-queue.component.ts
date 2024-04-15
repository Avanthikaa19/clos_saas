import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-underwriter-queue',
  templateUrl: './underwriter-queue.component.html',
  styleUrls: ['./underwriter-queue.component.scss']
})
export class UnderwriterQueueComponent implements OnInit {

  selectedTabIndex: any;
  constructor() { }

  ngOnInit(): void {
    this.selectedTabIndex = sessionStorage.getItem('TabIndex');
    sessionStorage.removeItem('TabIndex');
  }

}
