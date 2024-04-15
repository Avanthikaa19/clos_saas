import { animate, state, style, transition, trigger } from '@angular/animations';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { app_header_height } from 'src/app/decision-engine/config/app.constants';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { DataMonitoringService } from '../../service/data-monitoring.service';
import { EditorFile, EditorDir, EditorFileWithContent } from './models/FileEditorModels';

interface FileNode {
  name: string;
  isDir: boolean;
  format: string;
  data: EditorFile | EditorDir;
  loadingChildren?: boolean;
  children?: FileNode[];
  expanded: boolean;
}

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-editor.component.html',
  styleUrls: ['./file-editor.component.scss'],
  animations: [
    trigger('slideVertical', [
      state(
        '*', style({ height: 0 })
      ),
      state(
        'show', style({ height: '*' })
      ),
      transition('* => *', [animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)')])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FileEditorComponent implements OnInit, OnDestroy {
  component_height;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - app_header_height - 60;
  }

  aceOptions: any = {
    minLines: 50,
    maxLines: 10000,
    printMargin: false,
    useWorker: false
  };

  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();

  //component vars
  rootDir: string = '/apps';
  tree: EditorDir = null;
  treeData: FileNode[] = [];
  loadingTree: boolean = false;
  //temporary ui vars
  focusedNode: FileNode;
  activeNode: FileNode;

  browseExpanded: boolean = true;

  file: EditorFileWithContent;
  format: string = 'text';
  editorLanguage: string = 'text';
  unixEOL: boolean = true;
  loadingFile: boolean = false;
  savingFile: boolean = false;
  nodeorder: FileNode;

  constructor(
    private fileEditorDataService: DataMonitoringService,
    private snackBar: MatSnackBar,
    private url: UrlService
  ) {
    this.updateComponentSize();
    this.file = new EditorFileWithContent();
    // this.file.file = new EditorFile();
    // this.file.file.name = 'Sample File.txt';
    // this.file.file.path = '/apps/app_tmr/Sample File.txt';
    // this.file.file.size = 123456;
    this.file.content = '';
    //initialize tree
    this.dataSource.data = this.treeData;
  }

  hasChild = (_: number, node: FileNode) => !!node.children && node.children.length > 0;

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
    if(sessionStorage.getItem('fileEditorRootDir')) {
      this.rootDir = sessionStorage.getItem('fileEditorRootDir');
    }
    this.refreshTree();
  }

  ngOnDestroy() {
    sessionStorage.setItem('fileEditorRootDir', this.rootDir);
  }

  toggleWindowMode() {
    this.browseExpanded = !this.browseExpanded;
  }

  getFormatColor(format: string) {
    switch(format) {
      case 'json':
        return 'dodgerblue';
      case 'txt':
        return 'dodgerblue';
      case 'csv':
        return 'dodgerblue';
      case 'log':
          return 'dodgerblue';
      case 'sh':
        return 'orange';
      case 'xls':
        return 'green';
      case 'xlsx':
        return 'green';
      case 'pdf':
          return 'red';
      case 'sql':
          return 'dodgerblue';
      default: 
        return 'dimgrey';
    }
  }

  getEditorLanguage(format: string) {
    if(!format) {
      return 'text';
    }
    switch(format.toLocaleLowerCase()) {
      case 'json':
        return 'json';
      case 'sh':
        return 'shell';
      case 'sql':
          return 'sql';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'java': 
        return'java';
      case 'cmd':
        return 'powershell';
      case 'txt':
      case 'csv':
      case 'log':
      default: 
        return 'text';
    }
  }

  refreshTree() {
    this.loadingTree = true;
    this.fileEditorDataService.getTree(this.rootDir).subscribe(
      res => {
        this.tree = res;
        this.sortReportNames();
        this.treeData = [];
        for(let i = 0; i < this.tree.dirs.length; i++) {
          this.treeData = this.makeTree(this.tree, false);
        }
        this.dataSource.data = null;
        this.dataSource.data = this.treeData;
        this.loadingTree = false;
      },
      err => {
        this.loadingTree = false;
      }
    );
  }

  makeTree(dir: EditorDir, recursive: boolean): FileNode[] {
    if((dir.dirs == null || dir.dirs.length == 0) && (dir.files == null || dir.files.length == 0)) {
      return [];
    } else {
      let returnNodes: FileNode[] = [];
      //add directories
      if(dir.dirs.length > 0) {
        for(let i = 0; i < dir.dirs.length; i++) {
          returnNodes.push({ 
            name: dir.dirs[i].name, 
            isDir: true, 
            format: '', 
            data: dir.dirs[i], 
            children: recursive ? this.makeTree(dir.dirs[i], recursive) : undefined, 
            expanded: false 
          })
        }
      }
      //add files
      if(dir.files.length > 0) {
        for(let i = 0; i < dir.files.length; i++) {
          let fileFormat = dir.files[i].name.split('.').pop();
          returnNodes.push({ name: dir.files[i].name, isDir: false, format: fileFormat, data: dir.files[i], expanded: false });
        }
      }
      return returnNodes;
    }
  }

  focusNode(node: FileNode) {
    if(node.isDir && node.children == undefined) {
      node.loadingChildren = true;
      this.fileEditorDataService.getTree((node.data as EditorDir).path).subscribe(
        res => {
          node.children = this.makeTree(res, false); //also updates this.treeData
          this.nodeorder = node;
          this.sortReportNames();
          this.dataSource.data = null;
          this.dataSource.data = this.treeData;
          node.loadingChildren = false;
        },
        err => {
          node.children = undefined;
          node.loadingChildren = false;
        }
      );
    } else if(!node.isDir) {
      this.focusedNode = node;
    }
  }

  activateNode(node: FileNode) {
    if(!node.isDir) {
      this.activeNode = node;
      this.loadFile(this.activeNode.data as EditorFile);
      if(this.browseExpanded) {
        this.browseExpanded = false;
      }
    }
  }

  sortReportNames() {
    for (let i = 0; i < this.tree.dirs.length; i++) {
      let sortedList1 = this.tree.dirs;
      this.tree.dirs = sortedList1.slice();
      this.tree.dirs.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0));
    }
    if(this.nodeorder != undefined && this.nodeorder.children != undefined) {
      for (let j = 0; j < this.nodeorder.children.length; j++) {
        let sortedList2 = this.nodeorder.children;
        this.nodeorder.children = sortedList2.slice();
        this.nodeorder.children.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0));
      }
    }
  }

  loadFile(editorFile: EditorFile) {
    this.loadingFile = true;
    this.file.file = null;
    this.file.content = '';
    this.format = 'text';
    this.fileEditorDataService.getFileContent(editorFile).subscribe(
      res => {
        this.file = res;
        //set editor language mode
        if(this.file != null) {
          let fileFormat = this.file.file.name.split('.').pop().toLocaleLowerCase();
          this.editorLanguage = this.getEditorLanguage(fileFormat);
          switch(fileFormat) {
            case 'css': {
              this.format = 'css';
              break;
            }
            case 'html': {
              this.format = 'html';
              break;
            }
            case 'json': {
              this.format = 'json';
              break;
            }
            case 'java': {
              this.format = 'java';
              break;
            }
            case 'scss': {
              this.format = 'scss';
              break;
            }
            case 'sh': {
              this.format = 'sh';
              break;
            }
            case 'sql': {
              this.format = 'sql';
              break;
            }
            case 'xsl':
            case 'dtd':
            case 'xml': {
              this.format = 'xml';
              break;
            }
            default: {
              this.format = 'text';
            }
          }
        }
        this.loadingFile = false;
      },
      err => {
        this.format = 'text';
        this.loadingFile = false;
      }
    );
  }

  beautifyCode() {
    // var beautify = ace.require("ace/ext/beautify"); // get reference to extension
    // var editor = ace.edit("editor"); // get reference to editor
    // beautify.beautify(editor.session);
  }

  saveFile() {
    this.savingFile = true;
    this.fileEditorDataService.updateFileContent(this.file, this.unixEOL).subscribe(
      res => {
        this.file = res;
        this.openSnackBar('File ' + this.file.file.name + ' saved successfully.', null);
        this.savingFile = false;
      },
      err => {
        this.savingFile = false;
      }
    );
  }

  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
