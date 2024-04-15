import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-modules',
  templateUrl: './template-modules.component.html',
  styleUrls: ['./template-modules.component.scss']
})
export class TemplateModulesComponent implements OnInit
{
 element = {
   categories: [
     {
       category: 'Category 1',
       items: [
         {
           selected: true,
           displayName: 'Item 1',
           description: 'Description for Item 1'
         },
         {
           selected: false,
           displayName: 'Item 2',
           description: 'Description for Item 2'
         }
         // Add more items as needed
       ]
     },
     {
       category: 'Category 2',
       items: [
         {
           selected: true,
           displayName: 'Item 3',
           description: 'Description for Item 3'
         }
         // Add more items as needed
       ]
     }
     // Add more categories as needed
   ]
 };

 toggleItem(item: any) {
   // Logic to toggle the selected state of an item
   item.selected = !item.selected;
 }

 allowAccess(item: any) {
   // Logic to handle access permission for an item
   // For example, you can perform some action based on the item's state
 }
 constructor() { }

 ngOnInit(): void {
 }

}

