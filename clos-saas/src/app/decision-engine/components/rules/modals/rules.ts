export class RuleEngineParameters {
    id?: number;
    parameterName: string;
    parameterType: Datatype;
    is_selected?:Boolean;
}

export class Datatype {
    constructor(
        public name: string,
        public type: string,
        public paramName?: string,
        public children?: Datatype[],
        public checked?: boolean
    ) { }
}