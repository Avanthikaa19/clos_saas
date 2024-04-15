export class ChangeApproval {
    id: number;
    type: string;
    tableName: string;
    sourceId: number;
    approved: boolean;
    finalizingUser: string;
    comments: string;
}

export class ChangeApprovalFilter{
    constructor(
        public id: number,
        public type: string,
        public tableName: string,
        public sourceId: number,
        public approved: boolean,
        public finalizingUser: string,
    ) { }
}
export class MultiSort{
    sortingOrder: string;
    orderBy: string;
}
export class ChangeApprovalFilterSort{
    filters: ChangeApprovalFilter;
    sort: MultiSort[];
}