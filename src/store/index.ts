import { configureStore } from '@reduxjs/toolkit';
import databaseReducer from './database';
import tableReducer from './table';
import notificationReducer from './notification';
import { getRealmFiles } from 'src/utils/fileUitls';

const store = configureStore({
    reducer: {
        database: databaseReducer,
        table: tableReducer,
        notification: notificationReducer
    },
    preloadedState: {
        database: {
            currentDatabase: '',
            currentCollection: '',
            databases: getRealmFiles().map(database => ({ database, collections: [] }))
        }
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// https://github.com/reduxjs/redux/tree/master/examples

export default store;
