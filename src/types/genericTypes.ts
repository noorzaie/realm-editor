import { showDialogType } from 'src/providers/dialog/DialogProvider';
import { BooleanOperatorType, FilterType } from './dbTypes';

export type emptyFunctionType = () => void;

export type widthClassType = 'xl' | 'lg' | 'md' | 'sm';

export interface DialogPropTypes {
    showDialog: showDialogType;
    onDialogClose: emptyFunctionType;
    onDialogOk: (closeFN: emptyFunctionType) => void;
    onDialogCancel: emptyFunctionType;
}

export interface ObjectType { [key: string]: any }

export interface FilterGroupType {
    filters: FilterType[];
    operator: BooleanOperatorType;
}

export type RenamedColumnsType = { current: string; old: string }[];

export type ExportTypes = 'data' | 'schema' | 'database';
export type DataExportTypes = 'XLSX' | 'JSON' | 'Realm';
export type SchemaExportTypes = 'JSON' | 'Realm Schema' | 'Realm' | 'Java' | 'Kotlin' | 'JavaScript' | 'Swift' | 'TypeScript' | 'XLSX';
