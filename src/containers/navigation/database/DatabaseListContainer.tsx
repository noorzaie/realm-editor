import React, { createRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { basename } from 'path';
import DatabaseList from 'src/components/navigation/database/DatabaseList';
import fs from 'fs';
import { remote } from 'electron';
import { TextField } from '@material-ui/core';
import Realm from 'realm';
import { RootState } from 'src/store';
import withDialog from 'src/providers/dialog/withDialog';
import { DialogPropTypes, emptyFunctionType } from 'src/types/genericTypes';
import { DatabasesSchemas } from 'src/types/dbTypes';
import SchemaFormContainer from 'src/containers/SchemaFormContainer';
import DB from 'src/lib/db/DB';
import { deepCopy } from 'src/utils/helperMethods';
import { setDatabaseCollections, addDatabase, setCurrentCollection, setCurrentDatabase } from 'src/store/database';
import { addNotification } from 'src/store/notification';
import { resetTable } from 'src/store/table';
import { DATA_PATH } from 'src/utils/constants';

const dialog = remote.dialog;

const mapState = (state: RootState) => ({
    databases: state.database.databases.map(({ database }) => database)
});

const mapDispatch = {
    setCurrentDatabase,
    setCurrentCollection,
    addNotification,
    resetTable,
    setDatabaseCollections,
    addDatabase
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface StateTypes {
    databases: DatabasesSchemas;
    expandedItem: string;
    newDatabaseName: string;
}

class DatabaseListContainer extends React.Component<ReduxPropTypes & DialogPropTypes, StateTypes> {
    state = {
        databases: {} as DatabasesSchemas,
        expandedItem: '',
        newDatabaseName: ''
    }

    private DBInstance = DB.getInstance();
    private schemaFormRef = React.createRef<SchemaFormContainer>();
    private newDatabaseNameInputRef: React.RefObject<HTMLInputElement> = createRef();

    closeDatabase = (shouldDelete: boolean) => {
        alert(shouldDelete);
    }

    handleSchemaSubmit = (databaseName: string, collectionName: string, closeFN: emptyFunctionType) => {
        if (this.schemaFormRef.current !== null) {
            const { databases, setCurrentCollection, setCurrentDatabase, resetTable, setDatabaseCollections, addNotification } = this.props;

            setCurrentCollection('');
            setCurrentDatabase('');
            resetTable();

            const { schema: updatedSchema, renamedColumns } = this.schemaFormRef.current.getSchema();
            const tempSchema = deepCopy(this.state.databases[databaseName]);
            tempSchema.forEach((schema, index) => {
                if (schema.name === collectionName) {
                    tempSchema[index] = updatedSchema;
                }
            });
            try {
                this.DBInstance.updateSchema(databaseName, collectionName, updatedSchema.name, tempSchema, renamedColumns);

                // if a collectionName is renamed, we should refresh collection names
                setDatabaseCollections(
                    {
                        index: databases.indexOf(databaseName),
                        collections: this.DBInstance.getCollections(databaseName)
                    }
                );

                closeFN();
                addNotification({
                    message: 'Schema edited successfully',
                    variant: 'success'
                });
                this.setState(prevState => {
                    return {
                        databases: {
                            ...prevState.databases,
                            [databaseName]: tempSchema
                        }
                    };
                });
            } catch (e) {
                addNotification({
                    message: e.message,
                    variant: 'error'
                });
            }
        }
    }

    private openEditDialog = (databaseName: string, collectionName: string) => {
        let editingSchema: Realm.ObjectSchema | undefined;
        const otherSchemas: Realm.ObjectSchema[] = [];
        this.state.databases[databaseName].map(schema => {
            if (schema.name === collectionName) {
                editingSchema = schema;
            } else {
                otherSchemas.push(schema);
            }
        });
        const dialogContent = <SchemaFormContainer
            schema={editingSchema as Realm.ObjectSchema}
            otherSchemas={otherSchemas}
            ref={this.schemaFormRef}
        />;
        this.props.showDialog(dialogContent, 'Editing schema', (closeFN) => this.handleSchemaSubmit(databaseName, collectionName, closeFN), undefined, undefined, 'xl');
    }

    handleEditCollectionButtonClick = (databaseName: string, collectionName: string) => {
        if (!this.state.databases[databaseName]) {
            this.setState({
                databases: {
                    ...this.state.databases,
                    [databaseName]: this.DBInstance.getDatabaseSchema(databaseName)
                }
            }, () => this.openEditDialog(databaseName, collectionName));
        } else {
            this.openEditDialog(databaseName, collectionName);
        }
    }

    handleItemChange = (index: number, databaseName: string): void => {
        this.setState((prevState) => (
            {
                expandedItem: `item-${databaseName}` === prevState.expandedItem ? '' : `item-${databaseName}`
            }
        ));
    }

    handleAddDatabaseButtonClick = () => {
        const dialogContent = <TextField
            margin="dense"
            id="database-name-input"
            label="Database Name"
            type="text"
            inputRef={this.newDatabaseNameInputRef}
            fullWidth
        />;
        this.props.showDialog(dialogContent, 'Create new database', this.confirmNewDatabase, this.handleCloseNewDatabaseDialog, false, 'sm');
    }

    handleCloseNewDatabaseDialog = () => {
        this.setState({
            newDatabaseName: ''
        });
    }

    confirmNewDatabase = (closeFN: emptyFunctionType) => {
        if (this.newDatabaseNameInputRef.current) {
            const { addNotification, addDatabase } = this.props;

            this.DBInstance.createDatabase(`${this.newDatabaseNameInputRef.current.value}.realm`);
            addDatabase(`${this.newDatabaseNameInputRef.current.value}.realm`);
            addNotification({
                message: 'Database created successfully',
                variant: 'success'
            });
            closeFN();
        }
    }

    handleOpenRealmFileClick = () => {
        const path = dialog.showOpenDialogSync({ properties: [ 'openFile' ], filters: [ { name: 'Realm', extensions: [ 'realm' ] } ] });
        if (path) {
            const { addNotification, addDatabase } = this.props;

            const fileName = basename(path[0]);
            const destPath = `${DATA_PATH}/${fileName}`;
            if (fs.existsSync(destPath)) {
                addNotification({
                    message: 'Database already exists!',
                    variant: 'warning'
                });
            } else {
                fs.copyFile(path[0], destPath, () => {
                    addDatabase(fileName);
                    addNotification({
                        message: 'Database added successfully!',
                        variant: 'success'
                    });
                });
            }
        }
    }

    private handleOpenSchemaButtonClick = () => {
        const path = dialog.showOpenDialogSync({ properties: [ 'openFile' ], filters: [ { name: 'JSON', extensions: [ 'json' ] } ] });
        if (path) {
            const { addNotification, addDatabase } = this.props;

            const fileName = basename(`${path[0].replace(/\\.[^/.]+$/, '')}.realm`);
            const destPath = `${DATA_PATH}/${fileName}`;
            if (fs.existsSync(destPath)) {
                addNotification({
                    message: 'Database already exists!',
                    variant: 'warning'
                });
            } else {
                fs.readFile(path[0], 'utf8', (err, data) => {
                    if (err) {
                        addNotification({
                            message: err.message,
                            variant: 'error'
                        });
                    } else {
                        const schema = JSON.parse(data);
                        DB.getInstance().createDatabase(fileName, schema);
                        addDatabase(fileName);
                        addNotification({
                            message: 'Database added successfully!',
                            variant: 'success'
                        });
                    }
                });
            }
        }
    }

    render() {
        const { databases } = this.props;
        const { expandedItem } = this.state;

        return <DatabaseList
            databases={databases}
            expandedItem={expandedItem}
            onEditCollectionButtonClick={this.handleEditCollectionButtonClick}
            onItemChange={this.handleItemChange}
            onAddDatabaseButtonClick={this.handleAddDatabaseButtonClick}
            onOpenRealmFileClick={this.handleOpenRealmFileClick}
            onOpenSchemaButtonClick={this.handleOpenSchemaButtonClick}
        />;
    }
}

export default withDialog(connector(DatabaseListContainer));
