export class ColumnDefinition {
    public fieldName: string;
    public subFieldName?: string;
    public displayName: string;
    public lockColumn: boolean;
    public sortAsc: boolean;
    public sortOrder?: number;
    public searchText: any;
    public dateFormat?: string;
    public searchItem?: any[];
    public searchValue?: any[];
    public filterDisable?: boolean;
    public sortDisable?: boolean;
    public hideExport?: boolean;
    public columnDisable?: boolean;
    public isLink?: boolean;
    public dropDownList?: string[];
    searchBoolean?: string[];
    //For UI use
    public dateFrom?: any;
    public dateTill?: any;
    public timeFrom?: string;
    public timeTill?: string;
    public valueFrom?: number;
    public valueTo?: number;
    public fromDate?: string;
    public toDate?: string;
    public rangeFrom?: any;
    public isRange?: boolean;
    public rangeTo?: any;
    public matToolTip?: string;
    public jsonData?: any[];
    public isStatus?: boolean;
    public isExport?: boolean;
    public isFields?: boolean;
    public buttonDisable?: boolean;
    public isClosedStatus?: boolean;
    public isIQStatus?: boolean;
    public isNewStatus?: boolean;
    public isApprovalStatus?: boolean;
    public isDateFormat?: boolean;
    public isNumberRange?: boolean;
    public isList?: boolean;
    public listField?: string;
    public isExportList?: boolean;
    public dropDownField?: string;
  }

  export class ClickEvent {
    public clientX: number;
    public clientY: number;
    public screenX: number;
    public screenY: number;
    public index: number;
    public data: any;
    public col: ColumnDefinition;
    public checked?: any;
    public format?: any;
    public exportColumn?: any;
  }

  export class PageData {
    public currentPage: number;
    public pageSize: number;
    public totalPages: number;
    public totalRecords: number;
    public comma: string;
    public count: string;
  }

  export class Attachment{
    public attachmentId:number;
    public attachmentName:string;
}

export class AttachmentDetails {
  id: number;
  fileName: string;
  storageInstance: any;
  filePath: string;
  createdOn: string;
  createdBy: string;
  fileFormat: string;
  attachmentName: string;
  attachmentId: number;
}



  