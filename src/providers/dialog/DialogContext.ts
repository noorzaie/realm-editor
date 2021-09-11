import { Component, createContext } from 'react';
import { emptyFunctionType, widthClassType } from 'src/types/genericTypes';

const DialogContext = createContext({
    show: (component: Component, title: string, okCallback: (closeCallback: emptyFunctionType) => void, cancelCallback: emptyFunctionType, disabled: boolean, width: widthClassType, okText: string, cancelText: string): void => { console.log('Not implemented!'); },
    onClose: () => { console.log('Not implemented!'); },
    onOk: () => { console.log('Not implemented!'); },
    onCancel: () => { console.log('Not implemented!'); }
});

export default DialogContext;
