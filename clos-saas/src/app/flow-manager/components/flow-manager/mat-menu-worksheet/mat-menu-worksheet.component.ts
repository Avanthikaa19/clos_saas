import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Worksheet } from '../models/models-v2';
import { FlowManagerDataService } from '../services/flow-manager-data.service';

@Component({
  selector: 'app-mat-menu-worksheet',
  templateUrl: './mat-menu-worksheet.component.html',
  styleUrls: ['./mat-menu-worksheet.component.scss']
})
export class MatMenuWorksheetComponent implements OnInit {

  @Output("parentWorksheetFun") parentWorksheetFun: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPositionWorksheet = { x: '0px', y: '0px' };

  worksheet: Worksheet = null;

  constructor(private flowManagerDataService: FlowManagerDataService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onContextMenuWorksheet(event: MouseEvent, worksheet: Worksheet) {
    this.worksheet = worksheet;
    this.contextMenuPositionWorksheet.x = event.clientX + 'px';
    console.log(this.contextMenuPositionWorksheet.x)
    this.contextMenuPositionWorksheet.y = event.clientY + 'px';
    console.log(this.contextMenuPositionWorksheet.y)
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  cloneWorksheet() {
    // this.flowManagerDataService.cloneWorksheet(this.worksheet).subscribe(
    //   res => {
    //     this.openSnackBar('Worksheet has cloned successfully!', null);
    //   }
    // );
    this.parentWorksheetFun.emit();
  }
  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


}
