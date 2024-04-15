import { AfterViewInit, Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
// import { Band, BandGroup, BandGroupMetadata, CellFormat, ContextBand, ContextElement, DataElement, ExtractionBand, ExtractionQuery, Layout, LayoutSpec, Margins, Theme, TitleBand } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';
import { ExtractionQueryChooserComponent } from '../extraction-query-chooser/extraction-query-chooser.component';
import { ThemeChooserComponent } from '../theme-chooser/theme-chooser.component';
import { ThemeDetailComponent } from '../theme-detail/theme-detail.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EditFormulaPopupComponent } from './edit-formula-popup/edit-formula-popup.component';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { Band, BandGroup, BandGroupMetadata, CellFormat, ContextBand, ContextElement, DataElement, ExtractionBand, ExtractionQuery, Layout, LayoutSpec, Margins, Theme, TitleBand } from '../../../models/Models';

@Component({
  selector: 'app-layout-detail-grid',
  templateUrl: './layout-detail-grid.component.html',
  styleUrls: ['./layout-detail-grid.component.scss'],
  animations: [fadeInOut]
})
export class LayoutDetailGridComponent implements OnInit, AfterViewInit {
  MAX_ID: number = 1;
  DEFAULT_BG_COLOR: string = '#F5F5F5';
  // DEFAULT_BORDER_COLOR: string = 'red';
  DEFAULT_BORDER_COLOR: string = '#DCDCDC';

  layout: Layout;
  cellDataTypes: string[] = [];

  fontFamilyNames: string[] = [];

  toolbarExpandedItem: number = 0;

  selectedElement: any;
  selectedSubElement: any;
  selectedSubElementRowIndex: number = 0;
  selectedSubElementColIndex: number = 0;

  showAllHints: boolean = false;
  useDarkBg: boolean = false;
  showData: boolean = true;
  editingLayoutName: boolean = false;
  editingLayoutDesc: boolean = false;
  saving: boolean = false;
  applyingTheme: boolean = false;
  shiftKeyDown: boolean = false;
  ctrlKeyDown: boolean = false;
  altKeyDown: boolean = false;
  //Windows
  layoutBandGroupsExpanded: boolean = true;
  cellDataExpanded: boolean = true;

  columnWidthPx: number = 80;
  rowHeightPx: number = 20;

  canvasWidth: number = 26;
  canvasHeight: number = 100;
  canvasWidthPx: number;
  canvasHeightPx: number;
  canvasGridColLabelContainer: HTMLDivElement;
  canvasGrid: HTMLDivElement;
  canvasGridParent: HTMLDivElement;

  maxOccupiedWidth: number = 10;

  defaultGroup: BandGroup;
  selectedGroup: BandGroup;
  layoutBandGroups: BandGroup[] = [];

  //monaco editor options
  editorOptions = {
    theme: 'vs',
    language: "text",
    suggestOnTriggerCharacters: false,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    autoIndent: "full",
    updateLayout: true
  };

  constructor(
    public dialogRef: MatDialogRef<LayoutDetailGridComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LayoutDetailGridComponent,
    private reportPortalDataService: ReportPortalDataService,
    private authenticationService: JwtAuthenticationService,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) {
    this.layout = data.layout;
    //create default group 
    this.defaultGroup = new BandGroup();
    this.defaultGroup.id = 0;
    this.defaultGroup.name = 'Default';
    this.defaultGroup.expanded = true;
    this.defaultGroup.bands = [];
    this.layoutBandGroups.push(this.defaultGroup);

    if (!this.layout) {
      this.layout = new Layout();
      this.layout.name = 'New Layout';
      this.layout.defaultSheetName = 'New Layout';
      this.layout.description = 'New Layout Description';
      this.layout.id = null;
      this.layout.owner = this.authenticationService.getAuthenticatedUser();
      this.layout.visibleTo = 'OWNER_ONLY';
      this.layout.editableBy = 'OWNER_ONLY';
      this.layout.specification = new LayoutSpec();
      //TITLE BANDS
      this.layout.specification.titleBand = [];
      this.addNewTitleBand();
      //SUBTITLE BAND
      this.addNewTitleBand();
      //HEADER
      this.addNewHeaderBand();
      //DATA
      this.layout.specification.extractionBands = [];
      //FOOTER
    } else {
      //initialize other groups
      this.initializeBandGroups(this.layout.specification.bandGroupMetadata);
      this.applyStylesForUpdate();
    }
  }

  ngOnInit(): void {
    this.refreshFontFamilyNames();
    this.loadCellDataTypes();
    this.refreshCanvasDimensions();
    //TESTING
    // this.openExtractionQuerySelection();
  }

  ngAfterViewInit() {
    this.canvasGridParent = document.getElementById('grid-canvas-parent') as HTMLDivElement;
    this.canvasGridColLabelContainer = document.getElementById('grid-canvas-col-label') as HTMLDivElement;
    this.canvasGrid = document.getElementById('grid-canvas') as HTMLDivElement;
    this.refreshCanvasColumnLabels();
    //organise by band groups
    this.autoAlignBands();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ignoreClick(event) {
    event.stopPropagation();
  }

  toggleToolbarItem(event, index: number) {
    if (event) {
      event.stopPropagation();
    }
    if (this.toolbarExpandedItem === index) {
      this.toolbarExpandedItem = 0;
    } else {
      this.toolbarExpandedItem = index;
    }
  }

  refreshFontFamilyNames() {
    this.reportPortalDataService.getFontFamilyNames().subscribe(
      res => {
        this.fontFamilyNames = res;
        this.notifierService.notify('default', 'Loaded ' + res.length + ' font names.');
      },
      err => {
        this.notifierService.notify('error', err.error);
      }
    );
  }

  loadCellDataTypes() {
    this.reportPortalDataService.getCellDataTypes().subscribe(
      res => {
        this.cellDataTypes = res;
        this.showNotification('default', 'Loaded ' + this.cellDataTypes.length + ' cell data formula types.');
      },
      err => {
        this.showNotification('error', err.error);
      }
    );
  }

  updateBandGroupMetaData() {
    // console.log(this.layoutBandGroups)
    this.layout.specification.bandGroupMetadata = [];
    // this.layout.specification.bandMetadata = [];
    this.layoutBandGroups.forEach((item) => {
      item.bands.forEach((bandItem, BandIndex) => {
        this.layout.specification.bandGroupMetadata[BandIndex] = new BandGroupMetadata();
        this.layout.specification.bandGroupMetadata[BandIndex].groupId = item.id;
        this.layout.specification.bandGroupMetadata[BandIndex].groupName = item.name;
        this.layout.specification.bandGroupMetadata[BandIndex].bandId = bandItem.id;
        this.layout.specification.bandGroupMetadata[BandIndex].bandName = bandItem.name;

        // if (bandItem instanceof TitleBand ){
        //   this.bandMetaData(bandItem, bandItem.contextElement, this.layout.specification.bandMetadata.length);
        // } else if( bandItem instanceof ContextBand){
        //   bandItem.elements.forEach(element => {
        //     this.bandMetaData(bandItem,element,this.layout.specification.bandMetadata.length);       
        //   });
        // }else if( bandItem instanceof ExtractionBand){
        //   bandItem.elements.forEach(element => {
        //     this.bandMetaData(bandItem,element.fieldHeaderCell,this.layout.specification.bandMetadata.length);
        //     this.bandMetaData(bandItem,element.fieldDataCell,this.layout.specification.bandMetadata.length);                
        //   });
        // } 
      })
    })
  }

  // bandMetaData(bandItem, contextElement, index){
  //   this.layout.specification.bandMetadata[index] = new BandMetadata();
  //   this.layout.specification.bandMetadata[index].bandId = bandItem.id;
  //   this.layout.specification.bandMetadata[index].bandName = bandItem.name;
  //   this.layout.specification.bandMetadata[index].elementId = contextElement.id;
  //   this.layout.specification.bandMetadata[index].elementName = contextElement.name; 
  // }

  createLayout() {
    this.saving = true;
    this.updateBandGroupMetaData();
    this.reportPortalDataService.createLayout(this.layout).subscribe(
      res => {
        this.saving = false;
        this.dialogRef.close('Created successfully!');
      },
      err => {
        this.saving = false;
        console.error(err.error);
      }
    );
  }

  updateLayout() {
    this.saving = true;
    this.updateBandGroupMetaData();
    this.reportPortalDataService.updateLayout(this.layout).subscribe(
      res => {
        this.saving = false;
        this.dialogRef.close('Updated successfully!');
      },
      err => {
        this.saving = false;
        console.error(err.error);
      }
    );
  }

  deleteLayout() {
    if (confirm('Are you sure you want to delete this layout? \nThis process is irreversible!')) {
      this.saving = true;
      this.reportPortalDataService.deleteLayout(this.layout.id).subscribe(
        res => {
          this.saving = false;
          this.dialogRef.close('Deleted successfully!');
        },
        err => {
          this.saving = false;
          console.error(err.error);
        }
      );
    }
  }

  openThemeSelection(event, applyTo: string) {
    if (event) {
      event.stopPropagation();
    }
    let title = '';
    title = 'Select ' + applyTo + 'Theme';
    const dialogRef = this.dialog.open(ThemeChooserComponent, {
      panelClass: 'no-pad-dialog',
      data: {
        title: title,
        propagate: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.applyBaseTheme(result.theme.id, applyTo, result.propagate);
      }
    });
  }

  openExtractionQuerySelection(event?) {
    if (event) {
      event.stopPropagation();
    }
    let title = 'Select Extraction Query'
    const dialogRef = this.dialog.open(ExtractionQueryChooserComponent, {
      panelClass: 'no-pad-dialog',
      data: {
        title: title,
        propagate: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.showNotification('success', result.query.name + ' Refreshing list..');
        console.log('Extraction Band', result.query);
        this.addNewExtractionBand(result.query);
        // console.log(result);
      }
    });
  }

  applyBaseTheme(themeId: number, applyTo: string, propagate?: boolean) {
    //load theme
    this.applyingTheme = true;
    this.reportPortalDataService.getTheme(themeId).subscribe(
      res => {
        let theme: Theme = res;
        this.layout.specification.baseThemeId = themeId;
        this.layout.specification.baseTheme = theme;
        //apply theme
        //title & subtitle bands
        // console.log(this.selectedElement == null || this.selectedElement == undefined || this.selectedElement.name.includes('Header Band'));
        if (this.selectedElement?.name.includes('Title Band')) {
          if (this.selectedElement.name == 'Title Band 1') {
            this.selectedElement.contextElement.cellFormat = theme.specification.titleCell;
          } else {
            this.selectedElement.contextElement.cellFormat = theme.specification.subTitleCell;
          }
          this.setInnerElementStyle(this.selectedElement, 0, 0);
          this.realignInnerElements(this.selectedElement);

        } else if (this.selectedElement?.name.includes('Header Band')) {
          this.selectedElement.elements.forEach((item, index) => {
            item.cellFormat = theme.specification.headerCell;
            this.setInnerElementStyle(this.selectedElement, 0, index);
          })
          this.realignInnerElements(this.selectedElement);
        } else if (this.selectedElement?.name.includes('Footer Band')) {
          this.selectedElement.elements.forEach((item, index) => {
            item.cellFormat = theme.specification.footerCell;
            this.setInnerElementStyle(this.selectedElement, 0, index);
          })
          this.realignInnerElements(this.selectedElement);
        } else if (this.selectedElement?.name.includes('Extraction Band')) {
          this.selectedElement.elements.forEach((item, index) => {
            item.fieldHeaderCell.cellFormat = theme.specification.fieldHeaderCell;
            this.setInnerElementStyle(this.selectedElement, 0, index);
            item.fieldDataCell.cellFormat = theme.specification.fieldDataCell;
            this.setInnerElementStyle(this.selectedElement, 1, index);
          })
          this.realignInnerElements(this.selectedElement);
        } else {
          for (let i = 0; i < this.layout.specification.titleBand?.length; i++) {
            if (i === 0) {
              this.layout.specification.titleBand[i].contextElement.cellFormat = theme.specification.titleCell;
            } else {
              this.layout.specification.titleBand[i].contextElement.cellFormat = theme.specification.subTitleCell;
            }
            this.setInnerElementStyle(this.layout.specification.titleBand[i], 0, 0);
            this.realignInnerElements(this.layout.specification.titleBand[i]);
          }
          //header bands
          for (let i = 0; i < this.layout.specification.headerBands?.length; i++) {
            //left elements
            for (let j = 0; j < this.layout.specification.headerBands[i].elements.length; j++) {
              this.layout.specification.headerBands[i].elements[j].cellFormat = theme.specification.headerCell;
              this.setInnerElementStyle(this.layout.specification.headerBands[i], 0, j);
            }
            this.realignInnerElements(this.layout.specification.headerBands[i]);
          }
          //footer bands
          for (let i = 0; i < this.layout.specification.footerBands?.length; i++) {
            //left elements
            for (let j = 0; j < this.layout.specification.footerBands[i].elements.length; j++) {
              this.layout.specification.footerBands[i].elements[j].cellFormat = theme.specification.footerCell;
              this.setInnerElementStyle(this.layout.specification.footerBands[i], 0, j);
            }
            this.realignInnerElements(this.layout.specification.footerBands[i]);
          }
          //data bands
          if (propagate) {
            for (let i = 0; i < this.layout.specification.extractionBands?.length; i++) {
              for (let j = 0; j < this.layout.specification.extractionBands[i].elements.length; j++) {
                this.layout.specification.extractionBands[i].elements[j].fieldHeaderCell.cellFormat = theme.specification.fieldHeaderCell;
                this.setInnerElementStyle(this.layout.specification.extractionBands[i], 0, j);
                this.layout.specification.extractionBands[i].elements[j].fieldDataCell.cellFormat = theme.specification.fieldDataCell;
                this.setInnerElementStyle(this.layout.specification.extractionBands[i], 1, j);
              }
              this.realignInnerElements(this.layout.specification.extractionBands[i]);
            }
          }
        }
        // this.changeDetectorRef.detectChanges();
        this.showNotification('info', applyTo + ' theme applied successfully.');
        this.applyingTheme = false;
      },
      err => {
        this.applyingTheme = false;
      }
    );
  }
  addNewElement(event?) {
    if (event) {
      event.stopPropagation();
    }
    let i = this.selectedElement.elements.length;
    let newElement;
    let name: string;
    let counter: number = 0;
    let element = new DataElement();
    if (this.selectedElement.name.includes('Extraction Band')) {
      name = 'Field Header ';
      counter = counter + 1;
    } else if (this.selectedElement.name.includes('Header Band')) {
      name = 'Header Item'
    } else if (this.selectedElement.name.includes('Footer Band')) {
      name = 'Footer Item'
    }
    if (counter == 0) {
      this.selectedElement.elements[i] = this.newElementInBand(newElement, name, i);
      //  Apply styles
      this.setInnerElementStyle(this.selectedElement, 0, i);
    } else {
      this.selectedElement.elements[i] = new DataElement();
      this.selectedElement.elements[i].fieldHeaderCell = this.newElementInBand(newElement, name, i);
      this.selectedElement.elements[i].fieldDataCell = this.newElementInBand(element.fieldDataCell, 'Field Data ', i);
      //  Apply styles
      this.setInnerElementStyle(this.selectedElement, 0, i);
      this.setInnerElementStyle(this.selectedElement, 1, i);
    }

    // selected band width change 
    if (this.selectedElement.elements.length > this.selectedElement.width) {
      this.selectedElement.width = this.selectedElement.elements.length;
      this.selectedElement.style = this.getElementStyle(this.selectedElement);
      this.autoAlignBands();
    }
  }

  newElementInBand(newElement, name, i) {
    newElement = new ContextElement();
    newElement.id = this.getNextId();
    newElement.name = name + ' ' + (i + 1);
    newElement.include = true;
    newElement.visible = true;
    newElement.deletable = true;
    newElement.align = "LEFT";
    newElement.cellData = {
      type: 'STATIC_TEXT',
      value: 'Item ' + (i + 1)
    };
    newElement.cellFormat = ThemeDetailComponent.getDefaultCellFormat();

    return newElement;
  }

  addNewTitleBand(event?) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.layout.specification.titleBand) {
      this.layout.specification.titleBand = [];
    }
    let bandNumber = (this.layout.specification.titleBand.length + 1);
    let tBand = new TitleBand();
    tBand.id = this.getNextId();
    tBand.name = 'Title Band ' + bandNumber;
    tBand.include = true;
    tBand.visible = true;
    tBand.anchored = false;
    tBand.anchorX = 0;
    tBand.anchorY = 0;
    tBand.height = 1;
    if (bandNumber === 1) {
      tBand.width = 10;
      tBand.margins = new Margins(0, 0, 0, 0);
    } else {
      tBand.width = 8;
      tBand.margins = new Margins(1, 1, 1, 1);
    }
    tBand.backgroundColor = this.DEFAULT_BG_COLOR;
    tBand.innerBorders = { color: this.DEFAULT_BORDER_COLOR, thickness: 1 };
    tBand.outerBorders = {
      top: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      right: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      bottom: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      left: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 }
    };
    tBand.contextElement = this.newElementInBand(tBand.contextElement, 'Title Item ', bandNumber - 1);
    tBand.contextElement.deletable = false;
    this.setInnerElementStyle(tBand, 0, 0);
    tBand.style = this.getElementStyle(tBand);
    this.layout.specification.titleBand.push(tBand);
    //add to group 
    if (this.selectedGroup) {
      this.addBandToGroup(tBand, this.selectedGroup.id);
    } else {
      this.addBandToGroup(tBand, null); //adds to default group
    }
    this.autoAlignBands();
  }

  // ADDING HEADER BAND 
  addNewHeaderBand(event?) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.layout.specification.headerBands) {
      this.layout.specification.headerBands = [];
    }
    let bandNumber = (this.layout.specification.headerBands.length) + 1;
    let hBand = new ContextBand();
    hBand.id = this.getNextId();
    hBand.name = 'Header Band ' + bandNumber;
    hBand.include = true;
    hBand.visible = true;
    hBand.anchored = false;
    hBand.anchorX = 0;
    hBand.anchorY = 0;
    hBand.height = 1;
    hBand.width = 8;
    hBand.margins = new Margins(1, 1, 1, 1);
    hBand.backgroundColor = this.DEFAULT_BG_COLOR;
    hBand.innerBorders = { color: this.DEFAULT_BORDER_COLOR, thickness: 1 };
    hBand.outerBorders = {
      top: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      right: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      bottom: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      left: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 }
    };
    hBand.elements = [];
    for (let i = 0; i < 4; i++) {
      hBand.elements[i] = this.newElementInBand(hBand.elements[i], 'Header Item ', i);
      this.setInnerElementStyle(hBand, 0, i);
      hBand.style = this.getElementStyle(hBand);
    }

    this.layout.specification.headerBands.push(hBand);

    //add to group 
    if (this.selectedGroup) {
      this.addBandToGroup(hBand, this.selectedGroup.id);
    } else {
      this.addBandToGroup(hBand, null); //adds to default group
    }
    this.autoAlignBands();
  }

  // ADDING FOODER BAND
  addNewFooterBand(event?) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.layout.specification.footerBands) {
      this.layout.specification.footerBands = [];
    }
    let bandNumber = (this.layout.specification.footerBands.length) + 1;
    let fBand = new ContextBand();
    fBand.id = this.getNextId();
    fBand.name = 'Footer Band ' + bandNumber;
    fBand.include = true;
    fBand.visible = true;
    fBand.anchored = false;
    fBand.anchorX = 0;
    fBand.anchorY = 0;
    fBand.height = 1;
    fBand.width = 8;
    fBand.margins = new Margins(1, 1, 1, 1);
    fBand.backgroundColor = this.DEFAULT_BG_COLOR;
    fBand.innerBorders = { color: this.DEFAULT_BORDER_COLOR, thickness: 1 };
    fBand.outerBorders = {
      top: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      right: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      bottom: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      left: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 }
    };
    fBand.elements = [];
    for (let i = 0; i < 4; i++) {
      fBand.elements[i] = this.newElementInBand(fBand.elements[i], 'Footer Item ', i);
      this.setInnerElementStyle(fBand, 0, i);
      fBand.style = this.getElementStyle(fBand);
    }

    this.layout.specification.footerBands.push(fBand);

    //add to group 
    if (this.selectedGroup) {
      this.addBandToGroup(fBand, this.selectedGroup.id);
    } else {
      this.addBandToGroup(fBand, null); //adds to default group
    }
    this.autoAlignBands();
  }

  // ADDING EXTRACTION BAND
  addNewExtractionBand(extQuery: ExtractionQuery) {
    if (!this.layout.specification.extractionBands) {
      this.layout.specification.extractionBands = [];
    }
    let bandNumber = (this.layout.specification.extractionBands.length) + 1;
    let eBand = new ExtractionBand();
    eBand.id = this.getNextId();
    eBand.extractionId = extQuery.id;
    eBand.name = 'Extraction Band ' + bandNumber;
    eBand.include = true;
    eBand.visible = true;
    eBand.anchored = false;
    eBand.anchorX = 0;
    eBand.anchorY = 0;
    eBand.height = 2;
    eBand.width = extQuery.fieldCount;
    eBand.margins = new Margins(1, 1, 1, 1);
    eBand.backgroundColor = this.DEFAULT_BG_COLOR;
    eBand.innerBorders = { color: this.DEFAULT_BORDER_COLOR, thickness: 1 };
    eBand.outerBorders = {
      top: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      right: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      bottom: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 },
      left: { color: this.DEFAULT_BORDER_COLOR, thickness: 1 }
    };
    eBand.parameters = extQuery.parameters
    eBand.elements = [];
    let elementPos: number = 0;
    for (let i = 0; i < extQuery.fields.length; i++) {
      if(extQuery.fields[i].type != "BLOB") {
        eBand.elements[elementPos] = new DataElement();
        eBand.elements[elementPos].fieldHeaderCell = this.newElementInBand(eBand.elements[elementPos].fieldHeaderCell, extQuery.fields[i].name, i);
        eBand.elements[elementPos].fieldDataCell = this.newElementInBand(eBand.elements[elementPos].fieldHeaderCell, extQuery.fields[i].name + ' - Data', i);
        eBand.elements[elementPos].fieldHeaderCell.name = extQuery.fields[i].name;
        eBand.elements[elementPos].fieldDataCell.name = extQuery.fields[i].name + ' - Data';
        eBand.elements[elementPos].fieldHeaderCell.cellData = {
          type: 'STATIC_TEXT',
          value: extQuery.fields[i].name
        };
        eBand.elements[elementPos].fieldDataCell.cellData = {
          type: 'QUERY_FIELD',
          value: extQuery.fields[i].name
        };
        this.setInnerElementStyle(eBand, 0, elementPos);
        this.setInnerElementStyle(eBand, 1, elementPos);
        eBand.style = this.getElementStyle(eBand);
        elementPos++;
      }
    }
    this.layout.specification.extractionBands.push(eBand);

    //add to group 
    if (this.selectedGroup) {
      this.addBandToGroup(eBand, this.selectedGroup.id);
    } else {
      this.addBandToGroup(eBand, null); //adds to default group
    }
    this.autoAlignBands();
    //create band
    //assign band id & name
    //for each field in extQuery.fields -> add a DataElement (field header & field data)
    //add to group
  }

  createNewGroup(event) {
    event.stopPropagation();
    let groupNumber = (this.layoutBandGroups.length + 1);
    let group = new BandGroup();
    group.id = this.getNextId();
    group.name = 'Group ' + groupNumber;
    group.bands = [];
    group.expanded = true;
    this.layoutBandGroups.push(group);
  }

  addBandToGroup(band: any, groupId: number) {
    if (!groupId) {
      groupId = 0;
    }
    for (let group of this.layoutBandGroups) {
      if (group.id === groupId) {
        group.bands.push(band);
        let dummy = [];
        group.bands.forEach((item) => {
          if (item.name.includes("Title")) {
            dummy.push(item);
          }
        })
        group.bands.forEach((item) => {
          if (item.name.includes("Header")) {
            dummy.push(item);
          }
        })
        group.bands.forEach((item) => {
          if (item.name.includes("Extraction")) {
            dummy.push(item);
          }
        })
        group.bands.forEach((item) => {
          if (item.name.includes("Footer")) {
            dummy.push(item);
          }
        })

        group.bands = dummy;
      }
    }
  }

  deleteElement(event, element: TitleBand | ContextBand | ExtractionBand) {
    if (event) {
      event.stopPropagation();
    }
    if (element === this.selectedElement) {
      this.clearSelections();
    }
    if (element.name.includes('Title Band')) {
      for (let i = 0; i < this.layout.specification.titleBand.length; i++) {
        if (this.layout.specification.titleBand[i] === element) {
          this.layout.specification.titleBand.splice(i, 1);
          break;
        }
      }
    } else if (element.name.includes('Header Band')) {
      for (let i = 0; i < this.layout.specification.headerBands.length; i++) {
        if (this.layout.specification.headerBands[i] === element) {
          this.layout.specification.headerBands.splice(i, 1);
          break;
        }
      }
    } else if (element.name.includes('Footer Band')) {
      for (let i = 0; i < this.layout.specification.footerBands.length; i++) {
        if (this.layout.specification.footerBands[i] === element) {
          this.layout.specification.footerBands.splice(i, 1);
          break;
        }
      }
    } else if (element.name.includes('Extraction Band')) {
      for (let i = 0; i < this.layout.specification.extractionBands.length; i++) {
        if (this.layout.specification.extractionBands[i] === element) {
          this.layout.specification.extractionBands.splice(i, 1);
          break;
        }
      }
    }
    for (let bandGroup of this.layoutBandGroups) {
      for (let i = 0; i < bandGroup.bands.length; i++) {
        if (bandGroup.bands[i] === element) {
          bandGroup.bands.splice(i, 1);
          this.autoAlignBands();
          return;
        }
      }
    }
  }

  deleteInnerElement(event, element: any, rIndex: number, cIndex: number) {
    if (event) {
      event.stopPropagation();
    }
    if (!element.name.includes('Title Band')) {
      element.elements.splice(cIndex, 1);
    } else {
      this.showNotification('error', 'This inner element cannot be deleted.')
    }
  }

  selectElement(event, element: any) {
    if (event) {
      event.stopPropagation();
    }
    this.clearSelections();
    if (element) {
      this.selectedElement = element;
      for (let group of this.layoutBandGroups) {
        for (let band of group.bands) {
          if (band.id === this.selectedElement.id) {
            this.selectedGroup = group;
            return;
          }
        }
      }
    }
  }

  selectInnerElement(event, element: any, rIndex: number, cIndex: number, bandElement?) {
    this.clearSelections(event);
    this.selectElement(null, element);
    if (element.name.includes('Title Band')) {
      this.selectedSubElement = element.contextElement;
      this.selectedSubElementRowIndex = rIndex;
      this.selectedSubElementColIndex = cIndex;
    } else if (element.name.includes('Header Band') || element.name.includes('Footer Band')) {
      this.selectedSubElement = bandElement;
      this.selectedSubElementRowIndex = rIndex;
      this.selectedSubElementColIndex = cIndex;
    } else if (element.name.includes('Extraction Band')) {
      if (rIndex === 0) {
        this.selectedSubElement = bandElement.fieldHeaderCell;
      } else {
        this.selectedSubElement = bandElement.fieldDataCell;
      }
      this.selectedSubElementRowIndex = rIndex;
      this.selectedSubElementColIndex = cIndex;
    }
  }

  clearSelections(event?) {
    if (event) {
      event.stopPropagation();
    }
    this.toolbarExpandedItem = 0;
    this.selectedSubElement = null;
    this.selectedSubElementRowIndex = 0;
    this.selectedSubElementColIndex = 0;
    this.selectedElement = null;
  }

  setElementStyle(element: any) {
    this.autoAlignBands();
    // element.style = this.getElementStyle(element);
  }

  getElementStyle(element: any) {
    let style: string = '';
    style += 'width: ' + ((element.width * this.columnWidthPx) + ((element.margins.left + element.margins.right) * this.columnWidthPx) + 1) + 'px;';
    style += 'height: ' + ((element.height * this.rowHeightPx) + ((element.margins.top + element.margins.bottom) * this.rowHeightPx) + 1) + 'px;';
    style += 'padding-left: ' + (element.margins.left * this.columnWidthPx) + 'px;';
    style += 'padding-right: ' + (element.margins.right * this.columnWidthPx) + 'px;';
    style += 'padding-top: ' + (element.margins.top * this.rowHeightPx) + 'px;';
    style += 'padding-bottom: ' + (element.margins.bottom * this.rowHeightPx) + 'px;';
    style += 'background-size: 80px 20px;';
    style += 'background-position: top -1px left -1px;';
    if (element.innerBorders) {
      style += 'background-image: linear-gradient(to right, ' + element.innerBorders.color + ' 1px, transparent 1px), linear-gradient(to bottom, ' + element.innerBorders.color + ' 1px, transparent 1px);';
    } else {
      style += 'background-image: linear-gradient(to right, gainsboro 1px, transparent 1px), linear-gradient(to bottom, gainsboro 1px, transparent 1px);';
    }
    if (element.outerBorders) {
      style += 'border-top: solid ' + element.outerBorders.top.color + ' ' + element.outerBorders.top.thickness + 'px;';
      style += 'border-right: solid ' + element.outerBorders.right.color + ' ' + element.outerBorders.right.thickness + 'px;';
      style += 'border-bottom: solid ' + element.outerBorders.bottom.color + ' ' + element.outerBorders.bottom.thickness + 'px;';
      style += 'border-left: solid ' + element.outerBorders.left.color + ' ' + element.outerBorders.left.thickness + 'px;';
    } else {
      style += 'border-width: 1px;';
      style += 'border-color: transparent;';
    }
    if (element.backgroundColor) {
      style += 'background-color: ' + element.backgroundColor + ';';
    } else {
      style += 'background-color: transparent;';
    }
    if (element.anchored) {
      style += 'top: ' + (element.anchorY * this.rowHeightPx) + 'px;';
      style += 'left: ' + (element.anchorX * this.columnWidthPx) + 'px;';
    }
    return style;
  }

  interChangeElementPosition(event: CdkDragDrop<string[]>, element) {
    moveItemInArray(element.elements, event.previousIndex, event.currentIndex);
    for (let i = 0; i < element.elements.length; i++) {
      this.realignInnerElements(element);
    }
  }

  interChangeBand(event: CdkDragDrop<string[]>, element) {
    moveItemInArray(element, event.previousIndex, event.currentIndex);
    this.autoAlignBands();
  }

  realignInnerElements(element: any) {
    let counter: number = 0;
    let counter1: number = 0;
    // RIGHT & LEFT ALIGNMENT
    if (element.name.includes('Header Band') || element.name.includes('Footer Band')) {
      element.elements.forEach((item) => {
        item.cellFormat.left = 0;
        if (item.align == "RIGHT" && item.include == true && item.visible == true) {
          counter = counter + 1;
          item.cellFormat.left = ((element.width - counter) * this.columnWidthPx);
        } else if (item.align == "LEFT" && item.include == true && item.visible == true) {
          item.cellFormat.left = (counter1 * this.columnWidthPx);
          counter1 = counter1 + 1;
        }
        item.style = item.style + ('left: ' + item.cellFormat.left + 'px;');
      })
    } else {
      let alignElement: string;
      if (this.selectedSubElementRowIndex == 0) {
        alignElement = 'fieldHeaderCell';
      } else {
        alignElement = 'fieldDataCell';
      }
      element.elements?.forEach((item) => {
        item.fieldHeaderCell.cellFormat.left = 0;
        if (item[alignElement].align == "RIGHT" && item[alignElement].include == true && item[alignElement].visible == true) {
          counter = counter + 1;
          item.fieldHeaderCell.align = "RIGHT"; item.fieldDataCell.align = "RIGHT";
          item.fieldHeaderCell.cellFormat.left = ((element.width - counter) * this.columnWidthPx);
        } else if (item[alignElement].align == "LEFT" && item[alignElement].include == true && item[alignElement].visible == true) {
          item.fieldHeaderCell.align = "LEFT"; item.fieldDataCell.align = "LEFT";
          item.fieldHeaderCell.cellFormat.left = (counter1 * this.columnWidthPx);
          counter1 = counter1 + 1;
        }
        item.fieldDataCell.cellFormat.left = item.fieldHeaderCell.cellFormat.left;
        item.fieldHeaderCell.style = item.fieldHeaderCell.style + ('left: ' + item.fieldHeaderCell.cellFormat.left + 'px;');
        item.fieldDataCell.style = item.fieldDataCell.style + ('left: ' + item.fieldDataCell.cellFormat.left + 'px;');
      })
    }
  }

  setInnerElementStyle(element: any, rIndex: number, cIndex: number) {
    let style = '';
    let contextElement: ContextElement;
    let elementWidth: string;
    elementWidth = "width:" + (this.columnWidthPx + 1) + "px; ";
    let elementHeight: string;
    if (element.name.includes('Title Band')) {
      contextElement = element.contextElement;
      elementWidth = "width:100%; "
    } else if (element.name.includes('Header Band') || element.name.includes('Footer Band')) {
      contextElement = element.elements[cIndex];
    } else if (element.name.includes('Extraction Band')) {
      if (rIndex === 0) {
        contextElement = element.elements[cIndex].fieldHeaderCell;
      } else {
        contextElement = element.elements[cIndex].fieldDataCell;
      }
    }
    style = this.getCommonStylesFromCellFormat(contextElement.cellFormat);
    style = style + 'top: ' + ((rIndex * this.rowHeightPx)) + 'px;';
    style = style + elementWidth;
    elementHeight = "height:" + (this.rowHeightPx + 1) + "px; ";
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
    style = style + 'font-weight: ' + (cellFormat.fontStyle.includes('BOLD') ? 'bold' : 'normal') + '; ';
    style = style + 'font-style: ' + (cellFormat.fontStyle.includes('ITALIC') ? 'italic' : 'normal') + '; ';
    return style;
  }

  clearBorders(event, element: any, rIndex: number, cIndex: number) {
    if (event) {
      event.stopPropagation();
    }
    if (element.name.includes('Title Band')) {
      element.contextElement.cellFormat.borders.top.thickness = 0;
      element.contextElement.cellFormat.borders.right.thickness = 0;
      element.contextElement.cellFormat.borders.bottom.thickness = 0;
      element.contextElement.cellFormat.borders.left.thickness = 0;
    } else if (element.name.includes('Header Band') || element.name.includes('Footer Band')) {
      element.elements[cIndex].cellFormat.borders.top.thickness = 0;
      element.elements[cIndex].cellFormat.borders.right.thickness = 0;
      element.elements[cIndex].cellFormat.borders.bottom.thickness = 0;
      element.elements[cIndex].cellFormat.borders.left.thickness = 0;
    } else if (element.name.includes('Extraction Band')) {
      if (rIndex === 0) {
        element.elements[cIndex].fieldHeaderCell.cellFormat.borders.top.thickness = 0;
        element.elements[cIndex].fieldHeaderCell.cellFormat.borders.right.thickness = 0;
        element.elements[cIndex].fieldHeaderCell.cellFormat.borders.bottom.thickness = 0;
        element.elements[cIndex].fieldHeaderCell.cellFormat.borders.left.thickness = 0;
      } else {
        element.elements[cIndex].fieldDataCell.cellFormat.borders.top.thickness = 0;
        element.elements[cIndex].fieldDataCell.cellFormat.borders.right.thickness = 0;
        element.elements[cIndex].fieldDataCell.cellFormat.borders.bottom.thickness = 0;
        element.elements[cIndex].fieldDataCell.cellFormat.borders.left.thickness = 0;
      }
    }
    this.setInnerElementStyle(element, rIndex, cIndex);
  }

  clearOuterBorder(event, selectedElement, rIndex: number, cIndex: number) {
    if (event) {
      event.stopPropagation();
    }
    selectedElement.outerBorders.top.thickness = 0;
    selectedElement.outerBorders.right.thickness = 0;
    selectedElement.outerBorders.bottom.thickness = 0;
    selectedElement.outerBorders.left.thickness = 0;
    selectedElement.outerBorders.top.color = '#DCDCDC';
    selectedElement.outerBorders.right.color = '#DCDCDC';
    selectedElement.outerBorders.bottom.color = '#DCDCDC';
    selectedElement.outerBorders.left.color = '#DCDCDC';
    selectedElement.style = selectedElement.style + 'border: 1px solid #DCDCDC;'
  }

  alignElement(event, element: any, rIndex: number, cIndex: number, alignment: string) {
    if (event) {
      event.stopPropagation();
    }
    if (element.name.includes('Title Band')) {
      element.contextElement.cellFormat.textAlign = alignment;
    } else if (element.name.includes('Header Band') || element.name.includes('Footer Band')) {
      element.elements[cIndex].cellFormat.textAlign = alignment;
    } else if (element.name.includes('Extraction Band')) {
      if (rIndex === 0) {
        element.elements[cIndex].fieldHeaderCell.cellFormat.textAlign = alignment;
      } else {
        element.elements[cIndex].fieldDataCell.cellFormat.textAlign = alignment;
      }
    }
    this.setInnerElementStyle(element, rIndex, cIndex);
  }

  toggleFontStyle(event, element: any, rIndex: number, cIndex: number, style: string) {
    if (event) {
      event.stopPropagation();
    }
    let contextElement;
    if (element.name.includes('Title Band')) {
      contextElement = element.contextElement;
    } else if (element.name.includes('Header Band') || element.name.includes('Footer Band')) {
      contextElement = element.elements[cIndex];
    } else if (element.name.includes('Extraction Band')) {
      if (rIndex === 0) {
        contextElement = element.elements[cIndex].fieldHeaderCell;
      } else {
        contextElement = element.elements[cIndex].fieldDataCell;
      }
    }
    let currentStyle = contextElement.cellFormat.fontStyle;
    switch (style) {
      case 'BOLD': {
        switch (currentStyle) {
          case 'NORMAL': {
            contextElement.cellFormat.fontStyle = 'BOLD';
            break;
          }
          case 'BOLD': {
            contextElement.cellFormat.fontStyle = 'NORMAL';
            break;
          }
          case 'ITALIC': {
            contextElement.cellFormat.fontStyle = 'BOLD_ITALIC';
            break;
          }
          case 'BOLD_ITALIC': {
            contextElement.cellFormat.fontStyle = 'ITALIC';
            break;
          }
        }
        break;
      }
      case 'ITALIC': {
        switch (currentStyle) {
          case 'NORMAL': {
            contextElement.cellFormat.fontStyle = 'ITALIC';
            break;
          }
          case 'BOLD': {
            contextElement.cellFormat.fontStyle = 'BOLD_ITALIC';
            break;
          }
          case 'ITALIC': {
            contextElement.cellFormat.fontStyle = 'NORMAL';
            break;
          }
          case 'BOLD_ITALIC': {
            contextElement.cellFormat.fontStyle = 'BOLD';
            break;
          }
        }
        break;
      }
    }
    this.setInnerElementStyle(element, rIndex, cIndex);
  }

  findBandById(id: number): any {
    //title bands
    for (let band of this.layout.specification.titleBand) {
      if (band.id === id) {
        return band;
      }
    }
    //header bands
    for (let band of this.layout.specification.headerBands) {
      if (band.id === id) {
        return band;
      }
    }
    //extraction bands
    for (let band of this.layout.specification.extractionBands) {
      if (band.id === id) {
        return band;
      }
    }
    //footer bands
    for (let band of this.layout.specification.footerBands) {
      if (band.id === id) {
        return band;
      }
    }
    //no luck
    return null;
  }

  getNextId(): number {
    this.MAX_ID = this.MAX_ID + 1;
    return this.MAX_ID;
  }

  groupExistsAt(bandGroups: BandGroup[], id?: number, name?: string) {
    if (!id && !name) {
      return -1;
    }
    for (let i = 0; i < bandGroups.length; i++) {
      if ((id && id === bandGroups[i].id) || (name && name === bandGroups[i].name)) {
        return i;
      }
    }
    return -1;
  }

  initializeBandGroups(layoutBandGroupsMetadata: BandGroupMetadata[]) {
    let newLayoutBandGroups: BandGroup[] = [];
    newLayoutBandGroups.push(this.defaultGroup);
    for (let groupMetadata of layoutBandGroupsMetadata) {
      let groupIndex = this.groupExistsAt(newLayoutBandGroups, groupMetadata.groupId, groupMetadata.groupName);
      let group: BandGroup;
      if (groupIndex === -1) {
        //create new group
        group = new BandGroup();
        group.id = groupMetadata.groupId;
        group.name = groupMetadata.groupName;
        group.expanded = true;
        group.bands = [];
        newLayoutBandGroups.push(group);
      } else {
        //add to existing group
        group = this.layoutBandGroups[groupIndex];
        this.MAX_ID = group.id > this.MAX_ID ? group.id : this.MAX_ID;
      }
      //add band
      let band = this.findBandById(groupMetadata.bandId);
      if (band != null) {
        this.MAX_ID = band.id > this.MAX_ID ? band.id : this.MAX_ID;
        group.bands.push(band);
      }
    }
    this.layoutBandGroups = newLayoutBandGroups;
    this.setVisibilityDeletable();
  }

  setVisibilityDeletable() {
    this.layout.specification.titleBand?.forEach((band) => {
      band.visible = true;
      band.contextElement.deletable = false;
    });
    this.layout.specification.headerBands?.forEach((band) => {
      band.visible = true;
      band.elements.forEach(element => {
        element.visible = true;
        element.deletable = true;
      })
    });
    this.layout.specification.footerBands?.forEach((band) => {
      band.visible = true;
      band.elements.forEach(element => {
        element.visible = true;
        element.deletable = true;
      })
    });
    this.layout.specification.extractionBands?.forEach((band) => {
      band.visible = true;
      band.elements.forEach(element => {
        element.fieldHeaderCell.visible = true;
        element.fieldDataCell.visible = true;
        element.fieldHeaderCell.deletable = true;
        element.fieldDataCell.deletable = true;
      })
    });
  }

  autoAlignBands(event?) {
    if (event) {
      event.stopPropagation();
    }
    let maxHeightUsed: number = 0;
    for (let bandGroup of this.layoutBandGroups) {
      for (let band of bandGroup.bands) {
        if (band.include) {
          let style = this.getElementStyle(band);
          if (!band.anchored) {
            style += 'top: ' + (maxHeightUsed * this.rowHeightPx) + 'px;';
            style += 'left: ' + 0 + 'px;';
            maxHeightUsed = maxHeightUsed + band.height + band.margins.top + band.margins.bottom;
          }
          band.style = style;
        } else {
          // band.style = 'display: none;';
        }
      }
    }
  }

  disableGroupVisibility(event, group: BandGroup) {
    event.stopPropagation();
    for (let band of group.bands) {
      band.visible = false;
    }
  }

  enableGroupVisibility(event, group: BandGroup) {
    event.stopPropagation();
    for (let band of group.bands) {
      band.visible = true;
    }
  }

  toggleVisibility(event, element: any, band?) {
    event.stopPropagation();
    element.visible = !element.visible;
    if (band) {
      this.realignInnerElements(band);
    }
  }

  toggleAnchors(event, element: any) {
    if (event) {
      event.stopPropagation();
    }
    element.anchored = !element.anchored;
    element.style = this.getElementStyle(element);
    this.autoAlignBands();
  }

  onElementInclusivityChange(element: any, band?) {
    element.include = !element.include;
    this.autoAlignBands();
    if (band) {
      this.realignInnerElements(band);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event) {
    if (event.key === "Shift") {
      event.preventDefault();
      this.shiftKeyDown = true;
      return;
    }
    if (event.key === "Control") {
      event.preventDefault();
      this.ctrlKeyDown = true;
      return;
    }
    if (event.key === "Alt") {
      event.preventDefault();
      this.altKeyDown = true;
      return;
    }
  }
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event) {
    if (event.key === "Shift") {
      this.shiftKeyDown = false;
      return;
    }
    if (event.key === "Control") {
      this.ctrlKeyDown = false;
      return;
    }
    if (event.key === "Alt") {
      this.altKeyDown = false;
      return;
    }
    if (this.selectedElement) {
      event.preventDefault();
      if (event.key === "Delete") {
        if (this.selectedElement.name.includes('Title Band') || this.selectedElement.name.includes('Header Band') || this.selectedElement.name.includes('Footer Band') || this.selectedElement.name.includes('Extraction Band')) {
          this.deleteElement(null, this.selectedElement);
        }
        return;
      }
      if (this.altKeyDown && event.key === "a") {
        this.toggleAnchors(null, this.selectedElement);
        return;
      }
      if (this.shiftKeyDown) {
        //only title bands are allowed to be resized vertically
        if (this.selectedElement.height && this.selectedElement.name.includes('Title Band')) {
          if (event.key === "ArrowDown") {
            this.selectedElement.height = this.selectedElement.height + 1;
            this.selectedElement.contextElement.style = this.selectedElement.contextElement.style + 'height:' + this.selectedElement.height * this.rowHeightPx + 'px; '
          }
          if (event.key === "ArrowUp") {
            this.selectedElement.height = this.selectedElement.height > 1 ? this.selectedElement.height - 1 : 1;
            this.selectedElement.contextElement.style = this.selectedElement.contextElement.style + 'height:' + this.selectedElement.height * this.rowHeightPx + 'px; '
          }
        }
        //TITLE BANDS
        if (this.selectedElement.width && this.selectedElement.name.includes('Title Band')) {
          if (event.key === "ArrowRight") {
            this.selectedElement.width = this.selectedElement.width + 1;
          }
          if (event.key === "ArrowLeft") {
            this.selectedElement.width = this.selectedElement.width > 1 ? this.selectedElement.width - 1 : 1;
          }
        }
        //HEADER & FOOTER BANDS
        if (this.selectedElement.width && !(this.selectedElement.name.includes('Title Band'))) {
          if (event.key === "ArrowRight") {
            this.selectedElement.width = this.selectedElement.width + 1;
            //update inner element alignments
            this.realignInnerElements(this.selectedElement);
          }
          if (event.key === "ArrowLeft") {
            if (this.selectedElement.width === this.selectedElement.elements.length) {
              this.showNotification('warning', 'Remove band items to further shrink the width.');
            } else {
              this.selectedElement.width = this.selectedElement.width > 1 ? this.selectedElement.width - 1 : 1;
              //update inner element alignments
              this.realignInnerElements(this.selectedElement);
            }
          }
        }
      } else if (this.ctrlKeyDown) {
        if (this.selectedElement.margins) {
          if (event.key === "ArrowDown") {
            if (this.altKeyDown) {
              this.selectedElement.margins.bottom = this.selectedElement.margins.bottom > 0 ? this.selectedElement.margins.bottom - 1 : 0;
            } else {
              this.selectedElement.margins.bottom = this.selectedElement.margins.bottom + 1;
            }
          }
          if (event.key === "ArrowUp") {
            if (this.altKeyDown) {
              this.selectedElement.margins.top = this.selectedElement.margins.top > 0 ? this.selectedElement.margins.top - 1 : 0;
            } else {
              this.selectedElement.margins.top = this.selectedElement.margins.top + 1;
            }
          }
          if (event.key === "ArrowRight") {
            if (this.altKeyDown) {
              this.selectedElement.margins.right = this.selectedElement.margins.right > 0 ? this.selectedElement.margins.right - 1 : 0;
            } else {
              this.selectedElement.margins.right = this.selectedElement.margins.right + 1;
            }
          }
          if (event.key === "ArrowLeft") {
            if (this.altKeyDown) {
              this.selectedElement.margins.left = this.selectedElement.margins.left > 0 ? this.selectedElement.margins.left - 1 : 0;
            } else {
              this.selectedElement.margins.left = this.selectedElement.margins.left + 1;
            }
          }
        }
      } else {
        if (this.selectedElement.anchored) {
          if (event.key === "ArrowDown") {
            this.selectedElement.anchorY = this.selectedElement.anchorY + 1;
          }
          if (event.key === "ArrowUp") {
            this.selectedElement.anchorY = this.selectedElement.anchorY > 0 ? this.selectedElement.anchorY - 1 : 0;
          }
          if (event.key === "ArrowRight") {
            this.selectedElement.anchorX = this.selectedElement.anchorX + 1;
          }
          if (event.key === "ArrowLeft") {
            this.selectedElement.anchorX = this.selectedElement.anchorX > 0 ? this.selectedElement.anchorX - 1 : 0;
          }
        } else {
          if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) {
            this.showNotification('warning', 'Enable anchors first to move this element.')
          }
        }
      }
      this.selectedElement.style = this.getElementStyle(this.selectedElement);
      this.autoAlignBands();
    } else {

    }
  }

  refreshCanvasDimensions() {
    this.canvasWidthPx = this.canvasWidth * this.columnWidthPx;
    this.canvasHeightPx = this.canvasHeight * this.rowHeightPx;
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

  onCanvasScrolled(e) {
    if (this.canvasGridParent.offsetHeight + this.canvasGridParent.scrollTop >= this.canvasGridParent.scrollHeight) {
      this.canvasHeight = this.canvasHeight + 5;
      this.refreshCanvasDimensions();
    }
    if (this.canvasGridParent.offsetWidth + this.canvasGridParent.scrollLeft >= this.canvasGridParent.scrollWidth) {
      this.canvasWidth = this.canvasWidth + 5;
      this.refreshCanvasDimensions();
      this.refreshCanvasColumnLabels();
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

  printSpecification(event) {
    if (event) {
      event.stopPropagation();
    }
    console.log(this.layout.specification);
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  getEditorLanguage(event) {
    switch (event) {
      case "STATIC_TEXT":
        this.editorOptions.language = 'text';
        break;
      case "EVALUATE_JS":
        this.editorOptions.language = 'javascript';
        break;
      case "SQL":
        this.editorOptions.language = 'sql';
        break;
      case "QUERY_FIELD":
        this.editorOptions.language = 'sql';
        break;
    }
  }

  applyStylesForUpdate() {
    //apply theme
    //title & subtitle bands
    for (let i = 0; i < this.layout.specification.titleBand?.length; i++) {
      this.setInnerElementStyle(this.layout.specification.titleBand[i], 0, 0);
      this.realignInnerElements(this.layout.specification.titleBand[i]);
    }
    //header bands
    for (let i = 0; i < this.layout.specification.headerBands?.length; i++) {
      for (let j = 0; j < this.layout.specification.headerBands[i].elements.length; j++) {
        this.setInnerElementStyle(this.layout.specification.headerBands[i], 0, j);
      }
      this.realignInnerElements(this.layout.specification.headerBands[i]);
    }
    //footer bands
    for (let i = 0; i < this.layout.specification.footerBands?.length; i++) {
      for (let j = 0; j < this.layout.specification.footerBands[i].elements.length; j++) {
        this.setInnerElementStyle(this.layout.specification.footerBands[i], 0, j);
      }
      this.realignInnerElements(this.layout.specification.footerBands[i]);
    }
    //data bands
    for (let i = 0; i < this.layout.specification.extractionBands?.length; i++) {
      for (let j = 0; j < this.layout.specification.extractionBands[i].elements.length; j++) {
        this.setInnerElementStyle(this.layout.specification.extractionBands[i], 0, j);
        this.setInnerElementStyle(this.layout.specification.extractionBands[i], 1, j);
      }
      this.realignInnerElements(this.layout.specification.extractionBands[i])
    }
  }

  openEditFormula(formulaType: string, formulaValue: string) {
    let formulaParameter = [];
    if (this.selectedElement.name.includes('Extraction Band')) {
      this.selectedElement.elements.forEach(element => {
        formulaParameter.push(element.fieldHeaderCell.name);
      });
    }
    const dialogRef = this.dialog.open(EditFormulaPopupComponent, {
      width: '1000px',
      hasBackdrop: false,
      // panelClass: 'no-pad-dialog',
      data: { formulaType: formulaType, formulaValue: formulaValue, formulaParam: formulaParameter }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.selectedSubElement.cellData.value = result;
      }
    });
  }

}
