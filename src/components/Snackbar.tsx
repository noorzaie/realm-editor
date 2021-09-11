import React from 'react';
import { Snackbar, Theme, WithStyles, withStyles } from '@material-ui/core';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import { Notification, SnackbarVariationType } from 'src/types/notificationTypes';
import { amber, green } from '@material-ui/core/colors';

const styles = (theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column' as const,
        position: 'fixed' as const,
        left: 20,
        bottom: 0,
        zIndex: 10000
    },
    snackbar: {
        position: 'relative' as const,
        marginTop: 10
    },
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.main
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
});

const variantsIcon: { [key in SnackbarVariationType]: React.JSXElementConstructor<any> } = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
};

interface PropTypes {
    classes: {root: string; snackbar: string; success: string, error: string, info: string, warning: string, icon: string, iconVariant: string, message: string},
    notifications: Notification[];
    onClose: (index: number) => void;
}

const SnackbarComponent: React.FC<PropTypes & WithStyles<typeof styles>> = ({ classes, notifications, onClose }) => {
    return <div className={classes.root}>
        {
            notifications.map(({ id, variant, message, duration }, index) => {
                const Icon = variantsIcon[variant];

                return <Snackbar
                    className={classes.snackbar}
                    key={id}
                    open={true}
                    autoHideDuration={duration || 5000}
                    onClose={() => onClose(id as number)}
                >
                    <SnackbarContent
                        className={classes[variant]}
                        message={
                            <span className={classes.message}>
                                <Icon className={`${classes.icon} ${classes.iconVariant}`}/>
                                {message}
                            </span>
                        }
                        action={[
                            <IconButton
                                key="close"
                                aria-label="close"
                                color="inherit"
                                onClick={() => onClose(id as number)}
                            >
                                <CloseIcon className={classes.icon}/>
                            </IconButton>
                        ]}
                    />
                </Snackbar>;
            })
        }
    </div>;
};

export default withStyles(styles)(SnackbarComponent);
