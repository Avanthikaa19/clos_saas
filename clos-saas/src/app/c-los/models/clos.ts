import { Attachment } from "./clos-table";

export class ApplicationDetails {
    id: number;
    parentId: number;
    applicationId: number;
    //ApplicationDetails
    applicantName: string;
    entityName: string;
    typesOfLoan: string;
    companyId: string;
    share: string;
    passportNumber: string;
    officeAddress: string;
    homeAddress: string;
    contactNumber: number;
    mailId: string;
    dob: Date;
    age: number;
    nationality: string;
    nationalId: string;
    applicantSignature: Attachment[];
    presentDate: Date;
    designation: string;
    retrieveFields:boolean;
    //CorporateDetails - Business and Operation Information
    legalNameOfTheCompany: string;
    typeOfBusiness: string
    organizationType: string;
    registeredName: string;
    businessRegistrationNumber: string;
    countryOfRegistration: string;
    dateOfIncorporation: Date;
    businessAge: number;
    corporateTaxIdentificationNumber: string;
    resident: string;
    registeredAddress: string;
    businessOperatingAddress: string;
    mailingAddress: string;
    officeContactNumber: number;
    businessWebsiteURL: string;
    businessEmailAddress: string;
    businessWithForeignCountries: string;
    natureOfBusiness: string;
    expectedNumberOfTransactionsPerMonth: number;
    expectedTransactionAmountPerMonth: number;
    businessPaidUpCapital: number;
    annualSales: number;
    numberOfEmployees: number;
    sustainabilityPractises: string;
    esgInformation: string;
    annualTurnover: number;
    businessUniqueIdentifier: string;
    businessKYCDocumentNumber: string;
    //CorporateDetails - Ownership
    shareholderName: string;
    shareholdersDesignation: string;
    shareholdersHomeAddress: string;
    shareholdersOfficeAddress: string;
    shareholdersContactNumber: number;
    shareholdersMailId: string;
    shareholdersPassportNumber: string;
    shareholdersDob: Date;
    shareholdersAge: number;
    shareholdersNationality: string;
    shareholdersNationId: string;
    shareholdersTin: string;
    shareholdersAuthorizedSignatures: Attachment[];
    partnersEntityName: string;
    partnersDirectorName: string;
    partnersOfficeAddress: string;
    partnersContactNumber: number;
    partnersMailId: string;
    ultimateBeneficialOwner: string;
    KYCDocumentNumber: string;
    uniqueIdentifier: string;
    //CorporateDetails - Subsidiairies
    branchTypeOfBusiness: string;
    branchOrganizationType: string;
    branchRegisteredName: string;
    branchBusinessRegistrationNumber: string;
    branchCountryOfRegistration: string;
    branchDateOfIncorporation: Date;
    branchCorporateTaxIdentificationNumber: string;
    branchResident: string;
    branchRegisteredAddress: string;
    branchBusinessOperatingAddress: string;
    branchMailingAddress: string;
    branchOfficeContactNumber: number;
    branchBusinessWebsite: string;
    branchBusinessEmailAddress: string;
    branchExpectedNumberOfTransactionsPerMonth: number;
    branchExpectedTransactionAmountPerMonth: number;
    branchPaidUpCapital: number;
    branchAnnualSales: number;
    branchNumberOfEmployees: number;
    //CorporateDetails - Subsidiairies
    supplierCompanyName: string;
    supplierCompanyContactNumber: string;
    supplierContactPerson: string;
    supplierContactNumber: string;
    supplierContactEmail: string;
    supplierCompanyAddress: string;
    supplierCompanyRegistrationNumber: string;
    supplierAgreement: Attachment[];
    supplierAgreementRemarks: string;
    //CorporateDetails - Financial Details
    valueConversion: string;
    financialProxyCompany: string;
    latestInterimFinancialStatement: Attachment[];
    latestInterimFinancialStatementUploadsRemarks: string;
    financialStatementOfPast5Years: Attachment[];
    financialStatementOfPast5YearsUploadsRemarks: string;
    taxReturnsForTheLast3Years: Attachment[];
    taxReturnsForTheLast3YearsUploadsRemarks: string;
    numerals: string;
    revenueShareholdersEquity: number;
    revenueRetainedEarnings: number;
    commonStock: number;
    treasuryStock: number;
    otherComprehensiveIncome: number;
    totalEquity: number;
    debts: number;
    longTermDebt: number;
    debtPeriod: string;
    totalLiabilities: number;
    termLiabilities: number;
    currentLiabilities: number;
    totalAssets: number;
    fixedAssets: number;
    currentAssets: number;
    nonCurrentAssets: number;
    tangibleAssets: number;
    intangibleAssets: number;
    issuedCapital: number;
    paidUpCapital: number;
    additionalPaidInCapital: number;
    generalReserves: number;
    creditBalance: number;
    inventory: number;
    financialShareholdersEquity: number;
    ebit: number;
    ebitda: number;
    interestExpense: number;
    grossProfit: number;
    totalRevenue: number;
    operatingIncome: number;
    netIncome: number;
    interestPayable: number;
    netSales: number;
    averageTotalAssets: number;
    costOfGoodsSold: number;
    averageInventory: number;
    averageAccountsReceivable: number;
    purchases: number;
    averageAccountsPayable: number;
    leasePayments: number;
    principalRepayments: number;
    marketPricePerShare: number;
    earningsPerShare: number;
    bookValuePerShare: number;
    workingCapital: number;
    financialRetainedEarnings: number;
    marketValueOfEquity: number;
    sales: number;
    operationActivitiesNetCash: number;
    depreciationAndAmortization: number;
    changesInWorkingCapital: number;
    investingActivitiesNetCash: number;
    financingActivitiesNetCash: number;
    proceedsFromBorrowings: number;
    repaymentOfBorrowings: number;
    dividendsPaid: number;
    liquidityCurrentRatio: number;
    liquidityQuickRatio: number;
    debtToEquityRatio: number;
    debtRatio: number;
    interestCoverageRatio: number;
    grossProfitMargin: number;
    operatingProfitMargin: number;
    netProfitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
    assetTurnoverRatio: number;
    inventoryTurnoverRatio: number;
    receivableTurnoverRatio: number;
    payablesTurnoverRatio: number;
    debtServiceCoverageRatio: number;
    fixedChargeCoverageRatio: number;
    totalDebtToTotalCapitalRatio: number;
    longTermDebtToEquityRatio: number;
    priceToEarningsRatio: number;
    priceToBookRatio: number;
    altmanZScore: number;
    yearCalculation: string;
    // Proxy Fields
    proxyDebts: number;
    proxyLongTermDebt: number;
    proxyDebtPeriod: string;  
    proxyTotalLiabilities: number;
    proxyTermLiabilities: number;
    proxyCurrentLiabilities: number;
    proxyTotalAssets: number;
    proxyFixedAssets: number;
    proxyCurrentAssets: number;
    proxyNonCurrentAssets: number;
    proxyTangibleAssets: number;
    proxyIntangibleAssets: number;
    proxyIssuedCapital: number;
    proxyFinancialPaidUpCapital: number;
    proxyAdditionalPaidInCapital: number;
    proxyGeneralReserves: number;
    proxyCreditBalance: number;
    proxyInventory: number;
    proxyFinancialShareholdersEquity: number;
    proxyEbit: number;
    proxyEbitda: number;
    proxyInterestExpense: number;
    proxyGrossProfit: number;
    proxyTotalRevenue: number;
    proxyOperatingIncome: number;
    proxyNetIncome: number;
    proxyInterestPayable: number;
    proxyNetSales: number;
    proxyAverageTotalAssets: number;
    proxyCostOfGoodsSold: number;
    proxyAverageInventory: number;
    proxyAverageAccountsReceivable: number;
    proxyPurchases: number;
    proxyAverageAccountsPayable: number;
    proxyLeasePayments: number;
    proxyPrincipalRepayments: number;
    proxyMarketPricePerShare: number;
    proxyEarningsPerShare: number;
    proxyBookValuePerShare: number;
    proxyWorkingCapital: number;
    proxyFinancialRetainedEarnings: number;
    proxyMarketValueOfEquity: number;
    proxySales: number;
    proxyOperationActivitiesNetCash: number;
    proxyDepreciationAndAmortization: number;
    proxyChangesInWorkingCapital: number;
    proxyInvestingActivitiesNetCash: number;
    proxyFinancingActivitiesNetCash: number;
    proxyProceedsFromBorrowings: number;
    proxyRepaymentOfBorrowings: number;
    proxyDividendsPaid: number;
    //CorporateDetails - Industry Information
    productsOffered: string;
    servicesOffered: string;
    salesRegions: string;
    customers: string;
    keyCompetitors: string;
    keySuppliers: string;
    revenueStreams: string;
    contracts: string;
    //Loan Details
    purposeOfLoan: string;
    sourceOfFund: string;
    loanAmount: number;
    loanCurrency: string;
    effectiveRate: string;
    downPaymentAmount: number;
    valueDate: Date;
    maturityDate: Date;
    instalments: number;
    frequency: string;
    businessDebitCard: string;
    termLoan: string;
    intrestRateType: string;
    requestRepaymentFrequency: string;
    loanApprovalAmount: number;
    interestRate: any;
    //Collateral Details
    proxyCompany: string;
    collateralAmount: number;
    collateralAsset: string;
    collateralDescription: string;
    collateralCurrency: string;
    collateralValue: number;
    collateralCategory: string;
    collateralType: string;
    haircut: number;
    loanToValueRatio: number;
    marketValue: number;
    supportingSecurity: string;
    debenture: string;
    corporateGuarantee: string;
    collateralDocuments: Attachment[];
    collateralDocumentsRemarks: string;
    guarantorAgreement: Attachment[];
    guarantorAgreementRemarks: string;
    companyName: string;
    coverType: string;
    amount: number;
    period: string;
    //Risk and Compliance
    litigationHistory: string;
    ongoingLitigations: string;
    recentAuditsOnRegulatoryCompliance: string;
    pastLoanDefaults: string;
    financialFluctuations: string;
    carbonEmission: string;
    ghgEmission: string;
    renewableEnergyUsage: string;
    greenTechnologies: string;
    sustainabilityLevel: string;
    certifications: string;
    diversityEquityInclusion: string;
    complianceWithEnvironmentStandard: string;
    esgScore: number;
    //Reference
    vendorsCompanyName: string;
    vendorsCompanyAddress: string;
    vendorsCompanyContactNumber: number;
    vendorsAgreement: Attachment[];
    vendorsAgreementUploadsRemarks: string;
    suppliersCompanyName: string;
    suppliersCompanyAddress: string;
    suppliersCompanyContactNumber: number;
    suppliersAgreement: Attachment[];
    suppliersAgreementUploadsRemarks: string;
    partnersCompanyName: string;
    partnersCompanyAddress: string;
    partnersCompanyContactNumber: number;
    partnersAgreement: Attachment[];
    partnersAgreementUploadsRemarks: string;
    bankName: string;
    loanType: string;
    bankPurposeOfLoan: string;
    bankLoanAmount: number;
    paymentStatus: string;
    creditScore: number;
    //Uploads
    businessRegistration: Attachment[];
    businessRegistrationUploadsRemarks: string;
    photoCopyOfNRIC: Attachment[];
    photoCopyOfNRICUploadsRemarks: string;
    latest3YearsManagementAccounts: Attachment[];
    latest3YearsManagementAccountsUploadsRemarks: string;
    latest6MonthsBankStatements: Attachment[];
    latest6MonthsBankStatementsUploadsRemarks: string;
    latest3YearsIncomeTaxReturns: Attachment[];
    latest3YearsIncomeTaxReturnsUploadsRemarks: string;
    projectProposal: Attachment[];
    projectProposalUploadsRemarks: string;
    greenCertification: Attachment[];
    greenCertificationUploadsRemarks: string;
    smeIndustry: Attachment[];
    smeIndustryUploadsRemarks: string;
    KYCofApplicant: Attachment[];
    KYCofApplicantUploadsRemarks: string;
    KYCofDirector: Attachment[];
    KYCofDirectorUploadsRemarks: string;
    KYCofCompany: Attachment[];
    KYCofCompanyUploadsRemarks: string;
    balanceSheetUploads: Attachment[];
    balanceSheetUploadsRemarks: string;
    incomeStatementUploads: Attachment[];
    incomeStatementUploadsRemarks: string;
    cashFlowStatementUploads: Attachment[];
    cashFlowStatementUploadsRemarks: string;
    additionalAttachmentsUploads: Attachment[];
    additionalAttachmentsRemarks: string;
    //UI
    initialStatus?: string;
    status?: string;
    appStatus?: string;
    loanStatus: string;
}

