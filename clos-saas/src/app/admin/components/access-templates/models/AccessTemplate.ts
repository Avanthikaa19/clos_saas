
export class AccessTemplate {
    isChecked: boolean;
    length: number;
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public systemDefined: boolean,
        public creator: string,
        public editor: string,
        public created: string,
        public accessibleItems: string[]
    ) { }




}
export class AccessibleItem {
    name: string;
    displayName: string;
    description: string;
    module: string;
    childItems: string[];
    category: string;
    //temp
    selected: boolean;
    children: AccessibleItem[];
}
export class StructuredAccessibleItems {
    module: string;
    categories: CategorizedAccessibleItems[];
}
export class CategorizedAccessibleItems {
    category: string;
    items: AccessibleItem[];
}


export class MultiSort {
    sortingOrder: string;
    orderBy: string;
}

export class accessTemplatesort {
    filter: AccessTemplateFilter;
    sort: MultiSort[];
}


export class AccessTemplateFilter {
    constructor(

        public id: number,
        public name: string,
        public description: string,
        public systemDefined: boolean,
        public creator: string,
        public editor: string,
        public created: string,
        public accessibleItems: string[]
    ) { }
}
{ }
export class ExportFile{
    filter: accessTemplatesort;
    // columnDefinitions: ColumnDefinition[];
}