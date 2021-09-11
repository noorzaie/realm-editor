import React, { createRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Typography } from '@material-ui/core';
import CollectionItem from 'src/components/navigation/database/CollectionItem';
import DB from 'src/lib/db/DB';
import { RootState } from 'src/store';
import { setDatabaseCollections, setCurrentCollection, setCurrentDatabase } from 'src/store/database';
import { resetTable, setBreadCrumbItems } from 'src/store/table';
import withDialog from 'src/providers/dialog/withDialog';
import { DialogPropTypes, emptyFunctionType, ExportTypes } from 'src/types/genericTypes';
import { addNotification } from 'src/store/notification';
import { exportCollection, exportSchema } from 'src/lib/schema-exporter/exporter';
import ExportTypeFormContainer from 'src/containers/ExportTypeFormContainer';

const mapState = (state: RootState) => ({
    currentDatabase: state.database.currentDatabase,
    breadCrumbItems: state.table.breadCrumbItems
});

const mapDispatch = {
    setDatabaseCollections,
    setCurrentCollection,
    setCurrentDatabase,
    resetTable,
    setBreadCrumbItems,
    addNotification
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface PropTypes {
    index: number;
    databaseIndex: number;
    collectionName: string;
    databaseName: string;
    onEditCollectionButtonClick: (databaseName: string, collectionName: string) => void;
}

interface StateTypes {
    showActions: boolean;
    isPopoverOpen: boolean;
    anchorEl: HTMLButtonElement | null
}

class CollectionItemContainer extends React.Component<PropTypes & ReduxPropTypes & DialogPropTypes, StateTypes> {
    state = {
        showActions: false,
        isPopoverOpen: false,
        anchorEl: null
    }

    private DBInstance = DB.getInstance();
    private exportTypeRef = createRef<ExportTypeFormContainer>();

    private handleClick = () => {
        const { databaseName, collectionName, setCurrentCollection, setCurrentDatabase, resetTable, setBreadCrumbItems } = this.props;

        this.DBInstance.init('list', collectionName);
        setCurrentCollection(collectionName);
        setCurrentDatabase(databaseName);
        resetTable();
        setBreadCrumbItems([ collectionName ]);
    }

    private toggleActions = (show: boolean) => {
        this.setState({
            showActions: show
        });
    }

    private handleExportClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        this.setState({
            isPopoverOpen: !this.state.isPopoverOpen,
            anchorEl: event.currentTarget as HTMLButtonElement
        });
    }

    private handlePopoverClose = () => {
        this.setState({
            isPopoverOpen: false,
            showActions: false,
            anchorEl: null
        });
    }

    handleModalExportButtonClick = (type: ExportTypes, closeFN: emptyFunctionType) => {
        if (this.exportTypeRef.current) {
            const { databaseName, collectionName } = this.props;

            const outputType = this.exportTypeRef.current.getType();
            if (type === 'data') {
                exportCollection(databaseName, collectionName, outputType);
            } else {
                exportSchema(databaseName, collectionName, outputType);
            }
            closeFN();
        }
    }

    private handleExport = (event: React.MouseEvent, type: ExportTypes) => {
        event.stopPropagation();
        this.handlePopoverClose();
        const dialogContent = <ExportTypeFormContainer
            ref={this.exportTypeRef}
            type={type}
        />;
        this.props.showDialog(
            dialogContent, 'Select export type', (closeFN: emptyFunctionType) => this.handleModalExportButtonClick(type, closeFN), undefined, false, 'sm'
        );
    }

    private confirmDelete = (closeFN: emptyFunctionType) => {
        const { databaseName, collectionName, databaseIndex, addNotification } = this.props;

        this.DBInstance.deleteCollection(databaseName, collectionName);
        this.props.setDatabaseCollections(
            {
                index: databaseIndex,
                collections: this.DBInstance.getCollections(databaseName)
            }
        );
        addNotification({
            message: 'Collection deleted successfully',
            variant: 'success'
        });
        closeFN();
    }

    private handleDelete = () => {
        const dialogContent = <Typography variant="body1" noWrap>
            Are you sure to delete collection?
        </Typography>;
        this.props.showDialog(dialogContent, 'Delete Collection', this.confirmDelete, undefined, undefined, 'sm');
    }

    private handleEdit = () => {
        const { databaseName, collectionName, onEditCollectionButtonClick } = this.props;

        onEditCollectionButtonClick(databaseName, collectionName); // this is handled in DatabaseListContainer
    }

    render() {
        const { databaseName, collectionName, currentDatabase, breadCrumbItems } = this.props;
        const { showActions, isPopoverOpen, anchorEl } = this.state;

        return <CollectionItem
            collectionName={collectionName}
            showActions={showActions}
            isPopoverOpen={isPopoverOpen}
            anchorEl={anchorEl}
            selected={databaseName === currentDatabase && collectionName === breadCrumbItems[0]}
            onClick={this.handleClick}
            onToggleActions={this.toggleActions}
            onExportClick={this.handleExportClick}
            onPopoverClose={this.handlePopoverClose}
            onExport={this.handleExport}
            onDeleteClick={this.handleDelete}
            onEditClick={this.handleEdit}
        />;
    }
}

export default withDialog(connector(CollectionItemContainer));
