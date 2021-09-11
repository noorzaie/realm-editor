import React, { createRef } from 'react';
import { Typography } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import DatabaseItem from 'src/components/navigation/database/DatabaseItem';
import { DialogPropTypes, emptyFunctionType } from 'src/types/genericTypes';
import DB from 'src/lib/db/DB';
import { RootState } from 'src/store';
import { setDatabaseCollections, deleteDatabase, setCurrentDatabase, setCurrentCollection } from 'src/store/database';
import { addNotification } from 'src/store/notification';
import withDialog from 'src/providers/dialog/withDialog';
import { resetTable } from 'src/store/table';
import ExportTypeFormContainer from 'src/containers/ExportTypeFormContainer';
import { exportSchema } from 'src/lib/schema-exporter/exporter';

const mapState = (state: RootState) => ({ currentDatabase: state.database.currentDatabase });
const mapDispatch = {
    setDatabaseCollections,
    addNotification,
    deleteDatabase,
    resetTable,
    setCurrentDatabase,
    setCurrentCollection
};
const connector = connect(mapState, mapDispatch);

type ReduxPropTypes = ConnectedProps<typeof connector>;

interface PropTypes {
    databaseName: string;
    index: number;
    expanded: boolean;
    onChange: emptyFunctionType;
    onEditCollectionButtonClick: (databaseName: string, collectionName: string) => void;
}

interface StateTypes {
    showActions: boolean;
    loading: boolean;
}

class DatabaseItemContainer extends React.Component<PropTypes & ReduxPropTypes & DialogPropTypes, StateTypes> {
    state = {
        expanded: false,
        showActions: false,
        loading: false
    };

    private DBInstance = DB.getInstance();
    private exportTypeRef = createRef<ExportTypeFormContainer>();

    componentDidUpdate(prevProps: Readonly<PropTypes & ReduxPropTypes>) {
        const { expanded, databaseName, index, setDatabaseCollections } = this.props;

        if (!prevProps.expanded && expanded) {
            this.setState({ loading: true });
            this.DBInstance.open(databaseName);
            setDatabaseCollections(
                {
                    index: index,
                    collections: this.DBInstance.getCollections(databaseName)
                }
            );
            setTimeout(() => {
                this.setState({ loading: false });
            }, 500);
        }
    }

    private confirmDelete = (closeFN: emptyFunctionType) => {
        const { databaseName, index, currentDatabase, setCurrentCollection, setCurrentDatabase, resetTable, addNotification } = this.props;

        this.DBInstance.deleteDatabase(databaseName);
        deleteDatabase(index);
        // close table if current database is open
        if (currentDatabase === databaseName) {
            setCurrentCollection('');
            setCurrentDatabase('');
            resetTable();
        }
        addNotification({
            message: 'Database deleted successfully',
            variant: 'success'
        });
        closeFN();
    }

    private handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        const dialogContent = <Typography variant="body1" noWrap>
            Are you sure to delete database?
        </Typography>;
        this.props.showDialog(dialogContent, 'Delete Database', this.confirmDelete, undefined, undefined, 'sm');
    }

    private handleModalExportButtonClick = (closeFN: emptyFunctionType) => {
        if (this.exportTypeRef.current) {
            const outputType = this.exportTypeRef.current.getType();
            exportSchema(this.props.databaseName, '', outputType);
            closeFN();
        }
    }

    private handleExportClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        const dialogContent = <ExportTypeFormContainer
            ref={this.exportTypeRef}
            type="database"
        />;
        this.props.showDialog(
            dialogContent, 'Select export type', this.handleModalExportButtonClick, undefined, false, 'sm'
        );
    }

    private toggleActions = (show: boolean) => {
        this.setState({
            showActions: show
        });
    }

    render() {
        const { databaseName, index, expanded, onChange, onEditCollectionButtonClick } = this.props;
        const { showActions, loading } = this.state;

        return (
            <>
                <DatabaseItem
                    expanded={expanded}
                    loading={loading}
                    databaseName={databaseName}
                    index={index}
                    showActions={showActions}
                    onChange={onChange}
                    onDeleteClick={this.handleDeleteClick}
                    onExportClick={this.handleExportClick}
                    toggleActions={this.toggleActions}
                    onEditCollectionButtonClick={onEditCollectionButtonClick}
                />
            </>
        );
    }
}

export default connector(withDialog(DatabaseItemContainer));
