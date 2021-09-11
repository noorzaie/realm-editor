import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import { DataExportTypes, SchemaExportTypes } from 'src/types/genericTypes';

interface PropTypes {
    items: DataExportTypes[] | SchemaExportTypes[];
    value: string;
    onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ExportTypeForm: React.FC<PropTypes> = ({ items, value, onValueChange }) => {
    return <FormControl component="fieldset">
        <FormLabel component="legend">Export type</FormLabel>
        <RadioGroup
            value={value}
            onChange={onValueChange}
        >
            {
                items.map(
                    (item, index) => <FormControlLabel
                        key={index}
                        value={item}
                        control={<Radio color="primary" />}
                        label={item}
                    />
                )
            }
        </RadioGroup>
    </FormControl>;
};

export default ExportTypeForm;
