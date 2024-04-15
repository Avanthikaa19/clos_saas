import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private deleteIdSubject = new BehaviorSubject<any>(null);
  deleteId$ = this.deleteIdSubject.asObservable();
  //Store post response
  private response = new BehaviorSubject<any>({});
  response$ = this.response.asObservable();

  setDeleteId(deleteId:any) {
    this.deleteIdSubject.next(deleteId);
  }
  setData(response:any) {
    this.response.next(response);
  }
  getData(): Observable<any> {
    return this.response.asObservable();
  }
}
