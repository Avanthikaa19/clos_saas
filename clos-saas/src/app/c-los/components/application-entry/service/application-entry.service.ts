import { Injectable } from '@angular/core';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';
import { ApplicationDetails, ShareHolders , Partners, Collaterals, Suppliers, Statement,ProxyFinancialInformation, ProxyOverallDetails, ProxyDetail, RolloverDetails, ExtensionOfLoanDetails} from '../../../models/clos';
@Injectable({
  providedIn: 'root'
})
export class ApplicationEntryService {
  private generatedrollOverid: number | null = null;  
  isUdf:boolean = false;
  userCustomFields: UserDefinedCustomFields[] = [];

  setGeneratedId(id: number) {
    this.generatedrollOverid = id;
  }

  getGeneratedId(): number | null {
    return this.generatedrollOverid;
  }
  addUserCustomField(newField: UserDefinedCustomFields) {
    this.userCustomFields.push(newField);
  }

  clearUserCustomFields() {
    this.userCustomFields = [];
  }
  clearStatementCustomFields(){
    this.statementDetails = [];
    this.proxystatementDetails = [];
  }
  clearProxyFields(){
    this.proxyOverallDetails = [];
    this.proxystatementDetails = [];
    // this.proxyCompanyDetails = {};
  }
  selectedFieldNames: string[] = [];
  selecteFieldValues:any;

  selectedLoanlFieldNames: string[] = [];
  selecteLoanValues:any;

  selectedCollateralNames: string[] = [];
  selectedCollateralValues:any;

  selectedRiskCompilanceNames: string[] = [];
  selectedRiskCompilanceValues:any;

  selectedReferenceNames: string[] = [];
  selectedReferenceValues:any;

  selectedApplicationNames: string[] = [];
  selectedApplicationValues:any;

  selectedOwnershipNames: string[] = [];
  selectedOwnershipValues:any;

  selectedSubsidiariesNames: string[] = [];
  selectedSubsidiariesValues:any;

  selectedSuppliersNames: string[] = [];
  selectedSuppliersValues:any;

  selectedFinInformationNames: string[] = [];
  selectedFinInformationValues:any;

  selectedIndInformationNames: string[] = [];
  selectedIndInformationValues:any;
  // userCustomFields: any = {};
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  rollOverDetails : RolloverDetails = {
    newLoanTerm: 0,
    newInterestRate: 0,
    reason: '',
    maturityDate: null,
    rollOverFee: 0,
    history: [],
    applicationId: 0,
    proposedFrequency: '',
    additionalDocuments: [],
    additionalDocumentsComments: ''
  };
  extensionloandetails : ExtensionOfLoanDetails = {
    newLoanAgreement: [],
    newInterestRate: 0,
    reason: '',
    requestedExtensionTerm: undefined,
    applicationId: 0,
    extensionFee: 0
  }
  // proxyFinancialInformation: ProxyFinancialInformation = new ProxyFinancialInformation();
  shareHoldersDetails: ShareHolders[] = [];
  partnersDetails: Partners[] = [];
  collateralsDetails: Collaterals[] = [];
  suppliersDetails: Suppliers[] = [];
  statementDetails: Statement[] = [];
  shareHolders:ShareHolders[] = [];
  partners:Partners[] = [];
  collaterals:Collaterals[] = [];
  suppliers:Suppliers[] = []; 
  ratioDetails:any[] = [];
  proxyCompanyDetails: ProxyDetail ={
    id: 0,
    proxyCompanyName: '',
    proxyOrganizationType: '',
    companyBusinessRegistrationNumber: 0,
    proxyBranchDateOfIncorporation: undefined,
    proxyBusinessAge: 0,
    proxyBranchTypeOfBusiness: '',
    proxyBranchCorporateTaxIdentificationNumber: '',
    proxyRegisteredAddress: '',
    proxyOfficeContactNumber: 0,
    proxyBusinessEmailId: '',
    proxyCompanyPaidUpCapital: 0,
    proxyAnnualSales: 0,
    proxyAnnualTurnover: 0,
    applicationId:0,
    proxyYearCalculation:'',
    proxyValueConversion: ''
  };
  proxystatementDetails: ProxyFinancialInformation[] = [];
  proxyOverallDetails : ProxyOverallDetails[] =[];
  isData:boolean=false;
  constructor() { }

}
