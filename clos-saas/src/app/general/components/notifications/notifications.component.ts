import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map, scan, Subject, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { webSocket } from 'rxjs/webSocket'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  connected: Subscription;
  isConnected = false;

  address: any = 'wss://ws.coincap.io/prices?assets=bitcoin,ethereum,litecoin';
  message: any = 1;

  messages: Subject<any>;

  messageLog: any;

  scrollEndNow = false;

  // subject = webSocket('ws://localhost:8765/tl-notification-data-service/send-notification');

  // @ViewChild('console') console: ElementRef;


  constructor(
    private notificationService: NotificationService,
    private _websocket: WebsocketService
  ) {
    this.connected = _websocket.connected().subscribe(status => {
      this.isConnected = status;
      console.log('status', status);
    });
  }

  ngOnInit(): void {
  }

  getSocketConnection(){
    this._websocket.connected().subscribe(
      (res)=>{
        console.log('Response', res);
        return res;
      }
    )
    return 'No Data Found';
  }

  connect() {
    this.messages = <Subject<any>>this._websocket
      .connect(this.address)
      .pipe(
        map((response: MessageEvent): any => {
          console.log('Res',response);
          return response.data;
        })
      );
    console.log(this._websocket);
    this.messageLog = this.messages.pipe(scan((current, change) => {
      // this.scrollEnd();
      return [...current, `RESPONSE: ${change}`]
    }, []));
  }
  // getResponseFromWebSocketServer(){
  //   console.log('Method Works!')
  //   this.notificationService.messages.subscribe(
  //     (res)=>{
  //       console.log('Response From WebSocket Server'+ res);
  //     },
  //     (err)=>{
  //       console.log('Error Occured',err);
  //     }
  //   )
  // }

  // private message={
  //   author: 'Elite Forbs',
  //   message: 'Websocket Sample'
  // }

  // sendmsg(){
  //   console.log('New Message From client');
  //   this.notificationService.messages.next(this.message);
  // }

  send(sample?) {
    console.log('this.messageLog', this.messageLog);
    // this.messageLog = [...this.messageLog, 'SENT: ' + this.message];
    // this.subject.subscribe();
    // this.subject.next(10);
    // this.subject.complete();
    this.messages.next(this.message);
  }

  onMessageKeyup(event) {
    if (event.keyCode === 13) {
      this.send(); 
    }
    console.log(event);
  }

  // scrollEnd() {
  //   setTimeout(() => {
  //     this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
  //   }, 100);
  // }

  closeWebSocketConnection(){
    this.connected.unsubscribe();
    this.messages.unsubscribe();
  }

}
