export class Loancase {
    constructor(
        public filter: GroupFilter,
        public sort: MultiSort[]
    ){}
}

export class GroupFilter {
    constructor(
            public id: string,
            public companyName: string,
            public companyType: string,
            public applicantName: string,
            public contactNumber: string,
            public loanType: string,
            public secTDINo: string,
            public loanAmount: string,
            public loanPurpose: string,
            public verificationStatus: string
    ){}
}

export class MultiSort {
    constructor(
            public orderBy: string,
            public sortingOrder: string
    ){}
}

export class Inprogress {
    constructor(
            public applicationId: any,
            public assignedTo: string
    ){}
}
