import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiffEditorModel } from 'ngx-monaco-editor';
import { fadeInOut } from 'src/app/app.animations';
import { CustomServiceService } from '../service/custom-service.service';

@Component({
  selector: 'app-query-detail',
  templateUrl: './query-detail.component.html',
  styleUrls: ['./query-detail.component.scss'],
  animations:[fadeInOut]
})
export class QueryDetailComponent implements OnInit {
  editorOptions = {
    theme: 'vs-dark', 
    language: 'sql', 
    suggestOnTriggerCharacters: false,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    autoIndent: "full"
  };
  diffOptions = {
    theme: 'vs-dark',
    readOnly: true,
    scrollBeyondLastLine: false
  };
  originalModel: DiffEditorModel = {
    code: '',
    language: 'sql'
  };
  modifiedModel: DiffEditorModel = {
    code: '',
    language: 'sql'
  };
  unsavedSql:string='';
  pageSizeIndex:number=10;
  page:number=0;
  tableData:any=[];
  totalCount:any;
  selectedTabIndex: number = 0;
  showQuery:boolean=false;
  showData:boolean=false;

  onTabChanged($event) {
    let clickedIndex = $event.index;
    if(clickedIndex == 1) {
      this.modifiedModel = {
        code: this.unsavedSql,
        language: 'sql'
      };
      this.originalModel = {
        code: this.layoutData.tableData.queryText,
        language: 'sql'
      };
    }
  }
  constructor(
    public customService:CustomServiceService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<QueryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public layoutData: any,
  ) { }

  ngOnInit(): void {
    if(this.layoutData!==null || this.layoutData!==undefined){
      this.unsavedSql=this.layoutData.tableData.queryText;
      this.modifiedModel.code = this.unsavedSql;
    }
  }
  dataGeneration(){
    this.showQuery=!this.showQuery
  }
  error:any='';
  showQueryData(queryText:any){
    this.unsavedSql=queryText;
    this.showData=!this.showData
    this.customService.getQueryData(this.layoutData.type, queryText,this.page+1 ,this.pageSizeIndex).subscribe(
      res=>{
        if(this.layoutData.type=='candleStick'){
        this.tableData = res;
        }
        if(this.layoutData.type!=='candleStick'){
          this.tableData = res;
          }
        this.totalCount=res['count'];
      },err =>{
        console.log(err)
        this.error=err.error
      }
    )
    }
    apply(){
    this.showData=!this.showData
    if(this.layoutData.type=='card'){
      this.layoutData.type='cardChart'
    }
    sessionStorage.setItem('modifiedQuery',this.modifiedModel.code)
    this.customService.getQueryData(this.layoutData.type, this.unsavedSql,this.page+1 ,this.pageSizeIndex).subscribe(
      res=>{
        // if(this.layoutData.type=='candleStick'){
        // this.tableData = res;
        // }
        // if(this.layoutData.type!=='candleStick'){
          this.tableData = res;
          // }
        this.totalCount=res['count'];
        let response = [this.tableData,this.layoutData.type,this.unsavedSql]
        this.dialogRef.close(response)
      },err =>{
        console.log(err)
        this.error=err.error
      }
    )
    }
  onClose(){
    this.dialogRef.close();
  }
}
