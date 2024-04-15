import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '../../../models/Models';
// import { Theme } from 'src/app/report-portal/models/Models';


@Component({
  selector: 'app-theme-card',
  templateUrl: './theme-card.component.html',
  styleUrls: ['./theme-card.component.scss']
})
export class ThemeCardComponent implements OnInit {

  @Input() theme: Theme;

  constructor() { }

  ngOnInit(): void {
  }

}
