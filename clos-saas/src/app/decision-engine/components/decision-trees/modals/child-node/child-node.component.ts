import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Condition, TreeClusters, DecisionTreeList, IntegerTable } from '../../../../models/DecisionTrees';
import { DecisionTreesService } from '../../../../services/decision-trees.service';
import { formatDate } from '@angular/common';
import { ExampleHeaderComponent } from '../../../query-variable/example-header/example-header.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-child-node',
  templateUrl: './child-node.component.html',
  styleUrls: ['./child-node.component.scss']
})
export class ChildNodeComponent implements OnInit {

  constructor(
    private decisionTreeService: DecisionTreesService,

    public dialogRef: MatDialogRef<ChildNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public treeId: any
  ) {
    this.getTreeDatabyId()
  }
  nodeName: string = '';
  clusterDetail: TreeClusters = null;
  clusterList: TreeClusters[] = [];
  conditionData: any;
  condition: string = ''; start: Date;
  end: Date;
  condition_name: string = '';
  start_date: any
  end_date: any;
  splitData: Condition[] = [];
  readonly ExampleHeaderComponent = ExampleHeaderComponent;
  splitDate: Condition[] = [];
  master_checked: boolean = false;
  all_checked: boolean = false;
  master_indeterminate: boolean = false;
  indeterminate_data: boolean = false;
  conditionalVarList: any[] = [];
  finalCond: any[] = [];
  dataArray: any[] = [];
  booleanSplit: string[] = [];
  spiltConditionData: any[] = [];
  selectedParam: string = "";
  clusterData: TreeClusters[] = [];
  treeData: DecisionTreeList = null as any;
  tableData: IntegerTable[] = [{ lower: -Infinity, operator: "<=..<", upper: Infinity },]
  dataSource = new MatTableDataSource<IntegerTable>(this.tableData)
  displayedColumns: string[] = ['select', 'lower', 'operator', 'upper'];

  ngOnInit(): void {
  }



  getTreeDatabyId() {
    this.decisionTreeService.getDecisionTreeById(this.treeId).subscribe(
      res => {
        if (res) {
          console.log(res);
          this.clusterList = res.tree_cluster
        }
      }
    )
  }

  //To create String split condition
  createStringSplit() {
    this.splitData = []
    this.conditionData = this.conditionData.toUpperCase();
    if (!this.dataArray.includes(this.conditionData) && this.conditionData != '') {
      this.dataArray.push(this.conditionData)
    }
    this.conditionData = '';
    this.dataArray.forEach(data => {
      let label = " == " + data
      let splitData = this.clusterDetail.name + label
      let output = new Condition(label, splitData, false);
      this.splitData.push(output);

      label = " != " + data
      splitData = this.clusterDetail.name + label
      output = new Condition(label, splitData, false);
      this.splitData.push(output);
    })
    console.log("split", this.splitData)
  }
  master_change() {
    if (this.splitData.length > 0) {
      for (let value of Object.values(this.splitData)) {
        value.checked = this.master_checked;
      }
    }
    else if (this.splitDate.length > 0) {
      for (let value of Object.values(this.splitDate)) {
        value.checked = this.master_checked;
      }
    }

  }

  //To create Integer split condition
  splitIntegerFromInput() {
    this.tableData = [];
    if (!this.dataArray.includes(this.conditionData) && this.conditionData != '') {
      this.dataArray.push(this.conditionData)
    }
    this.dataArray = this.dataArray.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
    if (this.dataArray.length == 1) {
      this.tableDataCreation('-Infinity', this.conditionData, '<')
      this.tableDataCreation(this.conditionData, 'Infinity', '>')
    }
    else if (this.dataArray.length > 1) {
      this.tableDataCreation('-Infinity', this.dataArray[0], '<')

      for (var j = 0; j < this.dataArray.length - 1; j++) {
        this.tableDataCreation(this.dataArray[j], this.dataArray[j + 1], '<=..<')
        this.tableDataCreation(this.dataArray[this.dataArray.length - 1], 'Infinity', '>')
      }
    }
    this.dataSource = new MatTableDataSource<IntegerTable>(this.tableData);
    console.log(this.tableData)
    this.conditionData = ''
  }

