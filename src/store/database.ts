import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DatabasesListType, SetDatabaseCollectionsPayload } from 'src/types/dbTypes';
import { getReducers } from 'src/utils/storeUtils';

export interface StateType {
    currentDatabase: string;
    currentCollection: string;
    databases: DatabasesListType;
}

const initialState: StateType = {
    currentDatabase: '',
    currentCollection: '',
    databases: []
};

const database = createSlice({
    name: 'database',
    initialState,
    reducers: {
        ...getReducers<StateType>(initialState),
        setDatabaseCollections: (state: StateType, action: PayloadAction<SetDatabaseCollectionsPayload>) => {
            state.databases[action.payload.index].collections = action.payload.collections;
        },
        deleteDatabase: (state: StateType, action: PayloadAction<number>) => {
            state.databases.splice(action.payload, 1);
        },
        addCollection: (state: StateType, action: PayloadAction<{ index: number; databaseName: string; collectionName: string }>) => {
            state.databases[action.payload.index].collections.push(action.payload.collectionName);
        },
        addDatabase: (state: StateType, action: PayloadAction<string>) => {
            state.databases.push({
                database: action.payload,
                collections: []
            });
        }
    }
});

export const { setCurrentCollection, setCurrentDatabase, setDatabases, setDatabaseCollections, deleteDatabase, addCollection, addDatabase } = database.actions;

export default database.reducer;
