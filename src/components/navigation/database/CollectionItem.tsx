import React from 'react';
import PublishIcon from '@material-ui/icons/Publish';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {
    Box,
    Button,
    IconButton,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Popover,
    Tooltip
} from '@material-ui/core';
import { getShortText } from 'src/utils/helperMethods';
import { emptyFunctionType, ExportTypes } from 'src/types/genericTypes';
import 'src/styles/collectionItem.css';

export interface PropTypes {
    collectionName: string;
    showActions: boolean;
    isPopoverOpen: boolean;
    anchorEl: HTMLButtonElement | null;
    selected: boolean;
    onClick: emptyFunctionType;
    onToggleActions: (show: boolean) => void;
    onExportClick: (event: React.MouseEvent) => void;
    onPopoverClose: emptyFunctionType;
    onExport: (event: React.MouseEvent, type: ExportTypes) => void;
    onDeleteClick: emptyFunctionType;
    onEditClick: emptyFunctionType;
}

const CollectionItem: React.FC<PropTypes> = ({ collectionName, showActions, isPopoverOpen, anchorEl, selected, onClick, onToggleActions, onExportClick, onPopoverClose, onExport, onDeleteClick, onEditClick }) => {
    return (
        <ListItem
            onClick={onClick}
            onMouseEnter={() => onToggleActions(true)}
            onMouseLeave={() => onToggleActions(false)}
            selected={selected}
            button
            dense
        >
            <Tooltip
                title={collectionName}
                placement="top"
            >
                <ListItemText primary={getShortText(collectionName, 20)} />
            </Tooltip>

            <ListItemSecondaryAction
                className={`${showActions ? 'show' : 'hide'}`}
                onMouseEnter={() => onToggleActions(true)}
                onMouseLeave={() => onToggleActions(false)}
            >
                <Tooltip title="export">
                    <IconButton
                        onClick={onExportClick}
                        size="small"
                    >
                        <PublishIcon />
                    </IconButton>
                </Tooltip>

                <Popover
                    open={isPopoverOpen && showActions}
                    anchorEl={anchorEl}
                    onClose={onPopoverClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Box p={1} onClick={event => onExport(event, 'data')}>
                        <Button>Export data</Button>
                    </Box>
                    <Box p={1} onClick={event => onExport(event, 'schema')}>
                        <Button>Export schema</Button >
                    </Box>
                </Popover>

                <IconButton
                    size="small"
                    edge="end"
                    aria-label="delete"
                    onClick={event => { event.stopPropagation(); onDeleteClick(); }}
                >
                    <DeleteIcon
                        fontSize="small"
                        color="error"
                    />
                </IconButton>

                <IconButton
                    size="small"
                    edge="end"
                    aria-label="edit"
                    onClick={event => { event.stopPropagation(); onEditClick(); }}
                >
                    <EditIcon
                        fontSize="small"
                        color="primary"
                    />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default CollectionItem;
