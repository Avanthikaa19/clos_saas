import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { DirectoryModel, FileModel } from 'src/app/data-entry/models/models';
import { DownloadDataServices } from 'src/app/data-entry/services/download-service';
import { ImportExportService } from 'src/app/data-entry/services/import-export.service';
import { app_header_height } from 'src/app/decision-engine/config/app.constants';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  component_height;
  component_width;
  view_width;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - app_header_height;
    this.component_width = window.innerWidth;
    if (window.innerWidth < 1366) {
      this.component_height = this.component_height - 20;
      this.component_width = 1366;
    }
    this.view_width = this.component_width - 665;
  }
  contextMenuPosition = { x: '0px', y: '0px' };
  focusedDirectory: DirectoryModel = null;
  currentFolderPath: string = '/apps/los/batch_import/';
  loadingCurrentDirectory: boolean = false;
  path: string = '';
  currentDirectory: DirectoryModel = null;
  errorMessage: string = '';
  searchDirectoryOrFileText: string = '';
  focusedFile: FileModel = null;
  showHints: boolean = false;
  filesDataSource: MatTableDataSource<FileModel> = new MatTableDataSource([]);
  searchAllFiles: FileModel[] = [];
  currentFolderPathFolders: string[] = [];
  name: string = '';
  dir;
  targetpath;
  downloadingFile: boolean = false;
  downloadingZipFile: boolean = false;
  filteredFiles: any[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;

  constructor(
    private importExportService: ImportExportService,
    private notifierService: NotifierService,
    private snackBar: MatSnackBar,
    public downloadService: DownloadDataServices,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {
    this.matIconRegistry.addSvgIcon(
      "excel-green",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/Icons/xls.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "pdf",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/Icons/pdf.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "text",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/Icons/text.svg")
    );
  }

  ngOnInit(): void {
    this.setDirectory(this.currentFolderPath);
  }

  setDirectory(path: string) {
    this.currentFolderPath = path;
    this.fetchDirectory(path);
    this.updateAddressBarFolders();
  }

  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  fetchDirectory(path: string) {
    this.clearFocus();
    // this.deselectAllFiles();
    this.loadingCurrentDirectory = true;
    let startTime = new Date().getTime();
    // if (this.currentDirectory != null) {
    //   this.filesDataSource.data = [];
    // }
    this.path = path;
    this.importExportService.getDirectory(path).subscribe(
      res => {
        this.currentDirectory = res;
        // Filter the files based on the search text
        this.filteredFiles = this.currentDirectory.files.filter(file => {
          return file.name.toLowerCase().includes(this.searchDirectoryOrFileText.toLowerCase());
        });

        // Sorting logic
        this.filteredFiles.sort((a, b) => {
          if (a.gen < b.gen) {
            return 1;
          }
          if (a.gen > b.gen) {
            return -1;
          }
          return 0;
        });
        console.log(this.currentDirectory);
        function compare(a, b) {
          if (a.gen < b.gen) {
            return 1;
          }
          if (a.gen > b.gen) {
            return -1;
          }
          return 0;
        }
        this.currentDirectory.files.sort(compare);
        // this.updateDistinctDatesForFiles();
        // this.updateDistinctReportsForFiles();
        // this.getFilesForDate('');
        this.loadingCurrentDirectory = false;
        let endTime = new Date().getTime();
        // this.lastFetchTime = (endTime - startTime) / 1000;
        this.errorMessage = '';
      },
      err => {
        this.currentDirectory = null;
        this.errorMessage = err.error;
        this.loadingCurrentDirectory = false;
      }
    );
  }

  //FILTER
  getFilteredDirectoriesForSearch(dirs: DirectoryModel[], searchText: string) {
    searchText = searchText.toLowerCase();
    let newArr: DirectoryModel[] = [];
    for (let i = 0; i < dirs?.length; i++) {
      if (dirs[i].name.toLowerCase().includes(searchText)) {
        newArr.push(dirs[i]);
        //SORTING IN ASCENDING ORDER
        newArr.sort((a, b) => 0 - (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1));
        // console.log('Folders', newArr.sort((a,b) => 0 - (a.name > b.name ? -1 : 1)));
      }
    }
    return newArr;
  }

  focusFolder(dir: DirectoryModel, event) {
    this.dir = dir;
    this.name = dir.name;
    this.focusedFile = null;
    this.focusedDirectory = dir;
    event.stopPropagation();
  }

  getSelectedFiles(): FileModel[] {
    let files: FileModel[] = [];
    for (let i = 0; i < this.filesDataSource.data.length; i++) {
      if (this.filesDataSource.data[i].selected) {
        files.push(this.filesDataSource.data[i]);
      }
    }
    return files;
  }

  getFilteredFilesForSearch(dirs: FileModel[], searchText: string) {
    searchText = searchText.toLowerCase();
    // dirs = this.searchAllFiles
    let newArr: FileModel[] = [];
    for (let i = 0; i < dirs?.length; i++) {
      if (dirs[i].name.toLowerCase().includes(searchText)) {
        newArr.push(dirs[i]);
        //SORTING IN ASCENDING ORDER
        newArr.sort((a, b) => 0 - (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1));
      }
    }
    for (let j = 0; j < this.searchAllFiles.length; j++) {
      if (this.searchAllFiles[j].name.toLowerCase().includes(searchText)) {
        newArr.push(this.searchAllFiles[j]);
        //SORTING IN ASCENDING ORDER
        newArr.sort((a, b) => 0 - (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1));
      }
      // break;
    }

    return newArr;
  }

  clearFocus() {
    this.focusedFile = null;
    this.focusedDirectory = null;
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadFile(this.selectedFile)
  }

  uploadFile(file) {
    if (this.name) {
      this.targetpath = '/apps/los/batch_import/' + this.name;
    } else {
      this.targetpath = '/apps/los/batch_import/';
    }
    if (file) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      console.log(file)
      this.importExportService.uploadFile(this.targetpath, formData).subscribe(
        res => {
          if(res.type == 3){
            this.notifierService.notify('success', 'File Uploaded Successfully');
          }
        }, err => {
          if(err.status != 200){
            this.notifierService.notify('error', 'Oops!Something went wrong');
          }
        }
      )
    }
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  downloadFolder(file: DirectoryModel) {
    console.log(file)
    this.openSnackBar('Starting download..', '');
    this.downloadingFile = true;
    file.path = '/apps/los/batch_import';
    this.importExportService.downloadZip(file.name, file.path).subscribe(
      (response: any) => {
        var blob = new Blob([response], {
          type: "text/"
        });
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = file.name + '.zip';
        anchor.href = url;
        anchor.click();
        this.cdr.detectChanges();
        console.log(response)
        this.downloadingFile = false;
      },
      err => {
        console.log(err)
        this.errorMessage = err.error;
        this.openSnackBar('Failed to download!', '');
        this.downloadingFile = false;
      }
    );
  }

  getFileForDownload(file: FileModel, zip: boolean) {
    this.openSnackBar('Starting download..', '');
    this.downloadingFile = true;
    this.importExportService.downloadFile(file).subscribe(
      (response: any) => {
        var blob = new Blob([response], {
          type: "text/"
        });
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        if (zip == true) {
          anchor.download = file.name + '.zip';
        } else {
          anchor.download = file.name;
        }
        anchor.href = url;
        anchor.click();
        this.cdr.detectChanges();
        this.openSnackBar('Your download has started!', '');
        this.downloadingFile = false;
      },
      err => {
        console.log(err)
        this.errorMessage = err.error;
        this.openSnackBar('Failed to download!', '');
        this.downloadingFile = false;
      }
    );
  }

  getFileFormat(fileName: string) {
    return fileName.split('.').pop().toUpperCase();
  }

  focusFile(fil: FileModel, event, fileID: string, containerID: string) {
    this.focusedDirectory = null;
    this.focusedFile = fil;
    let left: string = '100%';
    let top: string = '100%';
    if (event) {
      event.stopPropagation();
      let fileElement = document.getElementById(fileID);
      let contElement = document.getElementById(containerID);
      let fileRect: DOMRect = fileElement.getBoundingClientRect();
      let contRect: DOMRect = contElement.getBoundingClientRect();
      if (fileRect.x >= (contRect.width / 2)) {
        left = 'calc(100% - 400px)';
      }
      if (fileRect.y >= (contRect.height / 2)) {
        top = 'calc(-100% - 100px)';
      }
    }
  }

  updateAddressBarFolders() {
    this.currentFolderPathFolders = [];
    if (this.currentFolderPath == '') {
      return;
    }
    this.currentFolderPathFolders = this.currentFolderPath.split("/").filter(function (el) { return el.length != 0 });
  }

  goToParentDir() {
    this.clearFocus();
    if (this.currentFolderPathFolders.length > 1) {
      let pathToReach: string = '';
      for (let i = 0; i < this.currentFolderPathFolders.length - 1; i++) {
        pathToReach += this.currentFolderPathFolders[i];
        if (i < this.currentFolderPathFolders.length - 2) {
          pathToReach += "/";
        }
      }
      console.log(pathToReach)
      this.setDirectory(pathToReach);
    }
  }

}
