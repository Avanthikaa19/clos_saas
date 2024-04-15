import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { fadeInOut } from 'src/app/app.animations';
import { CellFormat, ContextElement, Layout } from '../../../models/Models';
// import { CellFormat, ContextElement, Layout } from 'src/app/report-portal/models/Models';

@Component({
  selector: 'app-layout-single-card',
  templateUrl: './layout-single-card.component.html',
  styleUrls: ['./layout-single-card.component.scss'],
  animations: [fadeInOut]
})
export class LayoutSingleCardComponent implements OnInit, AfterViewInit {

  @Input() layout: Layout;
  columnWidthPx: number = 80;
  rowHeightPx: number = 20;
  canvasWidth: number = 26;
  canvasHeight: number = 100;
  canvasWidthPx: number;
  canvasHeightPx: number;
  maxHeightUsed: number = 0;

  canvasGridColLabelContainer: HTMLDivElement;
  canvasGrid: HTMLDivElement;
  canvasGridParent: HTMLDivElement;

  constructor() { }

  ngOnInit(): void {
    this.refreshCanvasDimensions();
    this.applyStylesForUpdate();
  }

  ngAfterViewInit() {
    this.canvasGridParent = document.getElementById('grid-canvas-parent') as HTMLDivElement;
    this.canvasGridColLabelContainer = document.getElementById('grid-canvas-col-label') as HTMLDivElement;
    this.canvasGrid = document.getElementById('grid-canvas') as HTMLDivElement;
    this.refreshCanvasColumnLabels();
  }

  refreshCanvasColumnLabels() {
    // console.log(this.canvasGridColLabelContainer.getBoundingClientRect().height + 'px x ' + this.canvasGridColLabelContainer.getBoundingClientRect().width + 'px');
    // let containerWidthPx = this.canvasGridColLabelContainer.getBoundingClientRect().width;
    // let containerHeightPx = this.canvasGridColLabelContainer.getBoundingClientRect().height;
    let containerWidthPx = this.canvasWidthPx;
    this.canvasGridColLabelContainer.innerHTML = '';
    let columnsDisplayed: number = containerWidthPx / this.columnWidthPx;
    for (let i = 0; i < columnsDisplayed; i++) {
      // let cellStartXPx: number = 1 + (i * this.columnWidthPx);
      // let cellEndXPx: number = cellStartXPx + this.columnWidthPx;
      let colLabelCell = document.createElement('div');
      colLabelCell.setAttribute('id', 'colLabelCell' + i);
      colLabelCell.className = 'col-label-cell';
      colLabelCell.innerHTML = '<a>' + this.getColName(i) + '</a>';
      this.canvasGridColLabelContainer.appendChild(colLabelCell);
    }
  }

  getColName(n) {
    let ordA = 'a'.charCodeAt(0);
    let ordZ = 'z'.charCodeAt(0);
    let len = ordZ - ordA + 1;
    let s = "";
    while (n >= 0) {
      s = String.fromCharCode(n % len + ordA) + s;
      n = Math.floor(n / len) - 1;
    }
    return s.toUpperCase();
  }

  refreshCanvasDimensions() {
    this.canvasWidthPx = this.canvasWidth * this.columnWidthPx;
    this.canvasHeightPx = this.canvasHeight * this.rowHeightPx;
  }

