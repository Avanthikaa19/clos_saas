import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnDefinition } from 'src/app/clos-admin/models/admin-table';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss']
})
export class UserListingComponent implements OnInit {
  usercolumns: ColumnDefinition[];

  constructor(public router: Router,
) { 
    this.usercolumns = [
      {
        fieldName: "id",
        displayName: "ID",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "User Name",
        displayName: "User Name",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "First Name",
        displayName: "First Name",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "Last Name",
        displayName: "Last Name",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "Supervising-user",
        displayName: "Supervising User",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
        isList: true,
      },
      {
        fieldName: "Birth Date",
        displayName: "Birth Date",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "Gender",
        displayName: "Gender",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "Email",
        displayName: "Email Id",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "MOBILE_NUMBER",
        displayName: "Mobile Number",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "ADDRESSLINE1",
        displayName: "Addressline1",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "ADDRESSLINE2",
        displayName: "Addressline2",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "ADDRESSLINE3",
        displayName: "Addressline3",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "Pincode",
        displayName: "Pincode",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "Country",
        displayName: "Country",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
    ];
  }

  ngOnInit(): void {
  }

  onAddNewUserClick(event:any){
    this.router.navigateByUrl('administrator/user-detail');   
  }
}
