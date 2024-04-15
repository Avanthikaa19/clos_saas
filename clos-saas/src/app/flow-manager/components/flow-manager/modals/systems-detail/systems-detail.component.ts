import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
import { DFMSystem } from '../../models/models-v2';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';

@Component({
  selector: 'app-systems-detail',
  templateUrl: './systems-detail.component.html',
  styleUrls: ['./systems-detail.component.scss'],
  animations: [fadeInOut]
})
export class SystemsDetailComponent implements OnInit {

  loadingItems: boolean = false;
  selectedTabIndex: number = 0;

  originalName: string = '';
  messageIcon: string = '';
  saving: boolean = false;

  system: DFMSystem;

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    private notifierService: NotifierService, 
    public dialogRef: MatDialogRef<SystemsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SystemsDetailComponent,
  ) { 
    if (data && data.system) {
      this.system = data.system;
      this.originalName = this.system.displayName;
    } else {
      this.system = new DFMSystem();
      this.system.systemName = '';
      this.system.systemDescription = '';
      this.system.systemCategory = '';
      this.system.displayName = '';
      this.system.displayColor = 'dimgray';
    }
  }

  ngOnInit(): void {
  }

  createSystem() {
    this.saving = true;
    this.flowManagerDataService.createSystem(this.system).subscribe(
      res => {
        if(!this.isColor(this.system.displayColor)) {
          this.system.displayColor = 'dimgray';
          this.showNotification('warning', 'Given color is not a valid color. Default dimgray will be used.');
        }
        this.showNotification('success', 'System configured successfully. ID: ' + res.id);
        this.dialogRef.close('System configured successfully. ID: ' + res.id);
        this.saving = false;
      },
      err => {
        console.error(err);
        this.showNotification('error', err.error);
        this.saving = false;
      }
    );
  }

  updateSystem() {
    this.saving = true;
    this.flowManagerDataService.updateSystem(this.system).subscribe(
      res => {
        if(!this.isColor(this.system.displayColor)) {
          this.system.displayColor = 'dimgray';
          this.showNotification('warning', 'Given color is not a valid color. Default dimgray will be used.');
        }
        this.showNotification('success', 'System configuration updated successfully. ID: ' + res.id);
        this.dialogRef.close('System configuration updated successfully. ID: ' + res.id);
        this.saving = false;
      },
      err => {
        console.error(err);
        this.showNotification('error', err.error);
        this.saving = false;
      }
    );
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  canSave(): string {
    this.messageIcon = '';
    if (!this.system.systemName || !this.system.systemName.trim()) {
      this.messageIcon = 'info';
      return 'System name is a required field.';
    } else if (this.system.systemName.length < 5) {
      this.messageIcon = 'info';
      return 'System name should be at least 5 characters long.';
    }
    if (!this.system.systemDescription || !this.system.systemDescription.trim()) {
      this.messageIcon = 'info';
      return 'System description is a required field.';
    } else if (this.system.systemDescription.length < 10) {
      this.messageIcon = 'info';
      return 'System description should be at least 10 characters long.';
    }
    return null;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  isColor(strColor) :boolean {
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
  }

}
