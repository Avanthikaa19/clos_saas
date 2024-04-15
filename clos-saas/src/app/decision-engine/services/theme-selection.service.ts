import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeSelectionService {
  themeSelection = false;
  constructor() { }
}
