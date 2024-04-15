import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
  condition:string;
  label:string;
  name:string;
  operator:string;
  value:string;
  from:string;
  to:string;
  symbols: any[] = [{ name: "equal to", value: "==", disable: false }, { name: "not equal to", value: "!=", disable: false },
  { name: "contains with", value: "contains", disable: false }, { name: "startswith", value: "startswith", disable: false },
  { name: "endswith", value: "endswith", disable: true },
];
  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public node: any
  ) { }

  ngOnInit(): void {
   console.log(this.node)
   if(this.node.action!=null){
    this.name=this.node.action.name
    this.value=this.node.name
   }
   else{
   if(this.node.datatype == "string"){
   this.node.name=this.node.name.trim()
   let split=this.node.condition.split(this.node.name)
   this.name=split[0]
   let conditionsplit=this.node.name.split(" ")
   let condsplit=this.node.name.split(conditionsplit[0])
   this.operator=conditionsplit[0]
   console.log( condsplit)
   this.value=condsplit[1]
   }
   if(this.node.datatype == "integer"){
    if(this.node.name.includes("<=..<")){
      let split=this.node.condition.split("=")
      this.name=split[0]
      console.log(split[0])
      let newsplit=this.node.name.split("<=..<")
      this.from=newsplit[0]
      this.to=newsplit[1]
    }
      else if(this.node.name.includes("<")){
        console.log("edit plz <")
        let split=this.node.condition.split("=")
        console.log("split",split)
        this.name=split[0]
        let newsplit=split[1].split("<")
        this.from=newsplit[0]
        this.to=newsplit[1]
      }
      else if(this.node.name.includes(">")){
        console.log("edit plz")
        let split=this.node.condition.split("=")
        this.name=split[0]
        let newsplit=split[1].split(">")
        this.from=newsplit[0]
        this.to=newsplit[1]
      }
     
    }
   }
  }

  onCreateClick() {
    if(this.node.action!=null){
      this.node.name=this.value
      this.node.condition=this.name+" == "+this.value
     }
    else{
      if(this.node.datatype=='integer'){
        console.log(this.from, this.to)
        if(this.from.toUpperCase()=='-INFINITY'){
          this.node.name="<"+""+this.to
          this.node.condition=this.name+""+"="+this.from+"<"+this.to
          console.log(this.node.condition,this.node)
        }
        else if(this.to.toUpperCase()=='INFINITY'){
          this.node.name=">"+""+this.from
          this.node.condition=this.name+""+"="+this.from+">"+this.to
          console.log(this.node.condition,this.node)
        }
        else{
          this.node.name=this.from+"<=..<"+this.to
          this.node.condition=this.name+"="+this.from+"<=..<"+this.to
          console.log(this.node.condition,this.node)
        }
      }
      else{
        this.node.name=this.operator+""+this.value
        this.node.condition=this.name+""+this.operator+""+this.value
        console.log(this.node.condition)
      }
    }
    this.dialogRef.close(this.node)
  }
  onCloseClick() {
    this.dialogRef.close()
  }
}
