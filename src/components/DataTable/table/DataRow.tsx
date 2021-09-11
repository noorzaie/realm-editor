import React from 'react';
import { Checkbox, IconButton, TableCell, TableRow, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { DataRowType, ResultsColumnsType } from 'src/types/dbTypes';
import { emptyFunctionType } from 'src/types/genericTypes';
import DataCellContainer from 'src/containers/DataTable/table/DataCellContainer';
import 'src/styles/dataRow.css';

interface PropTypes {
    data: DataRowType;
    selected: boolean;
    editable: boolean;
    showActions: boolean;
    columns: ResultsColumnsType;
    onToggleActions: (show: boolean) => void;
    onRowClick: emptyFunctionType;
    onEditButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onObjectCellClick: (field: string) => void;
}

const DataRow = (props: PropTypes) => {
    const { columns, data, editable, showActions, selected, onToggleActions, onRowClick, onEditButtonClick, onObjectCellClick } = props;

    return <TableRow
        hover
        role="checkbox"
        aria-checked={selected}
        tabIndex={-1}
        selected={selected}
        onClick={onRowClick}
        onMouseEnter={() => onToggleActions(true)}
        onMouseLeave={() => onToggleActions(false)}
    >
        <TableCell padding="checkbox">
            <Checkbox checked={selected} />
        </TableCell>
        {
            Object.entries(columns).map(([ name, { type, objectType } ], cellIndex) =>
                <DataCellContainer
                    key={cellIndex}
                    data={data[name]}
                    field={name}
                    type={type}
                    objectType={objectType}
                    onObjectCellClick={onObjectCellClick}
                />
            )
        }
        {
            editable && <TableCell className="editCell">
                <div className={`actions ${showActions ? 'showActions' : 'hideActions'}`}>
                    <Tooltip title="Edit">
                        <IconButton
                            size='small'
                            aria-label="edit"
                            onClick={onEditButtonClick}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </TableCell>
        }
    </TableRow>;
};

export default DataRow;
