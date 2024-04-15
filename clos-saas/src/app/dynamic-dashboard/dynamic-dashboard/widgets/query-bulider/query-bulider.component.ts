import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { AggregationCondition, QueryFieldCustomDashBoard, SearchScope, WhereCondition } from '../../models/model';
import { CustomServiceService } from '../../service/custom-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-query-bulider',
  templateUrl: './query-bulider.component.html',
  styleUrls: ['./query-bulider.component.scss'],
})
export class QueryBuliderComponent implements OnInit {

  queryField: QueryFieldCustomDashBoard = new QueryFieldCustomDashBoard(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
  allTableNames: string[];
  allTableColumns: any[] = [];
  allTableColumns2: string[] = [];
  aggregation: string[] = ['MIN', 'MAX', 'AVG', 'COUNT', 'SUM'];
  disable: boolean;
  error: string;
  showQuery: boolean = false;
  showData: boolean = false;
  queryData: any;
  loading: boolean = false;
  page: number = 0;
  searchScope: SearchScope = new SearchScope(10, 'Query-Builder')

  chartType: any;
  isJoin: boolean = false;
  order: string[] = ['asc','desc'];
  searchList:string=''
  whereList:any=[];
  orderByList:string='';
  colList1:any='';
  colList3:any='';
  colList4:any='';
  colList5:any='';
  colList6:any='';
  searchList1:string=''
  groupList:string='';
  groupList2:string='';
  keycol1:string='';
  colList2:string='';
  whereList2:any=[];
  orderBylist2:string='';
  keycol2:string='';
  allTableWhereColumns1: string[] = [];
  allTableWhereColumns2: string[] = [];
  clearQuery:boolean=false;
  allTableStringColumns1: string[] = [];
  allTableNumberColumns1: string[] = [];
  numTableColumnsForAgg: string[] = [];
  numTableColumnsForAgg2: string[] = [];
  axis1: any;
  axis2: any;
  showAgg: boolean = false;
  aggList: any;
  colStringList:any='';
  columnName3=[];
  columnName4=[];
  filters: string[] = ['T', '1W', '1M', '1Y','Custom Date'];
  selectedFilter: string = '';
  startDate=new Date();
  endDate=new Date();
  openDatePicker:boolean=true;

  @ViewChild("queryBox", { static: false }) query;

  tableHeader: string[] = [];
  queryText: any;
  savedQuery: any;
  constructor(
    private url: UrlService,
    public dialog: MatDialog,
    public customService: CustomServiceService,
    public dialogRef: MatDialogRef<QueryBuliderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe:DatePipe,
  ) {
    if (data.widget.queryText != null || data.widget.queryText != undefined) {
      this.queryField = data.widget.query;
      this.queryText = data.widget.queryText;
      this.queryData = data.widget.actualData;
      this.showQuery = true;
      this.showData = true;
      this.showTableColumn();
      this.showAggNumberField();
      if(this.queryField.tableName2!==null){
      this.showTableColumn2();
      this.showAggNumberField2();
      }
      if(this.queryField.join==false){
      this.queryField.where2 = [new WhereCondition (null,"","","","","")];
      this.queryField.aggregationList2 = [new AggregationCondition ("","","","")];
      }
    }else{
      this.queryField.where = [new WhereCondition (null,"","","","","")];
      this.queryField.where2 = [new WhereCondition (null,"","","","","")];
      this.queryField.aggregationList1 = [new AggregationCondition ("","","","")];
      this.queryField.aggregationList2 = [new AggregationCondition ("","","","")];
    }
    if(this.data.chartType == "card" || this.data.chartType=='cardChart'){
      this.data.chartType = 'gaugeChart';
    }
  }

  public updateUrl(): Promise<any> {
    return this.url.getUrl().toPromise().then();
  }

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response?.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.chartType = this.data.chartType;
    this.showAllTableName();
    if(this.data.chartType=='donutChart'||this.data.chartType=='pieChart'||this.data.chartType=='barChart'||this.data.chartType=='funnelChart'||this.data.chartType=='lineChart'||this.data.chartType==='multipleChart'){
    if(this.queryField?.columnName1!==null && this.queryField.columnName2!==null){
      this.queryField.columnName1=this.queryField?.columnName1?.toString();
      this.queryField.columnName2=this.queryField?.columnName2?.toString();
      this.queryField.columnName3=this.queryField?.columnName3?.toString();
      this.queryField.columnName4=this.queryField?.columnName4?.toString();
    }
  }
  if(this.data.chartType=='candleStick'){
    if(this.queryField.columnName1!==null && this.queryField.columnName2!==null && this.queryField.columnName3!==null && this.queryField.columnName4!==null && this.queryField.columnName5!==null && this.queryField.columnName6!==null){
      this.queryField.columnName1=this.queryField?.columnName1?.toString();
      this.queryField.columnName2=this.queryField?.columnName2?.toString();
      this.queryField.columnName3=this.queryField?.columnName3?.toString();
      this.queryField.columnName4=this.queryField?.columnName4?.toString();
      this.queryField.columnName5=this.queryField?.columnName5?.toString();
      this.queryField.columnName6=this.queryField?.columnName6?.toString();

    }
  }
    if(this.data.chartType=='card'||this.data.chartType=='gaugeChart'||this.data.chartType=='cardChart'){
      if(this.queryField?.columnName1!==null){
      this.queryField.columnName1=this.queryField?.columnName1?.toString();
      this.queryField.columnName2=['']
      }
    }
  }
  firstDate:any=[];
  todayDate:any=[];
  onFilterChange(filter: string) {
    this.selectedFilter = filter;
  
    if (filter === 'T') {
      this.openDatePicker = false;
      this.firstDate[0] = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    } else if (filter === '1W') {
      this.openDatePicker = false;
      var curr = new Date();
      this.startDate[0] = new Date(curr.setDate(curr.getDate()));
      this.endDate[0] = new Date(curr.setDate(curr.getDate() - 7));
      this.firstDate[0] = this.datepipe.transform(this.startDate[0], 'yyyy-MM-dd');
      this.todayDate[0] = this.datepipe.transform(this.endDate[0], 'yyyy-MM-dd');
    } else if (filter === '1M') {
      this.openDatePicker = false;
      var curr = new Date();
      this.startDate[0] = new Date(curr.setDate(curr.getDate()));
      this.endDate[0] = new Date(curr.setDate(curr.getDate() - 30));
      this.firstDate[0] = this.datepipe.transform(this.startDate[0], 'yyyy-MM-dd');
      this.todayDate[0] = this.datepipe.transform(this.endDate[0], 'yyyy-MM-dd');
    } else if (filter === '1Y') {
      this.openDatePicker = false;
      var curr = new Date();
      this.startDate[0] = new Date(curr.setDate(curr.getDate()));
      this.endDate[0] = new Date(curr.setDate(curr.getDate() - 365));
      this.firstDate[0] = this.datepipe.transform(this.startDate[0], 'yyyy-MM-dd');
      this.todayDate[0] = this.datepipe.transform(this.endDate[0], 'yyyy-MM-dd');
    } else if (filter === 'Custom Date') {
      this.openDatePicker = true;
    }
  }
  
  

  showAggre(e){
    this.queryField.aggregationList1?.push(new AggregationCondition(e,"","",""));
    // for(let i=0;i<this.queryField.aggregationList1?.length;i++){
    //   this.aggList[i]=this.queryField.aggregationList1[i].colList;
    // }
  }
  showAggre2(e){
    this.queryField.aggregationList2?.push(new AggregationCondition(e,"","",""));
    // for(let i=0;i<this.queryField.aggregationList1?.length;i++){
    //   this.aggList[i]=this.queryField.aggregationList1[i].colList;
    // }
  }
  getremoveAgg(index) {
    this.queryField.aggregationList1?.splice(index, 1);
  }
  getremoveAgg2(index) {
    this.queryField.aggregationList2?.splice(index, 1);
  }
  opDupCheck(val){
   
  }

  // All Table Name 
  showAllTableName() {
    this.loading = true;
    this.customService.getAllTableName().subscribe(
      res => {
        this.allTableNames = res;
        this.loading = false;
      }
    )
  }
  //Revoke Join Queries
  revokeJoin(){
    this.queryField.tableName2=null;
    this.queryField.where2=null;
    this.allTableColumns2=[];
    this.allTableWhereColumns2=[];
    this.queryField.order2=null;
    this.queryField.orderBy2=null;
    this.queryField.columnName2=null;
    this.queryField.keyCol1=null;
    this.queryField.keyCol2=null;
    this.queryField.join=false;
  }
  // All Column Name 
  showTableColumn() {
    this.loading = true;
    this.allTableColumns=[];
    this.allTableWhereColumns1=[];
    this.allTableNumberColumns1=[];
    this.allTableStringColumns1=[];
    this.customService.getTableColumns(this.queryField.tableName).subscribe(
      res => {
        this.loading = false;
        let arr = [];
        arr = res['columns'];
       arr?.sort((a,b) => a.fieldNane > b.fieldNane ? 1 : -1)
        if(this.data.chartType =='pieChart' || this.data.chartType =='donutChart' || this.data.chartType =='funnelChart' || this.chartType =='candleStick' || this.chartType =='multipleChart'){
          for(let i=0;i<=arr?.length;i++){
            if(arr[i]?.dataType == 'Number'){
              this.allTableNumberColumns1?.push(arr[i]);
            }
            else{
              this.allTableStringColumns1?.push(arr[i]);
            }
          }

        }
        else{
        arr.forEach(key => this.allTableNumberColumns1?.push(key));
        arr.forEach(key => this.allTableStringColumns1?.push(key));
        }
        arr.forEach(key => this.allTableColumns?.push(key.fieldNane));
        arr.forEach(key => this.allTableWhereColumns1?.push(key));
        // this.sortTableColumns();
      }
    )
  }
  sortTableColumns(){
    this.allTableColumns=[];
    this.allTableColumns?.sort((a,b) => a.fieldNane > b.fieldNane ? 1 : -1)
  }
  //UnCheck all the existing fields while clicking the *
  getAllTableFields(){
    let col1=this.queryField.columnName1
    let col2=this.queryField.columnName2
    if(this.queryField.columnName1?.includes('*')){
      this.queryField.columnName1.splice(col1)
      this.queryField.columnName1=['*']
    }
    if(this.queryField.columnName2?.includes('*')){
      this.queryField.columnName2?.splice(col2)
      this.queryField.columnName2=['*']
    }
  }
  showAggNumberField(){
  this.loading = false;
  this.numTableColumnsForAgg=[];
  this.customService.getTableColumns(this.queryField.tableName).subscribe(
    res => {
      this.loading = false;
      let arr = [];
      arr = res['columns'];
      arr?.sort((a,b) => a.fieldNane > b.fieldNane ? 1 : -1)
        for(let i=0;i<=arr?.length;i++){
          if(arr[i]?.dataType == 'Number'){
            this.numTableColumnsForAgg?.push(arr[i]);
          }
        }
      }
    )
  }
  showAggNumberField2(){
    this.loading = false;
    this.numTableColumnsForAgg2=[];
    this.customService.getTableColumns(this.queryField.tableName2).subscribe(
      res => {
        this.loading = false;
        let arr = [];
        arr = res['columns'];
        arr?.sort((a,b) => a.fieldNane > b.fieldNane ? 1 : -1)
          for(let i=0;i<=arr?.length;i++){
            if(arr[i]?.dataType == 'Number'){
              this.numTableColumnsForAgg2?.push(arr[i]);
            }
          }
        }
      )
    }

