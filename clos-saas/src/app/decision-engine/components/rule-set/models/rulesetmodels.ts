export class Rules {
    id: number;
    name: string;
    description: string;
    rule_type: string;
    effect_from: any;
    effect_to: any;
    parameters: any[];
    variables: any;
    python_scripts: string;
    project: number;
    reason_code:ReasonCode[];
    is_selected?:Boolean;
    conditions?:any[];
    action?:Actions[];
    choose_mode: string;
}

export class RuleSet {
    id: number;
    name: string;
    description: string;
    created_by: string;
    created_on: Date;
    project: any;
    rules: Rules[];
}

export class ReasonCode{
    public id:number;
    public name: string;
    public description: string;
    public project:number;
    public created_by: string;
    public created_on: string;
}

export class Actions{
    id:number;
    name:string;
    type:string;
    operand?:string;
    function?:number;
    config?:any;
    choosen?:string;

}

export class Conditions{
    id:number;
    name:string;
    type:string;
    operand?:string;
    operator?:string;
    fromOperand?:string;
    toOperand?:string;
    previous_condition?:number;
    logical_operator?:boolean;
}

export class RulesValueTree{
    id?: number;
    name: string;
    children?: RulesValueTree[];
}

export class Functions{
    id: number;
    name: string;
    desc: string;
    project:number;
    import_package:ImportData[];
    import_function:ImportData[];
    python_code: string;
    created_by: string;
    created_on: string;
}

export class ImportData{
    constructor(
        public name: string,
        public alias_name: string,
        public    checked:boolean,
        public disabled: boolean,
        public funConfig?:any  
    ){}
}