  applyStylesForUpdate(){
    //apply theme
    //title & subtitle bands
    for(let i = 0; i < this.layout.specification.titleBand?.length; i++) {
      this.setInnerElementStyle(this.layout.specification.titleBand[i], 0, 0);
      this.setAlignMent(this.layout.specification.titleBand[i]);
      this.getElementStyle(this.layout.specification.titleBand[i]);
    }
    //header bands
    for(let i = 0; i < this.layout.specification.headerBands?.length; i++) {
      for(let j = 0; j < this.layout.specification.headerBands[i].elements.length; j++) {
        this.setInnerElementStyle(this.layout.specification.headerBands[i], 0, j);
      }
      this.setAlignMent(this.layout.specification.headerBands[i]);
      this.getElementStyle(this.layout.specification.headerBands[i]);
    }
    //footer bands
    for(let i = 0; i < this.layout.specification.footerBands?.length; i++) {
      for(let j = 0; j < this.layout.specification.footerBands[i].elements.length; j++) {
        this.setInnerElementStyle(this.layout.specification.footerBands[i], 0, j);
      }
      this.setAlignMent(this.layout.specification.footerBands[i]);
      this.getElementStyle(this.layout.specification.footerBands[i]);
    }
    //data bands
      for (let i = 0; i < this.layout.specification.extractionBands?.length; i++) {
        for (let j = 0; j < this.layout.specification.extractionBands[i].elements.length; j++) {
          this.setInnerElementStyle(this.layout.specification.extractionBands[i], 0, j);
          this.setInnerElementStyle(this.layout.specification.extractionBands[i], 1, j);
        }
        this.setAlignMent(this.layout.specification.extractionBands[i]);
        this.getElementStyle(this.layout.specification.extractionBands[i]);
      }
  }

  setInnerElementStyle(element: any, rIndex: number, cIndex: number) {
    let style = '';
    let contextElement: ContextElement;
    let elementWidth : string;
    elementWidth = "width:"+ (this.columnWidthPx + 1) + "px; ";
    let elementHeight: string;
    if(element.name.includes('Title Band')) {
      contextElement = element.contextElement;
      elementWidth = "width:100%; " 
    } else if(element.name.includes('Header Band') || element.name.includes('Footer Band')) {
      contextElement = element.elements[cIndex];
    } else if(element.name.includes('Extraction Band') ) {
      if(rIndex === 0) {
        contextElement = element.elements[cIndex].fieldHeaderCell;
      } else {
        contextElement = element.elements[cIndex].fieldDataCell;
      }
    }
    style = this.getCommonStylesFromCellFormat(contextElement.cellFormat);
    style = style + 'top: ' + ((rIndex * this.rowHeightPx)) + 'px;';
    style = style + elementWidth;
    elementHeight = "height:"+ (this.rowHeightPx + 1) + "px; ";
    style = style + elementHeight;
    contextElement.cellFormat.left = (cIndex * this.columnWidthPx);
    style = style + 'left: ' + contextElement.cellFormat.left + 'px;';    
    contextElement.style = style;
  }

  getCommonStylesFromCellFormat(cellFormat: CellFormat) {
    //do validation
    cellFormat.borders.top.thickness = cellFormat.borders.top.thickness > 3 ? 3 : (cellFormat.borders.top.thickness < 0 ? 0 : cellFormat.borders.top.thickness);
    cellFormat.borders.right.thickness = cellFormat.borders.right.thickness > 3 ? 3 : (cellFormat.borders.right.thickness < 0 ? 0 : cellFormat.borders.right.thickness);
    cellFormat.borders.bottom.thickness = cellFormat.borders.bottom.thickness > 3 ? 3 : (cellFormat.borders.bottom.thickness < 0 ? 0 : cellFormat.borders.bottom.thickness);
    cellFormat.borders.left.thickness = cellFormat.borders.left.thickness > 3 ? 3 : (cellFormat.borders.left.thickness < 0 ? 0 : cellFormat.borders.left.thickness);
    let style: string = '';
    style = style + 'position: absolute !important;';
    style = style + 'overflow: hidden;';
    style = style + 'border-top-color: ' + cellFormat.borders.top.color + '; ';
    style = style + 'border-bottom-color: ' + cellFormat.borders.bottom.color + '; ';
    style = style + 'border-left-color: ' + cellFormat.borders.left.color + '; ';
    style = style + 'border-right-color: ' + cellFormat.borders.right.color + '; ';
    style = style + 'border-top-width: ' + cellFormat.borders.top.thickness + 'px' + '; ';
    style = style + 'border-bottom-width: ' + cellFormat.borders.bottom.thickness + 'px' + '; ';
    style = style + 'border-left-width: ' + cellFormat.borders.left.thickness + 'px' + '; ';
    style = style + 'border-right-width: ' + cellFormat.borders.right.thickness + 'px' + '; ';
    style = style + 'color: ' + cellFormat.fontColor + '; ';
    style = style + 'background-color: ' + cellFormat.backgroundColor + '; ';
    style = style + 'text-align: ' + cellFormat.textAlign + '; ';
    style = style + 'font-family: ' + cellFormat.font + '; ';
    style = style + 'font-size: ' + cellFormat.fontSize + 'px' + '; ';
    style = style + 'font-weight: ' + (cellFormat.fontStyle.includes('BOLD')? 'bold' : 'normal') + '; ';
    style = style + 'font-style: ' + (cellFormat.fontStyle.includes('ITALIC')? 'italic' : 'normal') + '; ';
    return style;
  }

