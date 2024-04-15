import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomMappingComponent } from './custom-mapping/custom-mapping.component';
import { CustomComponent } from './custom/custom.component';
import { NewLayoutComponent } from './custom/new-layout/new-layout.component';
import { DynamicDashboardComponent } from './dynamic-dashboard.component';
import { DynamicLandingPageComponent } from './dynamic-landing-page/dynamic-landing-page.component';
import { WidgetsSettingsComponent } from './widgets/widgets-settings/widgets-settings.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { RouteGuard } from 'src/app/services/route.guard';
import { DashboardMappingComponent } from './dashboard-mapping/dashboard-mapping.component';
import { QueryDetailComponent } from './query-detail/query-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dynamic',
    pathMatch: 'full'
  }, 
  { path: 'dynamic', component: DynamicDashboardComponent,children:[
    { path: 'landingPage', component: DynamicLandingPageComponent },
    { path: 'widgets', component: WidgetsComponent },
    { path: 'widget-settings', component: WidgetsSettingsComponent },
    { path: 'custom-dashboard', component: CustomComponent },
    { path: 'new-layout', component: NewLayoutComponent },
    { path: 'query-detail', component: QueryDetailComponent },
    { path: 'dashboardMapping', component: DashboardMappingComponent },
    { path: 'custom-mapping', component: CustomMappingComponent,
      children: [
        { path: '',
        redirectTo: 'dashboard-mapping',
        pathMatch: 'full'},
        ]},]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicDashboardRoutingModule { }
