import React from 'react';
import { TextField } from '@material-ui/core';

interface PropTypes {
    name: string;
    value: string;
    required: boolean;
    disabled: boolean;
    onChangeValue: (value: string) => void;
}

const Text: React.FC<PropTypes> = ({ name, value, required, disabled, onChangeValue }) => {
    return <TextField
        margin="dense"
        id={name}
        label={name}
        required={required}
        type="text"
        value={value}
        disabled={disabled}
        onChange={event => onChangeValue(event.target.value)}
        fullWidth
    />;
};

export default Text;
