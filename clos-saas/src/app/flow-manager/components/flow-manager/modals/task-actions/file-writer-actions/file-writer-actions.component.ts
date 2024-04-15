import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../models/models-v2';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
import { AccessControlData } from 'src/app/app.access';

@Component({
  selector: 'app-file-writer-actions',
  templateUrl: './file-writer-actions.component.html',
  styleUrls: ['./file-writer-actions.component.scss']
})
export class FileWriterActionsComponent implements OnInit {

//uploadFilePath: string = '/apps/app_tmr/dfm';
downloadFileName: string 
task: Task;
tId: number;

@Input()
get taskId() {
  return this.tId;
}
set taskId(val) {
  this.tId = val;
}
// get filePath() {
//   return this.uploadFilePath;
// }
// set filePath(val) {
//   this.uploadFilePath = val;
// }
@Input()
get fileName() {
  return this.downloadFileName;
}
set fileName(val) {
  this.downloadFileName = val;
}

constructor(private flowManagerDataService: FlowManagerDataService,
  private snackBar: MatSnackBar, public ac : AccessControlData) { 
  // if(this.filePath == undefined || this.filePath == null) {
  //   this.filePath = '/apps/app_tmr/dfm';
  // }
  if(this.fileName == undefined || this.fileName == null) {
    this.fileName = '';
  } 
  if(this.taskId == undefined || this.taskId == null) {
    this.taskId
  } 
  // console.log(this.fileName);
  }

ngOnInit(): void {
  console.log(this.taskId)
  console.log(this.fileName)
}

exportFile(){
  console.log(this.taskId)
  console.log(this.fileName)
  this.flowManagerDataService.downloadFile(this.taskId,this.fileName).subscribe(
  res =>{
      console.log(res);
      if('this.fileName.csv'){
      var blob = new Blob([res], {type: 'text/csv'});
      var url = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = `${this.fileName}`;
      anchor.href = url;
      anchor.click();
      this.openSnackBar(('Downloaded Sucessfully'), '');
    } 
     else if('this.fileName.xml'){
      var blob = new Blob([res], {type: 'text/plain'});
      var url = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = `${this.fileName}`;
      anchor.href = url;
      anchor.click();
      this.openSnackBar(('Downloaded Sucessfully'), '');
    }
  },
    (err) => {
      //TO CONVERT ARRAY BUFFER FORMAT INTO STRING FORMAT
      var enc = new TextDecoder()
      console.log(enc.decode(err.error))
      this.openSnackBar(enc.decode(err.error), '');
      // console.log(err.error)
      // this.openSnackBar((err.error), '');
    }
  )
}

//open snack bar
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 2000,
  });
}


}