export class ShareHolders {
    id: number;
    applicationId: number;
    shareholderName: string;
    shareholdersDesignation: string;
    shareholdersHomeAddress: string;
    shareholdersOfficeAddress: string;
    shareholdersContactNumber: number;
    shareholdersMailId: string;
    shareholdersPassportNumber: string;
    shareholdersDob: Date;
    shareholdersAge: number;
    shareholdersNationId: string;
    shareholdersTin: string;
    shareholdersNationality:string;
    shareholdersAuthorizedSignatures: Attachment[];
}
export class Partners {
    id: number;
    applicationId: number;
    partnershipEntityName: string;
    partnershipDirectorName: string;
    partnershipOfficeAddress: string;
    partnershipContactNumber: number;
    partnershipMailId: string;
    ultimateBeneficialOwner: string;
    uniqueIdentifier: string;
    kycdocumentNumber: string;
}
export class Suppliers {
    id: number;
    applicationId: number;
    supplierCompanyName: string;
    supplierCompanyContactNumber: string;
    supplierContactPerson: string;
    supplierContactNumber: string;
    supplierContactEmail: string;
    supplierCompanyAddress: string;
    supplierCompanyRegistrationNumber: string;
    supplierAgreement: Attachment[];
    supplierAgreementRemarks: string;
}
export class Collaterals {
    id: number;
    applicationId: number;
    collateralAmount: number;
    collateralAsset: string;
    collateralDescription: string;
    collateralCurrency: string;
    collateralValue: number;
    collateralCategory: string;
    collateralType: string;
    marketValue: number;
    haircut: number;
    loanToValueRatio: number;
    collateralDocuments: Attachment[];
    collateralDocumentsRemarks: string;
}

