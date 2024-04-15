import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnDefinition } from '../../../../models/admin-table';
@Component({
  selector: 'app-template-listing',
  templateUrl: './template-listing.component.html',
  styleUrls: ['./template-listing.component.scss']
})
export class TemplateListingComponent implements OnInit {

  roleColumns: ColumnDefinition[];

  constructor(public router: Router,) { 
    this.roleColumns = [
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
        fieldName: "defaultAccessTemplate",
        displayName: "Default Access Template",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
        isList: true,
      },
      {
        fieldName: "",
        displayName: "Edit Template",
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
    this.router.navigateByUrl('administrator/access-detail');   
   }
}
