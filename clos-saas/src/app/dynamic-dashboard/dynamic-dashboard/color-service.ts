// color.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private templateColors: { [templateId: string]: string } = {};
  private dashbckColor: { [templateId: string]: string } = {};
  private dashtxtColor: { [templateId: string]: string } = {};
  private colorArray1: { [templateId: string]: string[] } = {};
  private tableheaderColor: { [templateId: string]: string } = {};
  private tablebodyColor: { [templateId: string]: string } = {};
  private cardleftborder:{[templateId:string]: string} ={};
  private cardrightborder:{[templateId:string]: string} ={};
  private cardtopborder:{[templateId:string]: string} ={};
  private cardbottomborder:{[templateId:string]: string} ={};
  private cardcolor:{[templateId:string]: string} = {};
  private cardtxt:{[templateId:string]: string}={};
  private templateIdSubject = new BehaviorSubject<string>(''); // Initialize with an empty string
  constructor() {
    const storedColors = localStorage.getItem('templateColors');
    const bckColor = localStorage.getItem('dashbckColor');
    const txtColor = localStorage.getItem('dashtxtColor');
    const theme = localStorage.getItem('colorArray');
    const thead = localStorage.getItem('tableheaderColor');
    const tbody = localStorage.getItem('tablebodyColor');
    const cardl = localStorage.getItem('cardleftborder');
    const cardr = localStorage.getItem('cardrightborder');
    const cardt = localStorage.getItem('cardtopborder');
    const cardb = localStorage.getItem('cardbottomborder');
    const cardColor = localStorage.getItem('cardcolor');
    const cardTxt = localStorage.getItem('cardtxt');
    if (storedColors) {
      this.templateColors = JSON.parse(storedColors);
    }
    if (bckColor) {
      this.dashbckColor = JSON.parse(bckColor);
    }
    if (txtColor) {
      this.dashtxtColor = JSON.parse(txtColor);
    }
    if (theme) {
      this.colorArray1 = JSON.parse(theme);
    }
    if (thead) {
      this.tableheaderColor = JSON.parse(thead);
    }
    if (tbody) {
      this.tablebodyColor = JSON.parse(tbody);
    }
    if(cardl){
      this.cardleftborder = JSON.parse(cardl);
    }
    if(cardr){
      this.cardrightborder = JSON.parse(cardr);
    }
    if(cardl){
      this.cardtopborder = JSON.parse(cardt);
    }
    if(cardl){
      this.cardbottomborder = JSON.parse(cardb);
    }
    if(cardColor){
      this.cardcolor = JSON.parse(cardColor);
    }
    if(cardTxt){
      this.cardtxt = JSON.parse(cardTxt);
    }
  }
  
  //Setting card left border

  setcardlColor(templateId:string, newColors: string): void{
    this.cardleftborder[templateId] = newColors;
    localStorage.setItem('cardleftborder', JSON.stringify(this.cardleftborder));
  }

  //Getting card left border

  getcardlColor(templateId:string): string{
    return this.cardleftborder[templateId] || 'black'
  }

  //Setting card right border

  setcardrColor(templateId:string, newColors: string): void{
    this.cardrightborder[templateId] = newColors;
    localStorage.setItem('cardrightborder', JSON.stringify(this.cardrightborder));
  }

  //Getting card right border

  getcardrColor(templateId:string): string{
    return this.cardrightborder[templateId] || 'black'
  }
  //Setting card top border

  setcardtColor(templateId:string, newColors: string): void{
    this.cardtopborder[templateId] = newColors;
    localStorage.setItem('cardtopborder', JSON.stringify(this.cardtopborder));
  }

  //Getting card top border

  getcardtColor(templateId:string): string{
    return this.cardtopborder[templateId] || 'black'
  }
  //Setting card bottom border

  setcardbColor(templateId:string, newColors: string): void{
    this.cardbottomborder[templateId] = newColors;
    localStorage.setItem('cardbottomborder', JSON.stringify(this.cardbottomborder));
  }

  //Getting card bottom border

  getcardbColor(templateId:string): string{
    return this.cardbottomborder[templateId] || 'black'
  }
  
  //Setting card color

  setcardColor(templateId:string, newColors: string): void{
    this.cardcolor[templateId] = newColors;
    localStorage.setItem('cardcolor', JSON.stringify(this.cardcolor));
  }

  //Getting card color

  getcardColor(templateId:string): string{
    return this.cardcolor[templateId] || 'lightgrey'
  }
  
   //Setting card left border

   setcardTxt(templateId:string, newColors: string): void{
    this.cardtxt[templateId] = newColors;
    localStorage.setItem('cardtxt', JSON.stringify(this.cardtxt));
  }

  //Getting card left border

  getcardTxt(templateId:string): string{
    return this.cardtxt[templateId] || 'grey'
  }

  //Setting table body color

  settbColor(templateId: string, newColors: string): void {
    this.tablebodyColor[templateId] = newColors;
    localStorage.setItem('tablebodyColor', JSON.stringify(this.tablebodyColor));
  }

  //Getting table body color

  gettbColor(templateId: string): string {
    return this.tablebodyColor[templateId] || '#f8f8f8'
  }

  //Setting table header color

  setthColor(templateId: string, newColors: string): void {
    this.tableheaderColor[templateId] = newColors;
    localStorage.setItem('tableheaderColor', JSON.stringify(this.tableheaderColor));
  }

  //Getting table header color

  getthColor(templateId: string): string {
    return this.tableheaderColor[templateId] || '#0e2954'
  }

  //Setting theme

  setColorArray(templatId: string, newColors: string[]): void {
    this.colorArray1[templatId] = newColors;
    localStorage.setItem('colorArray', JSON.stringify(this.colorArray1));
  }

  //Getting theme

  getColorArray(templateId: string): string[] {
    return this.colorArray1[templateId] || ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'];
  }

  //Setting background color

  setBckColor(templateId: string, color: string): void {
    this.dashbckColor[templateId] = color;
    localStorage.setItem('dashbckColor', JSON.stringify(this.dashbckColor));
  }

  //Getting background color

  getBckColor(templateId: string): string {
    return this.dashbckColor[templateId] || 'white';
  }
  //Setting text color

  setTextColor(templateId: string, color: string): void {
    this.dashtxtColor[templateId] = color;
    localStorage.setItem('dashtxtColor', JSON.stringify(this.dashtxtColor));
  }
  //Getting text color

  getTextColor(templateId: string): string {
    return this.dashtxtColor[templateId] || 'black';
  }

  //Setting landing card color

  setUserColor(templateId: string, color: string): void {
    this.templateColors[templateId] = color;
    localStorage.setItem('templateColors', JSON.stringify(this.templateColors));

    // Notify subscribers about the color change
    this.templateIdSubject.next(templateId);
  }

  //Getting landing card color

  getUserColor(templateId: string): string {
    return this.templateColors[templateId] || 'rgba(150, 179, 200, 0.78)';
  }

  userColor$ = this.templateIdSubject.asObservable();
}