  //To create mat table from tableData
  tableDataCreation(lower: string, upper: string, operator: string) {
    this.tableData.push({ lower: lower, upper: upper, operator: operator })
  }
  list_change() {
    let checked_count = 0;
    if (this.splitData) {
      for (let value of Object.values(this.splitData)) {
        if (value.checked)
          checked_count++;
      }
    }
    else if (this.splitDate) {
      for (let value of Object.values(this.splitDate)) {
        if (value.checked)
          checked_count++;
      }
    }

    if ((checked_count > 0 && checked_count < this.splitData.length) || (checked_count > 0 && checked_count < this.splitDate.length)) {
      this.master_indeterminate = true;
    } else if ((checked_count == this.splitData.length) || (checked_count == this.splitDate.length)) {
      this.master_indeterminate = false;
      this.master_checked = true;
    } else {
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }
  all_change() {
    for (let value of Object.values(this.tableData)) {
      value.checked = this.all_checked;
    }
  }
  check_change() {
    let checked_count = 0;
    for (let value of Object.values(this.tableData)) {
      if (value.checked)
        checked_count++;
    }
    if (checked_count > 0 && checked_count < this.tableData.length) {
      this.indeterminate_data = true;
    } else if (checked_count == this.tableData.length) {
      this.indeterminate_data = false;
      this.all_checked = true;
    } else {
      this.indeterminate_data = false;
      this.all_checked = false;
    }
  }

  //To create Date split condition
  createDateSplit() {
    this.splitDate = []
    this.conditionData = this.conditionData.toUpperCase().trim();
    if (!this.dataArray.includes(this.conditionData) && this.conditionData != '') {
      this.dataArray.push(this.conditionData)
    }
    this.conditionData = '';
    this.dataArray.forEach(data => {
      if ((data != "NOW") && (data != "NOW-1 D")) {
        let lower: any = data.split('..')[0].toUpperCase()
        let upper: any = data.split('..')[1].toUpperCase()
        let operator: any = '<=..<'
        let label = lower + operator + upper
        let splitDate = this.clusterDetail.name + "==" + label
        let output = new Condition(label, splitDate, false);
        this.splitDate.push(output);
      }
      else {
        let label = " == " + data
        let splitDate = this.clusterDetail.name + label
        let output = new Condition(label, splitDate, false);
        this.splitDate.push(output);

        label = " != " + data
        splitDate = this.clusterDetail.name + label
        output = new Condition(label, splitDate, false);
        this.splitDate.push(output);
      }
    })
  }
  //To convert values from date picker
  onChange(start: any, end: any) {
    this.start = new Date(start.value)
    this.end = new Date(end.value)
    if (sessionStorage.getItem('start') !== null) {
      this.start_date = sessionStorage.getItem('start')
      this.end_date = sessionStorage.getItem('end')
      sessionStorage.removeItem('start')
    } else if (sessionStorage.getItem('end') !== null) {
      this.end_date = sessionStorage.getItem('end')
      sessionStorage.removeItem('end')
    }
    else {
      this.start_date = formatDate(this.start, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      this.end_date = formatDate(this.end, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }
    this.conditionData = this.relativeDateChange(this.start_date, this.end_date)
  }

  //To format relative day ranges
  relativeDateChange(start: any, end: any) {
    let data: any
    if (start == 'now' && end == 'now') {
      data = 'NOW'
    }
    else if (start == 'now-1 d' && end == 'now-1 d') {
      data = 'NOW-1 D'
    }
    else {
      data = start + '..' + end
    }
    return data
  }
  createChildNode() {
    // this.selectedParam.push(this.selectedNodeName)
    if (this.clusterDetail.cluster_data_type == 'string' || this.clusterDetail.cluster_data_type == 'str') {
      let filterOutput = this.splitData.filter(split => split.checked == true);
      filterOutput.forEach(filter => {
        this.spiltConditionData.push({ "name": filter.name, "condition": filter.condition, "datatype": "string" })
      })
    }
    else if (this.clusterDetail.cluster_data_type == 'integer' || this.clusterDetail.cluster_data_type == 'int' || this.clusterDetail.cluster_data_type == 'float') {
      let filterOutput = this.tableData.filter(data => data.checked == true);
      filterOutput.forEach(filter => {
        let name: string = this.conditionFormat(filter)
        this.spiltConditionData.push({ "name": name, "condition": this.clusterDetail.name + "=" + filter.lower + filter.operator + filter.upper, "datatype": "integer" })
      })
    }
    else if (this.clusterDetail.cluster_data_type == 'dateTime' || this.clusterDetail.cluster_data_type == 'date' || this.clusterDetail.cluster_data_type == 'datetime') {
      let filterOutput = this.splitDate.filter(data => data.checked == true);
      filterOutput.forEach(filter => {
        this.spiltConditionData.push({ "name": filter.name, "condition": filter.condition, "datatype": "dateTime" })
      })
    }
    this.dialogRef.close({ "splitCondition": this.spiltConditionData, "clustertype": this.clusterDetail.cluster_data_type, "clusterName": this.clusterDetail.name });
  }
  //To display integer split node conditions
  conditionFormat(cond: any) {
    let low = cond.lower
    let high = cond.upper
    let positive_max = 'Infinity';
    let negative_min = '-Infinity';
    if (low == negative_min) {
      this.condition_name = cond.operator + cond.upper
    }
    else if (high == positive_max) {
      this.condition_name = cond.operator + cond.lower
    }
    else {
      this.condition_name = cond.lower + cond.operator + cond.upper
    }
    return this.condition_name
  }
}

