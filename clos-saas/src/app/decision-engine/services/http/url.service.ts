import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../../config/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  public static API_URL: string;

  public static FALLBACK_API_URL: string;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) document: any
  ) { 
    let currentUrl = document.location.href as string;
    let splitArr: string[] = currentUrl.split('/#');
    UrlService.FALLBACK_API_URL = splitArr[0] + '/' + API_URL;
  }

  getUrl() {
    return this.http.get('assets/API_URL.txt', { responseType: 'text' as 'json'});   
  }

  getDecisionEngineUrl() {
    return this.http.get('assets/API_URL.txt', { responseType: 'text' as 'json'});
  }

  getCaseManagementUrl(){
    return this.http.get('assets/CM_URL.txt', { responseType: 'text' as 'json'});
  }

}
