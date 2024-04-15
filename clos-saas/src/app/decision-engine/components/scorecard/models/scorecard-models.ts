export class Scorecard {
    id: number;
    name: string;
    description?: string;
    version?: number;
    created_on?: Date;
    created_by?: string;
}

export class scoreCardTable {
    ReturnType: string;
    created_by: string;
    created_on: string;
    description: string;
    id: number;
    initialScore: number;
    name: string;
    reasonCodes: string;
    reasonCount: number;
    reasonMethod: string;
    version: number;
    allowexpressions: boolean;
    precalculation: boolean
    scorecardvariables: ScoreCardVariables[];
}

export class ScoreCardVariables {
    id: number;
    name: string;
    type: string;
    value: string;
    scorecardconditons: scoreValues[];
    input: string;
    functionId:string;
}

export class scoreValues {
    id: number;
    label: string;
    name: string;
    partialscore: number;
    reasoncode: string;
    type: string;
    unexpected: boolean;
    values: number;
}