import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../administrator-dashboard/services/admin-dashboard.service';

@Component({
  selector: 'app-duplicate-finder',
  templateUrl: './duplicate-finder.component.html',
  styleUrls: ['./duplicate-finder.component.scss']
})
export class DuplicateFinderComponent implements OnInit {

  selectedFields: string[]= [];
  fields: string[] = [];
  selected:boolean[]=[];

  constructor(
    public adminService: AdminDashboardService
  ) { }

  ngOnInit(): void {
    this.getPossibleFields();
    this.getChecked();
  }

   // To Get All Possible Fields for Duplicate Comparison
  getPossibleFields() {
    this.adminService.getPossibleFields().subscribe(
      res => {
        this.fields = res;
      }
    )
  }

  // To Get Checked Fields
  getChecked() {
    this.adminService.getChecked(1).subscribe(
      res => {
        this.selectedFields = res;
        this.selected = [];
        this.selectedFields.forEach( l => this.selected[l] = true)
      }
    )
  }

  // To Modify the Checked and Unchecked Fields
  putFields() {
    let table = {
      checkedFieldsList: this.selectedFields,
      uncheckedFieldsList: []
    }
    this.adminService.putFields(1,table).subscribe(
      res => {
        console.log(res);
      }
    )
  }

  // Mapping Table 
  tableSelect(event,list){
      if(event == true){
      this.selectedFields.push(list);
      }else {
        this.selectedFields.splice(this.selectedFields.indexOf(list),1);
      }  
    }
}