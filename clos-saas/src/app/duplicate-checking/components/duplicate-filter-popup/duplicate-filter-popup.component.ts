import { Component, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { displayFields, DuplicateModel } from '../../models/models';
import { DuplicateCheckingService } from '../../services/duplicate-checking.service';


@Component({
  selector: 'app-duplicate-filter-popup',
  templateUrl: './duplicate-filter-popup.component.html',
  styleUrls: ['./duplicate-filter-popup.component.scss']
})
export class DuplicateFilterPopupComponent implements OnInit {
  duplicateData: any[] = [];
  duplicateCount: number;
  Header: any[] = [];
  values: any[] = [];
  temp: any[] = [];
  loadingApplications: boolean = false;
  pageNum: number = 1;
  pageSize: number = 10;
  filterValue: string;
  filteredItems: any[]=[];
  mergedObj: any[] = [];
  mergedData: any[] = [];
  columns = [];
  displayData :any[] = [];
  order: string = 'asc';
  orderBy: string = 'id';
  page: number = 1;
  tablePageSize: number = 10;

  displayFields:displayFields = new displayFields(null,null,null,null,null,null,null)  


  table = {
    "choosenColumns":this.columns,
    "order":this.order,
    "orderBy":this.orderBy,
    "page":this.page,
    "pageSize":this.tablePageSize
  };

  constructor(public dialogRef: MatDialogRef<DuplicateFilterPopupComponent>,
    public notifierService: NotifierService,
    private duplicateService: DuplicateCheckingService) {
  }

  ngOnInit(): void {
    this.getAllApps();
  }
 
   // Fetches the list of application
   getAllApp1s(){
    this.loadingApplications = true;
    this.duplicateService.getAllApps(this.pageNum,this.pageSize,this.displayFields).subscribe(
      res => {
        this.loadingApplications = false;
        this.duplicateData = res['data'];
        this.duplicateCount = res['count'];
        // Array merge and pushing into new array
        for(let i=0;i<this.duplicateData.length;i++){
          this.mergedObj = Object.assign({}, this.duplicateData[i][0], this.duplicateData[i][1], this.duplicateData[i][2], this.duplicateData[i][3]);
          this.mergedData.push(this.mergedObj);
        }
        let headers: any[] = Object.keys(this.mergedObj);
        this.Header = []
        headers.forEach(head => {
          let headerData = { name: head.replace(/([A-Z])/g, ' $1').trim() }
          this.Header.push(headerData);
        })
        this.filteredItems = []
        headers.forEach(head => {
          let headerData = { name: head.replace(/([A-Z])/g, ' $1').trim() }
          this.filteredItems.push(headerData);
        })
        this.filteredItems.shift();
       },
      err => {
        this.loadingApplications = false;
        this.notifierService.notify('error', 'Error: Failed to load applications');
      }
    )
  }


allKeys: any[] = [];
getAllApps(){
  this.loadingApplications = true;
  this.duplicateService.getAllApps(this.pageNum,this.pageSize,this.displayFields).subscribe(
    res => {
      this.loadingApplications = false;
      this.duplicateData = res['data'];
      this.duplicateCount = res['count'];
      // Array merge and pushing into new array
      this.allKeys = [];

      // Loop through each object in the duplicateData array
      for (let i = 0; i < this.duplicateData.length; i++) {
        // Get the keys for the current object
        const keys = Object.keys(this.duplicateData[i]);
        // Loop through each key and add it to the allKeys array if it's not already there
        for (let j = 0; j < keys.length; j++) {
          if (!this.allKeys.includes(keys[j])) {
            this.allKeys.push(keys[j]);
          }
        }
      }
     },
    err => {
      this.loadingApplications = false;
      this.notifierService.notify('error', 'Error: Failed to load applications');
    }
  )
}


  closeDialog(): void {
    this.dialogRef.close({ result: [this.columns,this.displayData] });
  }


  // Add or Remove Fields
  fields(field,event){
    if(event.checked == true){
      this.columns.push(field.replace(/\s/g, ""));
    }else{
      this.columns.splice(this.columns.indexOf(field.replace(/\s/g, "")), 1)
    }
  }

  // Display Items
  displayItems() {
    this.duplicateService.displayFields(this.table).subscribe(
      res => {
        this.displayData = Object.values(res);
        this.closeDialog();
      },err => {
        this.notifierService.notify('error', 'Whoops! something went wrong.');
      }
    )
  }

// filter input
  filterItems() {
    const userInput = this.filterValue.toLowerCase();

    if (userInput === '') {
      this.allKeys = Object.keys(this.duplicateData[0]);
    } else {
      this.allKeys = Object.keys(this.duplicateData[0]).filter(header => header.toLowerCase().includes(userInput));
    }
  }
}
