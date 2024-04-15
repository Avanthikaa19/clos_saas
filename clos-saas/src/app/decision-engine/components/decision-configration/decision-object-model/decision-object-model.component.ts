import { Component, OnInit, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ObjectModel, ObjectModelDefaultId, ObjectModelFieldDetail, ObjectModelList } from '../../../models/ObjectModel';
import { UrlService } from '../../../services/http/url.service';
import { ObjectModelService } from '../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { WizardserviceService } from 'src/app/flow-manager/components/flow-manager/modals/import-export-wizard/service/wizardservice.service';

@Component({
  selector: 'app-decision-object-model',
  templateUrl: './decision-object-model.component.html',
  styleUrls: ['./decision-object-model.component.scss']
})
export class DecisionObjectModelComponent implements OnInit {

  value = '';
  private _transformer = (node: ObjectModel, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      type: node.type,
      id: node.id.toString(),
      level: level,
    };
  }

  fileName: string = '';
  file!: File;
  formData = new FormData();
  message: string = 'Object Model Preview';
  error_message: string = '';
  objectmodels: ObjectModelList[] = [];
  obj_model: any;
  selectedObjectModel!: ObjectModelList;
  selectedObjectModelId: number;
  data: number = null as any;
  objectModelId: ObjectModelDefaultId = new ObjectModelDefaultId();
  objectModelChild: ObjectModelFieldDetail[] = [];
  loading: boolean = false;
  @ViewChild('uploadForm')
  uploadForm!: HTMLFormElement;
  uploading: boolean = false;
  treeControl = new NestedTreeControl<ExampleFlatNode>(
    node => node.children);
  // treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  hasChild = (_: number, node: ExampleFlatNode) => !!node.children && node.children.length > 0;
  jsonformat: any;
  fileType: string;
  treeData: ExampleFlatNode[] = [];
  objectSearchKey: string = '';
  // Inside the component class
  isChildLoading: boolean = false;


  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: {id: number},
    private router: ActivatedRoute,
    private _objectmodels: ObjectModelService,
    private url: UrlService,
    private Wizardservice: WizardserviceService,
    private route: Router,
    private _snackBar: MatSnackBar,
    private selectedProject: DecisionEngineIdService,
    private notifierService: NotifierService
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
    this.data = this.selectedProject.selectedProjectId;
    this.getDefaultObjectModelData()
    let t = this.route.url;
    console.log('Tdata', t);
  }

  getObjectModels() {
    this.loading = true;
    this._objectmodels.getObjectModellist().subscribe(
      (res) => {
        this.loading = false;
        this.objectmodels = res;
        this.showNotification('default', 'Loaded Successfully.');
      },
      (err) => {
        this.loading = false;
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.fileName = this.file.name.split('.xsd')[0];
      this.fileName = this.fileName[0].toUpperCase() + this.fileName.slice(1);
      this.fileType = this.file.type
      this.formData.append("path", this.file);
      this.formData.append("projectdetail", '' + this.data);
    }
  }

  uploadFile() {
    this.uploading = true;
    this.formData.append("name", this.fileName);
    this.formData.append("created_by", "Admin");
    this.formData.append("type", 'file');
    this._objectmodels.postObjectModel(this.formData).subscribe(
      (res) => {
        this.obj_model = res.body;
        this.selectedObjectModelId = this.obj_model.id;
        this.uploading = false;
        this.fileName = '';
        this.showNotification('success', 'Uploaded Successfully.');
        this.getObjectModelSchema(this.selectedObjectModelId);

      },
      err => {
        this.error_message = err.error.name[0];
        this.uploadForm['form'].controls['fileName'].setErrors({ 'incorrect': true });
        this.showNotification('error', 'Oops! Something Went Wrong.')
      })
  }
  getObjectModelSchema(id: number) {
    this.loading = true;
    this._objectmodels.getConvertedObjectModel(id).subscribe(
      (res) => {
        this.loading = false;
        res.length != 0 ? this.message = 'Object Model Preview' : this.message = 'Empty Model';
        // this.dataSource.data = [res.schema];
        console.log([res.schema])
        // this.treeControl.expandAll();       
      },
      (err) => {
        this.showNotification('error', 'Oops! Something went wrong.')
      }
    )

  }
  selectObjectModel(id: number | undefined = 0, selectedData: ObjectModelList) {
    this.loading = true;
    this.selectedObjectModelId = id;
    this._objectmodels.getConvertedObjectModel(id).subscribe(
      (res) => {
        this.loading = false;
        res.length != 0 ? this.message = 'Click to Preview Tree' : this.message = 'Empty Model';
        this.dataSource.data = [res.schema];
        console.log([res.schema])
        // this.treeControl.expandAll();
        this.selectedObjectModel = selectedData;
      },
      (err) => {
        this.showNotification('error', 'Oops! Something went wrong.')
      }
    )
  }
  clearSelection() {
    this.fileName = '';
  }

  putObjectModel() {
    console.log(this.selectedObjectModel)
    this._objectmodels.putObjectModel(this.data, this.selectedObjectModel.id, this.selectedObjectModel).subscribe(
      (res) => {
        this.showNotification('success', 'Default Object Model Selected Successfully.');
      },
      (err) => {
        this.showNotification('error', 'Oops! Something Went Wrong.')
      }
    )
  }
  exportObjectModel(id: number | undefined = 0) {
    this._objectmodels.getConvertedObjectModel(this.selectedObjectModelId).subscribe(
      (res) => {
        this.showNotification('default', 'Exported Successfully.')
        this.jsonformat = res.pop()
        const filename = 'data.json';
        const jsonStr = JSON.stringify(this.jsonformat);
        console.log("json string", jsonStr)
        let element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStr));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
      (err) => {
        this.showNotification('error', 'Oops! Something Went Wrong.')
      }
    )
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  getDefaultObjectModelData() {
    this._objectmodels.getDefaultObjectModel().subscribe(
      res => {
        let children = res[0].schema.children;
        let parameterName = res[0].schema.name + " - " + res[0].schema.type;
        console.log('parameterName', parameterName)
        // this.mattreeData = children;

        if (children) {
          children.forEach((e: { paramName: string; name: string; type: string; }) => {
            e.paramName = e.name + " - " + e.type;
          })
        }
        this.treeData.push(
          {
            name: parameterName,
            children: res[0].schema.children,
            expandable: true,
            type: res[0].type,
            id: res[0].schema.id,
            level: 0
          })
        console.log('treeData', this.treeData)
        this.dataSource.data = this.treeData;
        console.log(res[0])
        this.obj_model = res[0];
        this.getObjectModelSchema(this.obj_model.id)
        this.showNotification('success', 'Default Object Model Loaded Successfully.')
      },
      (err) => {
        this.showNotification('error', 'Oops! Something went wrong.')
      }
    )
  }
  saveDefaultObjectModel() {
    // this.objectModelId.object_id = this.selectedObjectModelId;
    console.log(this.obj_model.id)
    this._objectmodels.saveObjectModel(this.obj_model.id).subscribe(
      res => {
        this.getObjectModels();
        this.showNotification('success', 'Default Object Model Saved Successfully.')
      },
      (err) => {
        this.showNotification('error', 'Oops! Something went wrong.')
      }
    )
  }

  selectedChild(node: any) {
    // Check if the method is already loading
    if (this.isChildLoading) {
      return;
    }

    this.isChildLoading = true;
    this._objectmodels.getChildObjectModel(node.id).subscribe(
      (res) => {
        this.isChildLoading = false; // Set the flag back to false once loading is complete
        this.loading = false;
        this.objectModelChild = res;
      },
      (err) => {
        this.isChildLoading = false; // Set the flag back to false on error as well
        this.loading = false;
        this.showNotification('error', 'Oops! something went wrong.')
      }
    );
  }


  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  updateChangedOnChild(onChange: any) {
    console.log('Emitted Event', onChange);
    this.getObjectModels()
  }

  addNewField() {
    console.log('New Field Added..!');
    let addFields = new ObjectModelFieldDetail();
    addFields.name = 'sample detai;';
    addFields.others = 'sample';
    console.log(addFields);

  }
  onBackClick() {
    //development in progress
    let viewUrl = "/desicion-engine/config/config-nav"
    console.log(viewUrl)
    this.route.navigateByUrl(viewUrl)
  }

  //  object search 

  objectTypeSearch() {
    const searchKey = this.objectSearchKey.toLowerCase().trim();

    if (searchKey === '') {
      // Reset the tree data to the original data
      this.dataSource.data = this.treeData;
      return;
    }

    this.Wizardservice.objectTypeSearch(searchKey).subscribe(
      res => {
        const filteredTreeData = this.filterTreeData(this.treeData, searchKey);
        this.expandFilteredNodes(filteredTreeData);
        this.dataSource.data = filteredTreeData;
        this.expandFilteredNodes(filteredTreeData);
      }
    );
  }

  filterTreeData(nodes: ExampleFlatNode[], searchKey: string, parentPath: ExampleFlatNode[] = []): ExampleFlatNode[] {
    const filteredNodes: ExampleFlatNode[] = [];

    nodes.forEach(node => {
      const filteredChildren = this.filterTreeData(node.children, searchKey, [...parentPath, node]);

      if (node.name.toLowerCase().includes(searchKey) || filteredChildren.length > 0) {
        const expanded = filteredChildren.length > 0; // Expand the node if it has matching children
        filteredNodes.push({
          ...node,
          children: filteredChildren,
          expandable: expanded
        });
      }
    });

    return filteredNodes;
  }

  expandFilteredNodes(nodes: ExampleFlatNode[]) {
    nodes.forEach(node => {
      if (node.expandable) {
        this.treeControl.expand(node); // Expand the node
      }
      if (node.children.length > 0) {
        this.expandFilteredNodes(node.children);
      }
    });
  }

}

interface ExampleFlatNode {
  name: string;
  type: string;
  id: string;
  level: number;
  children?: ExampleFlatNode[];
  expandable: boolean;
}
