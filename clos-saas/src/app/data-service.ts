import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private deleteIdSubject = new BehaviorSubject<any>(null);
  deleteId$ = this.deleteIdSubject.asObservable();
  //Store post response
  private response = new BehaviorSubject<any>(null);
  response$ = this.response.asObservable();

  setDeleteId(deleteId:any) {
    this.deleteIdSubject.next(deleteId);
  }
  setData(response:any) {
    this.response.next(response);
  }
}
