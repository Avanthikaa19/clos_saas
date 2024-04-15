import { Component, OnInit ,ElementRef, ViewChild} from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import { map, startWith } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AdminDashboardService } from '../../../administrator-dashboard/services/admin-dashboard.service';
import { managerUserFilter } from '../../models/User';


@Component({
  selector: 'app-manageuser-filter',
  templateUrl: './manageuser-filter.component.html',
  styleUrls: ['./manageuser-filter.component.scss']
})
export class ManageuserFilterComponent implements OnInit {

  searchText:string;
  roleDrpdown:string[]=[];
  drpdown: string[] = [];
  drpdowns: string[] = [];
  page: number=1;
  pageSize:number=10;
  column:string;
  // columns:string = 'initial';
  columnName:string='name';
  search:string;
  user:string="superuser";
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl([]);
  fruitCtrl1 = new FormControl([]);
  fruits: string[] = [];
  fruits1: string[] = [];
  fruits2: string[] = [];
  fruits3: string[] = [];
  fruits4: string[] = [];
  fruits5: string[] = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  allFiltercolumns:string[]=['username','initial','firstName','lastName','supervisingUser','roles']
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput1') fruitInput1: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput2') fruitInput2: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput3') fruitInput3: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput4') fruitInput4: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput5') fruitInput5: ElementRef<HTMLInputElement>;

  filteredFruits: any;
  filteredFruits1: any;

  managerfilter:managerUserFilter = new managerUserFilter('id','ID',true,null,true,null,[],[],true,true,false);

  constructor(
    public dialogRef: MatDialogRef<ManageuserFilterComponent>,
    private adminDashboardService: AdminDashboardService,
  ) { 
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
    { 
      this.filteredFruits1 = this.fruitCtrl1.valueChanges.pipe(
        startWith(null),
        map((fruit1: string | null) => (fruit1 ? this._filter1(fruit1) : this.allFruits.slice())),
      );
    }
  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value){ 
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    console.log("fruits",this.fruits)
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    console.log("fruits",this.fruits)
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  add1(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value){ 
      this.fruits1.push(value);
    }
 console.log("fruits1",this.fruits1)
    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl1.setValue(null);
  }

  remove1(fruitx: string): void {
    const index = this.fruits1.indexOf(fruitx);

    if (index >= 0) {
      this.fruits1.splice(index, 1);
    }
  }

  selected1(event: MatAutocompleteSelectedEvent): void {
    this.fruits1.push(event.option.viewValue);
    console.log("fruits1",this.fruits1)
    this.fruitInput1.nativeElement.value = '';
    this.fruitCtrl1.setValue(null);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  private _filter1(value: string): string[] {
    const filterValue1 = value.toLowerCase();
    return this.allFruits.filter(fruit1 => fruit1.toLowerCase().includes(filterValue1));
  }

// first name
add2(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  // Add our fruit
  if (value){ 
    this.fruits2.push(value);
  }

  // Clear the input value
  event.chipInput!.clear();

  this.fruitCtrl.setValue(null);
}

remove2(fruit: string): void {
  const index = this.fruits2.indexOf(fruit);

  if (index >= 0) {
    this.fruits2.splice(index, 1);
  }
}

selected2(event: MatAutocompleteSelectedEvent): void {
  this.fruits2.push(event.option.viewValue);
  this.fruitInput2.nativeElement.value = '';
  this.fruitCtrl.setValue(null);
}

// lastname
add3(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  // Add our fruit
  if (value){ 
    this.fruits3.push(value);
  }

  // Clear the input value
  event.chipInput!.clear();

  this.fruitCtrl.setValue(null);
}

remove3(fruit: string): void {
  const index = this.fruits3.indexOf(fruit);

  if (index >= 0) {
    this.fruits3.splice(index, 1);
  }
}

selected3(event: MatAutocompleteSelectedEvent): void {
  this.fruits3.push(event.option.viewValue);
  this.fruitInput3.nativeElement.value = '';
  this.fruitCtrl.setValue(null);
}

// supervising
add4(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  // Add our fruit
  if (value){ 
    this.fruits4.push(value);
  }

  // Clear the input value
  event.chipInput!.clear();

  this.fruitCtrl.setValue(null);
}

remove4(fruit: string): void {
  const index = this.fruits4.indexOf(fruit);

  if (index >= 0) {
    this.fruits4.splice(index, 1);
  }
}

selected4(event: MatAutocompleteSelectedEvent): void {
  this.fruits4.push(event.option.viewValue);
  this.fruitInput4.nativeElement.value = '';
  this.fruitCtrl.setValue(null);
}

// roles
add5(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  // Add our fruit
  if (value){ 
    this.fruits5.push(value);
  }

  // Clear the input value
  event.chipInput!.clear();

  this.fruitCtrl.setValue(null);
}

remove5(fruit: string): void {
  const index = this.fruits5.indexOf(fruit);

  if (index >= 0) {
    this.fruits5.splice(index, 1);
  }
}

selected5(event: MatAutocompleteSelectedEvent): void {
  this.fruits5.push(event.option.viewValue);
  this.fruitInput5.nativeElement.value = '';
  this.fruitCtrl.setValue(null);
}




// multi filter
getDropdownChip(name,list){
  console.log(name,list)
  this.column = name;
  this.search = list;
  if(this.column =='username'||this.column =='initial' || this.column =='firstName'||
  this.column =='lastName'||this.column =='supervisingUser'){
  this.adminDashboardService.getMultiSelect(this.page,this.pageSize,this.column,this.search,this.user).subscribe(
    res => {
      console.log(res);
      this.drpdown = res;
    }
  )
  }        
}

//roles dropdown
getRoles(list){
  console.log(list)
  this.search = list;
  this.adminDashboardService.getRolesdropdown(this.page,this.pageSize,this.columnName,this.search).subscribe(
    res => {
      console.log(res);
      this.drpdowns = res;
    }
  )
}

 postDropdownChip(){
  this.column = 'name';
  // this.search = list;
  this.adminDashboardService.postMultiSelect(this.page,this.pageSize,this.managerfilter).subscribe(
    res => {
      console.log(res);
      this.drpdown = res;
    }
  )

}


}