export class MultipleDetails {
    shareHolders: ShareHolders[];
    partners: Partners[];
    collaterals: Collaterals[];
    suppliers: Suppliers[];
}

export class Statement {
    id: number;
    numerals: string;
    commonStock: number;
    treasuryStock: number;
    otherComprehensiveIncome: number;
    totalEquity: number;
    debts: number;
    longTermDebt: number;
    debtPeriod: string;
    totalLiabilities: number;
    termLiabilities: number;
    currentLiabilities: number;
    totalAssets: number;
    fixedAssets: number;
    currentAssets: number;
    nonCurrentAssets: number;
    tangibleAssets: number;
    intangibleAssets: number;
    issuedCapital: number;
    paidUpCapital: number;
    additionalPaidInCapital: number;
    generalReserves: number;
    creditBalance: number;
    inventory: number;
    financialShareholdersEquity: number;
    ebit: number;
    ebitda: number;
    interestExpense: number;
    grossProfit: number;
    totalRevenue: number;
    operatingIncome: number;
    netIncome: number;
    interestPayable: number;
    netSales: number;
    averageTotalAssets: number;
    costOfGoodsSold: number;
    averageInventory: number;
    averageAccountsReceivable: number;
    purchases: number;
    averageAccountsPayable: number;
    leasePayments: number;
    principalRepayments: number;
    marketPricePerShare: number;
    earningsPerShare: number;
    bookValuePerShare: number;
    workingCapital: number;
    financialRetainedEarnings: number;
    marketValueOfEquity: number;
    sales: number;
    operationActivitiesNetCash: number;
    depreciationAndAmortization: number;
    changesInWorkingCapital: number;
    investingActivitiesNetCash: number;
    financingActivitiesNetCash: number;
    proceedsFromBorrowings: number;
    repaymentOfBorrowings: number;
    dividendsPaid: number;
    year: number;
    applicationId: number;
    liquidityCurrentRatio: number;
    liquidityQuickRatio: number;
    debtToEquityRatio: number;
    debtRatio: number;
    interestCoverageRatio: number;
    grossProfitMargin: number;
    operatingProfitMargin: number;
    netProfitMargin: number;
    returnOnAssets: number;
    returnOnEquity: number;
    assetTurnoverRatio: number;
    inventoryTurnoverRatio: number;
    receivableTurnoverRatio: number;
    payablesTurnoverRatio: number;
    debtServiceChargeCoverageRatio: number;
    fixedChargeCoverageRatio: number;
    totalDebtToTotalCapitalRatio: number;
    longTermDebtToEquityRatio: number;
    priceToEarningsRatio: number;
    priceToBookRatio: number;
    altmanZScore: number;
}

