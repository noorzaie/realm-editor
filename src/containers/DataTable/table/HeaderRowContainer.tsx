import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'src/store';
import HeaderRow from 'src/components/DataTable/table/HeaderRow';
import { setSelectedRows, setOrder, setOrderBy, setPage } from 'src/store/table';

const mapState = (state: RootState) => ({
    page: state.table.page,
    rowsPerPage: state.table.rowsPerPage,
    order: state.table.order,
    orderBy: state.table.orderBy,
    columns: state.table.columns,
    primaryKey: state.table.primaryKey,
    selectedRows: state.table.selectedRows,
    mode: state.table.mode
});

const mapDispatch = {
    setSelectedRows,
    setOrder,
    setOrderBy,
    setPage
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface PropTypes {
    rowsCount: number;
}

class HeaderRowContainer extends React.Component<PropTypes & ReduxPropTypes> {
    handleRequestSort = (property: string) => {
        const { orderBy, order, setSelectedRows, setOrderBy, setOrder, setPage } = this.props;
        const isDesc = orderBy === property && order === 'desc';

        setSelectedRows([]);
        setOrderBy(property);
        setOrder(isDesc ? 'asc' : 'desc');
        setPage(0);
    };

    handleSelectAll = (checked: boolean) => {
        const { mode, rowsCount, setSelectedRows } = this.props;

        if (checked && mode === 'select-single' && rowsCount > 1) {
            return false;
        } else {
            setSelectedRows(checked ? [ ...Array(rowsCount).keys() ] : []);
        }
    };

    render() {
        const { order, orderBy, columns, primaryKey, selectedRows, rowsCount } = this.props;

        return <HeaderRow
            selectedCount={selectedRows.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={this.handleSelectAll}
            onRequestSort={this.handleRequestSort}
            rowCount={rowsCount}
            columns={columns}
            primaryKey={primaryKey}
        />;
    }
}

export default connector(HeaderRowContainer);
