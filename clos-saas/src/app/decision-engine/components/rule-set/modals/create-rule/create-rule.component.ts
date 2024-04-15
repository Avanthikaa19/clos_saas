import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AccessControlData } from 'src/app/app.access';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { Rules } from '../../models/rulesetmodels';
import { ProjectService } from '../../services/projectservice';
import { RuleEngineService } from '../../services/rule-engine.service';
import { AddConditionalRuleComponent } from '../add-conditional-rule/add-conditional-rule.component';
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';

@Component({
  selector: 'app-create-rule',
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.scss']
})
export class CreateRuleComponent implements OnInit {

  ruleId: number = 0;
  masterSelected: boolean;
  master_indeterminate: boolean;
  rule: Rules;
  ruleSetId: number = null as any;
  rules: Rules[];
  listRules: Rules;
  loading: boolean = false;
  pageData: PageData;

  constructor(
    public dialog: MatDialog,
    private url: UrlService,
    private ruleEngineService: RuleEngineService,
    private selectedProject: ProjectService,
    private router: Router, private route: ActivatedRoute,
    private ruleService: RuleEngineService,
    public ac: AccessControlData,
    public dialogRef: MatDialogRef<CreateRuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateRuleComponent,
  ) {
    this.rule = JSON.parse(JSON.stringify(data.rule));
    console.log(this.rule)
    this.listRules = this.rule
    this.masterSelected = false;
    this.master_indeterminate = false;
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.ruleSetId = this.selectedProject.selectedRuleSetId;
    console.log(this.ruleSetId)
    this.getListOfRules()
  }

  getListOfRules() {
    this.loading = true;
    this.ruleEngineService.getRulePidList().subscribe((res) => {
      this.rules = res;
      this.loading = false;
      let rule = Object.values(this.rules)
      let selectRules = Object.values(this.listRules)
      for (let value of rule) {
        for (let val of selectRules) {
          if (value.id == val.id) {
            value.is_selected = true;
          }
        }
      }
      if (rule.length == selectRules.length) {
        this.masterSelected = true
      } else if (rule.length != selectRules.length) {
        this.master_indeterminate = true
      }

      console.log(this.rules)
    })
  }


  addNewConditional() {
    const dialogRef = this.dialog.open(AddConditionalRuleComponent, {
      height: "80vh",
      width: "70vw",
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ruleEditor(pyhhonScript: any) {
    const dialogRef = this.dialog.open(RuleEditorComponent, {
      height: "80vh",
      width: "70vw",
      data: { variableFields: pyhhonScript },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rule.python_scripts = result;
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  ruleCreate() {
    console.log(this.rule);
    this.rule.rule_type = "editor";
    this.rule.effect_from = new Date(this.rule.effect_from);
    this.rule.effect_to = new Date(this.rule.effect_to);
    this.ruleEngineService.createRule(this.rule).subscribe(
      (res) => {
        console.log(res);
        this.onNoClick();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  ruleUpdateInRuleSet() {
    let filterOutput = this.rules.filter(split => split.is_selected == true);
    this.rule.rule_type = "editor";
    this.rule.effect_from = new Date(this.rule.effect_from);
    this.rule.effect_to = new Date(this.rule.effect_to);
    let rules = { "rules": filterOutput }
    console.log('rules', rules)
    this.ruleEngineService.updateRuleSetById(this.ruleSetId, rules).subscribe(
      (res) => {
        this.onNoClick();
      }
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  master_change() {
    for (let value of Object.values(this.rules)) {
      value.is_selected = this.masterSelected;
    }
  }
  list_change() {
    let checked_count = 0;
    for (let value of Object.values(this.rules)) {
      if (value.is_selected)
        checked_count++;
    }
    if (checked_count > 0 && checked_count < this.rules.length) {
      this.master_indeterminate = true;
    } else if (checked_count == this.rules.length) {
      this.master_indeterminate = false;
      this.masterSelected = true;
    } else {
      this.master_indeterminate = false;
      this.masterSelected = false;
    }
  }
  getRuleSetByID() {
    this.ruleEngineService.getRuleSetById(this.ruleSetId).subscribe(
      (res) => {
        console.log(res);
        // this.listRules = res.rules;
      },
      (err) => {
        console.log(err);
      }
    )
  }
  createRuleNav() {
    this.ruleEngineService.saveUpdate = false;
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = "/desicion-engine/explorer/rules/rules-change/0"
    console.log("view rule", viewUrl)
    this.router.navigateByUrl(viewUrl);
  }

}