  typeCheck1(type){
   if(type == "String" || type == "Date"){
     this.axis1='category'
   }
   else if(type == "Number"){
    this.axis1='value'
   }
   sessionStorage.setItem('xaxis',this.axis1);
  //  this.axis1 = sessionStorage.getItem('xaxis')
  }
  typeCheck2(type){
    if(type == "String" || type == "Date"){
      this.axis2='category'
    }
    else if(type == "Number"){
     this.axis2='value'
    }
    sessionStorage.setItem('yaxis',this.axis2);
    // this.axis2 = sessionStorage.getItem('yaxis')
   }
  showTableColumn2() {
    this.loading = true;
    this.allTableColumns2=[];
    this.allTableWhereColumns2=[];
    this.customService.getTableColumns(this.queryField.tableName2).subscribe(
      res => {
        let arr = [];
        arr = res['columns'];
        arr?.sort((a,b) => a.fieldNane > b.fieldNane ? 1 : -1)
        arr.forEach(key => this.allTableColumns2?.push(key?.fieldNane));
        arr.forEach(key => this.allTableWhereColumns2?.push(key));
        this.loading = false;
      }
    )
  }
  opTypePass(where, val){
    where.operandType = val.dataType;
  }
  queryAdd=[];
  queryAdd2=[];

