import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
// import { Layout, LayoutSpec, TitleBand, Theme, ContextBand, ContextElement } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';
// import { ThemeChooserComponent } from '../theme-chooser/theme-chooser.component';
import { ThemeDetailComponent } from '../theme-detail/theme-detail.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatMenuTrigger } from '@angular/material/menu';
import { fadeInOut } from 'src/app/app.animations';
import { ContextBand, ContextElement, Layout, Theme } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { ThemeChooserComponent } from '../theme-chooser/theme-chooser.component';

@Component({
  selector: 'app-layout-detail',
  templateUrl: './layout-detail.component.html',
  styleUrls: ['./layout-detail.component.scss'],
  animations: [fadeInOut]
})
export class LayoutDetailComponent implements OnInit {

  layout: Layout;

  defaultBorderColor: string = '#F5F5F5';

  saving: boolean = false;
  applyingTheme: boolean = false;

  visibilities: { displayName: string, value: string }[] = [
    { displayName: 'Myself Only', value: 'OWNER_ONLY' },
    { displayName: 'Everyone', value: 'EVERYONE' }
  ];

  cellDataTypes: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<LayoutDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LayoutDetailComponent,
    private reportPortalDataService: ReportPortalDataService,
    private authenticationService: JwtAuthenticationService,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) {
    this.layout = data.layout;
    // if (!this.layout) {
    //   this.layout = new Layout();
    //   this.layout.name = '';
    //   this.layout.description = '';
    //   this.layout.id = null;
    //   this.layout.owner = this.authenticationService.userProfile.user.username;
    //   this.layout.visibleTo = 'OWNER_ONLY';
    //   this.layout.editableBy = 'OWNER_ONLY';
    //   this.layout.specification = new LayoutSpec();
    //   //TITLE
    //   this.layout.specification.titleBand = new TitleBand();
    //   this.layout.specification.titleBand.margins = {
    //     top: 0,
    //     bottom: 1,
    //     left: 0,
    //     right: 0
    //   };
    //   this.layout.specification.titleBand.include = true;
    //   this.layout.specification.titleBand.contextElement = {
    //     cellData: {
    //       type: 'STATIC_TEXT',
    //       value: 'Title'
    //     },
    //     cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //   }
    //   //SUBTITLE
    //   this.layout.specification.subTitleBand = new TitleBand();
    //   this.layout.specification.subTitleBand.margins = {
    //     top: 0,
    //     bottom: 1,
    //     left: 1,
    //     right: 1
    //   };
    //   this.layout.specification.subTitleBand.include = true;
    //   this.layout.specification.subTitleBand.contextElement = {
    //     cellData: {
    //       type: 'STATIC_TEXT',
    //       value: 'Subtitle'
    //     },
    //     cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //   }
    //   //HEADER
    //   this.layout.specification.headerBands = [
    //     {
    //       margins: {
    //         top: 0,
    //         bottom: 1,
    //         left: 0,
    //         right: 0
    //       },
    //       elementsLeft: [
    //         {
    //           cellData: {
    //             type: 'STATIC_TEXT',
    //             value: 'Gen.Date:'
    //           },
    //           cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //         },
    //         {
    //           cellData: {
    //             type: 'SQL',
    //             value: 'SELECT TO_CHAR(SYSDATE, \'DD-MMM-YYYY\') FROM DUAL'
    //           },
    //           cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //         }
    //       ],
    //       elementsRight: [
    //         {
    //           cellData: {
    //             type: 'STATIC_TEXT',
    //             value: 'Gen.User:'
    //           },
    //           cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //         },
    //         {
    //           cellData: {
    //             type: 'STATIC_TEXT',
    //             value: this.authenticationService.userProfile.user.username
    //           },
    //           cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //         }
    //       ]
    //     }
    //   ];
    //   //DATA
    //   this.layout.specification.extractionBands = [];
    //   //FOOTER
    //   this.layout.specification.footerBands = [
    //     {
    //       margins: {
    //         top: 0,
    //         bottom: 1,
    //         left: 0,
    //         right: 0
    //       },
    //       elementsLeft: [],
    //       elementsRight: []
    //     }
    //   ];
    // }
  }

  ngOnInit(): void {
    this.loadCellDataTypes();
    //this.openThemeSelection('Base');
  }

  onClose(): void {
    this.dialogRef.close();
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

  createLayout() {
    this.saving = true;
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

  openThemeSelection(applyTo: string, applyToIndex?: number) {
    let title = '';
    if (applyTo === 'Base') {
      title = 'Select Base Theme'
    } else {
      //get title for data band using index
      //TODO
    }
    const dialogRef = this.dialog.open(ThemeChooserComponent, {
      width: '1000px',
      data: {
        title: title,
        propagate: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        switch (applyTo) {
          case 'Base': {
            this.applyBaseTheme(result.theme.id, result.propagate);
            break;
          }
        }
      }
    });
  }

  applyBaseTheme(themeId: number, propagate?: boolean) {
    //load theme
    this.applyingTheme = true;
    this.reportPortalDataService.getTheme(themeId).subscribe(
      res => {
        let theme: Theme = res;
        this.layout.specification.baseThemeId = themeId;
        this.layout.specification.baseTheme = theme;
        //apply theme
        //title & subtitle bands
        for (let i = 0; i < this.layout.specification.titleBand.length; i++) {
          this.layout.specification.titleBand[i].contextElement.cellFormat = theme.specification.titleCell;
        }
        //header bands
        for (let i = 0; i < this.layout.specification.headerBands.length; i++) {
          //left elements
          for (let j = 0; j < this.layout.specification.headerBands[i].elements.length; j++) {
            this.layout.specification.headerBands[i].elements[j].cellFormat = theme.specification.headerCell;
          }
        }
        //footer bands
        for (let i = 0; i < this.layout.specification.footerBands.length; i++) {
          //left elements
          for (let j = 0; j < this.layout.specification.footerBands[i].elements.length; j++) {
            this.layout.specification.footerBands[i].elements[j].cellFormat = theme.specification.footerCell;
          }
        }
        //data bands
        if (propagate) {
          for (let i = 0; i < this.layout.specification.extractionBands.length; i++) {
            for (let j = 0; j < this.layout.specification.extractionBands[i].elements.length; j++) {
              this.layout.specification.extractionBands[i].elements[j].fieldHeaderCell.cellFormat = theme.specification.fieldHeaderCell;
              this.layout.specification.extractionBands[i].elements[j].fieldDataCell.cellFormat = theme.specification.fieldDataCell;
            }
          }
        }
        // this.changeDetectorRef.detectChanges();
        this.showNotification('info', 'Base theme applied successfully.');
        this.applyingTheme = false;
      },
      err => {
        this.applyingTheme = false;
      }
    );
  }

  addBandItem(band: ContextBand, align: string) {
    align = align.toLowerCase();
    let element: ContextElement = new ContextElement();
    element.cellData = {
      type: 'STATIC_TEXT',
      value: 'Sample Text'
    }
    element.cellFormat = ThemeDetailComponent.getDefaultCellFormat();

    switch (align) {
      case 'left': {
        element.align = "LEFT";
        break;
      }
      default: {
        element.align = "RIGHT";
      }
    }
    band.elements.push(element);
  }

  drop(event: CdkDragDrop<ContextElement[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        // this.layout.specification.headerBands[0].elementsLeft, 
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  //TASK NODES RIGHT CLICK MENU & ACTIONS
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event, type: string, selectedParent: any, selectedParentIndex: number, selectedItem: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = {
      'type': type,
      'selectedParent': selectedParent,
      'selectedParentIndex': selectedParentIndex,
      'selectedItem': selectedItem
    };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  test(type, parent, item) {
    console.log(type, parent, item);
  }

  removeFromParent(parent: any[], item: any) {
    for (let i = 0; i < parent.length; i++) {
      if (parent[i] === item) {
        parent.splice(i, 1);
      }
    }
  }

  removeHeaderBand(i) {
    this.layout.specification.headerBands.splice(i, 1);
  }

  addHeaderBand() {
    // this.layout.specification.headerBands.push(
    //   {
    //     margins: {
    //       top: 0,
    //       bottom: 1,
    //       left: 0,
    //       right: 0
    //     },
    //     elementsLeft: [
    //       // {
    //       //   cellData: {
    //       //     type: 'STATIC_TEXT',
    //       //     value: ''
    //       //   },
    //       //   cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //       // }
    //     ],
    //     elementsRight: [
    //       // {
    //       //   cellData: {
    //       //     type: 'STATIC_TEXT',
    //       //     value: ''
    //       //   },
    //       //   cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //       // }
    //     ]
    //   }
    // );
  }

  addFooterBand() {
    // this.layout.specification.footerBands.push(
    //   {
    //     margins: {
    //       top: 0,
    //       bottom: 1,
    //       left: 0,
    //       right: 0
    //     },
    //     elementsLeft: [
    //       {
    //         cellData: {
    //           type: 'STATIC_TEXT',
    //           value: ''
    //         },
    //         cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //       }
    //     ],
    //     elementsRight: [
    //       {
    //         cellData: {
    //           type: 'STATIC_TEXT',
    //           value: ''
    //         },
    //         cellFormat: ThemeDetailComponent.getDefaultCellFormat()
    //       }
    //     ]
    //   }
    // );
  }

  openContextElementEditor(isHeader: boolean, bandIndex: number, isLeftSide: boolean, elementIndex: number, element: ContextElement) {

  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}
