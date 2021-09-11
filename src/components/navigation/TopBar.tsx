import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { Theme } from '@material-ui/core';
import { DRAWER_WIDTH } from 'src/utils/constants';
import { emptyFunctionType } from 'src/types/genericTypes';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
    appBar: {
        transition: theme.transitions.create([ 'margin', 'width' ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH,
        transition: theme.transitions.create([ 'margin', 'width' ], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    hide: {
        display: 'none'
    }
});

export interface PropTypes {
    classes: { appBar: string, appBarShift: string, menuButton: string, hide: string };
    isOpen: boolean;
    onOpenIconClick: emptyFunctionType;
}

const TopBar: React.FC<PropTypes & WithStyles<typeof styles>> = props => {
    const { classes, isOpen, onOpenIconClick } = props;

    const handleIconClick = (): void => {
        onOpenIconClick();
    };

    return (
        <AppBar
            position="fixed"
            className={isOpen ? classes.appBarShift : classes.appBar}
            color="primary"
        >
            <Toolbar variant="dense">
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={handleIconClick}
                    edge="start"
                    className={isOpen ? classes.hide : classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="subtitle1" noWrap>
                    Realm Editor
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default withStyles(styles)(TopBar);
