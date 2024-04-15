import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { AddSectionComponent } from '../../queue-common/add-section/add-section.component';
// import { AddFieldComponent } from '../../queue-common/add-field/add-field.component'
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';
import { Router } from '@angular/router';
import { ColumnDefinition, PageData } from 'src/app/c-los/models/clos-table';


@Component({
  selector: 'app-underwriter-queue-detail',
  templateUrl: './underwriter-queue-detail.component.html',
  styleUrls: ['./underwriter-queue-detail.component.scss']
})
export class UnderwriterQueueDetailComponent implements OnInit {

  pageData: PageData;
  items: Document[] = []
  creditValue;
  amount: number;

  columns: ColumnDefinition[] = [
    {
      fieldName: "id",
      displayName: "Id",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "document",
      displayName: "Document",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "type",
      displayName: "Type",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "required",
      displayName: "Required",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "stage",
      displayName: "Stage",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "documentStatus",
      displayName: "Document Status",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "dataCapture",
      displayName: "Data Capture",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "date",
      displayName: "Date",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },

    {
      fieldName: "fileName",
      displayName: "File Name",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "$preview_button",
      displayName: "Preview",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
    {
      fieldName: "$request_button",
      displayName: "Request Document",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
    },
  ]


  sectionData: SectionChildren[] = [
    {
      id: 1,
      fieldName: "Company Name",
      inputType: "InputField",
      inputValue: "Shophee Pvt. ltd"
    },
    {
      id: 2,
      fieldName: "Company Type",
      inputType: "SelectOption",
      selectOption: ['Corporation', 'Private'],
      inputValue: "Corporation"
    },
    {
      id: 2,
      fieldName: "Application no.",
      inputType: "InputField",
      inputValue: "0098654321"
    },
    {
      id: 2,
      fieldName: "Applicant Name",
      inputType: "InputField",
      inputValue: "John"
    },
    {
      id: 2,
      fieldName: "Contact Number",
      inputType: "InputField",
      inputValue: "0098654321"
    },

    {
      id: 2,
      fieldName: "Loan Purpose",
      inputType: "SelectOption",
      selectOption: ['Business Card', 'Personal'],
      inputValue: "Business Card"
    },
    {
      id: 2,
      fieldName: "Requested Loan Amount",
      inputType: "InputField",
      inputValue: "10,000,000"
    },

  ]

  assessmentData: SectionChildren[] = [
    {
      id: 2,
      fieldName: "System Decision",
      inputType: "SelectOption",
      selectOption: ['Approve', 'Reject'],
      inputValue: "Approve"
    },
    {
      id: 2,
      fieldName: "Score",
      inputType: "Number",
      inputValue: 465
    },
    {
      id: 2,
      fieldName: "Bureau Score",
      inputType: "Number",
      inputValue: 800
    },
    {
      id: 2,
      fieldName: "Revenue",
      inputType: "InputField",
      inputValue: "45,000,000"
    },
    {
      id: 2,
      fieldName: "DSR Current",
      inputType: "Number",
      inputValue: 30
    },
    {
      id: 2,
      fieldName: "DSR with loan",
      inputType: "Number",
      inputValue: 45
    },
    {
      id: 2,
      fieldName: "Collateral Type",
      inputType: "MultiSelect",
      selectOption: ['Propery', 'Cash', 'Machinery', 'Inventory', 'Receivables'],
      inputValue: ["Cash"]
    },
    {
      id: 2,
      fieldName: "Collateral Value",
      inputType: "InputField",
      inputValue: "12,000,000"
    },
  ]

  sectionDetails: Section[] = [
    {
      id: 1,
      sectionName: "Decision",
      sectionDescription: "",
      sectionChildren: [
        // {
        //   id: 2,
        //   fieldName: "Credit Decision",
        //   inputType: "SelectOption",
        //   selectOption: ['Accept', 'Addtional Request', 'Esclate', 'Reject'],
        //   inputValue: "Accept"
        // },
        {
          id: 1,
          fieldName: "Proposal & Justification",
          inputType: "CommentBox",
        },
        {
          id: 1,
          fieldName: "Additional Documents",
          inputType: "Header",
        },
        {
          id: 1,
          fieldName: "Additional Documents",
          inputType: "Checkbox",
        },
        {
          id: 2,
          inputType: "InputField",
        },
        {
          id: 1,
          fieldName: "Additional Collateral",
          inputType: "Checkbox",
        },
        {
          id: 2,
          inputType: "InputField",
        },
        {
          id: 1,
          fieldName: "Site Visit",
          inputType: "Checkbox",
        },
        {
          id: 2,
          inputType: "InputField",
        }
      ]
    },
    {
      id: 1,
      sectionName: "Recommended loan terms",
      sectionDescription: "",
      sectionChildren: [
        // {
        //   id: 1,
        //   fieldName: "Loan Amount",
        //   inputType: "InputField",
        //   inputValue: "10,000,000"
        // },
        {
          id: 1,
          fieldName: "Loan amount deision remarks",
          inputType: "CommentBox",
        },
        {
          id: 1,
          fieldName: "Control Unit",
          inputType: "Header",
        },
        {
          id: 1,
          fieldName: "Control Unit",
          inputType: "CommentBox",
        },
        {
          id: 1,
          fieldName: "Remarks",
          inputType: "CommentBox",
        },
        {
          id: 1,
          fieldName: "Risk Rating",
          inputType: "CommentBox",
        }
      ]
    },

  ];

  systemDeviation: string[] = [
    "Current DSR > 25%",
    "DSR after new loan > 40%",
    "Worst payment status on bureau 30 DPD",
    "High risk sector",
    "Decreasing revenue last 3 years"
  ]

  constructor(
    public dialog: MatDialog,
    private loanCase: LoanCaseManagerServiceService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.items = this.jsonTabelData();
  }

  addSection() {
    // const dialogRef = this.dialog.open(AddSectionComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    //   let jsonify = JSON.parse(result);
    //   this.sectionDetails.push(jsonify);
    // });
  }

  addField(sectionData) {
    // const dialogRef = this.dialog.open(AddFieldComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    //   let jsonify = JSON.parse(result);
    //   sectionData.sectionChildren.push(jsonify);
    //   console.log(sectionData)
    // });
  }

  removeField(sectionData, i) {
    sectionData.sectionChildren.splice(i, 1);
  }
  jsonTabelData() {
    let document: Document[] = [
      {
        id: 1,
        document: "Audited Financial Report",
        type: "Financial",
        required: "Required",
        stage: "",
        documentStatus: "Pending",
        dataCapture: "Required",
        date: "",
        fileName: "Audit File.pdf",
        attachment: "$preview_button",
        docRequest: "$req_button"
      },
      {
        id: 1,
        document: "Income Tax Report",
        type: "Financial",
        required: "Required",
        stage: "",
        documentStatus: "Pending",
        dataCapture: "Required",
        date: "",
        fileName: "Audit File.pdf",
        attachment: "$preview_button",
        docRequest: "$req_button"
      },
      {
        id: 1,
        document: "Bank Statement",
        type: "Financial",
        required: "Required",
        stage: "",
        documentStatus: "Pending",
        dataCapture: "Required",
        date: "",
        fileName: "Audit File.pdf",
        attachment: "$preview_button",
        docRequest: "$req_button"
      },
      {
        id: 1,
        document: "Other Income Proofs",
        type: "Financial",
        required: "Required",
        stage: "",
        documentStatus: "Pending",
        dataCapture: "Required",
        date: "",
        fileName: "Audit File.pdf",
        attachment: "$preview_button",
        docRequest: "$req_button"
      },
      {
        id: 1,
        document: "Lease Contract",
        type: "Financial",
        required: "Required",
        stage: "",
        documentStatus: "Pending",
        dataCapture: "Required",
        date: "",
        fileName: "Audit File.pdf",
        attachment: "$preview_button",
        docRequest: "$req_button"
      }
    ]
    return document;
  }

  getcreditDecision() {
    if(this.amount ==  undefined){
      this.amount = 0;
    }
   console.log(this.amount)
    let app = sessionStorage.getItem('appId')
    this.loanCase.getCredit(app,this.creditValue,this.amount).subscribe(
      res=>{
        console.log(res)
      }
    )
  }

  closeWindow() {
    setTimeout( () => {
      this.router.navigateByUrl('/loan-case-manager/loan-case-manager-main/underwriter-queue')
      sessionStorage.removeItem('appId');
  },100);
}

}

export class Section {
  id: number;
  sectionName: string;
  sectionDescription: string;
  sectionChildren: SectionChildren[];
}

export class SectionChildren {
  id: number;
  fieldName?: string;
  inputType?: 'InputField' | 'SelectOption' | 'MultiSelect' | 'Radio' | 'Number' | 'CommentBox' | 'Date' | 'Checkbox' | 'Header';
  inputValue?: any;
  selectOption?: any[];
  multiSelectOption?: any[];
  radioOption?: any[];
  placeholder?: string;
}

export class Verification {
  id: number;
  companyName: string;
  companyType: string;
  regNumber: string;
  applicantName: string;
  contactNumber: string;
  loanAmount: string;
  assignTo: string;
  status: string;
}

export class Document {
  id: number;
  document: string;
  type: string;
  required: string;
  stage: string;
  documentStatus: string;
  dataCapture: string;
  date: string;
  fileName: string;
  attachment: string;
  docRequest: string;
}
