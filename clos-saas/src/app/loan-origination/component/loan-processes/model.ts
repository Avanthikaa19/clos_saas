export class Applicant {
    "customerNumber": number;
    "salutation": string;
    "customerName": string;
    "dob": string
    "nationality": string
    "relationToMainApplicant": string;
    "relationToApplication": string;
    "identification": Identification[]
    "documents": {
        "documentType": string
    }
    "employmentIncome": Employment[]
    "contact": Contact[]
    "address": Address[]
}

export class Identification {
    "idType": string
    "idNumber": number
    "idIssueCountry": string
    "idExpiryDate": string
    "isPrimaryId": boolean
}

export class Employment {
    "employmentType": string
    "employerName": string
    "isCurrentEmployer": boolean
    "grossMonthlyIncome": number
}

export class Contact {
    "contactType": string
    "contactNumber": number
}

export class Address {
    "addressType": string
    "line1": string
    "line2": string
    "area": string
    "district": string
    "state": string
    "country": string
    "areaCode": number
}

export class FilterSortApplicationModel {
    constructor(
        public applicationDataFilter: {
            applicantName: string,
            applicationId: number,
            applicationDate: string,
            idc: any[],
            fdc: any[],
            doc: any[],
            applicationDateFrom: string,
            applicationDateTo: string,
            applicationStage: any[]
        },
        public order: string,
        public orderBy: string

    ) { }
}
export class ApplicationObject {
    constructor(
        public initialData: InitialDataCapture,
        public fullData: FullDataCapture,
        public documentation: Documentation
    ) { }
}
export class InitialDataCapture {
    constructor(
        public id: number,
        public companyName: string,
        public companyType: string,
        public applicantName: string,
        public contactNumber: number,
        public loanType: string,
        public secTDINo: string,
        public loanAmount: number,
        public loanPurpose: string,
        public idc_status: string,
        public createdTime: string
    ) { }
}
export class FullDataCapture {
    constructor(
        public companyDetails: CompanyDetail,
        public applicantDetails: ApplicantDetail,
        public collateralDetails: CollateralDetail
    ) { }
}

export class CompanyDetail {
    constructor(
        public mainActivity: string,
        public sector: string,
        public declaredRevenue: number,
        public numberOfEmployees: number,
        public companyYearsInBusiness: number,
        public lastYearRevenue: number,
        public companyAddress: {
            "id": number,
            "unitNo": string,
            "streetAddress": string,
            "city": string,
            "district": string,
            "zipCode": number
        }
    ) { }
}

export class ApplicantDetail {
    constructor(
        public id: number,
        public name: string,
        public surName: string,
        public dob: string,
        public applicantYearInBusiness: string,
        public position: string,
        public ownerShip: any,
        public bureauSearchConsent: boolean,
        public emailId: string,
        public isPrimaryApplicant: boolean
    ) { }
}

export class CollateralDetail {
    constructor(
        public collateralType: string[],
        public approximateValue: number,
        public fdc_status: string,
        public propertyType?: string,
        public depositAmount?: number,
        public currentBank?: string,
        public collateralAddress?: {
            "id": number,
            "unitNo": number,
            "streetAddress": string,
            "city": string,
            "district": string,
            "zipCode": number
        }
    ) { }
}
export class Documentation {
    constructor(
        public filter: documentList,
        public sort: MultiSort[]
    ) { }
}

export class DocumentList {
    public dataCapture: string
    public daysInStatus: number
    public fileName: string
    public documentName: string
    public documentStatus: string
    public required: string
    public stage: string
    public fileType: string
    public documentId: number
    public documentType: string
}

export class UdfList {
    public booleanValue: boolean
    public dateValue: string
    public decimalValue: number
    public fieldId: number
    public modificationTime: string
    public modifiedByName: string
    public numberValue: number
    public stringValue: string
    public tableId: number
    public targetId: number
    public id: number
}

export class documentList {
    constructor(
        public dataCapture: string,
        public daysInStatus: number,
        public fileName: string,
        public documentName: string,
        public documentStatus: string,
        public required: string,
        public fileType: string,
        public documentId: number,
        public documentType: string,
        public stage: string,
        public documentDate: string
    ){}
}

export class MultiSort {
    constructor(
            public orderBy: string,
            public sortingOrder: string
    ){}
}
