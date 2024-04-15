import { Component, HostListener, OnInit } from '@angular/core';
import { LoanCaseManagerServiceService } from '../service/loan-case-manager-service.service';
import { format } from './Calculator/format';
import { isOperator, Operator } from './Calculator/model';
import { rpn } from './Calculator/rpn';
import { yard } from './Calculator/yard';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  
  tokens: string[] = [];
  showResult = false;

  constructor(
    public homePageService: LoanCaseManagerServiceService
  ) { }

  ngOnInit(): void {
  }

  insertChar(character: string): void {
    const lastToken = this.lastToken;
    const doubleMin = lastToken === '-' && isOperator(this.beforeLastToken);

    if (lastToken === undefined || (isOperator(lastToken) && !doubleMin)) {
      if (character === '.') {
        character = '0' + character;
      }

      this.tokens.push(character);
    } else if (this.showResult) {
      this.tokens = [character];
    } else {
      this.tokens[this.tokens.length - 1] = lastToken + character;
    }

    this.showResult = false;
  }

  get lastToken(): string {
    return this.tokens[this.tokens.length - 1];
  }

  get beforeLastToken(): string {
    return this.tokens[this.tokens.length - 2];
  }

  get input(): string {
    if (this.showResult) {
      try {
        //return format(math.eval(this.tokens.join(' ')).toString());
        return format(rpn(yard(this.tokens)).toString());
      } catch (e) {
        return 'Invalid Calculation.'
      }
    }

    return format(this.tokens
      .slice()
      .reverse()
      .find(t => !isOperator(t)) || '0');
  }

  get formattedTokens(): string {
    return this.tokens.map(format).join(' ').replace(/\*/g, 'x') || '0';
  }

  reset(): void {
    this.tokens = [];
    this.showResult = false;
  }

  evaluate(): void {
    // repeat last action
    if (this.showResult && this.tokens.length >= 2) {
      this.tokens = this.tokens.concat(this.tokens.slice(-2));
    }

    this.showResult = true;
  }

  execOperator(operator: Operator): void {
    // ANS support
    if (this.showResult) {
      this.tokens = [rpn(yard(this.tokens)).toString()];
    }

    if (!this.lastToken && operator !== '(') {
      this.tokens.push('0');
    }

    this.tokens.push(operator);
    this.showResult = false;
  }

  // KEYBOARD SUPPORT
  // @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    // event.preventDefault();

    if (key === 'c' || key === 'backspace') {
      this.reset();
    } else if (key === ',' || key === '.') {
      this.insertChar('.');
    } else if (!isNaN(parseInt(key))) {
      this.insertChar(key);
    } else if (key === 'enter') {
      this.evaluate();
    } else if (isOperator(key)) {
      this.execOperator(key);
    }
  }

}
