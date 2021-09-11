import React from 'react';
import { CssBaseline, Theme, WithStyles, withStyles } from '@material-ui/core';
import DatabaseListContainer from 'src/containers/navigation/database/DatabaseListContainer';
import DataTableContainer from 'src/containers/DataTable/table/DataTableContainer';
import SideBar from './navigation/SideBar';
import TopBar from './navigation/TopBar';
import { DRAWER_WIDTH } from 'src/utils/constants';
import ErrorBoundaryContainer from 'src/containers/ErrorBoundaryContainer';
import 'src/styles/main.css';

const styles = (theme: Theme) => ({
    root: {
        display: 'flex'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        justifyContent: 'flex-end',
        height: '48px'
    },
    content: {
        width: '100%',
        flexGrow: 1,
        // padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    contentShift: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        left: DRAWER_WIDTH
    },
    main: {
        height: '100%',
        position: 'absolute' as const
    },
    selectCollection: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'gray'
    }
});

interface PropTypes {
    isSideBarOpen: boolean;
    currentCollection: string;
    onSidebarStatusChange: (isOpen: boolean) => void;
}

const Main = (props: PropTypes & WithStyles<typeof styles>): JSX.Element => {
    const { classes, currentCollection, isSideBarOpen, onSidebarStatusChange } = props;

    return (
        <ErrorBoundaryContainer>
            <CssBaseline />
            <TopBar
                isOpen={isSideBarOpen}
                onOpenIconClick={() => onSidebarStatusChange(true)}
            />
            <SideBar
                isOpen={isSideBarOpen}
                onCloseIconClick={() => onSidebarStatusChange(false)}
            >
                <DatabaseListContainer />
            </SideBar>

            <main className={`${classes.main} ${isSideBarOpen ? classes.contentShift : classes.content}`}>
                <div className={classes.drawerHeader} />
                {
                    currentCollection && <DataTableContainer />
                }
                {
                    !currentCollection && <div className={classes.selectCollection}>Select a collection to view its data</div>
                }
            </main>
        </ErrorBoundaryContainer>
    );
};

export default withStyles(styles)(Main);
