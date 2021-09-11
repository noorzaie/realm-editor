import { REALM_PRIMITIVE_TYPES } from './constants';

export const isDataTypePrimitive = (type: string): boolean => {
    return REALM_PRIMITIVE_TYPES.includes(type);
};
