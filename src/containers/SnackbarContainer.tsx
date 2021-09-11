import React from 'react';
import { RootState } from 'src/store';
import { connect, ConnectedProps } from 'react-redux';
import { removeNotification } from 'src/store/notification';
import SnackbarComponent from 'src/components/Snackbar';

const mapState = (state: RootState) => ({
    notifications: state.notification.notifications
});

const mapDispatch = {
    removeNotification
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

class SnackbarContainer extends React.Component<ReduxPropTypes> {
    render() {
        const { notifications, removeNotification } = this.props;

        return <SnackbarComponent
            notifications={notifications}
            onClose={removeNotification}
        />;
    }
}

export default connector(SnackbarContainer);
