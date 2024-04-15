import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnDefinition } from '../../models/admin-table';

@Component({
  selector: 'app-groups-listing',
  templateUrl: './groups-listing.component.html',
  styleUrls: ['./groups-listing.component.scss']
})
export class GroupsListingComponent implements OnInit {
  
  groupColumns: ColumnDefinition[];

  constructor(public router: Router,) { 
    this.groupColumns = [
      {
        fieldName: "id",
        displayName: "ID",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "name",
        displayName: "Name",
        lockColumn: false,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "description",
        displayName: "Description",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "createdByUser",
        displayName: "Created By",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "created",
        displayName: "Created",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "originId",
        displayName: "Origin ID",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "",
        displayName: "Edit Group",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: false,
        hideExport:true,
      },
    ];
  }
  ngOnInit(): void {
  }
  onAddNewUserClick(event:any){
    this.router.navigateByUrl('administrator/group-details');   
   }
}
