import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ContextElement } from '../../../models/Models';
// import { ContextElement } from 'src/app/report-portal/models/Models';

@Component({
  selector: 'app-layout-context-element-card',
  templateUrl: './layout-context-element-card.component.html',
  styleUrls: ['./layout-context-element-card.component.scss']
})
export class LayoutContextElementCardComponent implements OnInit {

  @Input() element: ContextElement;
  @Output() elementChange: EventEmitter<ContextElement> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  
}
