import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';

@Component({
  selector: 'app-create-currency-config',
  templateUrl: './create-currency-config.component.html',
  styleUrls: ['./create-currency-config.component.scss']
})
export class CreateCurrencyConfigComponent implements OnInit {
  country: string[] = [];
  currency: string[] = [];
  searchCountry: string = '';
  searchCurrency: string = '';
  countryList: string[] = [];
  currencyList: string[] = [];
  currencyConfig: CurrencyConfiguration = new CurrencyConfiguration();
  baseRate:any;
  operator:string;
  currencySpread:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public duplicateService: DuplicateCheckingService) {
    if (data) {
      this.currencyConfig = data;
    }
  }

  ngOnInit(): void {
    this.getCountryAndCurrency();
  }

  getCountryAndCurrency() {
    this.duplicateService.getCurrencyByCountry().subscribe(
      res => {
        const uniqueCurrencies = new Set(Object.values(res));
        this.currency = Array.from(uniqueCurrencies);
        this.country = Object.keys(res);
        this.countryList = this.country;
        this.currencyList = this.currency;
        if (this.currencyConfig.country) {
          this.currencyConfig.currency = res[this.currencyConfig.country];
        }
      }
    )
  }

  onCountryFilter() {
    if (this.searchCountry) {
      const filteredCountry = this.countryList.filter(table => table.toLowerCase().includes(this.searchCountry.toLowerCase()));
      this.country = filteredCountry;
    } else {
      this.country = this.countryList;
    }
  }
  onCurrencyFilter() {
    if (this.searchCurrency) {
      const filteredCurrency = this.currencyList.filter(table => table.toLowerCase().includes(this.searchCurrency.toLowerCase()));
      this.currency = filteredCurrency;
    } else {
      this.currency = this.currencyList;
    }
  }
  saveCurrencyAndCurrency() {
    this.duplicateService.saveCurrencyAndCountry(this.currencyConfig).subscribe(res => {
      console.log(res);
    })
  }

  getCurrencyData(){
    console.log("Currency Data : ", this.duplicateService.currencyData)
    this.currencyConfig = this.duplicateService.currencyData;
  }

  calculateInterBankRate(){
    if(this.currencyConfig.operator === '+'){
      this.currencyConfig.interBankRate = Number(this.currencyConfig.baseRate) + Number(this.currencyConfig.spread);    }
    else if(this.currencyConfig.operator === '-'){
      this.currencyConfig.interBankRate = Number(this.currencyConfig.baseRate) - Number(this.currencyConfig.spread);    }
  }

  errMsg() {
    if (!this.currencyConfig.country) {
      return '* Country is a required field';
    }
    if (!this.currencyConfig.currency) {
      return '* Currency is a required field';
    }
    if (!this.currencyConfig.interBankName) {
      return '* Interbank Name is a required field';
    }
    if (!this.currencyConfig.baseRate) {
      return '* Base Rate is a required field';
    }
    if (!this.currencyConfig.interBankRate) {
      return '* Interbank Rate is a required field';
    }
    if (!this.currencyConfig.operator) {
      return '* Operator is a required field';
    }
    if (!this.currencyConfig.spread) {
      return '* Spread is a required field';
    }
    return ''
  }
}



export class CurrencyConfiguration {
  country: string;
  currency: string;
  interBankName: string;
  interBankRate: number;
  baseRate :number;
  operator :any;
  spread :number;
}
