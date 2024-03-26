import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  userHeaders:any=['NAME','DESCRIPTION','CREATED BY','CREATED','ORIGIN ID','EDIT']

  constructor() { }

  ngOnInit(): void {
  }

}
