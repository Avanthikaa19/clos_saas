import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ErrorComponent} from "./error/error.component";
import { UserDetailComponent } from './admin/components/users/modals/user-detail/user-detail.component';
import { LoginComponent } from './general/components/login/login.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./saas/saas-routing-module').then(m => m.SaasRoutingModule), data: {animationState: 'Saas'} },
  { path: `http://:subdomain.${window.location.host}/signup/login`,loadChildren: () => import('./general/general-routing.module').then(m => m.GeneralRoutingModule), data: {animationState: 'General'}  },
  { path: `general`,loadChildren: () => import('./general/general-routing.module').then(m => m.GeneralRoutingModule), data: {animationState: 'General'}  },
  { path: 'admin', loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule), data: {animationState: 'Admin'} },
  { path: 'application-entry', loadChildren: () => import('./c-los/c-los-routing.module').then(m => m.CLosRoutingModule), data: {animationState: 'C-Los'} },
  { path: 'administrator', loadChildren: () => import('./clos-admin/clos-admin-routing.module').then(m => m.ClosAdminRoutingModule), data: {animationState: 'Administrator'} },
  { path: 'loan-case-manager', loadChildren: () => import('./loan-case-manager/loan-case-manager-routing.module').then(m => m.LoanCaseManagerRoutingModule), data: {animationState: 'Case Manager'} },
  { path: 'flows', loadChildren: () => import('./flow-manager/flow-manager-routing.module').then(m => m.FlowManagerRoutingModule), data: {animationState: 'Flows'} },
  { path: 'data-entry', loadChildren: () => import('./data-entry/data-entry-routing.module').then(m => m.DataEntryRoutingModule), data: {animationState: 'Data Entry'} },
  { path: 'reports', loadChildren: () => import('./reports/reports-routing.module').then(m => m.ReportsRoutingModule), data: {animationState: 'Reports'} },
  { path: 'desicion-engine', loadChildren: () => import('./decision-engine/decision-engine-routing.module').then(m => m.DecisionEngineRoutingModule), data: {animationState: 'DecisionEngine'} },
  { path: 'loan-org', loadChildren: () => import('./loan-origination/loan-origination-routing.module').then(m => m.LoanOriginationRoutingModule), data: {animationState: 'Loan'} },
  { path: 'duplicate-checking', loadChildren: () => import('./duplicate-checking/dup-check-routing.module').then(m => m.DuplicateCheckingRoutingModule), data: {animationState: 'Duplicate'} },
  { path: 'loan-monitor', loadChildren: () => import('./loan-monitor/loan-monitor-routing.module').then(m => m.LoanMonitorRoutingModule), data: {animationState: 'Monitor'} },
  { path: 'dynamic', loadChildren: () => import('./dynamic-dashboard/dynamic-dashboard/dynamic-dashboard-routing').then(m => m.DynamicDashboardRoutingModule), data: {animationState: 'Dynamic'} },
 
  { path: 'loan-application-matching', loadChildren: () => import('./loan-application/loan-application-routing.module').then(m => m.LoanApplicationRoutingModule), data: {animationState: 'Loan'} },
  { path: '**', component: ErrorComponent, data: {animationState: 'Error'} },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
