import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { ConfigurationService } from '../../services/configuration.service';
import { EditorDir, EditorFile, EditorFileWithContent } from '../components/file-editor/models/FileEditorModels';
import { Monitor } from '../models/monitor';

@Injectable({
  providedIn: 'root'
})
export class DataMonitoringService {

  API_URL: string = '';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.lo_monitor_service;
  }

  // DATA MONITORING API INTEGRATION
  getDataMonitoringDatas(fromDate: string, toDate: string, tabName: string, pageNum: number, pageSize: number) {
    return this.http.post(`${this.API_URL}/dataMonitor/get/byDateFilter?fromDate=${fromDate}&toDate=${toDate}&tab=${tabName}&pageNum=${pageNum}&pageSize=${pageSize}`,'');
  };

  getTree(rootPath: string) {
    return this.http.post<EditorDir>(`${this.API_URL}/api/file-editor/browse-tree`, rootPath);
  }

  getFileContent(editorFile: EditorFile) {
    return this.http.post<EditorFileWithContent>(`${this.API_URL}/api/file-editor/file-view`, editorFile);
  }

  updateFileContent(editorFileWithContent: EditorFileWithContent, unixEOL: boolean) {
    return this.http.post<EditorFileWithContent>(`${this.API_URL}/api/file-editor/file-update?unix_eol=${unixEOL}`, editorFileWithContent);
  }

  getChartDetails(fromDate: string, toDate: string, tabName: string) {
    return this.http.post(`${this.API_URL}/dataMonitor/get/graph?fromDate=${fromDate}&toDate=${toDate}&tab=${tabName}`, '')
  }
}
