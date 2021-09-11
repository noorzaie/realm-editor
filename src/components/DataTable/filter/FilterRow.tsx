import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { AggregationType, OperatorType } from 'src/types/dbTypes';
import 'src/styles/filterRow.css';

interface PropTypes {
    fields: string[];
    aggregations: AggregationType[];
    operators: OperatorType[];
    selectedField: string;
    selectedAggregation: AggregationType;
    selectedOperator: OperatorType;
    selectedRelationField: string;
    value: string;
    index: number;
    relationFields: string[];
    onFieldChange: (field: string, fieldIndex: number) => void;
    onAggregationChange: (aggregation: AggregationType, aggregationIndex: number) => void;
    onRelationFieldChange: (relationField: string, relationFieldIndex: number) => void;
    onOperatorChange: (operator: OperatorType, operatorIndex: number) => void;
    onValueChange: (value: string, filterIndex: number) => void;
    onAddFilterButtonClick: (filterIndex: number) => void;
    onRemoveFilterButtonClick: (filterIndex: number) => void;
}

const FilterRow: React.FC<PropTypes> = props => {
    const {
        fields, aggregations, operators, relationFields, selectedField, selectedAggregation, selectedOperator, selectedRelationField, value, index,
        onFieldChange, onAggregationChange, onRelationFieldChange, onOperatorChange, onValueChange, onAddFilterButtonClick, onRemoveFilterButtonClick
    } = props;

    return <div className="filterRow">
        <div className="filters">
            <FormControl
                className="formControl"
                size="small"
                variant="outlined"
            >
                <Select
                    onChange={event => onFieldChange(event.target.value as string, index)}
                    value={selectedField}
                    displayEmpty
                >
                    <MenuItem value="">
                        Fields
                    </MenuItem>
                    {
                        fields.map((field, fieldIndex) => <MenuItem key={fieldIndex} value={field}>{field}</MenuItem>)
                    }
                </Select>
            </FormControl>

            <FormControl
                className="formControl"
                size="small"
                variant="outlined"
            >
                <Select
                    onChange={event => onAggregationChange(event.target.value as AggregationType, index)}
                    value={selectedAggregation}
                    displayEmpty
                    disabled={aggregations.length === 0}
                >
                    <MenuItem value="">
                        Aggregation
                    </MenuItem>
                    {
                        aggregations.map((aggregation, aggregationIndex) => <MenuItem key={aggregationIndex} value={aggregation}>{aggregation}</MenuItem>)
                    }
                </Select>
            </FormControl>

            <FormControl
                className="formControl"
                size="small"
                variant="outlined"
            >
                <Select
                    onChange={event => onRelationFieldChange(event.target.value as string, index)}
                    value={selectedRelationField}
                    displayEmpty
                    disabled={relationFields.length === 0}
                >
                    <MenuItem value="">
                        Relation Field
                    </MenuItem>
                    {
                        relationFields.map((relationField, relationFieldIndex) => <MenuItem key={relationFieldIndex} value={relationField}>{relationField}</MenuItem>)
                    }
                </Select>
            </FormControl>

            <FormControl
                className="formControl"
                size="small"
                variant="outlined"
            >
                <Select
                    onChange={event => onOperatorChange(event.target.value as OperatorType, index)}
                    value={selectedOperator}
                    displayEmpty
                    disabled={operators.length === 0}
                >
                    <MenuItem value="">
                        Operator
                    </MenuItem>
                    {
                        operators.map((operator, operatorIndex) => <MenuItem key={operatorIndex} value={operator}>{operator}</MenuItem>)
                    }
                </Select>
            </FormControl>

            <FormControl
                className="formControl"
            >
                <TextField
                    label="Value"
                    value={value}
                    size="small"
                    variant="outlined"
                    onChange={event => onValueChange(event.target.value, index)}
                />
            </FormControl>
        </div>

        <div className="filterButtons">
            <Tooltip title="Create new filter">
                <IconButton
                    size="small"
                    onClick={() => onAddFilterButtonClick(index)}
                >
                    <PlusIcon/>
                </IconButton>
            </Tooltip>
            {
                index > 0 && <Tooltip title="Delete filter">
                    <IconButton
                        size="small"
                        onClick={() => onRemoveFilterButtonClick(index)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            }
        </div>
    </div>;
};

export default React.memo(FilterRow);
