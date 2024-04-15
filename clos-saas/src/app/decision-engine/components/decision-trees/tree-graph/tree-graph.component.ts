import { Component, OnInit } from '@angular/core';
import { MiniMapPosition } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-tree-graph',
  templateUrl: './tree-graph.component.html',
  styleUrls: ['./tree-graph.component.scss']
})
export class TreeGraphComponent implements OnInit {
  selectedmodel:boolean = true;
  selectednode: string = '';
  nodetarget: string[] = [];
  position: any = MiniMapPosition.UpperRight;
  value = 50;
  contextMenu: any;
  clusterMenu: any;
  nodeid:any;
  nodelabel:any;
  selectedcluster: string = '';

  

  constructor() { }

  ngOnInit(): void {
  }
  
  

}
