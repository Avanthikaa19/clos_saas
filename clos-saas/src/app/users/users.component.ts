import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userHeaders:any=['USER NAME','USER ID','EMAIL','POSITION','COMPANY NAME','COUNTRY','PHONE','STATUS']

  constructor() { }

  ngOnInit(): void {
  }

}
