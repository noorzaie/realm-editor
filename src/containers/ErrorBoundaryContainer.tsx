import React from 'react';
import { addNotification } from 'src/store/notification';
import { connect, ConnectedProps } from 'react-redux';

const mapDispatch = {
    addNotification
};

const connector = connect(null, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

class ErrorBoundaryContainer extends React.Component<ReduxPropTypes> {
    componentDidMount() {
        // Catch errors that react does not catch
        window.onerror = (message, file, line, column, errorObject) => {
            this.props.addNotification({
                message: message as string,
                variant: 'error'
            });
            console.log({ message, file, line, column, errorObject });
            return false;
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.props.addNotification({
            message: error.message,
            variant: 'error'
        });
    }

    render() {
        return this.props.children;
    }
}

export default connector(ErrorBoundaryContainer) as unknown as React.ComponentClass;
