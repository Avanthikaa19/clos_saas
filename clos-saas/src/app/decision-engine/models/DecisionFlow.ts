export class DecisionFlow {

    id: number;
    name: string;
    description: string;
    scenario:Scenario;
    flowTasks?: FlowTasks[];
    configure_data: ConfigData;
    start_date: string;
    end_date: string;
    created_on: Date;
    created_by: string;
    is_selected?: boolean
    version: number;
}

export class Scenario{
    id:number;
    name:string;
}
export class Flow {
    
        public id: number;
        public config: string;
        public current_version: number;
   
}
export class FlowTask {
    constructor(
        public flowTasks: any) { }
}

export class FlowTasks {
    
        // public flowId: number,
        public id: number;
        public name: string;
        public created: Date;
        public flow_type: string;
        public prevTaskId: number[];
        public configId: number;
        public tempId?: number;
        public configName: string;  
        public tempName?: string;  
        public tempType?:any;    
        public repeat: number;
        public temp_condition?: string;
        public condition: string;
        public condition_branch: string;
        public repeatTo: number;
        public temp_condition_type?: string;
        public condition_type: string;
        public mergeBranch: string;
        public destination:any;

        //for UI use only
        public objectModel?: any;
}
export class ConfigData {
    inputColumn: any[];
    outputColumn: any[];
}
export class DecisionFlowBranch {
    id?: number;
    branchIndex: string;
    parameterType: string
}
export class DecisionFlowValueTree {
    id?: number;
    name: string;
    children?: DecisionFlowValueTrees[];
}
export class DecisionFlowValueTrees {
    id?: number;
    name: string;
    type: string;
}

export class flowConfigData {
    
    inputColumn: string[];
    outputColumn: string[];

}


export class TestFlowTable {
    header: string[];
    content: any[];
}
export class outputConfigure {
    constructor(
      public name: string,
      public checked: boolean,) { }
  
  }