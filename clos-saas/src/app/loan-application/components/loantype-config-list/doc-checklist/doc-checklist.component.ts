import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-doc-checklist',
  templateUrl: './doc-checklist.component.html',
  styleUrls: ['./doc-checklist.component.scss']
})
export class DocChecklistComponent implements OnInit {
  @Output() dataSaved = new EventEmitter<any>();
  @Input() onSaveCallback: Function;
  newData: any = {
    documentType :'',
    documentDescription:'',
    status :false
  }; 

  constructor() { }

  ngOnInit(): void {
  }

  // To save doc data
  onSaveData() {
    this.dataSaved.emit(this.newData);
    if (this.onSaveCallback) {
      this.onSaveCallback(this.newData);
    }
  }
}
