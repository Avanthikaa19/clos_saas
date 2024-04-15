import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Others } from '../../../../../models/Variables';
import { UrlService } from '../../../../../services/http/url.service';

@Component({
  selector: 'app-python-editor',
  templateUrl: './python-editor.component.html',
  styleUrls: ['./python-editor.component.scss']
})
export class PythonEditorComponent implements OnInit {

  pythonCode: Others; 
  variableFields: any;

  editorOptions = {
    theme: 'vs-dark', language: 'python',
    fontFamily: "Consolas, 'Courier New', monospace",
    fontSize: 14,
    fontLigatures: false,
    colorDecorators: true,
    dragAndDrop: true,
    linkedEditing: true,
    minimap: {
      enabled: true,
    },
    mouseWheelZoom: true,
    showFoldingControls: 'always',
    useTabStops: true,
  };

  fileName: string ='';
  code: string = '';

  editorTheme: string[] = ['hc-black', 'vs-dark', 'vs'];

  constructor(
    public dialogRef: MatDialogRef<PythonEditorComponent>,
    private url: UrlService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)public data: PythonEditorComponent,
  ) { 
    if(data.variableFields){
      this.pythonCode = JSON.parse(data.variableFields);
    }else{
      this.pythonCode =  new Others();
    }
  }

  ngOnInit(): void {
    console.log('Python', this.pythonCode);
  }

  onThemeChange(theme: string) {
    this.editorOptions = { ...this.editorOptions, theme: theme };
  }
  
  editorFields(){
    let stringfyData = JSON.stringify(this.pythonCode);
    this.onNoClick(stringfyData);
  }

  onNoClick(code: string): void {
    this.dialogRef.close(code);
  }

}
