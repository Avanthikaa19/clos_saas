import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppsComponent } from "./components/apps/apps.component";
import { ConfigurationsComponent } from "./components/configurations/configurations.component";
import { DatabaseConnectionComponent } from "./components/configurations/database-connection/database-connection.component";
import { DuplicateViewComponent } from "./components/duplicate-view/duplicate-view.component";
import { MainComponent } from "./components/main/main.component";
import { ViewDetailsComponent } from "./components/view-details/view-details.component";

const routes: Routes = [ 
  {
    path: '',
    redirectTo: 'duplicate-checking/dashboard',
    pathMatch: 'full'
  },
  {path:'duplicate-checking', component: MainComponent,children:[
    {path:'dashboard', component: AppsComponent},
    {path:'config', component: ConfigurationsComponent},
    {path:'db-details', component: DatabaseConnectionComponent},
    {path:'duplicate', component: DuplicateViewComponent},
    {path:'view-details', component: ViewDetailsComponent},
  ]}
];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DuplicateCheckingRoutingModule { }