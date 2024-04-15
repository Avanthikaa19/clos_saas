import { I } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Group } from '../../../groups/models/Group';
import { Role } from '../../../roles/models/Role';
import { AccessService } from '../../services/access.service';

@Component({
  selector: 'app-access-groups-roles',
  templateUrl: './access-groups-roles.component.html',
  styleUrls: ['./access-groups-roles.component.scss']
})
export class AccessGroupsRolesComponent implements OnInit {
//pagnation
totalPagess: number = 0;
pageNum: number = 0;
pageSize: number = 50;
entryCount: number = 0;
pageEvent: PageEvent;
accessGroups: Group[] = [];
accessRoles: Role[] = [];
groupHeaders: string[] = [];
roleHeaders: string[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private accessService:AccessService,
  ) 
  {

  }
  @Input() templateId: any;
  ngOnInit(): void {
    console.log(this.templateId)
    this.getAccessTemplateGroups();
    this.getAccessTemplateRoles()

  }


 getAccessTemplateGroups(pageNav?: any) {
    if (pageNav) {
      this.pageSize = pageNav.pageSize;
      this.pageNum = pageNav.pageIndex;
    }
    this.accessService.getAccessTemplateGroups(this.templateId,this.pageNum + 1, this.pageSize).subscribe(
      (res) => {
        console.log("res groups",res)
        this.totalPagess = res.totalPages;
        this.entryCount = res.count;
        this.accessGroups=res.data
        if(res.data){
          this.accessGroups=res.data
          console.log('User Groups onInit', this.accessGroups.length);
          if (this.accessGroups.length != 0) {
            console.log('User Groups not empty')
            this.groupHeaders = Object.keys(this.accessGroups[0]);
          } else {
            this.groupHeaders = Object.keys(new Group(null as any, '','', null as any, '', null as any, [], []));
          }
       
       
       } 
        
       },
      (err) => {
        console.log(err);
      }
    )
  }
  getAccessTemplateRoles(pageNav?: any) {
    if (pageNav) {
      this.pageSize = pageNav.pageSize;
      this.pageNum = pageNav.pageIndex;
    }
    this.accessService.getAccessTemplateRoles(this.templateId,this.pageNum + 1, this.pageSize).subscribe(
      (res) => {
        console.log("res roles",res)
        this.totalPagess = res.totalPages;
        this.entryCount = res.count;
        this.accessRoles=res.data
        if(res.data){
          this.accessRoles=res.data
          console.log('User Groups onInit', this.accessRoles.length);
          if (this.accessRoles.length != 0) {
            console.log('User Groups not empty')
            this.roleHeaders = Object.keys(this.accessRoles[0]);
          } else {
            
            this.roleHeaders = Object.keys(new Role(null, null, '', '', '', null, null, null,null, '', '', ''));
          }
       
       
       } },
      (err) => {
        console.log(err);
      }
    )
  }



}
