import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject, Observable, map } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { Notifications } from '../models/NotificationModel';

export interface Message {
  author: string,
  message: string
}
const CHAT_URL = 'wss://ws.coincap.io/prices?assets=bitcoin,ethereum,litecoin';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public messages: Subject<Message>;

  NOTIFICATION_URL: string = '';

  constructor(
    private wsService: WebsocketService,
    private configurationService: ConfigurationService,
    private http: HttpClient,
  ) {
    this.NOTIFICATION_URL = this.configurationService.apiUrl().services.notification_data_service;
    this.messages = <Subject<Message>>this.wsService
      .connect(CHAT_URL)
      .pipe(
        map((response: MessageEvent): any => {
          console.log('Response', response);
          return response.data;
        })
      )

  }

  //API INTEGRATIONS
  getUnreadNotificationCount(userName: string) {
    return this.http.get<number>(`${this.NOTIFICATION_URL}/notification/unread/count?user=${userName}`);
  }

  setMarkAsRead(id: number, notification: Notification) {
    return this.http.put<Notification>(`${this.NOTIFICATION_URL}/notification/${id}/mark-as-read`, notification);
  }

  getAllandUnreadNotification(markAsReadFlag: string, username: string, page: number, pageSize: number) {
    return this.http.get<{ count: number, totalPages: number, data: Notifications[] }>
      (`${this.NOTIFICATION_URL}/notification/get?markAsReadFlag=${markAsReadFlag}&user=${username}&page=${page}&pageSize=${pageSize}`);
  }

  setCloseFlag(id: number, notification: Notification) {
    return this.http.put<Notification>(`${this.NOTIFICATION_URL}/notification/${id}/close`, notification);
  }

  setMarkAllAsRead(userName: string) {
    return this.http.get(`${this.NOTIFICATION_URL}/notification/mark-all-as-read?user=${userName}`, { responseType: 'text' });
  }

}
