import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verifier-queue',
  templateUrl: './verifier-queue.component.html',
  styleUrls: ['./verifier-queue.component.scss']
})
export class VerifierQueueComponent implements OnInit {

  selectedTabIndex: any;
  constructor() { }

  ngOnInit(): void {
    this.selectedTabIndex = sessionStorage.getItem('TabIndex');
    sessionStorage.removeItem('TabIndex');
  }

}
