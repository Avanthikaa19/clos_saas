import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  userHeaders:any=['NAME','DESCRIPTION','CREATED BY','CREATED','EDITED BY','EDIT']

  constructor() { }

  ngOnInit(): void {
  }

}
