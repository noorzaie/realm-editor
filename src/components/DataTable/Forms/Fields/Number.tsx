import React from 'react';
import { TextField } from '@material-ui/core';

interface PropTypes {
    name: string;
    required: boolean;
    value: number;
    disabled: boolean;
    onChangeValue: (value: number) => void;
}

const Number: React.FC<PropTypes> = ({ name, value, required, disabled, onChangeValue }) => {
    const getStep = () => {
        if (!isFinite(value) || value === undefined || value === null || value === 0) return 0;
        let e = 1;
        let p = 0;
        while (Math.round(value * e) / e !== value) {
            e *= 10;
            p++;
        }
        return Math.pow(10, -p);
    };

    return <TextField
        margin="dense"
        id={name}
        label={name}
        type="number"
        inputProps={{ step: getStep() }}
        value={value}
        required={required}
        fullWidth
        disabled={disabled}
        onChange={event => onChangeValue(+event.target.value)}
    />;
};

export default Number;
