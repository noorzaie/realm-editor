import React from 'react';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import CodeIcon from '@material-ui/icons/Code';
import DatabaseItemContainer from 'src/containers/navigation/database/DatabaseItemContainer';
import { emptyFunctionType } from 'src/types/genericTypes';

interface PropTypes {
    databases: string[];
    expandedItem: string;
    onEditCollectionButtonClick: (databaseName: string, collectionName: string) => void;
    onItemChange: (index: number, databaseName: string) => void;
    onAddDatabaseButtonClick: emptyFunctionType;
    onOpenRealmFileClick: emptyFunctionType;
    onOpenSchemaButtonClick: emptyFunctionType;
}

class DatabaseList extends React.Component<PropTypes> {
    render() {
        const { databases, expandedItem, onEditCollectionButtonClick, onItemChange, onAddDatabaseButtonClick, onOpenRealmFileClick, onOpenSchemaButtonClick } = this.props;

        return <>
            {
                databases.map(
                    (databaseName, index) => {
                        return <DatabaseItemContainer
                            key={index}
                            databaseName={databaseName}
                            index={index}
                            expanded={expandedItem === `item-${databaseName}`}
                            onChange={() => onItemChange(index, databaseName)}
                            onEditCollectionButtonClick={onEditCollectionButtonClick}
                        />;
                    }
                )
            }
            <Box display="flex" justifyContent="space-around">
                <Tooltip title="Create Database">
                    <IconButton onClick={onAddDatabaseButtonClick}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Open .realm File">
                    <IconButton onClick={onOpenRealmFileClick}>
                        <GetAppIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Import Schema">
                    <IconButton onClick={onOpenSchemaButtonClick}>
                        <CodeIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </>;
    }
}

export default DatabaseList;
