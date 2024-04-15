import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { CLosService } from "src/app/c-los/service/c-los.service";
import { MatTabHeaders } from "../models/application-entry";
import { ApplicationDetails, ShareHolders, Partners, Suppliers, Statement } from "../../../models/clos";
import { ApplicationEntryService } from "../service/application-entry.service";
import { ApplicationEntryComponent } from "../application-entry.component";
import { Attachment, PageData } from "src/app/c-los/models/clos-table";
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { UserDefinedCustomFields } from "src/app/loan-application/components/models/config.models";
import { DuplicateCheckingService } from "src/app/duplicate-checking/services/duplicate-checking.service";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
@Component({
  selector: "app-corporate-details",
  templateUrl: "./corporate-details.component.html",
  styleUrls: ["./corporate-details.component.scss"],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateDetailsComponent implements OnInit {
  loanType: string[] = ['Term Loan', 'Working Capital Loan', 'Revolving Credit Lines', 'Equipment Financing', 'Commercial Real Estate Loan', 'Invoice Financing', 'Trade Finance', 'Bridge Loan', 'Mezzanine Loan', 'Debt Consolidation Loan', 'Acquisition Loan', 'Startup Loan', 'Project Finance']
  @ViewChild('fileInput') fileInput: any;
  udfFieldName: any;
  selectedUdfFieldName: any;
  selectedUdfOwnership: any;
  selectedUdfSubsideries: any;
  selectedUdfSuppliers: any;
  selectedUdfIndInfo: any;
  selectedUdfFinInfo: any;
  matchingField: any;
  matchingOwnership: any;
  matchingSubsideries: any;
  matchingSuppliers: any;
  matchingIndInfo: any;
  matchingFinInfo: any;
  selectedFieldNames: string[] = [];
  selectedFieldOwnership: string[] = [];
  selectedFieldSubsideries: string[] = [];
  selectedFieldSuppliers: string[] = [];
  selectedFieldIndInfo: string[] = [];
  selectedFieldFinInfo: string[] = [];
  filteredLoanList: any[];
  loanConfigList: any[] = [];
  udfSubsideries: any[] = [];
  udfOwnership: any[] = [];
  udfSuppliers: any[] = [];
  udfFinInfo: any[] = [];
  udfIndInfo: any[] = [];
  userCustomFields1: UserDefinedCustomFields[] = [];
  userCustomOwnership: UserDefinedCustomFields[] = [];
  userCustomSubsideries: UserDefinedCustomFields[] = [];
  userCustomSuppliers: UserDefinedCustomFields[] = [];
  userCustomIndInfo: UserDefinedCustomFields[] = [];
  userCustomFinInfo: UserDefinedCustomFields[] = [];
  statement: Statement[] = [];
  ratioList: string[] = [];
  page: number = 1;
  pageData: PageData;
  selectedField: any;
  selectedField1: any;
  selectedField2: any;
  selectedField3: any;
  selectedField4: any;
  selectedField5: any;
  yearlyRatios: any[] = [];
  country: any[] = [];
  currency: any;
  searchCountry: string = '';
  countryList: string[] = [];

  userCustomFields: UserDefinedCustomFields = new UserDefinedCustomFields();
  typeofBusiness: string[] = [
    'Manufacturing',
    'Retail',
    'Service Provider',
    'Technology',
    'Healthcare',
    'Real Estate',
    'Hospitality',
    'Construction',
    'Agriculture',
    'Financial Services',
    'Education',
    'Transportation',
    'Energy',
    'Entertainment',
    'Food and Beverage',
    'Legal Services',
    'Marketing and Advertising',
    'Consulting',
    'Nonprofit',
    'Government Contracting',
    'E - commerce',
    'Import / Export',
    'Wholesale',
    'Automotive',
    'Creative Arts'
  ]
  organizationType: string[] = [
    'Corporation (Corp)',
    'Limited Liability Company (LLC)',
    'Partnership',
    'Sole Proprietorship',
    'Non-profit Organization',
    'Co-operative',
    'Franchise',
    'Government Agency',
    'Public Corporation',
    'Private Corporation',
    'Subsidiary',
    'Joint Venture',
    'Trust',
    'Association',
    'Foundation',
    'Professional Association',
    'Social Enterprise',
    'Holding Company',
    'Family Business',
    'Start-up',
    'Mutual Company',
    'Educational Institution',
    'Healthcare Facility',
    'Religious Organization',
    'Cooperative Society'
  ]
  esgInfoType: string[] = [
    'Carbon Emissions Reporting',
    'Energy Consumption Metrics',
    'Water Usage Data',
    'Waste Management Statistics',
    'Diversity and Inclusion Metrics',
    'Employee Health and Safety Data',
    'Ethical Sourcing Verification',
    'Human Rights Compliance Information',
    'Executive Compensation Transparency',
    'Board Diversity Information',
    'Environmental Impact Assessments',
    'Social Impact Reporting',
    'Supply Chain Sustainability Evaluation',
    'Corporate Governance Practices',
    'Data Privacy and Security Measures',
    'Stakeholder Engagement Processes',
    'Philanthropic Contributions Tracking',
    'Sustainable Product Portfolio Details',
    'Green Innovation and Research Investments',
    'Environmental Risk Management Strategies'
  ]
  sustainabilityType: string[] = [
    'Energy Efficiency Improvements',
    'Waste Reduction Initiatives',
    'Renewable Energy Integration',
    'Water Conservation Programs',
    'Sustainable Supply Chain Management',
    'Emissions Reduction Strategies',
    'Green Building Standards Adoption',
    'Circular Economy Initiatives',
    'Biodiversity Conservation Efforts',
    'Social Impact and Community Projects',
    'Employee Well-being and Safety Programs',
    'Ethical Sourcing Practices',
    'Responsible Product Design and Development',
    'Stakeholder Engagement and Transparency',
    'Climate Risk Assessment and Mitigation',
    'Resource Efficiency Measures',
    'Sustainable Transportation Solutions',
    'Philanthropic Contributions and Donations',
    'Social Equity and Diversity Initiatives',
    'Stakeholder-Focused Governance Practices'
  ];
  yearrange: string[] = ['Last 3 Years', 'Last 5 Years'];
  selectedOption: string = 'Last 3 Years';
  yearsList: number[] = [];
  selectedConversion: string = 'Millions';
  conversionOptions: string[] = ['Thousands', 'Millions', 'Billions', 'Trillions'];
  datasList: any[] = []
  shareHolderTableHeader: string[] = ['Name', 'Designation', 'Contact Number', 'Office Address', 'Home Address', 'Mail Id', 'Passport Number', 'DOB', 'Age', 'Nation Id', 'TIN', 'Nationality','Authorized Signature'];
  partershipTableHeader: string[] = ['Entity name', 'Director Name', 'Office Address', 'Contact Number', 'Mail Id', 'Ultimate Beneficial Owner (UBO) ', 'KYC Document Number', 'Unique Identifier'];
  supplierTableHeader: string[] = ['Company Name', 'Company Contact Number', 'Contact Person', 'Contact Phone', 'Contact Email', 'Company Address', 'Supplier Company Registration Number', 'Aggreement'];
  selectType = ['Yes', 'No'];

  matTabHeader: MatTabHeaders[] = [
    { name: "Statement", icon: "file_copy" },
    { name: "Ratio", icon: "file_copy" },
  ];
  activeStepIndex: number = 0;
  index: number = 0;
  option: number = 0;
  ratioDetails: any[] = []
  activeTabName: string;
  activeSubTabName: string;
  files: File[] = [];
  minSelectInput: HTMLInputElement;
  appId: number;
  headers: ShareHolders[] = [new ShareHolders()];
  partnerHeaders: Partners[] = [new Partners()];
  supplierheaders: Suppliers[] = [new Suppliers()];
  action: string;
  call_Status: boolean = false;
  ratioindex: number = 0;
  currentDate = new Date().toISOString().split('T')[0];
  constructor(
    public router: Router,
    public closService: CLosService,
    private applicationEntryService: ApplicationEntryService,
    private applicationEntryComponent: ApplicationEntryComponent,
    public encryptDecryptService: EncryptDecryptService,
    private cdr: ChangeDetectorRef,
    public dupliateService: DuplicateCheckingService

  ) {
    // INITIALIZING PAGEDATA a
    this.userCustomFields.fieldValue = '';
    this.userCustomFields.fieldName = '';
    this.userCustomFields.tab = '';
    this.userCustomFields.subTab = '';
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
    this.closService.activeSubTabName$.subscribe((name) => {
      this.activeSubTabName = name;
    });

    let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
    this.appId = +decryptId;
    console.log("decrypt", this.appId)
    this.userCustomFields1 = [];
    this.userCustomOwnership = [];
    this.userCustomOwnership = [];
    this.userCustomSubsideries = [];
    this.userCustomSuppliers = [];
    this.userCustomIndInfo = [];
    this.userCustomFinInfo = [];

    // names
    if (this.applicationEntryService.selectedFieldNames) {
      this.selectedFieldNames = this.applicationEntryService.selectedFieldNames;
    }
    if (this.applicationEntryService.selectedOwnershipNames) {
      this.selectedFieldOwnership = this.applicationEntryService.selectedOwnershipNames;
    }
    if (this.applicationEntryService.selectedSubsidiariesNames) {
      this.selectedFieldSubsideries = this.applicationEntryService.selectedSubsidiariesNames;
    }
    if (this.applicationEntryService.selectedSuppliersNames) {
      this.selectedFieldSuppliers = this.applicationEntryService.selectedSuppliersNames;
    }
    if (this.applicationEntryService.selectedFinInformationNames) {
      this.selectedFieldFinInfo = this.applicationEntryService.selectedFinInformationNames;
    }
    if (this.applicationEntryService.selectedIndInformationNames) {
      this.selectedFieldIndInfo = this.applicationEntryService.selectedIndInformationNames;
    }
    // values
    if (this.applicationEntryService.selecteFieldValues) {
      this.userCustomFields1 = this.applicationEntryService.selecteFieldValues;
    }
    if (this.applicationEntryService.selectedOwnershipValues) {
      this.userCustomOwnership = this.applicationEntryService.selectedOwnershipValues;
    }
    if (this.applicationEntryService.selectedSubsidiariesValues) {
      this.userCustomSubsideries = this.applicationEntryService.selectedSubsidiariesValues;
    }
    if (this.applicationEntryService.selectedSuppliersValues) {
      this.userCustomSuppliers = this.applicationEntryService.selectedSuppliersValues;
    }
    if (this.applicationEntryService.selectedFinInformationValues) {
      this.userCustomFinInfo = this.applicationEntryService.selectedFinInformationValues;
    }
    if (this.applicationEntryService.selectedIndInformationValues) {
      this.userCustomIndInfo = this.applicationEntryService.selectedIndInformationValues;
    }
    if (this.applicationEntryService.shareHoldersDetails.length) {
      this.headers = this.applicationEntryService.shareHoldersDetails;
    }
    if (this.applicationEntryService.partnersDetails.length) {
      this.partnerHeaders = this.applicationEntryService.partnersDetails;
    }
    if (this.applicationEntryService.suppliersDetails.length) {
      this.supplierheaders = this.applicationEntryService.suppliersDetails;
    }
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (e.url === '/application-entry/application-view' || e.url === '/home') {
          this.applicationDetails.parentId = null;
          this.closService.resetFsIds();
          this.closService.resetAction();
        }
      }
    });
    this.action = this.closService.getAction();
  }

  applicationDetails: ApplicationDetails = new ApplicationDetails();
  shareHoldersDetails: ShareHolders = new ShareHolders();
  partnersDetails: Partners = new Partners();
  suppliersDetails: Suppliers = new Suppliers();
  ngOnInit(): void {
    this.applicationEntryComponent.goToNextStep();
    this.applicationEntryComponent.goToPreviousStep();
    this.applicationDetails = this.applicationEntryService.applicationDetails;
    this.ratioDetails = this.applicationEntryService.ratioDetails;
    if (this.applicationDetails.typesOfLoan && this.ratioindex == 0) {
      this.getRatioByLoan();
      this.ratioindex++;
    }
    this.applicationEntryComponent.activeSubStepIndex;
    if (this.applicationEntryComponent.activeSubStepIndex == 0) {
      this.activeSubTabName = 'Business and operation Information';
    }
    this.saveApplicationData('', '');
    this.action = this.closService.getAction();
    if (this.action === 'ADDITIONAL_LOAN') {
      if (Object.keys(this.applicationEntryService.applicationDetails).length > 0) {
        this.applicationEntryService.applicationDetails = this.applicationDetails;
      }
      else{
        this.getAdditionalLoanDetails();
      }
      this.appId = this.closService.getFsIds();
    }
    if (Object.keys(this.applicationEntryService.applicationDetails).length === 0 && this.appId && this.action != 'ADDITIONAL_LOAN') {
      this.getDataById();
    }
    if (Object.keys(this.applicationEntryService.shareHoldersDetails).length === 0 && this.appId) {
      this.getMultipleDetails();
    }
    if (this.applicationEntryService.userCustomFields.length === 0 && this.appId) {
      this.getCustomFields();
    }
    if (this.applicationEntryService.statementDetails.length === 0 && this.appId) {
      this.getStatementFields();
    }
    if (this.applicationEntryService.statementDetails != null) {
      
      if(this.applicationEntryService.statementDetails.length){
        this.calculateYears();
        this.statement = this.applicationEntryService.statementDetails;
      }
    } else {
      if (this.call_Status == false) {
        this.calculateYears();
      }
      this.applicationEntryService.statementDetails = this.statement;
    }
    const storedFieldNames = sessionStorage.getItem('udfFieldName');
    if (storedFieldNames) {
      this.udfFieldName = JSON.parse(storedFieldNames);
    }
    this.getUdfConfigDetails();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        if (e.url === '/application-entry/application-view' || e.url === '/home') {
          this.applicationEntryService.userCustomFields = [];
          this.applicationEntryService.selecteFieldValues = '';
          this.applicationEntryService.selectedFieldNames = [];
          this.applicationEntryService.selectedOwnershipValues = '';
          this.applicationEntryService.selectedOwnershipNames = [];
          this.applicationEntryService.selectedSubsidiariesValues = '';
          this.applicationEntryService.selectedSubsidiariesNames = [];
          this.applicationEntryService.selectedSuppliersValues = '';
          this.applicationEntryService.selectedSuppliersNames = [];
          this.applicationEntryService.selectedFinInformationValues = '';
          this.applicationEntryService.selectedFinInformationNames = [];
          this.applicationEntryService.selectedIndInformationValues = '';
          this.applicationEntryService.selectedIndInformationNames = [];
          this.applicationEntryService.shareHoldersDetails = [];
          this.applicationEntryService.partnersDetails = [];
          this.applicationEntryService.suppliersDetails = [];
          this.applicationEntryService.statementDetails = [];
          this.activeSubTabName === 'Business and operation Information';
        }
      }
    });
    this.dupliateService.getCurrencyByCountry().subscribe(data => {
      this.country.push(data);
      console.log('this', this.country);
      this.onDropdownClick();
    });
  }

  calculateYears() {
    const currentYear = new Date().getFullYear();
    const selectedOptionValue = parseInt(this.applicationDetails.yearCalculation?.split(' ')[1], 10);
    this.yearsList = [];
    this.statement = [];
    for (let i = 0; i < selectedOptionValue; i++) {
      this.yearsList.push(currentYear - i);
    }
    for (let i = 0; i < this.yearsList.length; i++) {
      // this.statement[i].year=0
      this.statement.push({
        "year": this.yearsList[i],
        "id": 0,
        "numerals":"",
        "applicationId": 0,
        "commonStock": 0,
        "treasuryStock": 0,
        "otherComprehensiveIncome": 0,
        "totalEquity": 0,
        "debts": 0,
        "longTermDebt": 0,
        "debtPeriod": "",
        "totalLiabilities": 0,
        "termLiabilities": 0,
        "currentLiabilities": 0,
        "totalAssets": 0,
        "fixedAssets": 0,
        "currentAssets": 0,
        "nonCurrentAssets": 0,
        "tangibleAssets": 0,
        "intangibleAssets": 0,
        "issuedCapital": 0,
        "paidUpCapital": 0,
        "additionalPaidInCapital": 0,
        "generalReserves": 0,
        "creditBalance": 0,
        "inventory": 0,
        "financialShareholdersEquity": 0,
        "ebit": 0,
        "ebitda": 0,
        "interestExpense": 0,
        "grossProfit": 0,
        "totalRevenue": 0,
        "operatingIncome": 0,
        "netIncome": 0,
        "interestPayable": 0,
        "netSales": 0,
        "averageTotalAssets": 0,
        "costOfGoodsSold": 0,
        "averageInventory": 0,
        "averageAccountsReceivable": 0,
        "purchases": 0,
        "averageAccountsPayable": 0,
        "leasePayments": 0,
        "principalRepayments": 0,
        "marketPricePerShare": 0,
        "earningsPerShare": 0,
        "bookValuePerShare": 0,
        "workingCapital": 0,
        "financialRetainedEarnings": 0,
        "marketValueOfEquity": 0,
        "sales": 0,
        "operationActivitiesNetCash": 0,
        "depreciationAndAmortization": 0,
        "changesInWorkingCapital": 0,
        "investingActivitiesNetCash": 0,
        "financingActivitiesNetCash": 0,
        "proceedsFromBorrowings": 0,
        "repaymentOfBorrowings": 0,
        "dividendsPaid": 0,
        "liquidityCurrentRatio": 0,
        "liquidityQuickRatio": 0,
        "debtToEquityRatio": 0,
        "debtRatio": 0,
        "interestCoverageRatio": 0,
        "grossProfitMargin": 0,
        "operatingProfitMargin": 0,
        "netProfitMargin": 0,
        "returnOnAssets": 0,
        "returnOnEquity": 0,
        "assetTurnoverRatio": 0,
        "inventoryTurnoverRatio": 0,
        "receivableTurnoverRatio": 0,
        "payablesTurnoverRatio": 0,
        "debtServiceChargeCoverageRatio": 0,
        "fixedChargeCoverageRatio": 0,
        "totalDebtToTotalCapitalRatio": 0,
        "longTermDebtToEquityRatio": 0,
        "priceToEarningsRatio": 0,
        "priceToBookRatio": 0,
        "altmanZScore": 0
      })
    }
  }

  addHeader() {
    this.headers.push({ ...this.shareHoldersDetails });
    this.shareHoldersDetails = new ShareHolders(); // Reset the form    
  }
  removeShareHolder(index) {
    this.headers.splice(index, 1);
  }
  removePartnerShip(index) {
    this.partnerHeaders.splice(index, 1);
  }
  removeSupplier(index) {
    this.supplierheaders.splice(index, 1);
  }
  addPartnerHeader() {
    this.partnerHeaders.push({ ...this.partnersDetails });
    this.partnersDetails = new Partners();
  }
  addSupplierHeader() {
    // if (!this.supplierheaders) {
    //   this.supplierheaders = []; 
    // }
    this.supplierheaders.push({ ...this.suppliersDetails });
    this.suppliersDetails = new Suppliers();
  }
  getMultipleDetails() {
    this.closService.getMultipleDetails(this.appId).subscribe(
      res => {
        this.applicationEntryService.shareHolders = res.shareHolders;
        this.applicationEntryService.suppliers = res.supplier;
        this.headers = res.shareHolders;
        this.partnerHeaders = res.partners;
        this.supplierheaders = res.supplier;
      }
    )
  }

  getDataById() {
    this.closService.getApplicationDetailsByID(this.appId).subscribe(
      res => {
        this.applicationDetails = res;
        this.getRatioByLoan();
        for (let key in res) {
          if (typeof res[key] === 'number' && !this.applicationDetails['officeContactNumber']) {
            this.applicationDetails[key] = res[key].toLocaleString();
          }
        }
        if (this.action === 'ROLL_OVER' || this.action === 'EXTENSION_OF_LOAN') {
          res['id'] = null;
          res['applicationId'] = null;
          this.appId = null;
          delete res['applicationResult'];
        }
        console.log(res);
        this.getCountryAndCurrency();
        this.cdr.detectChanges();
      }
    )
    // this.getMultipleDetails();
  }

  saveApplicationData(field, types) {
    this.applicationEntryService.applicationDetails = this.applicationDetails;
    this.closService.setSelectedLoanType(this.applicationDetails.typesOfLoan);
  }

  saveShareHoldersDetails() {
    this.applicationEntryService.shareHoldersDetails = this.headers;
    this.applicationEntryService.partnersDetails = this.partnerHeaders;
    this.applicationEntryService.suppliersDetails = this.supplierheaders;
  }

  onStepSelectionChange(event: any) {
    this.option = event.index;
    this.activeTabName = event.tab.textLabel;
    if (this.option == 1) {
      // this.toCalculateRatio();
    }
  }

  onFilesSelected(event: any, field: string) {
    this.files = event.target.files;
    this.uploadAttachments(field);
  }
  onMultipleDetailsFileSelected(event: any, field: string, index: number) {
    this.files = event.target.files;
    this.onMutipleDetailsFileUpload(field, index);
  }

  onMutipleDetailsFileUpload(field: string, index: number) {
    for (let i = 0; i < this.files.length; i++) {
      this.closService.uploadAttachment(this.files[i]).subscribe(
        res => {
          if (field === 'shareholdersAuthorizedSignatures') {
            if (!this.headers[index].shareholdersAuthorizedSignatures) {
              this.headers[index].shareholdersAuthorizedSignatures = [];
            }
            const response = this.formFileResponseData(res.attachmentName, res.attachmentId);
            this.headers[index].shareholdersAuthorizedSignatures.push(response);
            this.cdr.detectChanges();
          }
          if (field === 'supplierAgreement') {
            if (!this.supplierheaders[index].supplierAgreement) {
              this.supplierheaders[index].supplierAgreement = [];
            }
            const response = this.formFileResponseData(res.attachmentName, res.attachmentId);
            this.supplierheaders[index].supplierAgreement.push(response);
            this.cdr.detectChanges();
          }
        }
      );
    }
    this.saveShareHoldersDetails();
  }


  formFileResponseData(attachmentName: string, attachmentId: number) {
    let attachmentResponse = new Attachment()
    attachmentResponse.attachmentId = attachmentId;
    attachmentResponse.attachmentName = attachmentName;
    return attachmentResponse
  }

  uploadAttachments(field: string) {
    for (let i = 0; i < this.files.length; i++) {
      this.closService.uploadAttachment(this.files[i]).subscribe(
        res => {
          if (field == 'latestInterimFinancialStatement') {
            if (!this.applicationDetails.latestInterimFinancialStatement) {
              this.applicationDetails.latestInterimFinancialStatement = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.applicationDetails.latestInterimFinancialStatement.push(response);
            this.cdr.detectChanges();
          }
          if (field == 'financialStatementOfPast5Years') {
            if (!this.applicationDetails.financialStatementOfPast5Years) {
              this.applicationDetails.financialStatementOfPast5Years = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.applicationDetails.financialStatementOfPast5Years.push(response)
            this.cdr.detectChanges();
          }
          if (field == 'taxReturnsForTheLast3Years') {
            if (!this.applicationDetails.taxReturnsForTheLast3Years) {
              this.applicationDetails.taxReturnsForTheLast3Years = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.applicationDetails.taxReturnsForTheLast3Years.push(response)
            this.cdr.detectChanges();
          }
          this.saveApplicationData(field, 'string');
        }
      )
    }
  }

  removeAttachment(type: string, index: number, j?: number) {
    if (type == 'latestInterimFinancialStatement') {
      this.applicationDetails.latestInterimFinancialStatement.splice(index, 1)
    }
    else if (type == 'financialStatementOfPast5Years') {
      this.applicationDetails.financialStatementOfPast5Years.splice(index, 1)
    }
    else if (type == 'taxReturnsForTheLast3Years') {
      this.applicationDetails.taxReturnsForTheLast3Years.splice(index, 1)
    }
    else if (type == 'shareholdersAuthorizedSignatures') {
      this.headers[index].shareholdersAuthorizedSignatures.splice(j, 1)
    }
    else if (type == 'supplierAgreement') {
      this.supplierheaders[index].supplierAgreement.splice(j, 1)
    }
  }


  getAttachementFileDownload(id: number) {
    this.closService.getAttachmentDetails([id]).subscribe(attachment => {
      if (attachment) {
        let fileName = attachment[0].fileName
        this.closService.getAttachmentDownload(id).subscribe(res => {
          var blob = new Blob([res])
          var url = window.URL.createObjectURL(blob);
          var anchor = document.createElement("a");
          anchor.download = fileName;
          anchor.href = url;
          anchor.click();
        })
      }
    })
  }

  onFinancialFile(event: any) {
    this.files = event.target.files;
    this.uploadFinancialInformation();
  }

  uploadFinancialInformation() {
    for (let i = 0; i < this.files.length; i++) {
      this.closService.getUploadFile(this.files[i]).subscribe(
        res => {
          if (!this.statement) {
            this.statement = [];
           }        
          for (let i = 0; i < res.length; i++) {
            const financialData = res[i];            
            if (!this.statement[i]) {                
                this.statement[i] = new Statement();
            }           
            this.statement[i].year = financialData.year;
            this.statement[i].numerals = financialData.numerals;
            this.statement[i].commonStock = financialData.commonStock;
            this.statement[i].treasuryStock = financialData.treasuryStock;
            this.statement[i].otherComprehensiveIncome = financialData.otherComprehensiveIncome;
            this.statement[i].totalEquity = financialData.totalEquity;
            this.statement[i].debts = financialData.debts;
            this.statement[i].longTermDebt = financialData.longTermDebt;
            this.statement[i].debtPeriod = financialData.debtPeriod;
            this.statement[i].totalLiabilities = financialData.totalLiabilities;
            this.statement[i].termLiabilities = financialData.termLiabilities;
            this.statement[i].currentLiabilities = financialData.currentLiabilities;
            this.statement[i].totalAssets = financialData.totalAssets;
            this.statement[i].currentAssets = financialData.currentAssets;
            this.statement[i].fixedAssets = financialData.fixedAssets;
            this.statement[i].nonCurrentAssets = financialData.nonCurrentAssets;
            this.statement[i].tangibleAssets = financialData.tangibleAssets;
            this.statement[i].intangibleAssets = financialData.intangibleAssets;
            this.statement[i].issuedCapital = financialData.issuedCapital;
            this.statement[i].paidUpCapital = financialData.paidUpCapital;
            this.statement[i].additionalPaidInCapital = financialData.additionalPaid_InCapital;
            this.statement[i].generalReserves = financialData.generalReserves;
            this.statement[i].creditBalance = financialData.creditBalance;
            this.statement[i].inventory = financialData.inventory;
            this.statement[i].financialShareholdersEquity = financialData.financialShareholdersEquity;
            this.statement[i].ebit = financialData.ebit;
            this.statement[i].ebitda = financialData.ebitda;
            this.statement[i].interestExpense = financialData.interestExpense;
            this.statement[i].grossProfit = financialData.grossProfit;
            this.statement[i].totalRevenue = financialData.totalRevenue;
            this.statement[i].netIncome = financialData.netIncome;
            this.statement[i].interestPayable = financialData.interestPayable;
            this.statement[i].netSales = financialData.netSales;
            this.statement[i].averageTotalAssets = financialData.averageTotalAssets;
            this.statement[i].costOfGoodsSold = financialData.costOfGoodsSold;
            this.statement[i].averageInventory = financialData.averageInventory;
            this.statement[i].averageAccountsReceivable = financialData.averageAccountsReceivable;
            this.statement[i].purchases = financialData.purchases;
            this.statement[i].averageAccountsPayable = financialData.averageAccountsPayable;
            this.statement[i].leasePayments = financialData.leasePayments;
            this.statement[i].principalRepayments = financialData.principalRepayments;
            this.statement[i].marketPricePerShare = financialData.marketPricePerShare;
            this.statement[i].earningsPerShare = financialData.earningsPerShare;
            this.statement[i].bookValuePerShare = financialData.bookValuePerShare;
            this.statement[i].workingCapital = financialData.workingCapital;
            this.statement[i].financialRetainedEarnings = financialData.financialRetainedEarnings;
            this.statement[i].marketValueOfEquity = financialData.marketValueOfEquity;
            this.statement[i].sales = financialData.sales;
            this.statement[i].operationActivitiesNetCash = financialData.operationActivitiesNetCash;
            this.statement[i].depreciationAndAmortization = financialData.depreciationAndAmortization;
            this.statement[i].changesInWorkingCapital = financialData.changesInWorkingCapital;
            this.statement[i].investingActivitiesNetCash = financialData.investingActivitiesNetCash;
            this.statement[i].financingActivitiesNetCash = financialData.financingActivitiesNetCash;
            this.statement[i].proceedsFromBorrowings = financialData.proceedsFromBorrowings;
            this.statement[i].repaymentOfBorrowings = financialData.repaymentOfBorrowings;
            this.statement[i].dividendsPaid = financialData.dividendsPaid;    
            this.calculateRatio('commonStock', i, this.statement[i].commonStock); 
            this.calculateRatio('debts', i, this.statement[i].debts); 
            this.calculateRatio('longTermDebt', i, this.statement[i].longTermDebt); 
            this.calculateRatio('currentLiabilities', i, this.statement[i].currentLiabilities); 
            this.calculateRatio('totalAssets', i, this.statement[i].totalAssets);
            this.calculateRatio('currentAssets', i, this.statement[i].currentAssets); 
            this.calculateRatio('inventory', i, this.statement[i].inventory);           
            this.calculateRatio('financialShareholdersEquity', i, this.statement[i].financialShareholdersEquity);  
            this.calculateRatio('ebit', i, this.statement[i].ebit); 
            this.calculateRatio('ebitda', i, this.statement[i].ebitda); 
            this.calculateRatio('interestExpense', i, this.statement[i].interestExpense); 
            this.calculateRatio('grossProfit', i, this.statement[i].grossProfit); 
            this.calculateRatio('totalRevenue', i, this.statement[i].totalRevenue); 
            this.calculateRatio('operatingIncome', i, this.statement[i].operatingIncome); 
            this.calculateRatio('netIncome', i, this.statement[i].netIncome); 
            this.calculateRatio('interestPayable', i, this.statement[i].interestPayable); 
            this.calculateRatio('netSales', i, this.statement[i].netSales); 
            this.calculateRatio('averageTotalAssets', i, this.statement[i].averageTotalAssets); 
            this.calculateRatio('costOfGoodsSold', i, this.statement[i].costOfGoodsSold); 
            this.calculateRatio('averageInventory', i, this.statement[i].averageInventory); 
            this.calculateRatio('averageAccountsReceivable', i, this.statement[i].averageAccountsReceivable); 
            this.calculateRatio('purchases', i, this.statement[i].purchases); 
            this.calculateRatio('averageAccountsPayable', i, this.statement[i].averageAccountsPayable); 
            this.calculateRatio('leasePayments', i, this.statement[i].leasePayments); 
            this.calculateRatio('principalRepayments', i, this.statement[i].principalRepayments); 
            this.calculateRatio('marketPricePerShare', i, this.statement[i].marketPricePerShare); 
            this.calculateRatio('earningsPerShare', i, this.statement[i].earningsPerShare); 
            this.calculateRatio('bookValuePerShare', i, this.statement[i].bookValuePerShare); 
            this.calculateRatio('workingCapital', i, this.statement[i].workingCapital); 
            this.calculateRatio('financialRetainedEarnings', i, this.statement[i].financialRetainedEarnings); 
            this.calculateRatio('marketValueOfEquity', i, this.statement[i].marketValueOfEquity); 
            this.calculateRatio('sales', i, this.statement[i].sales); 
            this.fieldbinding();                  
            this.cdr.detectChanges();                
        }
          this.applicationDetails.additionalPaidInCapital = res.additionalPaidInCapital;
          this.applicationDetails.averageAccountsPayable = res.averageAccountsPayable;
          this.applicationDetails.averageAccountsReceivable = res.averageAccountsReceivable;
          this.applicationDetails.averageInventory = res.averageInventory;
          this.applicationDetails.averageTotalAssets = res.averageTotalAssets;
          this.applicationDetails.bookValuePerShare = res.bookValuePerShare;
          this.applicationDetails.changesInWorkingCapital = res.changesInWorkingCapital;
          this.applicationDetails.commonStock = res.commonStock;
          this.applicationDetails.costOfGoodsSold = res.costOfGoodsSold;
          this.applicationDetails.creditBalance = res.creditBalance;
          this.applicationDetails.currentAssets = res.currentAssets;
          this.applicationDetails.currentLiabilities = res.currentLiabilities;
          this.applicationDetails.debtPeriod = res.debtPeriod;
          this.applicationDetails.debts = res.debts;
          this.applicationDetails.depreciationAndAmortization = res.depreciationAndAmortization;
          this.applicationDetails.dividendsPaid = res.dividendsPaid;
          this.applicationDetails.earningsPerShare = res.earningsPerShare;
          this.applicationDetails.ebit = res.ebit;
          this.applicationDetails.ebitda = res.ebitda;
          this.applicationDetails.financialRetainedEarnings = res.financialRetainedEarnings;
          this.applicationDetails.financialShareholdersEquity = res.financialShareholdersEquity;
          this.applicationDetails.financingActivitiesNetCash = res.financingActivitiesNetCash;
          this.applicationDetails.fixedAssets = res.fixedAssets;
          this.applicationDetails.generalReserves = res.generalReserves;
          this.applicationDetails.grossProfit = res.grossProfit;
          this.applicationDetails.intangibleAssets = res.intangibleAssets;
          this.applicationDetails.interestExpense = res.interestExpense;
          this.applicationDetails.interestPayable = res.interestPayable;
          this.applicationDetails.inventory = res.inventory;
          this.applicationDetails.investingActivitiesNetCash = res.investingActivitiesNetCash;
          this.applicationDetails.issuedCapital = res.issuedCapital;
          this.applicationDetails.leasePayments = res.leasePayments;
          this.applicationDetails.longTermDebt = res.longTermDebt;
          this.applicationDetails.marketPricePerShare = res.marketPricePerShare;
          this.applicationDetails.marketValueOfEquity = res.marketValueOfEquity;
          this.applicationDetails.netIncome = res.netIncome;
          this.applicationDetails.netSales = res.netSales;
          this.applicationDetails.nonCurrentAssets = res.nonCurrentAssets;
          this.applicationDetails.operatingIncome = res.operatingIncome;
          this.applicationDetails.operationActivitiesNetCash = res.operationActivitiesNetCash;
          this.applicationDetails.otherComprehensiveIncome = res.otherComprehensiveIncome;
          this.applicationDetails.paidUpCapital = res.paidUpCapital;
          this.applicationDetails.principalRepayments = res.principalRepayments;
          this.applicationDetails.proceedsFromBorrowings = res.proceedsFromBorrowings;
          this.applicationDetails.purchases = res.purchases;
          this.applicationDetails.repaymentOfBorrowings = res.repaymentOfBorrowings;
          this.applicationDetails.revenueRetainedEarnings = res.revenueRetainedEarnings;
          this.applicationDetails.sales = res.sales;
          this.applicationDetails.tangibleAssets = res.tangibleAssets;
          this.applicationDetails.termLiabilities = res.termLiabilities;
          this.applicationDetails.totalAssets = res.totalAssets;
          this.applicationDetails.totalEquity = res.totalEquity;
          this.applicationDetails.totalLiabilities = res.totalLiabilities;
          this.applicationDetails.totalRevenue = res.totalRevenue;
          this.applicationDetails.treasuryStock = res.treasuryStock;
          this.applicationDetails.workingCapital = res.workingCapital;
          this.applicationDetails.numerals = res[i].numerals;
          this.cdr.detectChanges();
        this.fieldbinding();
        this.cdr.detectChanges();
        }
      )
    }
  }


  nexttab() {
    this.saveApplicationData('', '');
    this.applicationEntryComponent.goToNextStep();
    this.enableSecondTab()
  }

  enableSecondTab() {
    this.closService.setEnableSecondTab(true);
  }

  getRatioByLoan() {
    this.closService.getRatioByLoan(this.applicationDetails.typesOfLoan).subscribe(
      res => {
        this.ratioList = res;
        // To Calculate Years
        // const currentYear = new Date().getFullYear();
        // const selectedOptionValue = parseInt(this.selectedOption.split(' ')[1], 10);
        // this.yearsList = [];
        // for (let i = 0; i < selectedOptionValue; i++) {
        //   this.yearsList.push(currentYear - i);
        // }
      }
    )
  }

  disable() {
    if (!this.applicationDetails.legalNameOfTheCompany || !this.applicationDetails.typeOfBusiness || !this.applicationDetails.organizationType || !this.applicationDetails.typesOfLoan || !this.applicationDetails.businessRegistrationNumber || !this.applicationDetails.countryOfRegistration || !this.applicationDetails.dateOfIncorporation || !this.applicationDetails.corporateTaxIdentificationNumber || !this.applicationDetails.resident || !this.applicationDetails.registeredAddress || !this.applicationDetails.businessOperatingAddress
      || !this.applicationDetails.officeContactNumber || !this.applicationDetails.businessEmailAddress || !this.applicationDetails.annualTurnover || !this.applicationDetails.businessUniqueIdentifier || this.applicationDetails.latestInterimFinancialStatement?.length == 0 || this.applicationDetails.financialStatementOfPast5Years?.length == 0 || this.applicationDetails.taxReturnsForTheLast3Years?.length == 0
      ) {
      return false;
    }
    else {
      return true;
    }
  }

  errMsg() {
    if (!this.applicationDetails.legalNameOfTheCompany && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Registered Name of the Company is a required field';
    }
    if (!this.applicationDetails.typeOfBusiness  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Type of Business is a required field';
    }
    if (!this.applicationDetails.organizationType  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Organization Type is a required field';
    }
    if (!this.applicationDetails.typesOfLoan  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Types of Loan is a required field';
    }
    if (!this.applicationDetails.businessRegistrationNumber && this.applicationEntryComponent.activeSubStepIndex == 0 ) {
      return '* Business Registration Number is a required field';
    }
    if (!this.applicationDetails.countryOfRegistration  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Country of Registration is a required field';
    }
    if (!this.applicationDetails.dateOfIncorporation  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Date of Incorporation is a required field';
    }
    if (!this.applicationDetails.resident  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Resident is a required field';
    }
    if (!this.applicationDetails.registeredAddress  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Registered Address is a required field';
    }
    if (!this.applicationDetails.businessOperatingAddress  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Business Operating Address is a required field';
    }
    if (!this.applicationDetails.corporateTaxIdentificationNumber  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Corporate Tax Identification Number is a required field';
    }      
    if (!this.applicationDetails.officeContactNumber  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Office Contact Number is a required field';
    }
    if (!this.applicationDetails.businessEmailAddress  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Business Email Address is a required field';
    }
    if (!this.applicationDetails.annualTurnover  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Annual Turn Over is a required field';
    }
    if (!this.applicationDetails.businessUniqueIdentifier  && this.applicationEntryComponent.activeSubStepIndex == 0) {
      return '* Business Unique Identifier is a required field';
    }
    // if (!this.applicationDetails.valueConversion  && this.applicationEntryComponent.activeSubStepIndex == 5) {
    //   return '* Currency Conversion in Financial Information is a required field';
    // }
    if (!this.applicationDetails.latestInterimFinancialStatement?.length  && this.applicationEntryComponent.activeSubStepIndex == 5) {
      return '* Latest Interim Financial Statement is a required field';
    }
    if (!this.applicationDetails.financialStatementOfPast5Years?.length  && this.applicationEntryComponent.activeSubStepIndex == 5) {
      return '* Financial Statement of Past 5 years is a required field';
    }
    if (!this.applicationDetails.taxReturnsForTheLast3Years?.length  && this.applicationEntryComponent.activeSubStepIndex == 5) {
      return '* Tax returns for the last 3 years is a required field';
    }
    // if (!this.applicationDetails.debts) {
    //   return '* Debt is a required field';
    // }
    // if (!this.applicationDetails.currentLiabilities) {
    //   return '* Current Liabilities is a required field';
    // }
    // if (!this.applicationDetails.currentAssets) {
    //   return '* Current Assets is a required field';
    // }
    // if (!this.applicationDetails.inventory) {
    //   return '* Inventory is a required field';
    // }
    // if (!this.applicationDetails.financialShareholdersEquity) {
    //   return '* Shareholders Equity is a required field';
    // }
    // if (!this.applicationDetails.ebitda) {
    //   return '* EBITDA is a required field';
    // } 
    
    return ''
  }
  preventLetterE(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }

  }

  // To calculate business age
  calculateAge() {
    const dateOfIncorporation = new Date(this.applicationDetails.dateOfIncorporation);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dateOfIncorporation.getFullYear();
    if (currentDate.getMonth() < dateOfIncorporation.getMonth() || (currentDate.getMonth() === dateOfIncorporation.getMonth() && currentDate.getDate() < dateOfIncorporation.getDate())) {
      this.applicationDetails.businessAge = age - 1;
    } else {
      this.applicationDetails.businessAge = age;
    }
  }
  calculateShareholdersAge(headerIndex: number) {
    const dobDate = new Date(this.headers[headerIndex].shareholdersDob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();

    if (
      currentDate.getMonth() < dobDate.getMonth() ||
      (currentDate.getMonth() === dobDate.getMonth() &&
        currentDate.getDate() < dobDate.getDate())
    ) {
      this.headers[headerIndex].shareholdersAge = age - 1;
    } else {
      this.headers[headerIndex].shareholdersAge = age;
    }
  }
  formatNumber(value: number): string {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // add custom fields business
  addInputField(index: number) {
    if (this.selectedUdfFieldName && !this.selectedFieldNames.includes(this.selectedUdfFieldName)) {
      this.applicationEntryService.selectedFieldNames.push(this.selectedUdfFieldName);
      this.matchingField = this.loanConfigList.find(item => item.fieldName === this.selectedUdfFieldName);
      if (this.matchingField) {
        const newCustomField: UserDefinedCustomFields = {
          appId: null,
          fieldName: this.matchingField.fieldName,
          fieldType: this.matchingField.fieldType,
          fieldValue: '',
          tab: this.matchingField.tab,
          subTab: this.matchingField.subTab,
          dateFormat: 'yyyy-MM-dd',
          module: this.matchingField.module
        };
        this.userCustomFields1.push(newCustomField);
        this.applicationEntryService.addUserCustomField(newCustomField);
      }
      this.selectedUdfFieldName = '';
    }
  }

  // List udf
  getUdfConfigDetails() {
    this.dupliateService.getUserDefine(this.pageData.currentPage, 100).subscribe(
      res => {
        this.loanConfigList = res['data'].filter(item => {
          return item.tab === 'Corporate Details' && item.subTab === 'Business and Operation Information';
        });
        this.selectedField = this.loanConfigList.map(item => item.fieldName);

        this.udfOwnership = res['data'].filter(item => {
          return item.tab === 'Corporate Details' && item.subTab === 'Ownership';
        });
        this.selectedField1 = this.udfOwnership.map(item => item.fieldName);

        this.udfSubsideries = res['data'].filter(item => {
          return item.tab === 'Corporate Details' && item.subTab === 'Subsidiaries';
        });
        this.selectedField2 = this.udfSubsideries.map(item => item.fieldName);

        this.udfSuppliers = res['data'].filter(item => {
          return item.tab === 'Corporate Details' && item.subTab === 'Suppliers';
        });
        this.selectedField3 = this.udfSuppliers.map(item => item.fieldName);

        this.udfFinInfo = res['data'].filter(item => {
          return item.tab === 'Corporate Details' && item.subTab === 'Financial Information';
        });
        this.selectedField4 = this.udfFinInfo.map(item => item.fieldName);

        this.udfIndInfo = res['data'].filter(item => {
          return item.tab === 'Corporate Details' && item.subTab === 'Industry Information';
        });
        this.selectedField5 = this.udfIndInfo.map(item => item.fieldName);

        this.pageData.totalRecords = res['count'];
      }
    )
  }

  getFieldType(fieldName: string): string {
    if (this.loanConfigList) {
      const matchingField = this.loanConfigList.find(item => item.fieldName === fieldName);
      return matchingField ? matchingField.fieldType : 'text';
    }
    else {
      return 'text';
    }
  }

  getFieldType1(fieldName: string): string {
    if (this.udfOwnership) {
      const matchingField = this.udfOwnership.find(item => item.fieldName === fieldName);
      return matchingField ? matchingField.fieldType : 'text';
    }
    else {
      return 'text';
    }
  }
  getFieldType2(fieldName: string): string {
    if (this.udfSubsideries) {
      const matchingField = this.udfSubsideries.find(item => item.fieldName === fieldName);
      return matchingField ? matchingField.fieldType : 'text';
    }
    else {
      return 'text';
    }
  }
  getFieldType3(fieldName: string): string {
    if (this.udfSuppliers) {
      const matchingField = this.udfSuppliers.find(item => item.fieldName === fieldName);
      return matchingField ? matchingField.fieldType : 'text';
    }
    else {
      return 'text';
    }
  }
  getFieldType4(fieldName: string): string {
    if (this.udfFinInfo) {
      const matchingField = this.udfFinInfo.find(item => item.fieldName === fieldName);
      return matchingField ? matchingField.fieldType : 'text';
    }
    else {
      return 'text';
    }
  }
  getFieldType5(fieldName: string): string {
    if (this.udfIndInfo) {
      const matchingField = this.udfIndInfo.find(item => item.fieldName === fieldName);
      return matchingField ? matchingField.fieldType : 'text';
    }
    else {
      return 'text';
    }
  }

  fieldValuechecking() {
    this.closService.activeSubTabName$.subscribe((name) => {
      this.activeSubTabName = name;
      if (this.activeSubTabName == "Business and operation Information") {
        this.applicationEntryService.selecteFieldValues = this.userCustomFields1;
      }
      if (this.activeSubTabName == "Subsidiaries") {
        this.applicationEntryService.selectedSubsidiariesValues = this.userCustomSubsideries;
      }
      if (this.activeSubTabName == "Suppliers") {
        this.applicationEntryService.selectedSuppliersValues = this.userCustomSuppliers;
      }
      if (this.activeSubTabName == "Financial Information") {
        this.applicationEntryService.selectedFinInformationValues = this.userCustomFinInfo;
      }
      if (this.activeSubTabName == "Industry Information") {
        this.applicationEntryService.selectedIndInformationValues = this.userCustomIndInfo;
      }
    });
  }

  fieldValuechecking1() {
    this.closService.activeSubTabName$.subscribe((name) => {
      this.activeSubTabName = name;
      if (this.activeSubTabName == "Ownership") {
        this.applicationEntryService.selectedOwnershipValues = this.userCustomOwnership;

      }
    })
  }

  calculateRatio(fieldName, index, comingValue) {
    this.statement[fieldName] = comingValue;
    while (index >= this.ratioDetails.length) {
      this.ratioDetails.push({ ...this.statement });
    }
    this.ratioDetails[index]['liquidityCurrentRatio'] = isNaN(this.statement[index]['currentAssets'] / this.statement[index]['currentLiabilities']) ? null : +(this.statement[index]['currentAssets'] / this.statement[index]['currentLiabilities']).toFixed(4);
    this.ratioDetails[index]['liquidityQuickRatio'] = isNaN((this.statement[index]['currentAssets'] - this.statement[index]['inventory']) / this.statement[index]['currentLiabilities']) ? null : +((this.statement[index]['currentAssets'] - this.statement[index]['inventory']) / this.statement[index]['currentLiabilities']).toFixed(4);
    this.ratioDetails[index]['debtToEquityRatio'] = isNaN(this.statement[index]['debts'] / this.statement[index]['financialShareholdersEquity']) ? null : +(this.statement[index]['debts'] / this.statement[index]['financialShareholdersEquity']).toFixed(4);
    this.ratioDetails[index]['debtRatio'] = isNaN(this.statement[index]['debts'] / this.statement[index]['totalAssets']) ? null : +(this.statement[index]['debts'] / this.statement[index]['totalAssets']).toFixed(4);
    this.ratioDetails[index]['interestCoverageRatio'] = isNaN(this.statement[index]['ebit'] / this.statement[index]['interestExpense']) ? null : +(this.statement[index]['ebit'] / this.statement[index]['interestExpense']).toFixed(4);
    this.ratioDetails[index]['grossProfitMargin'] = isNaN((this.statement[index]['grossProfit'] / this.statement[index]['totalRevenue']) * 100) ? null : +((this.statement[index]['grossProfit'] / this.statement[index]['totalRevenue']) * 100).toFixed(4);
    this.ratioDetails[index]['operatingProfitMargin'] = isNaN((this.statement[index]['operatingIncome'] / this.statement[index]['totalRevenue']) * 100) ? null : +((this.statement[index]['operatingIncome'] / this.statement[index]['totalRevenue']) * 100).toFixed(4);
    this.ratioDetails[index]['netProfitMargin'] = isNaN((this.statement[index]['netIncome'] / this.statement[index]['totalRevenue']) * 100) ? null : +((this.statement[index]['netIncome'] / this.statement[index]['totalRevenue']) * 100).toFixed(4);
    this.ratioDetails[index]['returnOnAssets'] = isNaN(this.statement[index]['netIncome'] / this.statement[index]['totalAssets']) ? null : +(this.statement[index]['netIncome'] / this.statement[index]['totalAssets']).toFixed(4);
    this.ratioDetails[index]['returnOnEquity'] = isNaN(this.statement[index]['netIncome'] / this.statement[index]['financialShareholdersEquity']) ? null : +(this.statement[index]['netIncome'] / this.statement[index]['financialShareholdersEquity']).toFixed(4);
    this.ratioDetails[index]['inventoryTurnoverRatio'] = isNaN(this.statement[index]['costOfGoodsSold'] / this.statement[index]['averageInventory']) ? null : +(this.statement[index]['costOfGoodsSold'] / this.statement[index]['averageInventory']).toFixed(4);
    this.ratioDetails[index]['receivableTurnoverRatio'] = isNaN(this.statement[index]['netSales'] / this.statement[index]['averageAccountsReceivable']) ? null : +(this.statement[index]['netSales'] / this.statement[index]['averageAccountsReceivable']).toFixed(4);
    this.ratioDetails[index]['assetTurnoverRatio'] = isNaN(this.statement[index]['netSales'] / this.statement[index]['averageTotalAssets']) ? null : +(this.statement[index]['netSales'] / this.statement[index]['averageTotalAssets']).toFixed(4);
    this.ratioDetails[index]['payablesTurnoverRatio'] = isNaN(this.statement[index]['purchases'] / this.statement[index]['averageAccountsPayable']) ? null : +(this.statement[index]['purchases'] / this.statement[index]['averageAccountsPayable']).toFixed(4);
    this.ratioDetails[index]['debtServiceChargeCoverageRatio'] = isNaN(this.statement[index]['ebitda'] / this.statement[index]['debts']) ? null : +(this.statement[index]['ebitda'] / this.statement[index]['debts']).toFixed(4);
    this.ratioDetails[index]['fixedChargeCoverageRatio'] = isNaN(((this.statement[index]['ebit'] + this.statement[index]['leasePayments']) / (this.statement[index]['interestExpense'] + this.statement[index]['leasePayments']))) ? null : +(((this.statement[index]['ebit'] + this.statement[index]['leasePayments']) / (this.statement[index]['interestExpense'] + this.statement[index]['leasePayments']))).toFixed(4);
    this.ratioDetails[index]['totalDebtToTotalCapitalRatio'] = isNaN(((this.statement[index]['debts']) / (this.statement[index]['debts'] + this.statement[index]['financialShareholdersEquity']))) ? null : +(((this.statement[index]['debts']) / (this.statement[index]['debts'] + this.statement[index]['financialShareholdersEquity']))).toFixed(4);
    this.ratioDetails[index]['longTermDebtToEquityRatio'] = isNaN(this.statement[index]['longTermDebt'] / this.statement[index]['financialShareholdersEquity']) ? null : +(this.statement[index]['longTermDebt'] / this.statement[index]['financialShareholdersEquity']).toFixed(4);
    this.ratioDetails[index]['priceToEarningsRatio'] = isNaN(this.statement[index]['marketPricePerShare'] / this.statement[index]['earningsPerShare']) ? null : +(this.statement[index]['marketPricePerShare'] / this.statement[index]['earningsPerShare']).toFixed(4);
    this.ratioDetails[index]['priceToBookRatio'] = isNaN(this.statement[index]['marketPricePerShare'] / this.statement[index]['bookValuePerShare']) ? null : +(this.statement[index]['marketPricePerShare'] / this.statement[index]['bookValuePerShare']).toFixed(4);
    
    this.statement.forEach((statementObj, index) => {
      const correspondingRatioDetail = this.ratioDetails[index]; // Using index for matching
      if (correspondingRatioDetail) {
        statementObj.liquidityCurrentRatio = correspondingRatioDetail.liquidityCurrentRatio;
        statementObj.liquidityQuickRatio = correspondingRatioDetail.liquidityQuickRatio;
        statementObj.debtToEquityRatio = correspondingRatioDetail.debtToEquityRatio;
        statementObj.debtRatio = correspondingRatioDetail.debtRatio;
        statementObj.interestCoverageRatio = correspondingRatioDetail.interestCoverageRatio;
        statementObj.grossProfitMargin = correspondingRatioDetail.grossProfitMargin;
        statementObj.operatingProfitMargin = correspondingRatioDetail.operatingProfitMargin;
        statementObj.netProfitMargin = correspondingRatioDetail.netProfitMargin;
        statementObj.returnOnAssets = correspondingRatioDetail.returnOnAssets;
        statementObj.returnOnEquity = correspondingRatioDetail.returnOnEquity;
        statementObj.assetTurnoverRatio = correspondingRatioDetail.assetTurnoverRatio;
        statementObj.inventoryTurnoverRatio = correspondingRatioDetail.inventoryTurnoverRatio;
        statementObj.receivableTurnoverRatio = correspondingRatioDetail.receivableTurnoverRatio;
        statementObj.payablesTurnoverRatio = correspondingRatioDetail.payablesTurnoverRatio;
        statementObj.debtServiceChargeCoverageRatio = correspondingRatioDetail.debtServiceChargeCoverageRatio;
        statementObj.fixedChargeCoverageRatio = correspondingRatioDetail.fixedChargeCoverageRatio;
        statementObj.totalDebtToTotalCapitalRatio = correspondingRatioDetail.totalDebtToTotalCapitalRatio;
        statementObj.longTermDebtToEquityRatio = correspondingRatioDetail.longTermDebtToEquityRatio;
        statementObj.priceToEarningsRatio = correspondingRatioDetail.priceToEarningsRatio;
        statementObj.priceToBookRatio = correspondingRatioDetail.priceToBookRatio;
        statementObj.altmanZScore = correspondingRatioDetail.altmanZScore;
      }
    });
  }

  updateCheckValue(index: number, property: string, value: any) {
    if (this.ratioDetails[index]) {
      this.ratioDetails[index][property] = value;
      this.applicationEntryService.ratioDetails = this.ratioDetails[index][property];
    }
  }
  getPropertyBasedOnRatio(ratio: string): string {
    if (ratio.includes('Current Ratio')) {
      return 'liquidityCurrentRatio';
    }
    else if (ratio.includes('Quick Ratio (Acid-Test Ratio)')) {
      return 'liquidityQuickRatio';
    }
    else if (ratio.includes('Debt-to-Equity Ratio (D/E)')) {
      return 'debtToEquityRatio';
    }
    else if (ratio.includes('Debt Ratio')) {
      return 'debtRatio';
    }
    else if (ratio.includes('Interest Coverage Ratio')) {
      return 'interestCoverageRatio';
    }
    else if (ratio.includes('Gross Profit Margin')) {
      return 'grossProfitMargin';
    }
    else if (ratio.includes('Operating Profit Margin')) {
      return 'operatingProfitMargin';
    }
    else if (ratio.includes('Net Profit Margin')) {
      return 'netProfitMargin';
    }
    else if (ratio.includes('Return on Assets (ROA)')) {
      return 'returnOnAssets';
    }
    else if (ratio.includes('Return on Equity (ROE)')) {
      return 'returnOnEquity';
    }
    else if (ratio.includes('Asset Turnover Ratio')) {
      return 'assetTurnoverRatio';
    }
    else if (ratio.includes('Inventory Turnover Ratio')) {
      return 'inventoryTurnoverRatio';
    }
    else if (ratio.includes('Receivables Turnover Ratio')) {
      return 'receivableTurnoverRatio';
    }
    else if (ratio.includes('Payables Turnover Ratio')) {
      return 'payablesTurnoverRatio';
    }
    else if (ratio.includes('Debt Service Coverage Ratio')) {
      return 'debtServiceChargeCoverageRatio';
    }
    else if (ratio.includes('Fixed Charge Coverage Ratio')) {
      return 'fixedChargeCoverageRatio';
    }
    else if (ratio.includes('Total Debt-to-Total Capital Ratio')) {
      return 'totalDebtToTotalCapitalRatio';
    }
    else if (ratio.includes('Long-Term Debt-to-Equity Ratio')) {
      return 'longTermDebtToEquityRatio';
    }
    else if (ratio.includes('Price-to-Earnings Ratio (P/E)')) {
      return 'priceToEarningsRatio';
    }
    else if (ratio.includes('Price-to-Book Ratio')) {
      return 'priceToBookRatio';
    }
    else if (ratio.includes('Altman Z-Score')) {
      return 'altmanZScore';
    }

    return '';
  }



  fieldbinding() {
    console.log('fieldbinding')
    this.applicationEntryService.statementDetails = this.statement;
  }

  // To remove input
  removeInput(index: number) {
    if (index >= 0 && index < this.userCustomFields1.length) {
      this.selectedFieldNames.splice(index, 1);
      this.userCustomFields1.splice(index, 1);
    }
  }
  removeInputOwnership(index: number) {
    if (index >= 0 && index < this.userCustomOwnership.length) {
      this.selectedFieldOwnership.splice(index, 1);
      this.userCustomOwnership.splice(index, 1);
    }
  }
  removeInputSubsideries(index: number) {
    if (index >= 0 && index < this.userCustomSubsideries.length) {
      this.selectedFieldSubsideries.splice(index, 1);
      this.userCustomSubsideries.splice(index, 1);
    }
  }
  removeInputSuppliers(index: number) {
    if (index >= 0 && index < this.userCustomSuppliers.length) {
      this.selectedFieldSuppliers.splice(index, 1);
      this.userCustomSuppliers.splice(index, 1);
    }
  }
  removeInputIndInfo(index: number) {
    if (index >= 0 && index < this.userCustomIndInfo.length) {
      this.selectedFieldIndInfo.splice(index, 1);
      this.userCustomIndInfo.splice(index, 1);
    }
  }
  removeInputFinInfo(index: number) {
    if (index >= 0 && index < this.userCustomFinInfo.length) {
      this.selectedFieldFinInfo.splice(index, 1);
      this.userCustomFinInfo.splice(index, 1);
    }
  }
  // add custom fields ownership
  addInputownership(index: number) {
    if (this.selectedUdfOwnership && !this.selectedFieldOwnership.includes(this.selectedUdfOwnership)) {
      this.applicationEntryService.selectedOwnershipNames.push(this.selectedUdfOwnership);
      this.matchingOwnership = this.udfOwnership.find(item => item.fieldName === this.selectedUdfOwnership);
      if (this.matchingOwnership) {
        const newCustomOwnership: UserDefinedCustomFields = {
          appId: null,
          fieldName: this.matchingOwnership.fieldName,
          fieldType: this.matchingOwnership.fieldType,
          fieldValue: '',
          tab: this.matchingOwnership.tab,
          subTab: this.matchingOwnership.subTab,
          dateFormat: 'yyyy-MM-dd',
          module: this.matchingOwnership.module
        };
        this.userCustomOwnership.push(newCustomOwnership);
        this.applicationEntryService.addUserCustomField(newCustomOwnership);

      }
      this.selectedUdfOwnership = '';
    }
  }

  // add custom fields subsideries
  addInputSubsideries(index: number) {
    if (this.selectedUdfSubsideries && !this.selectedFieldSubsideries.includes(this.selectedUdfSubsideries)) {
      this.applicationEntryService.selectedSubsidiariesNames.push(this.selectedUdfSubsideries);
      this.matchingSubsideries = this.udfSubsideries.find(item => item.fieldName === this.selectedUdfSubsideries);
      if (this.matchingSubsideries) {
        const newCustomSubsideries: UserDefinedCustomFields = {
          appId: null,
          fieldName: this.matchingSubsideries.fieldName,
          fieldType: this.matchingSubsideries.fieldType,
          fieldValue: '',
          tab: this.matchingSubsideries.tab,
          subTab: this.matchingSubsideries.subTab,
          dateFormat: 'yyyy-MM-dd',
          module: this.matchingSubsideries.module
        };
        this.userCustomSubsideries.push(newCustomSubsideries);
        this.applicationEntryService.addUserCustomField(newCustomSubsideries);
      }
      this.selectedUdfSubsideries = '';
    }
  }

  // add custom fields Suppliers
  addInputSuppliers(index: number) {
    if (this.selectedUdfSuppliers && !this.selectedFieldSuppliers.includes(this.selectedUdfSuppliers)) {
      this.applicationEntryService.selectedSuppliersNames.push(this.selectedUdfSuppliers);
      this.matchingSuppliers = this.udfSuppliers.find(item => item.fieldName === this.selectedUdfSuppliers);
      if (this.matchingSuppliers) {
        const newCustomSuppliers: UserDefinedCustomFields = {
          appId: null,
          fieldName: this.matchingSuppliers.fieldName,
          fieldType: this.matchingSuppliers.fieldType,
          fieldValue: '',
          tab: this.matchingSuppliers.tab,
          subTab: this.matchingSuppliers.subTab,
          dateFormat: 'yyyy-MM-dd',
          module: this.matchingSuppliers.module
        };
        this.userCustomSuppliers.push(newCustomSuppliers);
        this.applicationEntryService.addUserCustomField(newCustomSuppliers);

      }
      this.selectedUdfSuppliers = '';
    }
  }

  // add custom fields Financial Information
  addInputIndInfo(index: number) {
    if (this.selectedUdfIndInfo && !this.selectedFieldIndInfo.includes(this.selectedUdfIndInfo)) {
      this.applicationEntryService.selectedIndInformationNames.push(this.selectedUdfIndInfo);
      this.matchingIndInfo = this.udfIndInfo.find(item => item.fieldName === this.selectedUdfIndInfo);
      if (this.matchingIndInfo) {
        const newCustomIndInfo: UserDefinedCustomFields = {
          appId: null,
          fieldName: this.matchingIndInfo.fieldName,
          fieldType: this.matchingIndInfo.fieldType,
          fieldValue: '',
          tab: this.matchingIndInfo.tab,
          subTab: this.matchingIndInfo.subTab,
          dateFormat: 'yyyy-MM-dd',
          module: this.matchingIndInfo.module
        };
        this.userCustomIndInfo.push(newCustomIndInfo);
        this.applicationEntryService.addUserCustomField(newCustomIndInfo);
      }
      this.selectedUdfIndInfo = '';
    }
  }

  // add custom fields Industry Information
  addInputFinInfo(index: number) {
    if (this.selectedUdfFinInfo && !this.selectedFieldFinInfo.includes(this.selectedUdfFinInfo)) {
      this.applicationEntryService.selectedFinInformationNames.push(this.selectedUdfFinInfo);
      this.matchingFinInfo = this.udfFinInfo.find(item => item.fieldName === this.selectedUdfFinInfo);
      if (this.matchingFinInfo) {
        const newCustomFinInfo: UserDefinedCustomFields = {
          appId: null,
          fieldName: this.matchingFinInfo.fieldName,
          fieldType: this.matchingFinInfo.fieldType,
          fieldValue: '',
          tab: this.matchingFinInfo.tab,
          subTab: this.matchingFinInfo.subTab,
          dateFormat: 'yyyy-MM-dd',
          module: this.matchingFinInfo.module
        };
        this.userCustomFinInfo.push(newCustomFinInfo);
        this.applicationEntryService.addUserCustomField(newCustomFinInfo);
      }
      this.selectedUdfFinInfo = '';
    }
  }

  // get udf
  getCustomFields() {
    if (this.appId) {
      this.closService.activeSubTabName$.subscribe((name) => {
        this.activeSubTabName = name;

        if (this.activeSubTabName == "Business and operation Information" && this.appId && this.userCustomFields1.length === 0) {
          this.closService.getCustomFields(this.appId, 'Corporate Details', 'Business and operation Information').subscribe(
            (res: any) => {
              this.userCustomFields1 = res;
              res.forEach(item => {
                if (!this.selectedFieldNames.includes(item.fieldName)) {
                  this.selectedFieldNames.push(item.fieldName)
                }
              });
              this.applicationEntryService.selecteFieldValues = this.userCustomFields1;
            }
          );
        }
        if (this.activeSubTabName == "Ownership" && this.appId && this.userCustomOwnership.length === 0) {
          this.closService.getCustomFields(this.appId, 'Corporate Details', 'Ownership').subscribe(
            (res: any) => {
              this.userCustomOwnership = res;
              res.forEach(item => {
                if (!this.selectedFieldOwnership.includes(item.fieldName)) {
                  this.selectedFieldOwnership.push(item.fieldName)
                }
              });
              this.applicationEntryService.selectedOwnershipValues = this.userCustomOwnership;
            }
          );
        }
        if (this.activeSubTabName == "Subsidiaries" && this.appId && this.userCustomSubsideries.length === 0) {
          this.closService.getCustomFields(this.appId, 'Corporate Details', 'Subsidiaries').subscribe(
            (res: any) => {
              this.userCustomSubsideries = res;
              res.forEach(item => {
                if (!this.selectedFieldSubsideries.includes(item.fieldName)) {
                  this.selectedFieldSubsideries.push(item.fieldName)
                }
              });
              this.applicationEntryService.selectedSubsidiariesValues = this.userCustomSubsideries;
            }
          );
        }
        if (this.activeSubTabName == "Suppliers" && this.appId && this.userCustomSuppliers.length === 0) {
          this.closService.getCustomFields(this.appId, 'Corporate Details', 'Suppliers').subscribe(
            (res: any) => {
              this.userCustomSuppliers = res;
              res.forEach(item => {
                if (!this.selectedFieldSuppliers.includes(item.fieldName)) {
                  this.selectedFieldSuppliers.push(item.fieldName)
                }
              });
              this.applicationEntryService.selectedSuppliersValues = this.userCustomSuppliers;
            }
          );
        }
        if (this.activeSubTabName == "Financial Information" && this.appId && this.userCustomFinInfo.length === 0) {
          this.closService.getCustomFields(this.appId, 'Corporate Details', 'Financial Information').subscribe(
            (res: any) => {
              this.userCustomFinInfo = res;
              res.forEach(item => {
                if (!this.selectedFieldFinInfo.includes(item.fieldName)) {
                  this.selectedFieldFinInfo.push(item.fieldName)
                }
              });
              this.applicationEntryService.selectedFinInformationValues = this.userCustomFinInfo;
            }
          );
        }
        if (this.activeSubTabName == "Industry Information" && this.appId && this.userCustomIndInfo.length === 0) {
          this.closService.getCustomFields(this.appId, 'Corporate Details', 'Industry Information').subscribe(
            (res: any) => {
              this.userCustomIndInfo = res;
              res.forEach(item => {
                if (!this.selectedFieldIndInfo.includes(item.fieldName)) {
                  this.selectedFieldIndInfo.push(item.fieldName)
                }
              });
              this.applicationEntryService.selectedIndInformationValues = this.userCustomIndInfo;
            }
          );
        }
      });
    }
  }

  getStatementFields() {
    const currentYear = new Date().getFullYear();
    this.closService.getstatement(this.appId, this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        const responseData = res['data'];
        if (Array.isArray(responseData) && responseData.length > 0) {
          this.yearsList = [];
          for (let i = 0; i < responseData.length; i++) {
            this.yearsList.push(currentYear - i);
          }
        }
        for (const newData of responseData) {
          const existingDataIndex = this.statement.findIndex(item => item.id === newData.id);
          if (existingDataIndex !== -1) {
            this.statement[existingDataIndex] = newData;
            this.ratioDetails[existingDataIndex] = newData;
          } else {
            this.statement.push(newData);
            this.ratioDetails.push(newData);
          }
        }
      }
    )
    this.call_Status = true;
  }
  onProxyCompanyChange(newValue: string) {
    this.closService.setTabState(newValue === 'Yes');
  }

  getAdditionalLoanDetails() {
    const parentId = this.closService.getFsIds();
    this.closService.getAdditionalLoan(parentId).subscribe(
      res => {
        console.log(res)
        this.applicationDetails = res;
        this.closService.getRatioByLoan(this.applicationDetails.typesOfLoan).subscribe(
          res => {
            this.ratioList = res;
          }
        )
        this.applicationEntryService.applicationDetails = this.applicationDetails;
      }
    )
    // this.getOwnershipandSupplieronAdditionalLoan();
  }
  // get country dropdown
  getCountryAndCurrency() {
    this.dupliateService.getCurrencyByCountry().subscribe(
      (res) => {
        this.country = Object.keys(res);
        this.countryList = this.country;
        this.cdr.detectChanges();
        const selectedCountry = this.applicationDetails.countryOfRegistration;
        this.dupliateService.setCountryAndCurrency(selectedCountry, this.currency);
        this.applicationDetails.loanCurrency = res[selectedCountry] || '';
      }
    );
  }
  onDropdownClick() {
    this.getCountryAndCurrency();
  }
  // search dropdown 
  onCountryFilter() {
    if (this.searchCountry) {
      const filteredCountry = this.countryList.filter(table => table.toLowerCase().includes(this.searchCountry.toLowerCase()));
      this.country = filteredCountry;
    } else {
      this.country = this.countryList;
    }
  }
  // getOwnershipandSupplieronAdditionalLoan() {
  //   const parentId = this.closService.getFsIds();
  //   this.closService.getOwnershipandSuppliersforAdditionalLoan(parentId).subscribe(
  //     res => {
  //       console.log(res)
  //       this.applicationDetails = res;
  //     }
  //   )
  // }
}
