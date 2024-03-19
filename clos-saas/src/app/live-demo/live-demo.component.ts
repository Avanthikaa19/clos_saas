import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-demo',
  templateUrl: './live-demo.component.html',
  styleUrls: ['./live-demo.component.scss']
})
export class LiveDemoComponent implements OnInit {
  minutes:any=['00','01','05','10','15','20','30','45','60']
  hrs:any=['01','02','03','04','05','06','07','08','09','10','11','12'];
  timeofdemo:any=['AM','PM'];
  firstname:any='';
  lastname:any='';
  companyname:any='';
  date:any='';
  hr:any='';
  min:any='';
  ampm:any='';
  email:any='';
  phn:any='';
  demovideo:boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

}
