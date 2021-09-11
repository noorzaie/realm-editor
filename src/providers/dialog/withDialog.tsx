import React from 'react';
import { Subtract } from 'utility-types';
import DialogContext from 'src/providers/dialog/DialogContext';
import { DialogPropTypes } from 'src/types/genericTypes';

const withDialog = <P extends DialogPropTypes>(Component: React.ComponentType<P>): React.ComponentType<Subtract<P, DialogPropTypes>> => {
    return class C extends React.Component<Subtract<P, DialogPropTypes>> {
        render() {
            return <DialogContext.Consumer>
                {
                    context =>
                        <Component
                            {...this.props as P}
                            showDialog={context.show}
                            onDialogClose={context.onClose}
                            onDialogOk={context.onOk}
                            onDialogCancel={context.onCancel}
                        />
                }
            </DialogContext.Consumer>;
        }
    };
};

export default withDialog;