export class ProxyDetail {
    id: number;
    proxyCompanyName: string;
    proxyOrganizationType: string;
    companyBusinessRegistrationNumber: number;
    proxyBranchDateOfIncorporation: Date;
    proxyBusinessAge: number;
    proxyBranchTypeOfBusiness: string;
    proxyBranchCorporateTaxIdentificationNumber: string;
    proxyRegisteredAddress: string;
    proxyOfficeContactNumber: number;
    proxyBusinessEmailId: string;
    proxyCompanyPaidUpCapital: number;
    proxyAnnualSales: number;
    proxyAnnualTurnover: number;
    applicationId: number;
    proxyYearCalculation: string;
    proxyValueConversion: string
}
export class DynamicUploads{
    applicationId:number;
    id:number;
    name:string;
    attachmentResponse:Attachment[];
    remarks:string; 
  }
  export class ProxyFinancialInformation{   
    id:number;
    proxyLatestInterimFinancialStatementUploadsRemarks: string;
    proxyFinancialStatementOfPast5YearsUploadsRemarks: string;
    proxyTaxReturnsForTheLast3YearsUploadsRemarks: string;
    proxyCommonStock: number;
    proxyTreasuryStock: number;
    proxyOtherComprehensiveIncome: number;
    proxyTotalEquity: number;
    proxyDebts: number;
    proxyLongTermDebt: string;
    proxyDebtPeriod: string;  
    proxyTotalLiabilities: number;
    proxyTermLiabilities: number;
    proxyCurrentLiabilities: number;
    proxyTotalAssets: number;
    proxyFixedAssets: number;
    proxyCurrentAssets: number;
    proxyNonCurrentAssets: number;
    proxyTangibleAssets: number;
    proxyIntangibleAssets: number;
    proxyIssuedCapital: number;
    proxyFinancialPaidUpCapital: number;
    proxyAdditionalPaidInCapital: number;
    proxyGeneralReserves: number;
    proxyCreditBalance: number;
    proxyInventory: number;
    proxyFinancialShareholdersEquity: number;
    proxyEbit: number;
    proxyEbitda: number;
    proxyInterestExpense: number;
    proxyGrossProfit: number;
    proxyTotalRevenue: number;
    proxyOperatingIncome: number;
    proxyNetIncome: number;
    proxyInterestPayable: number;
    proxyNetSales: number;
    proxyAverageTotalAssets: number;
    proxyCostOfGoodsSold: number;
    proxyAverageInventory: number;
    proxyAverageAccountsReceivable: number;
    proxyPurchases: number;
    proxyAverageAccountsPayable: number;
    proxyLeasePayments: number;
    proxyPrincipalRepayments: number;
    proxyMarketPricePerShare: number;
    proxyEarningsPerShare: number;
    proxyBookValuePerShare: number;
    proxyWorkingCapital: number;
    proxyFinancialRetainedEarnings: number;
    proxyMarketValueOfEquity: number;
    proxySales: number;
    proxyOperationActivitiesNetCash: number;
    proxyDepreciationAndAmortization: number;
    proxyChangesInWorkingCapital: number;
    proxyInvestingActivitiesNetCash: number;
    proxyFinancingActivitiesNetCash: number;
    proxyProceedsFromBorrowings: number;
    proxyRepaymentOfBorrowings: number;
    proxyDividendsPaid: number;
    proxyLiquidityCurrentRatio: number;
    proxyLiquidityQuickRatio: number;
    proxyDebtToEquityRatio: number;
    proxyDebtRatio: number;
    proxyInterestCoverageRatio: number;
    proxyGrossProfitMargin: number;
    proxyOperatingProfitMargin: number;
    proxyNetProfitMargin: number;
    proxyReturnOnAssets: number;
    proxyReturnOnEquity: number;
    proxyAssetTurnoverRatio: number;
    proxyInventoryTurnoverRatio: number;
    proxyReceivableTurnoverRatio: number;
    proxyPayablesTurnoverRatio: number;
    proxyDebtServiceCoverageRatio: number;
    proxyFixedChargeCoverageRatio: number;
    proxyTotalDebtToTotalCapitalRatio: number;
    proxyLongTermDebtToEquityRatio: number;
    proxyPriceToEarningsRatio: number;
    proxyPriceToBookRatio: number;
    proxyAltmanZScore: number;
    proxyRevenueRetainedEarnings: number;
    applicationId: number;
    year: number;
}
export  class ProxyOverallDetails{
    proxyCompanyInformation :ProxyDetail;
    proxyFinancialInformations :ProxyFinancialInformation[];
}
export class RolloverDetails{
    newLoanTerm: number;
    newInterestRate: number;
    reason: string;
    maturityDate: Date;
    rollOverFee: number;
    history: Attachment[];
    applicationId: number;
    proposedFrequency: string;
    additionalDocuments: Attachment[];
    additionalDocumentsComments: string;
    constructor(appId: number){
        this.applicationId = appId;
    }
}
export class ExtensionOfLoanDetails{
    newLoanAgreement: Attachment[];
    newInterestRate:number;    
    reason:string;    
    requestedExtensionTerm:Date;    
    applicationId: number;    
    extensionFee: number;
    constructor(applicationId: number){
        this.applicationId = applicationId;
    }
}
export class LoanTransactionLog{
    applicationId : number;
    borrowerInformation: string;
    loanAmount: number;
    interestRate: number;
    interestPaid: number;
    interestPending: number;
    paymentSchedule: string;
    noOfInstallments: number;
    installmentsPaid: number;
    installmentsPending: number;
    paymentDates: string;
    paymentAmounts: number;
    latePayments: number;
    principalPaid: number;
    principalPending: number;
    currentStatus: string;
    delinquencyStatus: string;
    latePaymentStatus: number;
    otherFees: number;
    loanAgreements: string;    
}     