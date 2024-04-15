import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { elementAt, Observable } from 'rxjs';
import { DecisionTablesList, Cell, Header, Row } from '../../../models/DecisionTables';
import { ObjectModelFieldDetail, Datatype } from '../../../models/ObjectModel';
import { ComponentCanDeactivate } from '../../../deactivate/component-can-deactivate';
import { DecisionTablesService } from '../../../services/decision-tables.service';
import { UrlService } from '../../../services/http/url.service';
import { ObjectModelService } from '../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { EditTableCellsComponent } from '../modals/edit-table-cells/edit-table-cells.component';
import { TableValueComponent } from '../modals/table-value/table-value.component';
import { AccessControlData } from 'src/app/app.access';

@Component({
  selector: 'app-view-tables',
  templateUrl: './view-tables.component.html',
  styleUrls: ['./view-tables.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => active', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ViewTablesComponent implements OnInit, ComponentCanDeactivate {
  tableDataById: DecisionTablesList = null as any;
  objectModelSchemaId: ObjectModelFieldDetail[] = [];
  all_checked: boolean = false;
  conditionList: any[] = []
  actionList: any[] = []
  data: number = null as any;
  projectId: number = null as any;
  tableParameters: Datatype = new Datatype('', '', '', null);
  params: Datatype[] = [];
  selectedCellData: any[] = [];
  selectedRow: any = null as any;
  selectedHeader: any = null as any;
  selectedColumn: number;
  filterList: Cell[] = null as any
  // datatypes: string[] = ['string', 'integer', 'boolean']
  tableValues: string[] = [];
  rowArray: any[] = [];
  selectedIndex: number;
  loading: boolean = false;
  disableSave: boolean = false;
  isDirty: boolean = false;
  selected: number;
  selectedhead: number;
  unselectrow: boolean = false;
  unselectcolumn: boolean = false;
  noAccess:boolean  = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private url: UrlService,
    public decisionTableService: DecisionTablesService,
    public dialog: MatDialog,
    private objectModelService: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    public ac: AccessControlData
  ) {
  }
  canDeactivate(): boolean {
    return !this.isDirty
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.data = Number(this.route.snapshot.paramMap.get("id"));
    this.projectId = this.selectedProject.selectedProjectId;
    this.getDecisionTableById();
    this.getDefaultObject();
  }

  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/decisionTableList'
    this.router.navigateByUrl(viewUrl)
  }

  getDecisionTableById() {
    this.decisionTableService.getDecisionTableById(this.data).subscribe(
      res => {
        // this.conditionList = []
        // this.actionList = []
        let cells: Cell[] = []
        this.tableDataById = res;
        this.loading = true;
        this.tableDataById.rows.forEach(row => {
          this.tableDataById.cells.forEach(cell => {
            if (cell.row_order == row.sequence_order) {
              cells.push(cell)
              row.cells = cells
            }
            if (cell.data_type == 'integer' && cell.custom_operand) {
              cell.custom_operand = cell.custom_operand.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            }
          })

        });
        this.tableDataById.headers.forEach((e) => {
          this.tableDataById.cells.forEach((ele) => {
            if (ele.header['id'] == e.id) {
              ele.data_type = e.object_model[0].type
            }
          })
        })

      }
    )
  }


  updateDecisionTable() {
    this.tableDataById.created_by = "Admin"
    this.decisionTableService.updateDecisionTableById(this.tableDataById.id, this.tableDataById).subscribe(
      res => {
        this.tableDataById = res;
      }
    )
  }



  selectedCell(cellData: any[]) {
    this.selectedCellData = cellData;
  }

  removeRow() {
    this.tableDataById.rows.pop();
  }

  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        if(res[0]){
        let children = res[0].schema.children;
        this.params = children;
        }
      }
    )
  }


  saveDecisionTableById() {
    this.isDirty = false
    this.disableSave = true;
    this.tableDataById.cells.forEach(data => {
      if (data.data_type == 'integer' && data.custom_operand) {
        data.custom_operand = data.custom_operand.replace(/,(?=\d{3})/g, '');
      }
    });
    this.decisionTableService.updateDecisionTableById(this.tableDataById.id, this.tableDataById).subscribe(
      res => {
        this.tableDataById = res;
        this.tableDataById.cells.forEach(data => {
          if (data.data_type == 'integer' && data.custom_operand) {
            data.custom_operand = data.custom_operand.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
          }
        });
        this.disableSave = false;
        this.router.navigateByUrl('/desicion-engine/explorer/decisionTables/decisionTableList')
      }
    )
  }
  singleobj: any[] = [];
  insertHeader() {
    const dialogRef = this.dialog.open(TableValueComponent, {
      width: '45vw',
      height: '75vh',
      data: this.data,
      panelClass: 'table-value-panel'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result)
      let headers: Header = new Header()
      if (result?.mode == 'Object Model') {
        console.log('object')
        this.objectModelSchemaId = []
        this.objectModelSchemaId.push(result?.result)
        headers.object_model = this.objectModelSchemaId
        console.log('header', headers)
        if (this.tableDataById.headers.length == 0) {
          headers.sequence_order = 0
        }
        else {
          const max = this.tableDataById.headers.reduce(function (prev, current) {
            return (prev.sequence_order > current.sequence_order) ? prev : current
          })
          headers.sequence_order = max.sequence_order + 1
        }
        headers.type = result?.lable
        this.tableDataById.headers.push(headers)
        //for dataBase response
      } else if (result?.mode == 'Database') {
        console.log('Database')
        this.objectModelSchemaId = []
        // this.objectModelSchemaId.push(result?.result)
        this.objectModelSchemaId = result?.result
        headers.object_model = this.objectModelSchemaId
        if (this.tableDataById.headers.length == 0) {
          headers.sequence_order = 0
        }
        else {
          const max = this.tableDataById.headers.reduce(function (prev, current) {
            return (prev.sequence_order > current.sequence_order) ? prev : current
          })
          headers.sequence_order = max.sequence_order + 1
        }
        headers.type = result?.lable
        this.tableDataById.headers.push(headers)
      }
      for (let i = 0; i < this.tableDataById.rows.length; i++) {
        let cell: Cell = new Cell()
        if (this.tableDataById.headers.length == 1) {
          cell.header_order = 0
        }
        else if (this.tableDataById.headers.length > 1) {
          const max = this.tableDataById.headers.reduce(function (prev, current) {
            return (prev.sequence_order > current.sequence_order) ? prev : current
          })
          cell.header_order = max.sequence_order
        }
        cell.row_order = this.tableDataById.rows[i].sequence_order
        cell.standard_operand = null
        cell.standard_operand_type = null
        cell.data_type = headers.object_model[0]?.type
        this.tableDataById.cells.push(cell)
      }
      let condition: Header[] = []
      let action: Header[] = []
      let cell: Cell[] = []
      for (let i = 0; i < this.tableDataById.headers.length; i++) {
        if (this.tableDataById.headers[i].type == "conditionalVariable") {
          condition.push(this.tableDataById.headers[i])
        }
        else {
          action.push(this.tableDataById.headers[i])
        }
      }
      action.forEach(element => {
        condition.push(element)
      });
      this.tableDataById.headers = condition
      this.tableDataById.headers.forEach((e, index) => {
        e.sequence_order = index
      })
    });
  }


  insertRow() {
    let rows: Row = new Row()
    if (this.tableDataById.rows.length == 0) {
      rows.sequence_order = 0
    }
    else {
      const max = this.tableDataById.rows.reduce(function (prev, current) {
        return (prev.sequence_order > current.sequence_order) ? prev : current
      })
      rows.sequence_order = max.sequence_order + 1
    }
    this.tableDataById.rows.push(rows)
    for (let i = 0; i < this.tableDataById.headers.length; i++) {
      let cell: Cell = new Cell()
      cell.header_order = this.tableDataById.headers[i].sequence_order
      if (this.tableDataById.rows.length == 1) {
        cell.row_order = 0
      }
      else if (this.tableDataById.rows.length > 1) {
        const max = this.tableDataById.rows.reduce(function (prev, current) {
          return (prev.sequence_order > current.sequence_order) ? prev : current
        })
        cell.row_order = max.sequence_order
      }
      cell.standard_operand = null
      cell.standard_operand_type = null
      cell.data_type = this.tableDataById.headers[i].object_model[0]?.type
      this.tableDataById.cells.push(cell)
    }

  }
  editTableCell(cellValue: any) {
    let name: string;
    let type: string;
    let var_type: string;
    this.tableDataById.headers.forEach((e) => {
      if (cellValue.header_order == e.sequence_order) {
        name = e.object_model[0]['name']
        type = e.object_model[0]['type']
        var_type = e.type
      }
    })
    if (this.ac.super || this.ac.items?.DTS001H_DECISION_TABLE_MODIFY_ROW) {
      const dialogRef = this.dialog.open(EditTableCellsComponent, {
        width: "38vw",
        data: { data: cellValue, name: name, type: type, var_type: var_type, dirty: this.isDirty }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isDirty = true
        }
      });
    }
  }
  detectChange() {
    this.isDirty = true
  }

  refreshData() {
    if (this.isDirty == true) {
      var c = confirm("You have unsaved changes.Your Changes may be lost.Do you want to continue it anyway?")
      if (c == true) {
        this.getDecisionTableById()
      }
      else {
      }
    }
    else {
      this.getDecisionTableById()
    }
  }

  selectRow(i: any) {
    this.selectedhead = null
    if (this.selectedRow != null) {
      if (this.selectedRow['sequence_order'] == i['sequence_order']) {

        this.unselectrow = !this.unselectrow
      }
      else {
        this.unselectrow = true
      }
    }
    else {
      this.unselectrow = true
    }
    this.selectedRow = i
    this.selected = i['sequence_order']
    this.unselectcolumn = false

  }
  selectHeader(i: any) {
    this.selected = null
    if (this.selectedHeader != null) {
      if (this.selectedHeader['sequence_order'] == i['sequence_order']) {

        this.unselectcolumn = !this.unselectcolumn
      }
      else {
        this.unselectcolumn = true
      }
    }
    else {
      this.unselectcolumn = true
    }
    this.selectedHeader = i
    this.selectedhead = i['sequence_order']
    this.unselectrow = false
  }
  deleteRow() {
    this.filterList = this.tableDataById.cells.filter((filter) => {
      return filter.row_order == this.selectedRow['sequence_order']

    })
    this.filterList.forEach((element) => {
      this.tableDataById.cells.forEach((ele, index) => {
        var list = ele['id'] === undefined
        if (ele['id'] === undefined) {
          if (ele == element) {
            this.tableDataById.cells.splice(index, 1)
          }
        } else {
          if (ele['id'] == element['id']) {
            this.tableDataById.cells.splice(index, 1)
          }
        }
      })
    });
    this.tableDataById.rows.forEach((element, index) => {
      if (element['sequence_order'] == this.selectedRow['sequence_order']) {
        this.tableDataById.rows.splice(index, 1)
      }
    });
  }

  deleteColumn() {
    this.filterList = this.tableDataById.cells.filter((filter) => {
      return filter.header_order == this.selectedHeader['sequence_order']
    })
    this.filterList.forEach((element) => {
      this.tableDataById.cells.forEach((ele, index) => {
        var list = ele['id'] === undefined
        if (ele['id'] === undefined) {
          if (ele == element) {
            this.tableDataById.cells.splice(index, 1)
          }
        } else {
          if (ele['id'] == element['id']) {
            this.tableDataById.cells.splice(index, 1)
          }
        }
      })
    });
    this.tableDataById.headers.forEach((element, index) => {
      var list = element['id'] === undefined
      if (element['id'] === undefined) {
        if (element == this.selectedHeader) {
          this.tableDataById.headers.splice(index, 1)
        }
      } else {
        if (element['id'] == this.selectedHeader['id']) {
          this.tableDataById.headers.splice(index, 1)
        }
      }
    });
    if (this.tableDataById.headers.length == 0) {
      this.tableDataById.rows = []
    }
  }

  // tooltip operator 
  getTooltipText(operator: string): string {
    switch (operator) {
      case '==':
          return 'Equal To';
      case '!=':
          return 'Not Equal To';
      case '>=':
          return 'Greater Than or Equal To';
      case '<':
          return 'Less Than';
      case '>':
          return 'Greater Than';
      case '<=':
          return 'Less Than or Equal To';
      case '..':
          return 'Between';
      case 'containswith':
          return 'Containswith';
      case 'startswith':
          return 'Startswith';
      case 'endswith':
          return 'Endswith';
      default:
          return operator;
  }
}

  // text operator 
  getOperatorText(operator: string): string {
    switch (operator) {
        case '==':
            return '(Equal To)';
        case '!=':
            return '(Not Equal To)';
        case '>=':
            return '(Greater Than or Equal To)';
        case '<':
            return '(Less Than)';
        case '>':
            return '(Greater Than)';
        case '<=':
            return '(Less Than or Equal To)';
        case '..':
            return '(Between)';
        case 'containswith':
            return '(Containswith)';
        case 'startswith':
            return '(Startswith)';
        case 'endswith':
            return '(Endswith)';
        default:
            return operator;
    }
}
}
