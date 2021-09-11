import React from 'react';
import { Box, Button, List } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CollectionItemContainer from 'src/containers/navigation/database/CollectionItemContainer';
import AddButtonContainer from 'src/containers/navigation/AddButtonContainer';
import { emptyFunctionType } from 'src/types/genericTypes';
import 'src/styles/collectionList.css';

export interface PropTypes {
    databaseIndex: number;
    collections: string[];
    databaseName: string;
    onAddCollectionButtonClick: emptyFunctionType;
    onEditCollectionButtonClick: (databaseName: string, collectionName: string) => void;
}

const CollectionList: React.FC<PropTypes> = props => {
    const { databaseIndex, collections, databaseName, onAddCollectionButtonClick, onEditCollectionButtonClick } = props;

    return (
        <List className="collectionsList">
            {
                collections.map(
                    (collectionName, index) => (
                        <CollectionItemContainer
                            key={index}
                            index={index}
                            databaseIndex={databaseIndex}
                            collectionName={collectionName}
                            databaseName={databaseName}
                            onEditCollectionButtonClick={onEditCollectionButtonClick}
                        />
                    )
                )
            }
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
            >
                <Button
                    variant="contained"
                    color="default"
                    onClick={onAddCollectionButtonClick}
                    startIcon={<AddIcon />}
                >
                    New Collection
                </Button>
            </Box>
        </List>
    );
};

export default CollectionList;
