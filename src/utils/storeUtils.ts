import { PayloadAction } from '@reduxjs/toolkit';
import { capitalizeString } from './helperMethods';

type ReducersType<StateType> = {
    [key in keyof StateType as `set${Capitalize<string & key>}`]: (state: StateType, action: PayloadAction<StateType[key]>) => void
}
export const getReducers = <StateType>(initialState: StateType): ReducersType<StateType> => {
    const reducers: any = {};

    for (const [ key, value ] of Object.entries(initialState) as Array<[keyof StateType, any]>) {
        reducers[`set${capitalizeString(key as string)}`] = (state: StateType, action: PayloadAction<typeof value>) => {
            state[key] = action.payload;
        };
    }

    return reducers as ReducersType<StateType>;
};
