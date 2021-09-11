import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel } from '@material-ui/core';

interface PropTypes {
    name: string;
    required: boolean;
    value: boolean;
    onChangeValue: (value: boolean) => void;
}

const Bool: React.FC<PropTypes> = ({ name, value, required, onChangeValue }) => {
    return <FormControlLabel
        control={
            <Checkbox
                checked={value}
                onChange={event => onChangeValue(event.target.checked)}
                value={name}
                required={required}
                color="primary"
            />
        }
        label={name}
    />;
};

export default Bool;
