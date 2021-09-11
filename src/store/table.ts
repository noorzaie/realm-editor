import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataTableModeType, OrderType, ResultsColumnsType, RowsPerPgeType } from 'src/types/dbTypes';
import { getReducers } from 'src/utils/storeUtils';

export interface StateType {
    page: number;
    rowsPerPage: RowsPerPgeType;
    order: OrderType;
    orderBy: string;
    columns: ResultsColumnsType;
    editable: boolean;
    selectedRows: number[];
    mode: DataTableModeType;
    primaryKey: string | undefined;
    loading: boolean;
    filter: string;
    dataUpdateKey: number;
    breadCrumbItems: string[];
}

const initialState: StateType = {
    page: 0,
    rowsPerPage: 10 as RowsPerPgeType,
    order: 'desc',
    orderBy: '',
    columns: {},
    editable: true,
    selectedRows: [],
    mode: 'create',
    primaryKey: '',
    filter: '',
    loading: false,
    dataUpdateKey: Math.random(),
    breadCrumbItems: []
};

const table = createSlice({
    name: 'table',
    initialState,
    reducers: {
        ...getReducers<StateType>(initialState),
        updateDataKey: (state: StateType) => { // refresh table's data
            state.dataUpdateKey = Math.random();
        },
        resetTable: (state: StateType) => {
            state.page = 0;
            state.order = 'desc';
            state.orderBy = '';
            state.editable = true;
            state.selectedRows = [];
            state.mode = 'create';
            state.primaryKey = '';
            state.filter = '';
            state.dataUpdateKey = Math.random();
        },
        pushBreadCrumbItem: (state: StateType, action: PayloadAction<string>) => {
            state.breadCrumbItems = [
                ...state.breadCrumbItems,
                action.payload
            ];
        },
        popBreadCrumbItem: (state: StateType, action: PayloadAction<number>) => {
            state.breadCrumbItems.splice(action.payload + 1);
        }
    }
});

export const { setPage, setRowsPerPage, setOrder, setOrderBy, setColumns, setEditable, setSelectedRows, setMode, setPrimaryKey, updateDataKey, setLoading, resetTable, pushBreadCrumbItem, popBreadCrumbItem, setBreadCrumbItems, setFilter } = table.actions;
export default table.reducer;
