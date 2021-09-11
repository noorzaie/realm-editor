import React from 'react';
import { Button, FormControl, MenuItem, Select, TextField } from '@material-ui/core';
import { emptyFunctionType, FilterGroupType } from 'src/types/genericTypes';
import { AggregationType, BooleanOperatorType, OperatorType } from 'src/types/dbTypes';
import FilterGroup from './FilterGroup';
import 'src/styles/filterGroupOperator.css';
import 'src/styles/filter.css';

interface PropTypes {
    groups: FilterGroupType[];
    queryString: string;
    onGroupOperatorChange: (event: React.ChangeEvent<{ value: unknown }>, groupIndex: number) => void;
    onFilterSubmit: emptyFunctionType;
    onAddGroupButtonClick: (groupIndex: number) => void;
    onRemoveGroupButtonClick: (groupIndex: number) => void;
    onFilterOperatorChange: (operator: BooleanOperatorType, groupIndex: number, filterIndex: number) => void;
    onFieldChange: (selectedField: string, groupIndex: number, filterIndex: number) => void;
    onAggregationChange: (aggregation: AggregationType, groupIndex: number, filterIndex: number) => void;
    onRelationFieldChange: (relationField: string, groupIndex: number, filterIndex: number) => void;
    onOperatorChange: (operator: OperatorType, groupIndex: number, filterIndex: number) => void;
    onValueChange: (value: string, groupIndex: number, filterIndex: number) => void;
    onAddFilterButtonClick: (groupIndex: number, filterIndex: number) => void;
    onRemoveFilterButtonClick: (groupIndex: number, filterIndex: number) => void;
    onQueryStringChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

const Filter: React.FC<PropTypes> = ({ groups, onGroupOperatorChange, onFilterSubmit, queryString, onAddGroupButtonClick, onRemoveGroupButtonClick, onFilterOperatorChange, onFieldChange, onAggregationChange, onRelationFieldChange, onOperatorChange, onValueChange, onAddFilterButtonClick, onRemoveFilterButtonClick, onQueryStringChange }) => {
    return <div className="root">
        {
            groups.map(({ filters, operator: groupOperator }, groupIndex) => {
                return <React.Fragment key={`group-${groupIndex}`}>

                    {
                        groupIndex > 0 &&
                        <FormControl
                            className="groupOperator"
                            size="small"
                            variant="outlined"
                        >
                            <Select
                                onChange={event => onGroupOperatorChange(event, groupIndex)}
                                value={groupOperator}
                                displayEmpty
                            >
                                <MenuItem value="and">
                              and
                                </MenuItem>
                                <MenuItem value="or">
                              or
                                </MenuItem>
                            </Select>
                        </FormControl>
                    }

                    <FilterGroup
                        filters={filters}
                        index={groupIndex}
                        onAddGroupButtonClick={() => onAddGroupButtonClick(groupIndex)}
                        onRemoveGroupButtonClick={() => onRemoveGroupButtonClick(groupIndex)}
                        onFilterOperatorChange={(operator: BooleanOperatorType, filterIndex: number) => onFilterOperatorChange(operator, groupIndex, filterIndex)}
                        onFieldChange={(field: string, filterIndex: number) => onFieldChange(field, groupIndex, filterIndex)}
                        onAggregationChange={(aggregation: AggregationType, aggregationIndex: number) => onAggregationChange(aggregation, groupIndex, aggregationIndex)}
                        onRelationFieldChange={(relationField: string, relationFieldIndex: number) => onRelationFieldChange(relationField, groupIndex, relationFieldIndex)}
                        onOperatorChange={(operator: OperatorType, operatorIndex: number) => onOperatorChange(operator, groupIndex, operatorIndex)}
                        onValueChange={(value: string, filterIndex: number) => onValueChange(value, groupIndex, filterIndex)}
                        onAddFilterButtonClick={(filterIndex: number) => onAddFilterButtonClick(groupIndex, filterIndex)}
                        onRemoveFilterButtonClick={(filterIndex: number) => onRemoveFilterButtonClick(groupIndex, filterIndex)}
                    />
                </React.Fragment>;
            })
        }
        {
            <div className="filterResults">
                <TextField
                    className="queryInput"
                    label="Query String"
                    rows="1"
                    value={queryString}
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={onQueryStringChange}
                />

                <Button
                    className="filterButton"
                    variant="contained"
                    color="primary"
                    onClick={onFilterSubmit}
                >
                    Filter
                </Button>
            </div>
        }
    </div>;
};

export default Filter;
