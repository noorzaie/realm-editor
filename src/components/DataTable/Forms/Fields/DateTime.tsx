import React from 'react';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

interface PropTypes {
    name: string;
    required: boolean;
    value: Date;
    disabled: boolean;
    onChangeValue: (value: Date | null) => void;
}

const DateTime: React.FC<PropTypes> = ({ name, value, required, disabled, onChangeValue }) => {
    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
            autoOk
            fullWidth
            ampm={false}
            format="yyyy/mm/dd H:mm"
            value={value}
            name={name}
            disabled={disabled}
            required={required}
            onChange={onChangeValue}
            label={name}
        />
    </MuiPickersUtilsProvider>;
};

export default DateTime;
