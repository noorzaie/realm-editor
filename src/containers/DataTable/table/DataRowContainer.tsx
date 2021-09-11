import React, { createRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import DataRow from 'src/components/DataTable/table/DataRow';
import { DataRowType } from 'src/types/dbTypes';
import { RootState } from 'src/store';
import { setSelectedRows, updateDataKey } from 'src/store/table';
import { addNotification } from 'src/store/notification';
import withDialog from 'src/providers/dialog/withDialog';
import { DialogPropTypes, emptyFunctionType } from 'src/types/genericTypes';
import DataRowFormContainer, { DataRowFormContainer as DataRowFormContainerWithoutRedux } from 'src/containers/DataTable/tools/DataRowFormContainer';
import DB from 'src/lib/db/DB';

const mapState = (state: RootState) => ({
    columns: state.table.columns,
    editable: state.table.editable,
    mode: state.table.mode,
    selectedRows: state.table.selectedRows
});

const mapDispatch = {
    setSelectedRows,
    addNotification,
    updateDataKey
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface PropTypes {
    index: number;
    data: DataRowType;
    isItemSelected: boolean;
}

interface StateTypes {
    showActions: boolean;
}

class DataRowContainer extends React.Component<PropTypes & ReduxPropTypes & DialogPropTypes, StateTypes> {
    state = {
        showActions: false
    };

    private dataDialogRef = createRef<DataRowFormContainerWithoutRedux>();
    private DBInstance = DB.getInstance();

    handleEditButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const { data, index, showDialog } = this.props;

        event.stopPropagation();
        this.setState({
            showActions: false
        }, () => {
            const component = <DataRowFormContainer
                ref={this.dataDialogRef}
                data={{ ...(data.toJSON ? data.toJSON() : data) }}
                isForEdit={true}
            />;
            showDialog(component, `Edit row ${index + 1}`, this.handleEditRow);
        });
    };

    handleEditRow = (closeFN: emptyFunctionType) => {
        if (this.dataDialogRef.current !== null) {
            const { data, updateDataKey, addNotification } = this.props;

            try {
                this.DBInstance.updateRow(this.dataDialogRef.current.getData(), data, this.props.index);
                updateDataKey();
                addNotification({
                    message: 'Row edited successfully',
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

    handleToggleActions = (value: boolean) => {
        this.setState({
            showActions: value
        });
    };

    handleClick = () => {
        const { index, mode, selectedRows, setSelectedRows } = this.props;

        if (mode === 'unselectable') {
            return false;
        } else if (mode === 'select-single' && selectedRows.length > 0) {
            setSelectedRows([ index ]);
        } else {
            const indexOfRow = selectedRows.indexOf(index);
            if (indexOfRow === -1) {
                setSelectedRows([ ...selectedRows, index ]);
            } else {
                setSelectedRows([ ...selectedRows.slice(0, indexOfRow), ...selectedRows.slice(indexOfRow + 1) ]);
            }
        }
    }

    handleObjectCellClick = (field: string) => {
        this.DBInstance.setWorkingRow(this.props.data, field);
    }

    render() {
        const { editable, isItemSelected, columns, data } = this.props;
        const { showActions } = this.state;

        return <DataRow
            data={data}
            columns={columns}
            selected={isItemSelected}
            editable={editable}
            showActions={showActions}
            onEditButtonClick={this.handleEditButtonClick}
            onToggleActions={this.handleToggleActions}
            onRowClick={this.handleClick}
            onObjectCellClick={this.handleObjectCellClick}
        />;
    }
}

export default connector(withDialog(DataRowContainer));
