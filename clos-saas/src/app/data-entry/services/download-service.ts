import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { interval, Observable, Subject, Subscription } from "rxjs";
import { UrlService } from "src/app/decision-engine/services/http/url.service";

@Injectable({
    providedIn: 'root'
})
export class DownloadDataServices {

    trackedDownloads: DownloadJobWrapper[];
    panelStatusSubject: Subject<boolean> = new Subject<boolean>();
    autoRefreshInterval: Observable<number>;
    jobRefreshSubscription: Subscription;
    fileName:string;

    constructor() {
        this.trackedDownloads = [];
        this.panelStatusSubject.next(false);
      }

    openPanel() {
        this.panelStatusSubject.next(true);
    }

    trackDownload(job: DownloadJob, fileName?: string, finalformat?: string) {
        this.openPanel();
        //create trackable wrapper
        let jobWrapper: DownloadJobWrapper = new DownloadJobWrapper();
        jobWrapper.job = job;
        jobWrapper.cancelled = false;
        jobWrapper.refreshing = false;
        jobWrapper.downloaded = false;
        if (fileName)
            jobWrapper.fileName = fileName
        if (finalformat)
            jobWrapper.extension = finalformat
        this.trackedDownloads.push(jobWrapper);
    }
}

export class DownloadJob {
    id: any;
    type: string;
    filePath: string;
    progressStage: string;
    progress: number;
    itemsProcessed: number;
    itemsTotal: number;
    isReady: boolean;
    username: string;
    requestTime: Date;
    readyTime: Date;
    downloading: boolean;
}

export class DownloadJobWrapper {
    job: DownloadJob;
    cancelled: boolean;
    refreshing: boolean;
    downloaded: boolean;
    progress: number;

    //UI use only
    fileName?: string;
    extension?: string;
}