import React from 'react';
import createTheme from '@material-ui/core/styles/createTheme';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'src/store';
import Main from 'src/components/Main';
import SnackbarContainer from './SnackbarContainer';
import { addNotification } from 'src/store/notification';
import { purple } from '@material-ui/core/colors';
import { MuiThemeProvider } from '@material-ui/core';
import DB from 'src/lib/db/DB';

const theme = createTheme({
    palette: {
        primary: {
            main: purple[500]
        },
        secondary: {
            main: purple[300]
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
                }
            }
        }
    }
});

const mapState = (state: RootState) => ({
    currentCollection: state.database.currentCollection
});

const mapDispatch = {
    addNotification
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

class MainContainer extends React.Component<ReduxPropTypes> {
    state = {
        isSideBarOpen: true
    };

    handleSideBarStatusChange = (isOpen: boolean): void => {
        this.setState({ isSideBarOpen: isOpen });
    }

    componentWillUnmount() {
        DB.getInstance().close();
    }

    render() {
        const { isSideBarOpen } = this.state;
        const { currentCollection } = this.props;

        return <MuiThemeProvider theme={theme}>
            <SnackbarContainer />
            <Main
                isSideBarOpen={isSideBarOpen}
                currentCollection={currentCollection}
                onSidebarStatusChange={this.handleSideBarStatusChange}
            />
        </MuiThemeProvider>;
    }
}

export default connector(MainContainer);
