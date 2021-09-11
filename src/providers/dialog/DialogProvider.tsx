import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogTitle } from '@material-ui/core';
import DialogContext from './DialogContext';
import { emptyFunctionType, widthClassType } from 'src/types/genericTypes';

export type showDialogType = (component: React.ReactNode, title: string, okCallback: (closeFN: emptyFunctionType) => void, cancelCallback?: emptyFunctionType, disabled?: boolean, width?: widthClassType, okText?: string, cancelText?: string) => void;

interface StateTypes {
    value: {
        show: showDialogType;
        onClose: emptyFunctionType;
        onOk: emptyFunctionType;
        onCancel: emptyFunctionType;
    };
    open: boolean;
    title: string;
    okText?: string;
    cancelText?: string;
    width?: widthClassType;
    disabled: boolean;
    component: React.ReactNode | null;
    okCallback: (closeFN: emptyFunctionType) => void;
    cancelCallback: emptyFunctionType | undefined;
}

interface PropTypes {
    children: React.ReactNode
}

class DialogProvider extends React.PureComponent<PropTypes, StateTypes> {
    constructor(props: PropTypes) {
        super(props);

        this.state = {
            open: false,
            title: '',
            okText: '',
            cancelText: '',
            width: 'md',
            disabled: false,
            component: null,
            okCallback: (closeFN) => { console.log('Not implemented!'); },
            cancelCallback: undefined,
            value: {
                show: this.show,
                onClose: this.handleClose,
                onOk: this.handleOk,
                onCancel: this.handleCancel
            }
        };
    }

    public show: showDialogType = (component, title, okCallback, cancelCallback, disabled = false, width = 'md', okText, cancelText) => {
        this.setState({
            open: true,
            title,
            okText,
            cancelText,
            width,
            disabled,
            component,
            okCallback,
            cancelCallback
        });
    };

    public handleClose = (): void => {
        this.setState({
            open: false
        });
    };

    public handleOk = (): void => {
        this.state.okCallback(this.handleClose);
    };

    public handleCancel = (): void => {
        this.setState({
            open: false
        });
        if (this.state.cancelCallback) {
            this.state.cancelCallback();
        }
    };

    render(): React.ReactNode {
        const { value, open, component, title, okText, cancelText, width, disabled } = this.state;
        const { children } = this.props;

        return <DialogContext.Provider
            value={value}
        >
            {children}
            <Dialog
                open={open}
                onClose={this.handleClose}
                fullWidth={true}
                maxWidth={width}
                // disableBackdropClick={true}
            >
                {
                    title && <DialogTitle id="alert-dialog-title">
                        { title }
                    </DialogTitle>
                }
                <DialogContent>
                    { component }
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.handleCancel}
                        color="secondary"
                    >
                        { cancelText || 'Cancel' }
                    </Button>
                    <Button
                        onClick={this.handleOk}
                        color="primary"
                        disabled={disabled}
                    >
                        { okText || 'Confirm' }
                    </Button>
                </DialogActions>
            </Dialog>
        </DialogContext.Provider>;
    }
}

export default DialogProvider;
