import React, { createRef } from 'react';
import Realm from 'realm';
import { Typography } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import DataTable from 'src/components/DataTable/table/DataTable';
import DB from 'src/lib/db/DB';
import { DataRowsType, RowsPerPgeType } from 'src/types/dbTypes';
import { RootState } from 'src/store';
import {
    setColumns,
    setPage,
    setRowsPerPage,
    setSelectedRows,
    setPrimaryKey,
    updateDataKey,
    setMode,
    setOrder,
    setOrderBy,
    setLoading,
    popBreadCrumbItem
} from 'src/store/table';
import { addNotification } from 'src/store/notification';
import withDialog from 'src/providers/dialog/withDialog';
import { DialogPropTypes, emptyFunctionType } from 'src/types/genericTypes';
import FilterContainer from 'src/containers/DataTable/filter/FilterContainer';
import { exportCollection } from 'src/lib/schema-exporter/exporter';
import ExportTypeFormContainer from 'src/containers/ExportTypeFormContainer';

const mapState = (state: RootState) => ({
    currentCollection: state.database.currentCollection,
    currentDatabase: state.database.currentDatabase,
    page: state.table.page,
    rowsPerPage: state.table.rowsPerPage,
    order: state.table.order,
    orderBy: state.table.orderBy,
    selectedRows: state.table.selectedRows,
    dataUpdateKey: state.table.dataUpdateKey,
    mode: state.table.mode,
    filter: state.table.filter,
    breadCrumbItems: state.table.breadCrumbItems,
    loading: state.table.loading
});

const mapDispatch = {
    setColumns,
    setSelectedRows,
    setPage,
    setRowsPerPage,
    setPrimaryKey,
    updateDataKey,
    addNotification,
    setMode,
    setOrder,
    setOrderBy,
    setLoading,
    popBreadCrumbItem
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface StateTypes {
    rows: DataRowsType;
    rowsCount: number;
    primaryKey: string;
    tableKey: number;
}

class DataTableContainer extends React.Component<ReduxPropTypes & DialogPropTypes, StateTypes> {
    private DBInstance = DB.getInstance();
    private exportTypeRef = createRef<ExportTypeFormContainer>();

    state = {
        rows: [],
        rowsCount: 0,
        primaryKey: '',
        tableKey: Math.random()
    };

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps: Readonly<ReduxPropTypes>, prevState: StateTypes) {
        const { currentDatabase, currentCollection, order, page, rowsPerPage, orderBy, dataUpdateKey } = this.props;

        if (prevProps.currentDatabase !== currentDatabase || prevProps.currentCollection !== currentCollection || prevProps.page !== page || prevProps.rowsPerPage !== rowsPerPage || prevProps.order !== order || prevProps.orderBy !== orderBy || prevProps.dataUpdateKey !== dataUpdateKey) {
            try {
                this.getData();
            } catch (e) {
                addNotification({
                    message: e.message,
                    variant: 'error'
                });
                setLoading(false);
            }
        }
    }

    getColumns = () => {
        const columns = this.DBInstance.getColumns();
        this.props.setColumns(columns);
    }

    getData = () => {
        const { setLoading } = this.props;

        setLoading(true);
        const { currentCollection, page, rowsPerPage, order, orderBy, filter, setSelectedRows, setPrimaryKey } = this.props;
        const rows = this.DBInstance.getData(currentCollection, filter, page, rowsPerPage, orderBy, order);
        const rowsCount = this.DBInstance.getResultsCount();

        this.setState({
            rows,
            rowsCount,
            tableKey: Math.random()
        });
        setSelectedRows([]);
        setPrimaryKey(this.DBInstance.getPrimaryKey(currentCollection));
        this.getColumns();
        setLoading(false);
    }

    handleRequestSort = (property: string) => {
        alert('sort');
    }

    handleSelectAllClick = () => {
        alert('select all');
    }

    handlePageChange = (event: unknown, newPage: number) => {
        this.props.setPage(newPage);
    };

    handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { setPage, setRowsPerPage } = this.props;

        setRowsPerPage(+event.target.value as RowsPerPgeType);
        setPage(0);
    };

    handleDeleteRows = (closeFN: emptyFunctionType) => {
        const { mode, selectedRows, updateDataKey, addNotification } = this.props;

        DB.getInstance().deleteRows([ ...selectedRows ], [ 'add-list', 'add-single' ].includes(mode));
        updateDataKey();
        addNotification({
            message: 'Rows deleted successfully',
            variant: 'success'
        });
        closeFN();
    }

    handleDeleteRowsButtonCLick = () => {
        this.props.showDialog(
            <Typography variant="body1" noWrap>Are you sure to delete selected rows?</Typography>,
            'Delete rows',
            this.handleDeleteRows,
            undefined,
            false,
            'sm'
        );
    }

    handleAddRelationRowsButtonClick = () => {
        const { selectedRows, setLoading } = this.props;

        setLoading(true);
        this.DBInstance.addRelationRow(this.state.rows.filter((_, index) => selectedRows.includes(index)));
        const { breadCrumbItems, setOrder, setOrderBy, setPage, setRowsPerPage, setMode, popBreadCrumbItem, updateDataKey } = this.props;
        const { order, orderBy, page, rowsPerPage, mode } = this.DBInstance.popRelationHistory(breadCrumbItems.length - 2);
        setOrder(order || 'desc');
        setOrderBy(orderBy || '');
        setPage(page);
        setMode(mode);
        setRowsPerPage(rowsPerPage);
        popBreadCrumbItem(breadCrumbItems.length - 2);
        updateDataKey();
    }

    handleFilterButtonClick = () => {
        try {
            this.getData();
        } catch (e) {
            const { addNotification, setLoading } = this.props;
            addNotification({
                message: e.message,
                variant: 'error'
            });
            setLoading(false);
        }
    }

    handleModalExportButtonClick = (closeFN: emptyFunctionType) => {
        if (this.exportTypeRef.current) {
            const { currentDatabase, currentCollection } = this.props;

            const type = this.exportTypeRef.current.getType();
            exportCollection(currentDatabase, currentCollection, type, this.state.rows as unknown as Realm.Results<Realm.Object>);
            closeFN();
        }
    }

    handleExportButtonClick = () => {
        const dialogContent = <ExportTypeFormContainer
            ref={this.exportTypeRef}
            type="data"
        />;
        this.props.showDialog(
            dialogContent, 'Select export type', this.handleModalExportButtonClick, undefined, false, 'sm'
        );
    }

    render() {
        const { loading, breadCrumbItems, selectedRows, rowsPerPage, page } = this.props;
        const { rows, rowsCount, tableKey } = this.state;

        return <>
            {
                breadCrumbItems.length === 1 && <FilterContainer
                    onFilterButtonClick={this.handleFilterButtonClick}
                />
            }
            {
                !loading ? <DataTable
                    key={tableKey}
                    rows={rows}
                    selectedRows={selectedRows}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    rowsCount={rowsCount}
                    onPageChange={this.handlePageChange}
                    onRowsPerPageChange={this.handleRowsPerPageChange}
                    onDeleteButtonClick={this.handleDeleteRowsButtonCLick}
                    onAddRelationRowsButtonClick={this.handleAddRelationRowsButtonClick}
                    onExportButtonClick={this.handleExportButtonClick}
                /> : <div>loading ...</div>
            }
        </>;
    }
}

export default connector(withDialog(DataTableContainer));
