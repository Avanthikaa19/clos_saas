import { Datatype } from "./ObjectModel";


export class DecisionTreeList{
    id: number;
    name: string;
    description: string;
    tree_node:TreeNodes[];
    tree_cluster:TreeClusters[];
    project: number;
    parameters:DecisionTreeParameters;
    selectedParameter:string[];
    optimised_config?:any;
    version: number;
    created_on: Date;
    created_by: string;
}
export class NodeData{
  public nodeName:string;
  public nodeType:string;
}

export class DecisionTreeParameters {
    id?: number;
    condition: NodeData[];
    action: any;
}
export class TreeNodes{
    constructor(
        public id: number,
        public name: string,
        public condition :string,
        public datatype? :string,
        public action?:actionData,
        public nextnode_id?:number[],
        public visibility?: string,

    ){}
  }
  export class TreeClusters{
    constructor(
        public id: number,
        public name: string,
        public childNodeIds: string[],
        public clustertype: string,
        public next_cluster_id:number[],
        public cluster_data_type:string,
        public orgId?: number,

    ){}
  }
  
  export class DecisionTree{
    constructor(
        public prev_node: number,
        public clus_id: number,
        public tree_node: TreeNodes[],
        public tree_cluster: TreeClusters,
        public selectedParameter:string[]
    ){}
  }

  export class linkdata{
    constructor(
        
        public source: string,
        public target: string,
        public id?: string,
        public visibility?: string
    ){}
  }
  export class NewNode{
    constructor(
        public name: string,
        public tree_id: number,
        public prev_id: number,
        public clus_id: number,
        public condition : string,
        public datatype:string,
        public action?:actionData,
       
    ){}
  }
  export class Cluster{
    constructor(
        
        public label: string,
        public childNodeIds: any[],
        public cluster_data_type:string,
        public clustertype:string,
        public next_cluster_id:number[],
        public id: string,
        public orgId:number,
    ){}
  }
  export class Nodes{
    constructor(
        public id:string,
        public label: string,
        public nextnode_id:number[],
        public name:string,
        public action:string,
        public condition:string,
        public datatype:string     


    ){}
  }
  export class Condition {
    constructor(
      public name: string,
      public condition:string,
      public checked?: boolean,
      ) { }
  
  }
  export interface IntegerTable {
    upper: any;
    operator: string;
    lower: any;
    checked?: boolean;
  }
  export class actionData{
    constructor(
      public name: string,
      public type:string,
      public typeId?:string,
      public config?:any,
      ) { }
  }