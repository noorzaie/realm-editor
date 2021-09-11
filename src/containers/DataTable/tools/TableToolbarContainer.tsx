import React, { createRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import TableToolbar from 'src/components/DataTable/tools/TableToolbar';
import { RootState } from 'src/store';
import { DialogPropTypes, emptyFunctionType } from 'src/types/genericTypes';
import withDialog from 'src/providers/dialog/withDialog';
import DataRowFormContainer, { DataRowFormContainer as DataRowFormContainerWithoutRedux } from './DataRowFormContainer';
import DB from 'src/lib/db/DB';
import { updateDataKey, resetTable, popBreadCrumbItem, setMode, pushBreadCrumbItem, setFilter, setOrder, setOrderBy, setPage, setLoading, setRowsPerPage } from 'src/store/table';
import { addNotification } from 'src/store/notification';

const mapState = (state: RootState) => ({
    mode: state.table.mode,
    selectedRows: state.table.selectedRows,
    currentCollection: state.database.currentCollection,
    breadCrumbItems: state.table.breadCrumbItems
});

const mapDispatch = {
    updateDataKey,
    addNotification,
    resetTable,
    setMode,
    setOrder,
    setOrderBy,
    setPage,
    setLoading,
    setRowsPerPage,
    popBreadCrumbItem,
    pushBreadCrumbItem,
    setFilter
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface PropTypes {
    onDeleteButtonClick: emptyFunctionType;
    onAddRelationRowsButtonClick: emptyFunctionType;
    onExportButtonClick: emptyFunctionType;
}

class TableToolbarContainer extends React.Component<PropTypes & ReduxPropTypes & DialogPropTypes> {
    private dataDialogRef = createRef<DataRowFormContainerWithoutRedux>();
    private DBInstance = DB.getInstance();

    handleBreadcrumbClick = (event: React.MouseEvent, index: number) => {
        event.preventDefault();
        const { setLoading, setFilter, setOrder, setOrderBy, setPage, setRowsPerPage, setMode, popBreadCrumbItem, updateDataKey } = this.props;
        const { order, orderBy, page, rowsPerPage, mode } = this.DBInstance.popRelationHistory(this.props.breadCrumbItems.length - index - 1);
        setLoading(true);
        setOrder(order || 'desc');
        setOrderBy(orderBy || '');
        setPage(page);
        setMode(mode);
        setRowsPerPage(rowsPerPage);
        popBreadCrumbItem(index);
        setFilter('');
        updateDataKey();
    };

    handleCreateRow = (closeFN: emptyFunctionType) => {
        if (this.dataDialogRef.current !== null) {
            const { updateDataKey, addNotification } = this.props;

            try {
                this.DBInstance.createRow(this.dataDialogRef.current.getData());
                updateDataKey();
                addNotification({
                    message: 'Row created successfully',
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

    handleAddRowButtonClick = () => {
        const { mode, setMode, currentCollection, updateDataKey, pushBreadCrumbItem } = this.props;
        const newMode = mode === 'add-list' ? 'select-list' : 'select-single';
        this.DBInstance.init('list', currentCollection, null, true, newMode);
        pushBreadCrumbItem(currentCollection);
        setMode(newMode);
        updateDataKey();
    };

    handleCreateRowButtonClick = () => {
        const component = <DataRowFormContainer
            ref={this.dataDialogRef}
            data={{}}
            isForEdit={false}
        />;
        this.props.showDialog(component, 'Create new record', this.handleCreateRow);
    }

    render() {
        const { mode, selectedRows, breadCrumbItems, onDeleteButtonClick, onAddRelationRowsButtonClick, onExportButtonClick } = this.props;
        const numSelected = selectedRows.length;

        let icon: React.ReactNode = null;
        let tooltip = '';
        let clickHandler: emptyFunctionType | undefined;
        if (mode === 'create' || mode === 'add-list' || mode === 'add-single') {
            if (numSelected === 0) {
                icon = <PlusIcon />;
                tooltip = mode === 'create' ? 'Create new item' : 'Add Item(s)';
                clickHandler = mode === 'create' ? this.handleCreateRowButtonClick : this.handleAddRowButtonClick;
            } else {
                icon = <DeleteIcon />;
                tooltip = `Delete Selected Item${numSelected > 1 ? 's' : ''}`;
                clickHandler = onDeleteButtonClick;
            }
        } else if (mode === 'select-list' || mode === 'select-single') {
            if (numSelected > 0) {
                icon = <CheckIcon />;
                tooltip = `Add Selected Row${numSelected > 1 ? 's' : ''}`;
                clickHandler = onAddRelationRowsButtonClick;
            }
        }

        return <TableToolbar
            numSelected={numSelected}
            breadCrumbItems={breadCrumbItems}
            onBreadcrumbClick={this.handleBreadcrumbClick}
            icon={icon}
            tooltip={tooltip}
            clickHandler={clickHandler}
            onExportButtonClick={onExportButtonClick}
        />;
    }
}

export default withDialog(connector(TableToolbarContainer));
