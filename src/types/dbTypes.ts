import Realm from 'realm';
import ObjectResults from 'src/lib/db/ObjectResults';
import PrimitiveListResults from 'src/lib/db/PrimitiveListResults';
import ListResults from 'src/lib/db/ListResults';
import { ObjectType } from './genericTypes';

export type ResultsType = ListResults | PrimitiveListResults | ObjectResults;

export type OrderType = 'asc' | 'desc';

// add-list: a list of relations is open
// add-single: a single relation object is open
// select-list: select multiple items to add to relation
// select-single: select one single item to add to relation
export type DataTableModeType = 'create' | 'add-list' | 'add-single' | 'select-list' | 'select-single' | 'unselectable';

export type DataRowType = ObjectType;

export type RowsPerPgeType = 15 | 20 | 30;

export type DBResultsType = 'primitive' | 'list' | 'object';

export interface PrimitiveColumnsType {
    [key: string]: {
        type: 'primitive' | 'list' | 'object'
    }
}

export type ResultsColumnsType = Realm.PropertiesTypes | PrimitiveColumnsType;

interface DatabaseStateItem {
    database: string;
    collections: string[];
}

export type DatabasesListType = DatabaseStateItem[];

export type DatabasesSchemas = { [database: string]: Realm.ObjectSchema[] };

export type DataTypes =
    'bool'
    | 'int'
    | 'float'
    | 'double'
    | 'string'
    | 'decimal128'
    | 'objectId'
    | 'uuid'
    | 'mixed'
    | 'date'
    | 'data'
    | 'list'
    | 'linkingObjects'
    | 'object';

export type DataRowsType = Realm.Results<Realm.Object> | Realm.List<DataTypes> | Realm.Object[];

export type FilterType = {
    fields: string[];
    aggregations: AggregationType[];
    operators: OperatorType[];
    relationFields: string[];
    selectedField: string;
    selectedAggregation: AggregationType;
    selectedOperator: OperatorType;
    selectedRelationField: string;
    operator: string;
    value: string;
}

// redux store types
// database
export interface SetDatabaseCollectionsPayload {
    index: number;
    collections: string[];
}

export type AggregationType = '@count' | '@size' | '@min' | '@max' | '@sum' | '@avg' | '';

export type OperatorType =
    '='
    | '=='
    | '<='
    | '<'
    | '>='
    | '>'
    | '!='
    | '<>'
    | 'BEGINSWITH'
    | 'CONTAINS'
    | 'ENDSWITH'
    | 'LIKE'
    | '';

export type BooleanOperatorType = 'and' | 'or';
