import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FileEditorComponent } from "./components/file-editor/file-editor.component";
import { DataMonitoringComponent } from "./components/monitor-menu/data-monitoring/data-monitoring.component";
import { MonitorMenuComponent } from "./components/monitor-menu/monitor-menu.component";
import { HouseKeepingComponent } from "./components/house-keeping/house-keeping.component";
import { ApplicationCoreComponent } from "./components/application-core/application-core.component";
import { HouseKeepingLandingComponent } from "./components/house-keeping/components/house-keeping-landing/house-keeping-landing.component";

const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: 'data-monitoring' },
  {
    path: '', component: MonitorMenuComponent, children: [
      { path:'data-monitoring', component: DataMonitoringComponent, children: [] },
      { path:'file-editor', component: FileEditorComponent},
      { path:'house-keeping', component: HouseKeepingComponent,
    children:[
      { path:'', component: HouseKeepingLandingComponent}
    ]},
      { path:'application-core', component: ApplicationCoreComponent}
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanMonitorRoutingModule { }