import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ObjectModelFieldDetail } from '../../../../models/ObjectModel';
import { ObjectModelService } from '../../../../services/Object-model.service';

@Component({
  selector: 'app-object-table',
  templateUrl: './object-table.component.html',
  styleUrls: ['./object-table.component.scss']
})
export class ObjectTableComponent implements OnInit {

  editableInput: boolean = false;

  @Input() item: ObjectModelFieldDetail[] = [];

  @Output() valueChange = new EventEmitter();

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  constructor(
    private objectModelService: ObjectModelService,
    private notifierService: NotifierService,
  ) { }

  ngOnInit(): void {
  }

  onDoubleClick(editableInput: ObjectModelFieldDetail) {
    editableInput.editableMode = true;
    this.editableInput = true;
  }

  onSaveClick(childData: ObjectModelFieldDetail) {
    console.log('OnSvclick', childData);
    childData.editableMode = false;
    this.editableInput = false;
    // console.log(childData);
    this.objectModelService.updateChildObjectModel(childData.id, childData).subscribe(
      (res) => {
        console.log(res);
        this.showNotification('success', 'Updated successfully.');
        this.valueChanged();
        this.putField(childData);
      },
      (err) => {
        console.log(err);
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  valueChanged() {
    console.log('Changes Made!');
    this.valueChange.emit('changes made');
  }

  addField(){
    let newField = new ObjectModelFieldDetail();
    console.log('Field added successfully.', this.item);
    newField.parent = this.item[0].parent;
    newField.id = this.item.length + 1;
    this.item.unshift(newField);
    console.log(this.item);
  }

  deleteObject(child){
    this.objectModelService.deleteObjectModel(child.id).subscribe(
      (res) => {
        console.log(res);
        this.showNotification('success', 'Deleted successfully.');
        this.parentFun.emit();
      },
      (err) => {
        console.log(err);
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
  }

  putField(childData) {
    let json = {
      "parent": childData.parent, 
      "id": childData.id, 
      "editableMode": childData.editableMode, 
      "name": childData.name, 
      "type": childData.type
    };
    this.objectModelService.putObject(childData.parent,json).subscribe(
      res => {
        this.parentFun.emit();
        this.showNotification('success', res);
      },
      err => {
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
    }
}
