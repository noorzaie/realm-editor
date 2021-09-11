import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { SORTABLE_TYPES } from 'src/utils/constants';
import { OrderType, ResultsColumnsType } from 'src/types/dbTypes';
import HeaderCell from './HeaderCell';

const isColumnSortable = (type: string) => {
    return SORTABLE_TYPES.includes(type);
};

interface PropTypes {
    selectedCount: number;
    onRequestSort: (property: string) => void;
    onSelectAllClick: (checked: boolean) => void;
    order: OrderType;
    orderBy: string;
    rowCount: number;
    columns: ResultsColumnsType;
    primaryKey: string | undefined;
}

const HeaderRow: React.FC<PropTypes> = props => {
    const { columns, onSelectAllClick, order, orderBy, selectedCount, rowCount, onRequestSort, primaryKey } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {
                        rowCount > 0 && <Checkbox
                            indeterminate={selectedCount > 0 && selectedCount < rowCount}
                            checked={rowCount > 0 && selectedCount === rowCount}
                            onChange={(_, checked) => onSelectAllClick(checked)}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                    }
                </TableCell>
                {
                    Object.entries(columns).map(([ name, { type, indexed, optional, mapTo, objectType } ], index) => (
                        <HeaderCell
                            key={index}
                            id={index}
                            label={name}
                            sortable={isColumnSortable(type) && rowCount > 0}
                            sortDirection={order}
                            isSortActive={orderBy === name}
                            isIndexed={indexed === true}
                            isPrimaryKey={primaryKey === name}
                            info={{ type, objectType, optional, mapTo }}
                            onClick={onRequestSort}
                        />
                    ))
                }
            </TableRow>
        </TableHead>
    );
};

export default HeaderRow;
