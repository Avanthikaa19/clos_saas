import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { GeneralRoutingModule } from './general-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LogoutComponent } from './components/logout/logout.component';
import {MaterialModule} from "../material/material.module";
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { NoAccessComponent } from './components/no-access/no-access.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { WebsocketService } from '../services/websocket.service';
import { NotificationService } from '../services/notification.service';
import { SessionLogoutComponent } from './components/session-logout/session-logout.component';
import { ErrorNotificationPopupComponent } from './components/error-notification-popup/error-notification-popup.component';
import { GenericDataTableComponent } from './components/generic-data-table/generic-data-table.component';
import { GenericFilterPopupComponent } from './components/generic-filter-popup/generic-filter-popup.component';
import { GenericExportPopupComponent } from './components/generic-export-popup/generic-export-popup.component';
import { GenericDisplayAllfieldsPopupComponent } from './components/generic-display-allfields-popup/generic-display-allfields-popup.component';
import { LogoutPopupComponent } from './components/logout-popup/logout-popup.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardpopupComponent } from './components/dashboardpopup/dashboardpopup.component';
// import { ErrormessagePopupComponent } from './components/errormessage-popup/errormessage-popup.component';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    LogoutComponent,
    MyProfileComponent,
    ResetpasswordComponent,
    NoAccessComponent,
    NotificationsComponent,
    SessionLogoutComponent,
    ErrorNotificationPopupComponent,
    GenericDataTableComponent,
    GenericFilterPopupComponent,
    GenericExportPopupComponent,
    GenericDisplayAllfieldsPopupComponent,
    LogoutPopupComponent,
    DashboardpopupComponent,
    // ErrormessagePopupComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NoAccessComponent,
    GenericDataTableComponent,
    GenericFilterPopupComponent,
    GenericExportPopupComponent,
    GenericDisplayAllfieldsPopupComponent
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],

  providers:[
    WebsocketService,
    NotificationService
  ]
})
export class GeneralModule { }

