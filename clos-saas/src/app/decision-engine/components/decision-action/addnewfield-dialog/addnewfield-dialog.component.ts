import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ActionFieldDetail } from 'src/app/decision-engine/models/DecisionAction';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { FieldEditorService } from '../field-editor.service';

@Component({
  selector: 'app-addnewfield-dialog',
  templateUrl: './addnewfield-dialog.component.html',
  styleUrls: ['./addnewfield-dialog.component.scss']
})
export class AddnewfieldDialogComponent implements OnInit {
  objectModelField: ActionFieldDetail = {} as ActionFieldDetail;
  fieldData: ActionFieldDetail[] = [];
  tableFieldList;

  constructor(
    public dialogRef: MatDialogRef<AddnewfieldDialogComponent>,  
    private notifierService: NotifierService,
    public fieldEditorService: FieldEditorService,
    @Inject(MAT_DIALOG_DATA) public data: { editableData: any}    
  ) {
    if (data && data.editableData) {
      this.tableFieldList = data.editableData;
    }
    }
 
  ngOnInit(): void {
    this.OnEditClick();
  }
  
  onCloseClick(){
    this.dialogRef.close();
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  // To add fields in table
  addField() {
    const actionField: ActionFieldDetail = {
      id: this.objectModelField.id,
      field_name: this.objectModelField.field_name,
      field_type: this.objectModelField.field_type,
      description: this.objectModelField.description,
      tag: this.objectModelField.tag,
      in_use: this.objectModelField.in_use,
      source: this.objectModelField.source,
      others: this.objectModelField.others,
    }; 
    this.fieldData.push(actionField);
    this.fieldEditorService.createNewField(actionField).subscribe(
      (res) => {
        this.showNotification('success', 'Fields added successfully.')
        this.objectModelField = {} as ActionFieldDetail;
        this.onCloseClick();
      }),
      (err) => {
        console.log(err);
        this.showNotification('error', 'Oops! something went wrong.');
      }
  }
  
    // Edit table field
    OnEditClick() {
      if (this.tableFieldList) {      
        this.objectModelField.id = this.tableFieldList.id;
        this.objectModelField.field_name = this.tableFieldList.field_name;
        this.objectModelField.field_type = this.tableFieldList.field_type;
        this.objectModelField.description = this.tableFieldList.description;
        this.objectModelField.tag = this.tableFieldList.tag;
        this.objectModelField.in_use = this.tableFieldList.in_use;
        this.objectModelField.source = this.tableFieldList.source;
        this.objectModelField.others = this.tableFieldList.others;
      }
     }

  // update table fields
  updateField(id) {
    this.fieldEditorService.updateAddedFields(this.objectModelField.id, this.objectModelField).subscribe(
      (res) => {
        this.objectModelField = {} as ActionFieldDetail;
      },
      (err) => {
        console.log(err);
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
    this.dialogRef.close();
  }

}
