import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Navigation } from '../../models/administrator';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {
  breadCrumbList: any[] = []
  currentURL: string = '';
  currentPanel: string = "...";
  sideNavigationList: Navigation[] = [
    { name: "Manage User", iconName: "supervised_user_circle", routerLink: "manage-user", activeOnPanels: ["Application Entry"], disabled: false, access: '' },
    { name: "Manage Groups", iconName: "settings_suggest", routerLink: "group-list", activeOnPanels: ["Application Details"], disabled: false, access: '' },
    { name: "Manage Roles", iconName: "manage_accounts", routerLink: "manage-roles", activeOnPanels: ["Application Details"], disabled: false, access: '' },
    { name: "Manage Access Template", iconName:"security", routerLink: "access-template", activeOnPanels: ["Application Details"], disabled: false, access: '' },
  ]
  constructor(
    public router: Router,
  ) {
    this.currentURL = this.router.url;
  }

  ngOnInit(): void {
    this.currentPanel = this.getCurrentPathName(this.router.url);
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentPanel = this.getCurrentPathName(e.url);
      }
    });
  }

  onNavClick(navElement: Navigation) {
    let url = this.currentURL;
    url = url.substring(0, url.lastIndexOf("/"));
    this.router.navigateByUrl(url + "/" + navElement.routerLink);
  }

  getCurrentPathName(path: string) {
    if (path.endsWith('dashboard')) {
      this.breadCrumbList = [{ name: 'User Admin Dashboard', url: ['admin', 'admin', 'dashboard'] }]
      return "Administrator";
    }
    else if (path.endsWith('manage-user')) {
      this.breadCrumbList = [{ name: 'Manage Users', url: ['administrator', 'manage-user'] }]
      return "Administrator";
    }
    else if (path.endsWith('user-detail')) {
      this.breadCrumbList = [{ name: 'Manage Users', url: ['administrator', 'manage-user'] }, { name: 'User Details', url: ['administrator', 'user-detail'] }]
      return "Administrator";
    }
    else if (path.endsWith('group-list')) {
      this.breadCrumbList = [{ name: 'Manage Groups', url: ['administrator', 'group-list'] }]
      return "Administrator";
    }
    else if (path.endsWith('group-details')) {
      this.breadCrumbList = [{ name: 'Manage Groups', url: ['administrator', 'group-list'] }, { name: 'Group Details', url: ['administrator', 'group-details'] }]
      return "Administrator";
    }
    else if (path.endsWith('manage-roles')) {
      this.breadCrumbList = [{ name: 'Manage Roles', url: ['administrator', 'manage-roles'] }]
      return "Administrator";
    }
    else if (path.endsWith('roles-detail')) {
      this.breadCrumbList = [{ name: 'Manage Roles', url: ['administrator', 'manage-roles'] }, { name: 'Role Details', url: ['administrator', 'roles-detail'] }]
      return "Administrator";
    }
    else if (path.endsWith('access-template')) {
      this.breadCrumbList = [{ name: 'Access Template', url: ['admin', 'admin', 'access-template'] }]
      return "Administrator";
    }
    else if (path.endsWith('access-detail')) {
      this.breadCrumbList = [{ name: 'Access Template', url: ['administrator', 'access-template'] }, { name: 'Access Details', url: ['administrator', 'access-detail'] }]
      return "Administrator";
    }
    else if (path.endsWith('audit')) {
      this.breadCrumbList = [{ name: 'Audit Trail', url: ['admin', 'admin', 'audit'] }]
      return "Administrator";
    }

    else if (path.endsWith('audit-reports')) {
      this.breadCrumbList = [{ name: 'ITAM Reports', url: ['admin', 'admin', 'audit-reports'] }]
      return "Administrator";
    }
    return path
  }

  navToUrl(link: any[]) {
    this.router.navigate(link)
  }
}

