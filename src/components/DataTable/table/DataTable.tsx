import React from 'react';
import { Paper, Table, TableBody, TableContainer } from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';
import { DataRowsType, RowsPerPgeType } from 'src/types/dbTypes';
import DataRowContainer from 'src/containers/DataTable/table/DataRowContainer';
import TableToolbarContainer from 'src/containers/DataTable/tools/TableToolbarContainer';
import PaginationActionsContainer from 'src/containers/DataTable/tools/PaginationActionsContainer';
import { PAGINATION_OPTIONS } from 'src/utils/constants';
import HeaderRowContainer from 'src/containers/DataTable/table/HeaderRowContainer';
import { emptyFunctionType } from 'src/types/genericTypes';
import 'src/styles/dataTable.css';

interface PropTypes {
    rows: DataRowsType;
    selectedRows: number[];
    page: number;
    rowsCount: number;
    rowsPerPage: RowsPerPgeType;
    onPageChange: (event: unknown, page: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteButtonClick: emptyFunctionType;
    onAddRelationRowsButtonClick: emptyFunctionType;
    onExportButtonClick: emptyFunctionType;
}

const DataTable = (props: PropTypes) => {
    const { rows, selectedRows, page, rowsCount, rowsPerPage, onPageChange, onRowsPerPageChange, onDeleteButtonClick, onAddRelationRowsButtonClick, onExportButtonClick } = props;

    return <div className="root">
        <Paper className="paper">
            <TableToolbarContainer
                onDeleteButtonClick={onDeleteButtonClick}
                onAddRelationRowsButtonClick={onAddRelationRowsButtonClick}
                onExportButtonClick={onExportButtonClick}
            />

            <TableContainer className="tableWrapper">
                <Table
                    className="table"
                    size='small'
                >
                    <HeaderRowContainer
                        rowsCount={rows.length}
                    />

                    <TableBody>
                        {
                            rows.map((row, index) => {
                                const isItemSelected = selectedRows.indexOf(index) !== -1;

                                return <DataRowContainer
                                    data={row}
                                    key={index}
                                    index={index}
                                    isItemSelected={isItemSelected}
                                />;
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                className="pagination"
                rowsPerPageOptions={PAGINATION_OPTIONS}
                colSpan={3}
                component="div"
                count={rowsCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                ActionsComponent={PaginationActionsContainer}
            />
        </Paper>
    </div>;
};

export default DataTable;
