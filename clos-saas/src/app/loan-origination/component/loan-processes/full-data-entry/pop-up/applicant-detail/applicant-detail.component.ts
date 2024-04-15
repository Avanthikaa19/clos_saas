import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddressDetailComponent } from '../address-detail/address-detail.component';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { EmploymentDetailComponent } from '../employment-detail/employment-detail.component';
import { IdentificationDetailComponent } from '../identification-detail/identification-detail.component';
import { IncomeDetailComponent } from '../income-detail/income-detail.component';

@Component({
  selector: 'app-applicant-detail',
  templateUrl: './applicant-detail.component.html',
  styleUrls: ['./applicant-detail.component.scss','../../full-data-entry.component.scss','../../../loan-processes.component.scss']
})
export class ApplicantDetailComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  @Output() showPage = new EventEmitter();

  ngOnInit(): void {
  }

  goBack(){
      this.showPage.emit('true');
  }
  
  addNewIdentification(){
    const dialogRef = this.dialog.open(IdentificationDetailComponent, {
      width:'600px'
    });
  }

  addNewContact(){
    const dialogRef = this.dialog.open(ContactDetailComponent, {
      width:'600px'
    });
  }

  addNewAddress(){
    const dialogRef = this.dialog.open(AddressDetailComponent, {
      width:'600px'
    });
  }

  addNewEmployment(){
    const dialogRef = this.dialog.open(EmploymentDetailComponent, {
      width:'600px'
    });
  }

  addNewIncome(){
    const dialogRef = this.dialog.open(IncomeDetailComponent, {
      width:'600px'
    });
  }
}
