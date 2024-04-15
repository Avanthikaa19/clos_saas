import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {

  
  loanOrigination: any[] = [
    {step: '01', name: 'PERSONAL INFORMATION',abbr:'PI', description:'', icon:'person' , route: 'personal'},
    {step: '02', name: 'WORK AND FINANCES',abbr:'WAF', description:'', icon:'work' , route: 'workandfinance'},
    {step: '03', name: 'ADDITIONAL INFORMATION',abbr:'AI', description:'', icon:'library_add' , route: 'additional'},
  ];
  loanProcess: any[]=[];
  isExpanded : boolean = false;

  ngOnInit(): void {
  }

}
