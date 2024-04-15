import { Component, OnInit } from '@angular/core';
import { DbConnection, DbDetail, ObjectModelList } from '../../../../models/ObjectModel';
import { ObjectModelService } from '../../../../services/Object-model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSourceService } from '../../../../services/data-source.service';
import { DbConfig } from '../../../../models/DataSource';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { QueryBuilderComponent } from '../modals/query-builder/query-builder.component';

@Component({
  selector: 'app-db-connection-detail',
  templateUrl: './db-connection-detail.component.html',
  styleUrls: ['./db-connection-detail.component.scss']
})
export class DbConnectionDetailComponent implements OnInit {

  formData = new FormData();
  data: number = null as any;
  objectmodels: ObjectModelList[] = [];
  dbDetailConnection: DbConnection = new DbConnection();
  dbDetail: DbDetail = new DbDetail();
  db_type: string = "";
  config_id: number = null;
  db_config: any = null;
  dbFieldConfig: DbConfig[] = [];
  dbValueConfig: any = {};
  loading: boolean = false;
  queryLoading: boolean = false;

  constructor(
    private url: UrlService,
    private dbModelService: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    private router: Router,
    private route: ActivatedRoute,
    private _objectmodels: ObjectModelService,
    private _snackBar: MatSnackBar,
    public dbSourceService: DataSourceService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) { }

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
    let param = this.route.queryParams.forEach(e => {
      this.db_type = e['db_type'];
      this.config_id = e['config_id'];
    });
    this.getRouteConfig();
  }

  createDbModel() {
    this.dbDetailConnection.db_connection = this.dbDetail;
    this.dbDetailConnection.type = "db";
    this.dbDetailConnection.created_by = "Admin";
    this.dbDetailConnection
    console.log(this.dbDetailConnection);
    this.dbModelService.createDatabaseModel( this.dbDetailConnection).subscribe(
      res => {
        console.log(res);
      }
    )
  }

  onBackClick() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/db-list/'
    console.log(viewUrl)
    this.router.navigate([viewUrl])
  }

  dbconnect() {
    // this.uploading = true;
    this.formData.append("name", this.dbDetailConnection.name);
    this.formData.append("type", "db");
    this.formData.append("projectdetail", this.selectedProject.selectedProjectId.toString());
    this.formData.append("db_connection", JSON.stringify(this.dbDetail));
    this.formData.append("created_by", "Admin")
    this._objectmodels.postDBModel(1, this.formData).subscribe(
      (res) => {
        // this.uploadForm.reset(),
        // this.uploading = false;
        // this.fileName = '';
        this.openSnackBar('Database Connection Saved Successfully', "close");
        this.onBackClick();
      },
      // err => {
      //   this.error_message = err.error.name[0];
      //   this.uploadForm.form.controls['fileName'].setErrors({ 'incorrect': true });
    )
  }


  getObjectModels() {
    this._objectmodels.getDBModellist(1).subscribe(
      (res) => {
        this.objectmodels = res;
        console.log(this.objectmodels)
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getRouteConfig() {
    if (this.config_id) {
      this.getUpdateConfig();
    } else {
      this.getMysqlDbConfig();
    }
  }

  //TO DISPLAY DB FIELDS DYNAMICALLY
  getMysqlDbConfig() {
    this.loading = true;
    this.dbSourceService.getMysqlFieldList(this.db_type).subscribe(
      (res) => {
        this.loading = false;
        this.db_config = res;
        this.setDbFieldConfig(res)
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    )
  }

  //TO DISPLAY THE FIELDS NEED TO UPDATE
  getUpdateConfig() {
    this.loading = true;
    this.dbSourceService.getMysqlConfigById(this.config_id).subscribe(
      (res) => {
        this.loading = false;
        this.db_config = res;
        console.log(this.db_config);
        this.setUpdateDbFieldConfig(res);
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    )
  }

  setDbFieldConfig(res: any) {
    var keys = Object.keys(res);
    keys.forEach(e => {
      this.dbFieldConfig.push({
        lable: e,
        field: res[e],
      })
    })
  }

  setUpdateDbFieldConfig(res: any) {
    var keys = Object.keys(res);
    keys.forEach(e => {
      if (e != 'id' && e != 'db_type' && e != 'project') {
        this.dbFieldConfig.push({
          lable: e,
          field: typeof (res[e]),
          value: res[e],
        })
      }
    })
  }

  getLableName(lableName: string) {
    switch (lableName) {
      case 'db_type': return 'Database Type';
      case 'db_name': return 'Database Name';
      case 'tls_client_auth': return 'TLS Client Auth';
      case 'ca_cert': return 'CA Cert';
      case 'tls_verify': return 'TLS Verify';
      case 'max_open': return 'Max open';
      case 'max_idle': return 'Max Idle';
      case 'max_life_time': return 'Max life time';
      case 'max_time_interval': return 'Max Time Interval';
    }
    return lableName;
  }

  deleteConfiguration() {
    if (confirm('Are you sure want to delete this configuration?')) {
      this.dbSourceService.deleteConfig(this.config_id).subscribe(
        (res) => {
          console.log(res);

          this.showNotification('success', 'Deleted successfully.');
          this.onBackClick();
        },
        (err) => {
          console.log(err);
          this.showNotification('error', 'Oops! something went wrong.');
        }
      )
    } else {
      // Do nothing!
    }
  }

  onSaveClick() {
    this.dbValueConfig = {};
    console.log('Save Button clicked', this.dbFieldConfig);
    this.dbFieldConfig.forEach(e => {
      let keys = e.lable;
      this.dbValueConfig["project"] = this.selectedProject.selectedProjectId;
      this.dbValueConfig["db_type"] = this.db_type;
      // if (e.value) {
        this.dbValueConfig[keys] = e.value
      // }
    })
    console.log(this.dbValueConfig);
    if (this.config_id) {
      console.log(this.config_id, this.dbValueConfig)
      this.dbSourceService.updateMysqlConfig(this.config_id, this.dbValueConfig).subscribe(
        (res) => {
          console.log(res);
          this.queryLoading = true;
          this.showNotification('success', 'Database configuration updated successfully.');
          this.router.navigateByUrl('/desicion-engine/config/config-nav/db-connection')
          // this.onBackClick();
        },
        (err) => {
          console.log(err);
          this.showNotification('error', 'Oops! something went wrong.')
        }
      )
    } else {
      this.dbSourceService.createMysqlConfig(this.dbValueConfig).subscribe(
        (res) => {
          console.log(res);
          this.queryLoading = true;
          this.showNotification('success', 'Database configuration created successfully.');
          this.router.navigateByUrl('/desicion-engine/config/config-nav/db-connection')
          // this.onBackClick();
        },
        (err) => {
          console.log(err);
          this.showNotification('error', 'Oops! something went wrong.');
        }
      )
    }
    this.dbSourceService.dbConnection(this.config_id, this.dbValueConfig).subscribe(
      res => {
        console.log(res)
      }
    )
  }

  onResetClick(){
      this.dbFieldConfig.forEach(
        e=>{
          e.value = null;
        }
      )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  openQueryBuilder() {
    const dialogRef = this.dialog.open(QueryBuilderComponent,{
      height: '90vh',
      width: '90vw',
      data: this.dbValueConfig,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
