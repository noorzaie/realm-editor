import { ObjectType } from 'src/types/genericTypes';

export const getShortText = (str: string, maxLength: number): string => {
    return str.length > 20 ? `${str.substr(0, maxLength)}...` : str;
};

export const capitalizeString = (str: string): string => {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const getRandomNumber = (min = 1000, max = 10000): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const deepCopy = <T extends ObjectType>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};
