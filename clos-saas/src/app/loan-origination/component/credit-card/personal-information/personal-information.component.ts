import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-personal-information",
  templateUrl: "./personal-information.component.html",
  styleUrls: ["./personal-information.component.scss"],
})
export class PersonalInformationComponent implements OnInit {
  genderOption = [{ gender: "Male" }, { gender: "Female" }];

  civilStatusOption = [
    { status: "Single" },
    { status: "Married" },
    { status: "Widowed" },
    { status: "Seperated" },
  ];

  educationOption = [
    { education: "High School" },
    { education: "Some College" },
    { education: "College" },
    { education: "Post Graduate" },
  ];

  homeOption = [
    { home: "Owned,Mortgaged" },
    { home: "Owned,Not Mortgaged" },
    { home: "Living with Parents or Relatives" },
    { home: "Rented" },
  ];

  countryList = [
    { country: "India" },
    { country: "Philiplines" },
    { country: "Singapore" },
    { country: "Malaysia" },
  ];

  creditCardOption = {
    creditCard: [
      "Platinum Mastercard",
      "Visa Platinum",
      "EveryDay Titanium Mastercard",
      "Doice Vita Mastercard",
      "Visa Gold",
      "Gold Mastercard",
      "Visa Classic",
      "Classic Mastercard",
      "Singapore Airlines KrisFlyer Platinum Mastercard",
      "Singapore Airlines KrisFlyer World Mastercard",
    ],
  };

  constructor() {}

  ngOnInit(): void {}
}