  setAlignMent(element: any){
    let counter : number = 0;
    let counter1: number = 0;
    // RIGHT & LEFT ALIGNMENT
    if(element.name.includes('Header Band') || element.name.includes('Footer Band')){
    element.elements.forEach((item) =>{
      item.cellFormat.left = 0;
      if(item.align == "RIGHT"){
        counter = counter + 1;
        item.cellFormat.left = ( (element.width - counter) * this.columnWidthPx);
      }else if(item.align == "LEFT"){
        item.cellFormat.left = ( counter1 * this.columnWidthPx);
        counter1 = counter1 + 1;
      }
      item.style = item.style + ('left: ' + item.cellFormat.left + 'px;');
    })
  }else{
    element.elements?.forEach((item) =>{ 
      item.fieldHeaderCell.cellFormat.left = 0;     
      if(item['fieldHeaderCell'].align == "RIGHT"){
        counter = counter + 1;
        item.fieldHeaderCell.align="RIGHT";item.fieldDataCell.align="RIGHT";
        item.fieldHeaderCell.cellFormat.left = ( (element.width - counter) * this.columnWidthPx);
      }else if(item['fieldHeaderCell'].align == "LEFT"){
        item.fieldHeaderCell.align="LEFT";item.fieldDataCell.align="LEFT";
        item.fieldHeaderCell.cellFormat.left = ( counter1 * this.columnWidthPx);
        counter1 = counter1 + 1;
      }
      item.fieldDataCell.cellFormat.left = item.fieldHeaderCell.cellFormat.left;
      item.fieldHeaderCell.style = item.fieldHeaderCell.style + ( 'left: ' + item.fieldHeaderCell.cellFormat.left + 'px;');
      item.fieldDataCell.style = item.fieldDataCell.style + ( 'left: ' + item.fieldDataCell.cellFormat.left + 'px;');
    })
  }
}

getElementStyle(element: any) {
    let style: string = '';
    style += 'width: ' + ((element.width * this.columnWidthPx) + ((element.margins.left + element.margins.right) * this.columnWidthPx) + 1) + 'px;';
    style += 'height: ' + ((element.height * this.rowHeightPx) + ((element.margins.top + element.margins.bottom) * this.rowHeightPx) + 1) + 'px;';
    style += 'padding-left: ' + (element.margins.left * this.columnWidthPx) + 'px;';
    style += 'padding-right: ' + (element.margins.right * this.columnWidthPx) + 'px;';
    style += 'padding-top: ' + (element.margins.top * this.rowHeightPx) + 'px;';
    style += 'padding-bottom: ' + (element.margins.bottom * this.rowHeightPx) + 'px;';
    if(element.anchored) {
      style += 'top: ' + (element.anchorY * this.rowHeightPx) + 'px;';
      style += 'left: ' + (element.anchorX * this.columnWidthPx) + 'px;';
    }

    style += 'top: ' + (this.maxHeightUsed * this.rowHeightPx) + 'px;';
    style += 'left: ' + 0 + 'px;';
    this.maxHeightUsed = this.maxHeightUsed + element.height + element.margins.top + element.margins.bottom;
    return element.style = style;
  }

}
