import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { Others } from '../../../variables/models/variable-models';

@Component({
  selector: 'app-rule-editor',
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss']
})
export class RuleEditorComponent implements OnInit {

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
    public dialogRef: MatDialogRef<RuleEditorComponent>,
    private url: UrlService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)public data: RuleEditorComponent,
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
