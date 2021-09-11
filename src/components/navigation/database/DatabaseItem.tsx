import React from 'react';
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getShortText } from 'src/utils/helperMethods';
import CollectionListContainer from 'src/containers/navigation/database/CollectionListContainer';
import { emptyFunctionType } from 'src/types/genericTypes';
import MuiAccordion from '@material-ui/core/Accordion';
import 'src/styles/expansionPanel.css';
import 'src/styles/databaseItem.css';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';

interface PropTypes {
    expanded: boolean;
    loading: boolean;
    databaseName: string;
    index: number;
    showActions: boolean;
    onChange: emptyFunctionType;
    onDeleteClick: (event: React.MouseEvent) => void;
    onExportClick: (event: React.MouseEvent) => void;
    toggleActions: (show: boolean) => void;
    onEditCollectionButtonClick: (databaseName: string, collectionName: string) => void;
}

const DatabaseItem: React.FC<PropTypes> = ({ loading, expanded, databaseName, index, showActions, onChange, onDeleteClick, onExportClick, toggleActions, onEditCollectionButtonClick }) => {
    return (
        <MuiAccordion
            expanded={expanded}
            onChange={onChange}
            square
        >
            <MuiAccordionSummary
                className="itemTitle"
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`"panel${index}d-content"`}
                id={`panel${index}d-header`}
                onMouseEnter={() => toggleActions(true)}
                onMouseLeave={() => toggleActions(false)}
            >
                <Tooltip
                    title={databaseName}
                    placement="top"
                >
                    <div
                        className="itemText"
                    >
                        {getShortText(databaseName, 17)}
                    </div>
                </Tooltip>

                <IconButton
                    style={{ visibility: showActions ? 'visible' : 'hidden' }}
                    edge="end"
                    aria-label="delete"
                    size="small"
                    onClick={onDeleteClick}
                >
                    <DeleteIcon
                        fontSize="small"
                        color="error"
                    />
                </IconButton>

                <Tooltip title="export schema">
                    <IconButton
                        style={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={onExportClick}
                        size="small"
                    >
                        <PublishIcon />
                    </IconButton>
                </Tooltip>

                {
                    loading && <CircularProgress
                        size={20}
                    />
                }
            </MuiAccordionSummary>

            <MuiAccordionDetails className="details">
                <CollectionListContainer
                    index={ index }
                    databaseName={databaseName}
                    onEditCollectionButtonClick={onEditCollectionButtonClick}
                />
            </MuiAccordionDetails>
        </MuiAccordion>
    );
};

export default DatabaseItem;
