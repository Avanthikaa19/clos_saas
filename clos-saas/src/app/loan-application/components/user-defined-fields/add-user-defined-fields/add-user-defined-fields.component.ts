import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fieldsDetails } from 'src/app/duplicate-checking/models/models';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { UserDefinedFields } from '../../models/config.models';

@Component({
  selector: 'app-add-user-defined-fields',
  templateUrl: './add-user-defined-fields.component.html',
  styleUrls: ['./add-user-defined-fields.component.scss']
})
export class AddUserDefinedFieldsComponent implements OnInit {
  fieldType: string[] = ['NUMERIC', 'ALPHA_NUMERIC', 'DATE', 'DATE_TIME', 'DECIMAL'];
  tabNames: string[] = ['Corporate Details', 'Loan Details', 'Collateral Details', 'Risk and Compliance', 'Applicant details', 'Reference'];
  subTabNames: string[] = ['Business and Operation Information', 'Ownership', 'Subsidiaries','Suppliers', 'Financial Information', 'Industry Information'];
  productLoan: any;
  fields: UserDefinedFields = new UserDefinedFields();
  loading: boolean = false;
  udfFieldName: any;
  udfModuleRes: any;

  constructor(
    public dupliateService: DuplicateCheckingService,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data) {
      this.fields = data;
    }
    this.fields.dateFormat ="";
    this.fields.module = 'Application Entry'
  }

  ngOnInit(): void {
  }


  // Notification
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  disable() {
    if(!this.fields.fieldName || !this.fields.fieldType){
       return true;
    }
    else{
       if (this.fields.tab == 'Corporate Details') {
          if (this.fields.subTab)
            return false;
          else
            return true;  
       }
       else
          return false;
    }
      return true;
  }

  // Save User Defined Fields
  onSaveUserFields(moduleName: any) {
    this.dupliateService.saveUserFields(this.fields).subscribe(
      res => {
        console.log(res);
        this.showNotification('success', 'Saved successfully');
        this.udfModuleName(moduleName);
      },
    )
  }

  // module name in udf
  udfModuleName(moduleName: string) {
    this.dupliateService.getUDF(moduleName).subscribe(
      res => {
        this.udfModuleRes = res;
        this.udfFieldName = this.udfModuleRes.map(item => item.fieldName);
        console.log(this.udfFieldName);
        sessionStorage.setItem('udfFieldName', JSON.stringify(this.udfFieldName));
      })
  }

  errMsg() {

    if (!this.fields.fieldName)
      return '* Field Name is a required field';
    
    if (!this.fields.fieldType)
      return '* Field Type is a required field';

    if (this.fields.fieldName && this.fields.fieldType && this.fields.tab == 'Corporate Details') {
        if (!this.fields.subTab)
          return "* Subtab is a required field";  
    }
    return ''
  }
}
