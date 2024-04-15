import { ObjectModelFieldDetail } from "./ObjectModel";

export class DecisionTablesList{
    id: number;
    name: string;
    description?: string;
    version?: number;
    headers?:Header[]
    rows?: Row[];
    cells?: Cell[];
    created_on?: Date;
    created_by?: string;
}

export class Header{
    id: number;
    object_model:ObjectModelFieldDetail[];
    sequence_order:number;
    type:string;
}


export class Row{
    id: number;
    sequence_order:number;
    cells?:Cell[];
}


export class Cell{
    id: number;
    operator:string;
    custom_operand:string;
    standard_operand:any;
    standard_operand_type:any;
    header:Header;
    row:Row;
    header_order:number;
    row_order:number;
    cell_type:string;
    data_type:string;

}
export class SelectedColumn{
    name:string;
    type:string;
}
export class MultipleColumn{
    object_model:SelectedColumn[];
    sequence_order:number;
    type:string;
}