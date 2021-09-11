import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { AggregationType, BooleanOperatorType, FilterType, OperatorType } from 'src/types/dbTypes';
import 'src/styles/filterGroupOperator.css';
import 'src/styles/filterGroup.css';
import FilterRow from './FilterRow';
import { emptyFunctionType } from 'src/types/genericTypes';

interface PropTypes {
    filters: FilterType[];
    index: number,
    onAddGroupButtonClick: emptyFunctionType,
    onRemoveGroupButtonClick: emptyFunctionType,
    onFilterOperatorChange: (operator: BooleanOperatorType, filterIndex: number) => void;
    onFieldChange: (field: string, fieldIndex: number) => void;
    onAggregationChange: (aggregation: AggregationType, aggregationIndex: number) => void;
    onRelationFieldChange: (relationField: string, relationFieldIndex: number) => void;
    onOperatorChange: (operator: OperatorType, operatorIndex: number) => void;
    onValueChange: (value: string, filterIndex: number) => void;
    onAddFilterButtonClick: (filterIndex: number) => void;
    onRemoveFilterButtonClick: (filterIndex: number) => void;
}

const FilterGroup: React.FC<PropTypes> = props => {
    const { filters, index, onAddGroupButtonClick, onRemoveGroupButtonClick, onFilterOperatorChange, onFieldChange, onAggregationChange, onRelationFieldChange, onOperatorChange, onValueChange, onAddFilterButtonClick, onRemoveFilterButtonClick } = props;

    return <Card className="card">
        <CardContent className="cardContent">
            <div className="groupButtons">
                <Tooltip title="Create new group">
                    <IconButton
                        size="small"
                        onClick={() => onAddGroupButtonClick()}
                    >
                        <PlusIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete group">
                    <IconButton
                        size="small"
                        onClick={onRemoveGroupButtonClick}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </div>
            {
                filters.map(({ fields, aggregations, operators, relationFields, selectedField, selectedAggregation, selectedOperator, selectedRelationField, operator, value }, filterIndex) => {
                    return <React.Fragment key={`filter-${index}-${filterIndex}`}>

                        {
                            filterIndex > 0 &&
                            <FormControl
                                className="groupOperator"
                                size="small"
                                variant="outlined"
                            >
                                <Select
                                    onChange={event => onFilterOperatorChange(event.target.value as BooleanOperatorType, filterIndex)}
                                    value={operator}
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

                        <FilterRow
                            fields={fields}
                            aggregations={aggregations}
                            operators={operators}
                            selectedField={selectedField}
                            selectedAggregation={selectedAggregation}
                            selectedOperator={selectedOperator}
                            selectedRelationField={selectedRelationField}
                            value={value}
                            index={filterIndex}
                            relationFields={relationFields}
                            onFieldChange={onFieldChange}
                            onAggregationChange={onAggregationChange}
                            onRelationFieldChange={onRelationFieldChange}
                            onOperatorChange={onOperatorChange}
                            onValueChange={onValueChange}
                            onAddFilterButtonClick={onAddFilterButtonClick}
                            onRemoveFilterButtonClick={onRemoveFilterButtonClick}
                        />
                    </React.Fragment>;
                })
            }
        </CardContent>
    </Card>;
};

export default React.memo(FilterGroup);
