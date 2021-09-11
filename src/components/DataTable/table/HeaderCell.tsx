import React from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Box, TableCell } from '@material-ui/core';
import KeyIcon from '@material-ui/icons/VpnKey';
import { PropertyType } from 'realm';
import Tooltip from '@material-ui/core/Tooltip';

interface Info {
    type: PropertyType;
    objectType: PropertyType;
    optional: boolean;
    mapTo: string;
}

interface PropTypes {
    id: number;
    label: string;
    sortable: boolean;
    sortDirection: 'asc' | 'desc';
    isSortActive: boolean;
    isIndexed: boolean;
    isPrimaryKey: boolean;
    onClick: (label: string) => void;
    info: Info;
}

const HeaderCell: React.FC<PropTypes> = props => {
    const { id, label, sortable, sortDirection, isSortActive, isIndexed, isPrimaryKey, info, onClick } = props;

    const handleCellClick = () => {
        onClick(label);
    };

    const infoArray = Object.entries(info);
    const tooltip: string = infoArray.reduce(
        (acc, [ key, value ], index) => {
            if (value !== undefined) {
                if (typeof value === 'boolean') {
                    if (value) {
                        acc += key;
                    } else {
                        return acc; // Skip line break
                    }
                } else {
                    acc += `${key}: ${value}`;
                }
                if (index < infoArray.length) {
                    acc += '<br>';
                }
            }
            return acc;
        }, ''
    );

    return <TableCell
        key={id}
        align='center'
        padding={'none'}
        sortDirection={isSortActive ? sortDirection : false}
    >
        <Tooltip
            title={<React.Fragment><div dangerouslySetInnerHTML={{ __html: tooltip }}/></React.Fragment>}
            placement="top"
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <React.Fragment>
                    {
                        !isPrimaryKey && isIndexed &&
                        <KeyIcon
                            fontSize="small"
                            color="disabled"
                        />
                    }
                    {
                        isPrimaryKey &&
                        <KeyIcon
                            fontSize="small"
                            style={{ color: 'gold' }}
                        />
                    }
                    &nbsp;
                    {
                        sortable
                            ? <TableSortLabel
                                active={isSortActive}
                                direction={sortDirection}
                                onClick={handleCellClick}
                            >
                                {label}
                            </TableSortLabel>
                            : label
                    }
                </React.Fragment>
            </Box>
        </Tooltip>
    </TableCell>;
};

export default HeaderCell;
