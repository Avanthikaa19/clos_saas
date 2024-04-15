import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeData: any;

  setThemeData(themeData: any) {
    this.themeData = themeData;
  }

  getThemeData(): any {
    return this.themeData;
  }
}
