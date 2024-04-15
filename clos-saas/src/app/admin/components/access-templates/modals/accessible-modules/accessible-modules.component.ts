import { AccessibleItem, StructuredAccessibleItems, CategorizedAccessibleItems, AccessTemplate } from '../../models/AccessTemplate';
import { AccessService } from '../../services/access.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-accessible-modules',
  templateUrl: './accessible-modules.component.html',
  styleUrls: ['./accessible-modules.component.scss']
})

export class AccessibleModulesComponent implements OnInit {
  accessibleItems: AccessibleItem[] = [];
  data: StructuredAccessibleItems[] = [];
  accessModule: string[] = [];
  toggleDisable: boolean = false;
  accessTemplateData: AccessTemplate = new AccessTemplate(0, '', '', false, '', '', '', [])

  constructor(
    private accessDetailDataService: AccessService
  )
   {}

  @Output() accessChange = new EventEmitter<any[]>();
  @Input()
  get access() {
    console.log("get", this.accessModule);
    return this.accessModule;
  }
  set access(val) {
    console.log('val', val);
    this.accessModule = val;
    if (val) {
      if (val.length > 0) {
        this.toggleDisable = true;

      }
    }
  }

  ngOnInit(): void {
    this.getAccessItemslist()
  }

  getAccessItemslist() {
    this.accessDetailDataService.getAccessItems().subscribe(res => {
      console.log(res)
      this.accessibleItems = res;
      this.data = [];
      let modules: string[] = [];
      //post process items to construct dependency tree
      let itemsMap = {};
      for (let item of this.accessibleItems) {
        itemsMap[item.name] = item;
        if (!this.accessModule.includes(item.name)) {
          item.selected = false;
        }
        else {
          item.selected = true;
        }
        item.children = [];
        if (item.childItems && item.childItems.length > 0) {
          for (let itemName of item.childItems) {
            item.children.push(itemsMap[itemName]);
          }
        }
        let moduleName: string = this.replaceAll(item.module, "_", " ");
        if (!modules.includes(moduleName)) {
          modules.push(moduleName);
        }
      }
      //create data structured by modules & category
      //loop modules
      for (let module of modules) {
        let moduleData = new StructuredAccessibleItems();
        moduleData.module = module;
        moduleData.categories = [];
        //loop categories
        let categories: string[] = [];
        for (let item of this.accessibleItems) {
          let moduleName: string = this.replaceAll(item.module, "_", " ");
          if (moduleName === module) {
            if (!categories.includes(item.category)) {
              categories.push(item.category);
            }
          }
        }
        for (let category of categories) {
          let categoryItems: CategorizedAccessibleItems = new CategorizedAccessibleItems();
          categoryItems.category = category;
          categoryItems.items = [];
          for (let item of this.accessibleItems) {
            let moduleName: string = this.replaceAll(item.module, "_", " ");
            if (moduleName === module && item.category === category) {
              categoryItems.items.push(item);
            }
          }
          moduleData.categories.push(categoryItems);
        }
        this.data.push(moduleData);
      }
    })
  }
  replaceAll(str, find, replace): string {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  toggleItem(targetItem: AccessibleItem) {
    if (!targetItem.selected) {
      targetItem.selected = true;
      //select dependent items
      child_loop:
      for (let childItem of targetItem.children) {
        childItem.selected = true;
      }
    } else {
      targetItem.selected = false;
      // deselect dependent items
      item_loop:
      for (let item of this.accessibleItems) {
        if (item.children) {
          child_loop:
          for (let childItem of item.children) {
            if (childItem.name === targetItem.name) {
              item.selected = false;
              continue item_loop;
            }
          }
        }
      }
    }
  }

  allowAccess(item) {
    console.log("item selected", item);
    this.data.forEach(accessData => {
      console.log(this.accessModule,)
      accessData.categories.forEach(category => {
        category.items.forEach(access => {
          console.log(item.name)
          if (access.selected == true && access.name == item.name) {
            if (!this.accessModule.includes(access.name)) {
              this.accessModule.push(access.name)
              this.accessChange.emit(this.accessModule);
            }
          }
          else if (item.selected == false && access.name == item.name) {
            this.accessModule = this.accessModule.filter(data => data != item.name)
            this.accessChange.emit(this.accessModule);
          }
        })
      })
    })
    // this.accessibleItems.forEach(access=>{
    //     if(item.selected==true && access.name==item.name) {
    //        if(!this.accessModule.includes(access.name)){
    //        this.accessModule.push(access.name)
    //       this.accessChange.emit(this.accessModule);
    //        }
    //     }
    //     else if(item.selected==false){
    //       this.accessModule=this.accessModule.filter(data=>data!=access.name)
    //     }
    //   })
  }
}
export class Modules {
  id: number;
  moduleName: string;
  iconName: string;
}
