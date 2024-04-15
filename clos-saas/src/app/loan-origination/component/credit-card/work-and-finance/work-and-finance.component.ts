import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-work-and-finance",
  templateUrl: "./work-and-finance.component.html",
  styleUrls: ["./work-and-finance.component.scss"],
})
export class WorkAndFinanceComponent implements OnInit {
  sourceOption = {
    source: [
      "Salary/Benefits",
      "Allowances",
      "Business Income",
      "Remmitance",
      "Retirement/Seperation",
      "Others",
    ],
  };

  employOption = {
    employee: ["Private", "Government", "Self-Employed", "Retired", "Others"],
  };

  positionOption = {
    position: [
      "Staff-Contractual",
      "President",
      "OFW",
      "Staff-Regular",
      "Director",
      "Religious",
      "Junior Officer,Rank",
      "Owner",
      "Retired",
      "Junior Officer,Rank",
      "Professional",
    ],
  };

  natureOption = {
    nature: [
      "Agriculture/Mining",
      "Banking",
      "Business/Commercial Service",
      "Community/Social/Personal",
      "Construction",
      "Financing",
      "Insurance",
      "Manufacturing",
      "Real-Estate",
      "Transportation/Communication",
      "Utilities",
      "Wholesale/Retail",
      "Retired",
      "BPO",
      "Government",
      "Money Changes/Foreign Exchange Dealer",
      "Money Transmitters/Remittance Agents",
      "Pawnshop",
      "Cash Checking Facilities/Bayand Center",
    ],
  };

  optionValue = [
    {
      option: "Yes",
    },
    {
      option: "No",
    },
  ];

  card: boolean = false;
  
  constructor() {}

  ngOnInit(): void {}
}
