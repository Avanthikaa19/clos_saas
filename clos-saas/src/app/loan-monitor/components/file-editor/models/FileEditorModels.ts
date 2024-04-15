export class EditorFile {

    name: string;
    path: string;

    lastModified: Date;
    size: number;

    readable: boolean;
    editable: boolean;
    deletable: boolean;
    executable: boolean;

}

export class EditorDir {

    name: string;
    path: string;

    lastModified: Date;

    readable: boolean;
    editable: boolean;
    deletable: boolean;
    executable: boolean;

    dirs: EditorDir[];
    files: EditorFile[];

}

export class EditorFileWithContent {

    file: EditorFile;
    content: string;

}
