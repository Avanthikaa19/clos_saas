import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-additional-information",
  templateUrl: "./additional-information.component.html",
  styleUrls: ["./additional-information.component.scss"],
})
export class AdditionalInformationComponent implements OnInit {
  optionValue1 = [{ option: "Yes" }, { option: "No" }];

  optionValue2 = [{ option: "Yes" }, { option: "No" }];

  optionValue3 = [{ option: "Yes" }, { option: "No" }];

  optionValue4 = [{ option: "Yes" }, { option: "No" }];

  optionValue5 = [{ option: "Yes" }, { option: "No" }];

  optionValue6 = [{ option: "Yes" }, { option: "No" }];

  constructor() {}

  ngOnInit(): void {}
}
