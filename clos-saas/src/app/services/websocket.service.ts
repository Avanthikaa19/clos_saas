import { Injectable } from '@angular/core';
import * as Rx from 'rxjs'
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

  private subject: Rx.Subject<MessageEvent>;
  private connected$ = new Subject<any>();

  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully Connected");
      this.connected$.next(true);
    }
    return this.subject;
  }

  public connected(): Observable<any> {
    return this.connected$.asObservable();
  }


  private create(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);
    console.log('Web Socket', ws);
    let observable = Rx.Observable.create(
      (obs: Rx.Subject<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        // ws.onmessage = (e)=>{
        //   console.log('Sample',e)
        // }
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      }
    )

    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    }

    return Rx.Subject.create(observer, observable);
  }

}
