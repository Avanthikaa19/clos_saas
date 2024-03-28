import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { API } from '../app-constant';
import { ApiUrlMap } from '../models/api-url';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UrlService {

  public static API_URL: string;
  private apiUrlMap: ApiUrlMap ;

  public static FALLBACK_API_URL: string;
  private readonly apiUrlMapPath: string = 'assets/config/api-url-map.json';

  constructor(
      private http:HttpClient,
    @Inject(DOCUMENT) document: any
  ) {
    let currentUrl = document.location.href as string;
    let splitArr: string[] = currentUrl.split('/#');
    UrlService.FALLBACK_API_URL = splitArr[0] + '/' + API;
  }

  url = 'assets/API_URL.txt'
  getUrl() {
    console.log('url')
    let url = this.http.get(`${this.url}`, { responseType: 'text' as 'json' });
    console.log(url,'url')
    return url;
  }
  async loadConfigurations(): Promise<void> {
    const apiUrl = this.apiUrlMapPath;
    let response;
    try {
       await this.http.get<ApiUrlMap>(apiUrl).toPromise().then(
         res=>{
           response=res;
         }
       );
  
      if (!response) {
        throw new Error('Configuration response is undefined.');
      }
      this.apiUrlMap = {
        gateway: response.gateway,
        services: {
          auth_service: response.services.auth_service.replace('[gateway]', response.gateway),
          admin_service: response.services.admin_service.replace('[gateway]', response.gateway),
        }
      };
  
      } catch (error) {
      console.error('Error loading configurations:', error);
      throw new Error('Failed to load configurations.');
      }
  }
  
  public apiUrl(): ApiUrlMap  {
    if (this.apiUrlMap) {
      sessionStorage.setItem('ApiUrlMapPath', JSON.stringify(this.apiUrlMap));
      return this.apiUrlMap;
    } else {
      console.error('API URL Map is undefined.');
      return null;
    }
  }
  
}