  // adding extra where field function
  addWhereField(e) {
    this.queryField.where.push(new WhereCondition (e,"","","","",""));
    for(let i=0;i<this.queryField.where?.length;i++){
      this.whereList[i]=this.queryField.where[i]?.operandField;
      this.queryAdd[i]=this.queryField.where[i].operation;
    }
  }
  // removing where field function
  removeField() {
    this.queryField.where.pop();
  }

  getremoveField(index) {
    this.queryField.where.splice(index, 1);
      this.queryAdd[index]=[]
  }

  // adding extra where field function
  addWhereField2(e) {
    this.queryField.where2.push(new WhereCondition (e,"","","","",""));
    for(let i=0;i<this.queryField.where2?.length;i++){
      this.whereList2[i]=this.queryField.where2[i]?.operandField;
      this.queryAdd2[i]=this.queryField?.where2[i]?.operation;
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
    this.queryField.where2 = [new WhereCondition (null,"","","","","")];
    this.queryText = null;
    this.queryData = null;
    this.showQuery = false;
    this.showData = false;
    this.queryField.columnName1=null;
    this.queryField.columnName2=null;
    this.queryField.order=null;
    this.queryField.order2=null;
    this.queryField.orderBy=null;
    this.queryField.orderBy2=null;
    this.allTableColumns=[];
    this.allTableColumns2=[];
    this.allTableWhereColumns1=[];
    this.allTableWhereColumns2=[];
    this.error = null;
  }
  onTableNameChange(){
    // this.queryField = new QueryFieldCustomDashBoard(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
    this.queryField.where = [new WhereCondition (null,"","","","","")];
    this.queryField.where2 = [new WhereCondition (null,"","","","","")];
    this.queryText = null;
    this.queryData = null;
    this.showQuery = false;
    this.showData = false;
    this.queryField.columnName1=null;
    this.queryField.columnName2=null;
    this.queryField.order=null;
    this.queryField.order2=null;
    this.queryField.orderBy=null;
    this.queryField.orderBy2=null;
    this.allTableColumns=[];
    this.allTableColumns2=[];
    this.allTableWhereColumns1=[];
    this.allTableWhereColumns2=[];
    this.error = null;
  }
  
  dataGenration(){
    if(this.query?.nativeElement){
      this.queryText = this.query.nativeElement.innerText;
    }
  }

  showQueryData() {
    this.queryText = this.query.nativeElement.innerText;
    this.queryData = null;
    this.loading = true;
    if(this.data.chartType == "card"){
      this.data.chartType = 'gaugeChart';
    }
    // if(this.data.chartType=='donutChart'||this.data.chartType=='pieChart'||this.data.chartType=='barChart'||this.data.chartType=='funnelChart'||this.data.chartType=='lineChart'){
    //   this.queryField.columnName1=[this.queryField.columnName1];
    //   this.queryField.columnName2=[this.queryField.columnName2];
    // }
    if(this.data.chartType=='card'||this.data.chartType=='gaugeChart'){
      // this.queryField.columnName1=[this.queryField.columnName1];
      this.queryField.columnName2=[''];
    }
    this.customService.getQueryData(this.data.chartType, this.queryText, this.page + 1, this.searchScope.pageSize).subscribe(
      res => {
        this.queryData = res;
        this.loading = false;
      }, err => {
        this.error = err.error;
        this.loading = false;
      }
    )
  }
  clearSearch() {
    this.queryField.tableName = null!;
  }

  onClose(){
    if(this.data.chartType=='donutChart'||this.data.chartType=='pieChart'||this.data.chartType=='barChart'||this.data.chartType=='funnelChart'||this.data.chartType=='lineChart'||this.data.chartType=='multipleChart'){
      this.queryField.columnName1=[this.queryField.columnName1];
      this.queryField.columnName2=[this.queryField.columnName2];
      this.queryField.columnName3=[this.queryField.columnName3];
      this.queryField.columnName4=[this.queryField.columnName4];

    }
    if(this.data.chartType=='candleStick'){
      if(this.queryField.columnName1!==null && this.queryField.columnName2!==null && this.queryField.columnName3!==null && this.queryField.columnName4!==null && this.queryField.columnName5!==null && this.queryField.columnName6!==null){
        this.queryField.columnName1=[this.queryField.columnName1];
        this.queryField.columnName2=[this.queryField.columnName2];
        this.queryField.columnName3=[this.queryField.columnName3];
        this.queryField.columnName4=[this.queryField.columnName4];
        this.queryField.columnName5=[this.queryField.columnName5];
        this.queryField.columnName6=[this.queryField.columnName6];
      }
    }
    if(this.data.chartType=='card'||this.data.chartType=='gaugeChart'){
      this.queryField.columnName1=[this.queryField.columnName1];
      this.queryField.columnName2=['null']
    }
    this.dialogRef.close();
  }
  async apply(){
    this.queryText = this.query.nativeElement.innerText;
    this.queryData = null;
    this.loading = true;
    if(this.data.chartType == "card"){
      this.data.chartType = 'gaugeChart';
    }
    if(this.data.chartType=='donutChart'||this.data.chartType=='pieChart'||this.data.chartType=='barChart'||this.data.chartType=='funnelChart'||this.data.chartType=='lineChart'||this.data.chartType=='multipleChart'){
      this.queryField.columnName1=[this.queryField.columnName1];
      this.queryField.columnName2=[this.queryField.columnName2];
      this.queryField.columnName3=[this.queryField.columnName3];
      this.queryField.columnName4=[this.queryField.columnName4];

    }
    if(this.data.chartType=='candleStick'){
      this.queryField.columnName1=[this.queryField.columnName1];
      this.queryField.columnName2=[this.queryField.columnName2];
      this.queryField.columnName3=[this.queryField.columnName3];
      this.queryField.columnName4=[this.queryField.columnName4];
      this.queryField.columnName5=[this.queryField.columnName5];
      this.queryField.columnName6=[this.queryField.columnName6];
    }
    // if(this.data.chartType=='candleStick'){
    //   if(this.queryField.columnName1!==null && this.queryField.columnName2!==null && this.queryField.columnName3!==null && this.queryField.columnName4!==null && this.queryField.columnName5!==null && this.queryField.columnName6!==null){
    //     this.queryField.columnName1=this.queryField?.columnName1?.toString();
    //     this.queryField.columnName2=this.queryField?.columnName2?.toString();
    //     this.queryField.columnName3=this.queryField?.columnName3?.toString();
    //     this.queryField.columnName4=this.queryField?.columnName5?.toString();
    //     this.queryField.columnName5=this.queryField?.columnName5?.toString();
    //     this.queryField.columnName6=this.queryField?.columnName6?.toString();
  
    //   }
    // }
    if(this.data.chartType=='card'||this.data.chartType=='gaugeChart'){
      this.queryField.columnName1=[this.queryField.columnName1];
      this.queryField.columnName2=['null']
    }
    await this.customService.getQueryData(this.data.chartType, this.queryText, this.page + 1, this.searchScope.pageSize).pipe().toPromise()
    .then(async res=>{
        this.queryData = res;
        this.loading = false;
      }, err => {
        this.error = err.error;
        this.loading = false;
      }
    )
  let response = [this.queryData, this.queryText, this.queryField, this.axis1, this.axis2];
  this.dialogRef.close(response);
  }
}
