import Realm from 'realm';
import { DataTableModeType, DataTypes, OrderType, PrimitiveColumnsType, RowsPerPgeType } from 'src/types/dbTypes';
import ListResults from './ListResults';
import { ObjectType } from 'src/types/genericTypes';

type RowsType = Realm.Results<Realm.Object> | Realm.List<DataTypes> | Realm.Object | null;

class Results {
    private _data: RowsType;
    private readonly _databaseName: string;
    private readonly _collectionName: string;
    private _order: OrderType | undefined;
    private _orderBy: string | undefined;
    private _rowsPerPage: RowsPerPgeType = 15;
    private _page = 0;
    private readonly _mode: DataTableModeType;
    private _workingField: string;
    private _columns: Realm.PropertiesTypes;
    private _filter: string;
    private _workingRow: ObjectType;
    public _parent: ListResults;

    constructor(parent: ListResults, databaseName: string, collectionName: string, data: Realm.Results<Realm.Object> | Realm.List<DataTypes> | Realm.Object | null, fieldName: string, mode: DataTableModeType) {
        this._data = data;
        this._databaseName = databaseName;
        this._collectionName = collectionName;
        this._mode = mode;
        this._workingField = fieldName;
        this._parent = parent;
    }

    public setParams(filter: string, order: OrderType | undefined, orderBy: string | undefined, rowsPerPage: RowsPerPgeType, page: number): void {
        this._filter = filter;
        this._order = order;
        this._orderBy = orderBy;
        this._rowsPerPage = rowsPerPage;
        this._page = page;
    }

    protected getPageData(data: any[]): Realm.Results<Realm.Object> | Realm.List<DataTypes> {
        if (this._page !== undefined && this._rowsPerPage !== undefined) {
            const start = this._page * this._rowsPerPage;
            const end = this._page * this._rowsPerPage + this._rowsPerPage;

            return data.slice(start, end) as unknown as Realm.Results<Realm.Object> | Realm.List<DataTypes>;
        } else {
            return data as unknown as Realm.Results<Realm.Object> | Realm.List<DataTypes>;
        }
    }

    public setWorkingRow = (row: ObjectType, field: string): void => {
        this._workingRow = row;
        this._workingField = field;
    };

    public setColumns(columns: Realm.PropertiesTypes | PrimitiveColumnsType): void {
        this._columns = columns;
    }

    public updateRow(updates: ObjectType, data: ObjectType, index: number): void {
        for (const field in { ...updates }) {
            data[field] = updates[field];
        }
    }

    set data(value: RowsType) {
        this._data = value;
    }

    get data(): RowsType {
        return this._data;
    }

    get databaseName(): string {
        return this._databaseName;
    }

    get collectionName(): string {
        return this._collectionName;
    }

    get order(): OrderType | undefined {
        return this._order;
    }

    get orderBy(): string | undefined {
        return this._orderBy;
    }

    get rowsPerPage(): RowsPerPgeType {
        return this._rowsPerPage;
    }

    get page(): number {
        return this._page;
    }

    get mode(): DataTableModeType {
        return this._mode;
    }

    get workingField(): string {
        return this._workingField;
    }

    get columns(): Realm.PropertiesTypes {
        return this._columns;
    }

    get filter(): string {
        return this._filter;
    }

    get workingRow(): ObjectType {
        return this._workingRow;
    }

    get parent(): ListResults {
        return this._parent;
    }
}

export default Results;
