export class configDetails {
    constructor(
        public tableName: string,
        public tablePriority: number,
        public fieldsDetails: configFieldsDetails[],
        public inquiredApplicationFields: [],
        public matchedTableFields: [],
        public highMatchThreshold:string,
        public averageFromMatchThreshold:string,
        public averageToMatchThreshold:string,
        public lowMatchThreshold:string,
        public avgMatchCCode:string,
        public highMatchCCode:string,
        public lowMatchCCode:string,
        public multipleTable: boolean,
        public configurationMultiple: configDetail[]   
    ){}
}

export class configFieldsDetails {
    constructor(
        public tableFields: [],
        public characters: [],
        public applicationFields: [],
        public doHighlight: boolean,
        public chosenColor: string,
        public chosenAlgorithm: string,
        public fieldPriority: number,
        public routingResultsAndPriority: route[]
    ){}
}

export class configurations {
    constructor(
        public name: string,
        public dbName: string,
        public host: string,
        public port: string,
        public username: string,
        public password: string
    ){}
}

export class route {
    constructor(
        public result: string,
        public chosenPriorityLevel: string,
        public routingPriority: number
    ){}
}
export class configDetail {
    constructor(
        public fieldsDetails: field[],
        public tableName: string,
        public tablePriority: any,
        public inquiredApplicationFields: [],
        public matchedTableFields: []
    ){
    }
}

export class field {
    constructor(
        public applicationFields: [],
        public averageFromMatchThreshold: string,
        public averageToMatchThreshold: string,
        public avgMatchCCode: string,
        public characters: [],
        public chosenAlgorithm: string,
        public chosenColor: string,
        public doHighlight: boolean,
        public fieldPriority: number,
        public highMatchCCode: string,
        public highMatchThreshold: string,

        public lowMatchCCode: string,
        public lowMatchThreshold: string,
        public routingResultsAndPriority: route[],
        public tableFields:[]
    ){}
}
export class loanTypeConfig {
    constructor(
        public loanType: string,
        public product: string,
        public minLoanAmount: number,
        public maxLoanAmount: number,
        public status: string,
        public interestRate: string,
        public collateralCategory: string,
        public collateralType: string,
        public documents : any,
        public baseRate :number,
        public operator :any,
        public spread :number,
    ){
    }
}
export class UserDefinedFields{
    fieldName:string;
    fieldType:string;
    fieldValue:string;
    tab:string;
    subTab:string;
    dateFormat:string;
    module:string;
}

export class UserDefinedCustomFields{
    appId:number;
    fieldName:string;
    fieldType:string;
    fieldValue:string='';
    tab:string;
    subTab?:string;
    dateFormat:string;
    module:string;
}

export class CollateralField{
    loanType:string;
    collateralCategory:string;
    collateralType:string;
    collateralInputType:string;
}
