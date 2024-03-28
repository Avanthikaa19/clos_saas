import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  userHeaders:any=['ROLE ID','NAME','DESCRIPTION','CREATED BY','DEFAULT TEMPLATE','PHONE','EDIT']

  constructor() { }

  ngOnInit(): void {
  }

}