import { Datatype } from "./ObjectModel";
import { ReasonCode } from "./ReasonCode";

export class RuleEngine {
    id: number;
    name: string;
    description: string;
    last_updated_by: string;
    last_updated_on: Date;
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
export class Actions{
    id:number;
    name:string;
    type:string;
    operand?:string;
    function?:number;
    config?:any;
    choosen?:string;

}
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

}

export class RuleEngineParameters {
    id?: number;
    parameterName: string;
    parameterType: Datatype;
    is_selected?:Boolean;
}

export class RulesValueTree{
    id?: number;
    name: string;
    children?: RulesValueTree[];
}