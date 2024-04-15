import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
import { DFMSystem } from '../../models/models-v2';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { SystemsDetailComponent } from '../systems-detail/systems-detail.component';

@Component({
  selector: 'app-systems-list',
  templateUrl: './systems-list.component.html',
  styleUrls: ['./systems-list.component.scss'],
  animations: [ fadeInOut ]
})
export class SystemsListComponent implements OnInit {
  loadingItems: boolean = false;
  systems: DFMSystem[] = [];

  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalRecords: number = 0;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;
  
  nameSearch: string = '';

  constructor(
    public dialog: MatDialog,
    private flowManagerDataService: FlowManagerDataService,
    public dialogRef: MatDialogRef<SystemsListComponent>,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.refreshItems();
  }

  refreshItems() {
    this.loadingItems = true;
    this.systems = [];
    this.flowManagerDataService.getAllSystemsByPageAndName(this.pageSize, this.currentPage-1, this.nameSearch ? this.nameSearch : ' ').subscribe(
      res => {
        this.loadingItems = false;
        this.totalRecords = res.records;
        this.totalPages = res.totalPages;
        this.systems = res.content;

        //compute page vars
        this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
        this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);

        this.showNotification('default', this.systems.length ? 'Loaded ' + this.systems.length + ' systems.' : 'No systems found.');
      },
      err => {
        this.loadingItems = false;
        console.error(err.error);
      }
    );
  }

  openItemDetails(system: DFMSystem) {
    const dialogRef = this.dialog.open(SystemsDetailComponent, {
      data: { system: JSON.parse(JSON.stringify(system)) },
      panelClass: 'no-pad-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.showNotification('success', result + ' Refreshing list..');
        this.refreshItems();
      }
    });
  }

  deleteSystem(system: DFMSystem, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this system? \nThis process is irreversible!')) {
      system.deleting = true;
      this.flowManagerDataService.deleteSystem(system.id).subscribe(
        res => {
          system.deleting = false;
          this.currentPage = 1;
          this.refreshItems();
          this.showNotification('success', 'System deleted successfully.');
        },
        err => {
          system.deleting = false;
          console.error(err);
          this.showNotification('error', 'Problem deleting system. Refer console for more details.');
        }
      );
    }
  }

  prevPage() {
    if(this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.refreshItems();
  }

  nextPage() {
    if(this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.refreshItems();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onKey(event) {
    if (event.code == 'Enter') {
      this.currentPage = 1;
      this.refreshItems();
    }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
