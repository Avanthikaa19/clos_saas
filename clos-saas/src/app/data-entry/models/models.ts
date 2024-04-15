export class DirectoryModel {
    constructor(
        public name: string,
        public path: string,
        public files: FileModel[],
        public children: DirectoryModel[],
    ){}
}

export class FileModel {
    selected: boolean;
    constructor(
        public name: string,
        public size: string,
        public path: string,
        public gen: number,
    ){}

}