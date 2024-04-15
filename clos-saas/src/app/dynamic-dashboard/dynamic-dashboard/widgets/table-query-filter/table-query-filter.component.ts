import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { QueryFieldCustomDashBoard, SearchScope, WhereCondition } from '../../models/model';
import { CustomServiceService } from '../../service/custom-service.service';

@Component({
  selector: 'app-table-query-filter',
  templateUrl: './table-query-filter.component.html',
  styleUrls: ['./table-query-filter.component.scss']
})
export class TableQueryFilterComponent implements OnInit {
  loading: boolean = false;
  queryField: QueryFieldCustomDashBoard = new QueryFieldCustomDashBoard(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
  allTableNames: string[];
  allTableColumns: any = [];
  allTableColumns2: any = [];
  aggregation: string[]=['MIN','MAX','AVG','COUNT','SUM'];
  disable: boolean;
  error: string;
  showQuery: boolean = false;
  showData: boolean = false;
  tableData: any;
  chartType: any;
  whereList=[];
  isJoin: boolean = false;
  order: any = ['asc','desc'];
  @ViewChild("queryBox", { static: false }) query;
  
  tableHeader: string[] = [];
  queryText: any;
  savedQuery: any;
  searchList:string='';
  allTableWhereColumns1: string[] = [];
  allTableWhereColumns2: string[] = [];
  whereList2=[];
  fieldValue:any;
  queryAdd=[];
  queryAdd2=[];
  tableName:any='';

  page: number = 0;
  searchScope: SearchScope = new SearchScope(10, 'Query-Builder');
  constructor(public dialogRef: MatDialogRef < TableQueryFilterComponent > ,
    private url: UrlService,
    public dialog: MatDialog,
    public customService: CustomServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
      if(data.widget.queryText != null || data.widget.queryText != undefined){
        console.log(this.data)
        // console.log(this.data.widget)
        this.queryText = data.widget.queryText;
        this.tableData = data.widget.actualData;
        this.showQuery = true;
        this.showData = true;
        this.showTableColumn();
        this.showTableColumn2();
      }
      else{
        this.queryField.where = [new WhereCondition (null,"","","","","")];
        this.queryField.where2 = [new WhereCondition (null,"","","","","")];
      }
     }

  ngOnInit(): void {
    if(this.data.chartType=='card'||this.data.widget.type=='cardChart'){
      if(this.queryField?.columnName1!==null){
      // this.queryField.columnName1=[this.queryField.columnName1]
      this.queryField.columnName2=['']
      }
    }
    if(this.data.chartType=='gaugeChart'){
      if(this.queryField?.columnName1!==null){
        // this.queryField.columnName1=[this.queryField.columnName1]
        this.queryField.columnName2=['']
        }
    }
    if(this.data.widget.query==null){
      console.log('queryfield is null')
        this.queryField.where = [new WhereCondition (null,"","","","","")];
        this.queryField.where2 = [new WhereCondition (null,"","","","","")];
      }
      else{
        this.queryField=this.data.widget.query
      }
  }

  onClose(){
    // let response = [this.tableData, this.queryText, this.queryField];
    // console.log(response)
    this.dialogRef.close();
  }
   // All Table Name 
   showAllTableName(){
    this.loading = true;
    this.customService.getAllTableName().subscribe(
      res => {
        this.allTableNames = res;
        this.loading = false;
      }
    )
  }

   // All Column Name 
   showTableColumn() {
    this.loading = true;
    if(this.data.widget.query==null){
      console.log('no query found..so try seperating tablename')
    }
    const tableNameRegex = /FROM\s+(\w+)/i;
    let tableName;
    const match = this.data?.widget?.queryText?.match(tableNameRegex);
    if (match && match[1]) {
      tableName = match[1];
    }
    this.tableName=match[1]
    this.customService.getTableColumns(this.data.widget.query==null?tableName:this.data.widget.query.tableName).subscribe(
      res => {
        let arr = [];
        arr = res['columns'];
        arr?.sort((a,b) => a.fieldNane > b.fieldNane ? 1 : -1)
        arr.forEach(key => this.allTableColumns.push(key.fieldNane));
        arr.forEach(key => this.allTableWhereColumns1.push(key));
        this.loading = false;
      }
    )
    }
  showTableColumn2() {
    this.loading = true;
    if(this.data.widget.query==null){
      console.log('no query found..so try seperating tablename')
    }
    if(this.data.widget.query==null){
      console.log('no query found..so try seperating tablename')
    }
    const tableNameRegex = /FROM\s+(\w+)/i;
    let tableName;
    const match = this.data?.widget?.queryText?.match(tableNameRegex);
    if (match && match[1]) {
      tableName = match[1];
    }
    this.customService.getTableColumns(this.data.widget.query==null?tableName:this.data.widget.query.tableName2).subscribe(
      res => {
        let arr = [];
        arr = res['columns'];
        arr?.sort((a,b) => a.fieldNane > b.fieldNane ? 1 : -1)
        arr.forEach(key => this.allTableColumns.push(key.fieldNane));
        arr.forEach(key => this.allTableWhereColumns1.push(key));
        this.loading = false;
      }
    )
    }
  opTypePass(where, val){
    where.operandType = val.dataType;
  }
  
  // adding extra where field function
  addWhereField(e) {
    let app= localStorage.getItem('queryFields')
    let app2=localStorage.setItem('apps',app)
    let query=localStorage.getItem('queryField2')
    let query2=localStorage.setItem('queryJoin',query)
    this.queryField.where.push(new WhereCondition (e,"","","","",""));
    for (let i=0;i<this.queryField.where?.length;i++){
      this.whereList[i]=''
      this.whereList[i]=this.queryField.where[i].operandField;
      this.queryAdd[i]=this.queryField?.where[i]?.operation
    }
    this.fieldValue=e;
  }
  // removing where field function
  removeField() {
    this.queryField.where.pop();
  }

  getremoveField(index){
    this.queryField.where.splice(index,1);
    this.queryAdd[index]=[]
  }

  // adding extra where field function
  addWhereField2(e) {
    let app= localStorage.getItem('queryFields')
    let app2=localStorage.setItem('apps',app)
    let query=localStorage.getItem('queryField2')
    let query2=localStorage.setItem('queryJoin',query)
    // console.log(this.queryField.where);
    this.queryField.where2.push(new WhereCondition (e,"","","","",""));
    for (let i=0;i<this.queryField.where2?.length;i++){
      this.whereList2[i]=this.queryField.where2[i].operandField
      this.queryAdd2[i]=this.queryField?.where2[i]?.operation
    }
  }
  // removing where field function
  removeField2() {
    this.queryField.where2.pop();
  }

  getremoveField2(index){
    this.queryField.where2.splice(index,1);
    this.queryAdd2[index]=[];
  }

  // CLEAR QUERY
  clear(){
    this.queryField = new QueryFieldCustomDashBoard(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
    this.queryField.where = [new WhereCondition (null,"","","","","")];
    this.queryText = null;
    this.tableData = null;
    this.showQuery = false;
    this.showData = false;
    this.error = null;
  }
  
  dataGenration(){
    if(this.data.chartType=='card'||this.data.chartType=='gaugeChart'||this.data.widget.type=='cardChart'){
      if(this.queryField?.columnName1!==null){
      this.queryField.columnName1=[this.queryField.columnName1]
      this.queryField.columnName2=['']
      }
    }
    if(this.query?.nativeElement){
      this.queryText = this.query.nativeElement.innerText;
    }
  }
  async showQueryData(){
    
   // Assuming this.data.widget.queryText contains the original query
let originalQuery = this.data.widget.queryText;
const conditions = this.queryField.where;

// Initialize an array to store individual condition strings
const conditionStrings = [];
let conditionString;
let groupby;
let order;
// Build the array of condition strings
for (let i = 0; i < conditions.length; i++) {
    const field = conditions[i].operandField;
    const operator = conditions[i].operator;
    const value = conditions[i].value;
      conditionString = `${field} ${operator} ${value}`;

    // Add the condition string to the array
    conditionStrings.push(conditionString);
}

// Combine the individual condition strings using 'AND' to create the final additionalCondition
const additionalCondition = conditionStrings.join(' AND ');
// Check if the original query contains a WHERE clause
const regexFrom = /\bFROM\s+([^\s;]+)/i;
const regexWhere = /\bWHERE\b/i;
const tableNameMatch = originalQuery.match(regexFrom);
const dynamicTableName = tableNameMatch ? tableNameMatch[1] : null;
// Check if the original query contains a WHERE clause
if (regexWhere.test(originalQuery)) {
    // If there is already a WHERE clause, append the additional conditions with AND
    originalQuery = originalQuery.replace(regexWhere, `WHERE ${additionalCondition} AND`);
} else {
    // If there is no WHERE clause, add the conditions with WHERE
    originalQuery = originalQuery.replace(regexFrom, `FROM ${dynamicTableName} WHERE ${additionalCondition}`);
}

// Remove all punctuation characters at the end of the query
originalQuery = originalQuery.replace(/[.,;]*$/, '');

// Now 'originalQuery' contains the updated query with your conditions, and trailing punctuation is removed
this.queryText = originalQuery;

    this.tableData = null;
    if(this.data.widget.type=='cardChart'||this.data.widget.type=='card'||this.queryField?.columnName1?.includes('*')||this.data.widget.type=='gaugeChart'){
     this.queryField.columnName2=[''];
     this.queryText=this.queryText.replace('null',' ')
    }
    // if(this.data.widget.type == "card"){
    //   this.data.widget.type = 'gaugeChart';
    // }
    this.loading = true;
    await this.customService.getQueryData(this.data.widget.type,this.queryText, this.page + 1, this.searchScope.pageSize).pipe().toPromise()
    .then(async res=>{
        this.tableData = res;
        this.loading = false;
      },err =>{
        this.error = err.error;
        this.loading = false;
      }
    )
    this.apply();
  }
  isFiltered=false;

  apply(){
    this.isFiltered=true;
    sessionStorage.setItem('isFiltered',JSON.stringify(this.isFiltered))
    if(sessionStorage.getItem('isFiltered')=='true'){
   let app= localStorage.getItem('queryFields')
   let app2=localStorage.setItem('apps',app)
   let query=localStorage.getItem('queryField2')
   let query2=localStorage.setItem('queryJoin',query)
    }
    if(this.data.widget.type=='card'||this.data.widget.type=='cardChart'){
      // this.queryField.columnName1=[this.queryField.columnName1];
      this.queryField.columnName2=[''];
    }
    if(this.data.widget.type=='gaugeChart'){
      // this.queryField.columnName1=[this.queryField.columnName1];
      this.queryField.columnName2=[''];
    }
    let response = [this.tableData, this.queryText, this.queryField];
    if(response==null && response==undefined && response?.length==0){
       sessionStorage.removeItem('isFiltered')
       localStorage.removeItem('apps')
       localStorage.removeItem('queryJoin')
       localStorage.removeItem('queryFields')
       localStorage.removeItem('queryField2')
    }
    this.dialogRef.close(response);
    this.isFiltered=false
  }
  clearFilter(){
   let filter= sessionStorage.getItem('isFiltered')
    if(filter==null && localStorage.getItem('apps')!==null){
    let obj = localStorage.getItem('queryFields')
    let obj2= JSON.parse(obj)
    this.queryField.where=obj2
    let query2=localStorage.getItem('queryField2')
   let queryJoin=JSON.parse(query2)
   this.queryField.where2=queryJoin
   this.isFiltered=false;
   sessionStorage.removeItem('isFiltered')
   localStorage.removeItem('apps');
   localStorage.removeItem('queryJoin')
    }
    if(localStorage.getItem('apps')===null){
      // console.log(localStorage.getItem('queryFields'))
      localStorage.removeItem('apps')
      localStorage.removeItem('queryJoin')
    }
    else{
      localStorage.getItem('apps')
      if(localStorage.getItem('apps')!==null){
      let obj = localStorage.getItem('apps')
      let obj2= JSON.parse(obj)
      this.queryField.where=obj2
      let query2=localStorage.getItem('queryJoin')
     let queryJoin=JSON.parse(query2)
     this.queryField.where2=queryJoin
     sessionStorage.removeItem('isFiltered')
     localStorage.removeItem('apps');
     localStorage.removeItem('queryJoin')
      }
    }
   this.queryField.order=null;
   this.queryField.orderBy=null;
   this.queryField.order2=null;
   this.queryField.orderBy2=null;
   this.queryAdd=[];
   this.queryAdd2=[];
    this.queryText=this.data.widget.queryText;
    sessionStorage.removeItem('isFiltered')
  }

}
