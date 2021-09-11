import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tooltip from '@material-ui/core/Tooltip';
import PublishIcon from '@material-ui/icons/Publish';
import { emptyFunctionType } from 'src/types/genericTypes';
import { lighten, Theme, WithStyles, withStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => (
    {
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1)
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85)
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark
                },
        spacer: {
            flex: '1 1 100%'
        },
        actions: {
            color: theme.palette.text.secondary,
            display: 'flex'
        },
        title: {
            flex: '0 0 auto'
        }
    }
);

interface PropTypes {
    classes: {root: string, highlight: string, spacer: string, actions: string, title: string};
    numSelected: number;
    breadCrumbItems: string[];
    icon: React.ReactNode;
    tooltip: string;
    clickHandler: emptyFunctionType | undefined;
    onBreadcrumbClick: (event: React.MouseEvent, item: number) => void;
    onExportButtonClick: emptyFunctionType;
}

const TableToolbar: React.FC<PropTypes & WithStyles<typeof styles>> = props => {
    const { classes, breadCrumbItems, numSelected, icon, tooltip, clickHandler, onExportButtonClick, onBreadcrumbClick } = props;

    return (
        <Toolbar
            className={`${classes.root} ${numSelected > 0 ? classes.highlight : ''}`}
        >
            <div className={classes.title}>
                {
                    numSelected > 0
                        ? (
                            <Typography color="inherit" variant="subtitle1">
                                {numSelected} selected
                            </Typography>
                        )
                        : (
                            <Breadcrumbs
                                separator={<NavigateNextIcon fontSize="small" />}
                                aria-label="breadcrumb"
                            >
                                {
                                    breadCrumbItems.map((collectionName, index) => {
                                        return index === breadCrumbItems.length - 1
                                            ? <Typography
                                                key={index}
                                                color="textPrimary"
                                            >{collectionName}</Typography>
                                            : <Link
                                                color="inherit"
                                                href="#"
                                                key={index}
                                                onClick={(event: React.MouseEvent) => onBreadcrumbClick(event, index)}
                                            >
                                                {collectionName}
                                            </Link>;
                                    })
                                }
                            </Breadcrumbs>
                        )
                }
            </div>

            <div className={classes.spacer} />

            <div className={classes.actions}>
                <Tooltip title="export results">
                    <IconButton
                        onClick={onExportButtonClick}
                        size="small"
                    >
                        <PublishIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title={tooltip}>
                    <IconButton
                        onClick={clickHandler}
                        size="small"
                    >
                        { icon }
                    </IconButton>
                </Tooltip>
            </div>
        </Toolbar>
    );
};

export default withStyles(styles)(TableToolbar);
