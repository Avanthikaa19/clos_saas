import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unsecured-loan-details',
  templateUrl: './unsecured-loan-details.component.html',
  styleUrls: ['./unsecured-loan-details.component.scss']
})
export class UnsecuredLoanDetailsComponent implements OnInit {

  selectedCategory = '1';
  
  constructor( 
    public location: Location,
  ) { }

  ngOnInit(): void {
  }

  back(){
    this.location.back();
  }
}
