import React, { createRef } from 'react';
import { TextField } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import CollectionList from 'src/components/navigation/database/CollectionList';
import { RootState } from 'src/store';
import withDialog from 'src/providers/dialog/withDialog';
import { DialogPropTypes, emptyFunctionType } from 'src/types/genericTypes';
import { deepCopy } from 'src/utils/helperMethods';
import DB from 'src/lib/db/DB';
import { addCollection } from 'src/store/database';
import { addNotification } from 'src/store/notification';

const mapState = (state: RootState, props: PropTypes) => ({
    collections: state.database.databases[props.index].collections
});

const mapDispatch = {
    addCollection,
    addNotification
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface PropTypes {
    index: number;
    databaseName: string;
    onEditCollectionButtonClick: (databaseName: string, collectionName: string) => void;
}

class CollectionListContainer extends React.Component<PropTypes & ReduxPropTypes & DialogPropTypes> {
    private DBInstance = DB.getInstance();
    private newCollectionNameInputRef: React.RefObject<HTMLInputElement> = createRef();

    confirmNewCollection = (closeFN: emptyFunctionType) => {
        if (this.newCollectionNameInputRef.current) {
            const { databaseName, index, addNotification, addCollection } = this.props;

            const newCollectionName = this.newCollectionNameInputRef.current.value;
            const schema = deepCopy(this.DBInstance.getDatabaseSchema(databaseName));
            schema.push(
                {
                    name: newCollectionName,
                    properties: {}
                }
            );
            try {
                this.DBInstance.updateSchema(databaseName, newCollectionName, newCollectionName, schema);
                addCollection({ index: index, databaseName: databaseName, collectionName: newCollectionName });
                addNotification({
                    message: 'Collection created successfully',
                    variant: 'success'
                });
                closeFN();
            } catch (e) {
                addNotification({
                    message: e.message,
                    variant: 'error'
                });
            }
        }
    }

    handleCloseNewCollectionDialog = () => {
        this.setState({
            newCollectionName: ''
        });
    }

    private handleAddCollectionButtonClick = () => {
        const dialogContent = <TextField
            margin="dense"
            id="collection-name-input"
            label="Collection Name"
            type="text"
            inputRef={this.newCollectionNameInputRef}
            fullWidth
        />;
        this.props.showDialog(dialogContent, 'Create new collection', this.confirmNewCollection, this.handleCloseNewCollectionDialog, false, 'sm');
    }

    render() {
        const { index, collections, databaseName, onEditCollectionButtonClick } = this.props;

        return <CollectionList
            databaseIndex={index}
            collections={collections}
            databaseName={databaseName}
            onAddCollectionButtonClick={this.handleAddCollectionButtonClick}
            onEditCollectionButtonClick={onEditCollectionButtonClick}
        />;
    }
}

export default connector(withDialog(CollectionListContainer));
