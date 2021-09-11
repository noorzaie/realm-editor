import React from 'react';
import { Box, IconButton, TextField } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

interface PropTypes {
    name: string;
    required: boolean;
    value: string;
    onChangeValue: (value: string) => void;
}

const ObjectId: React.FC<PropTypes> = ({ name, value, required, onChangeValue }) => {
    return <Box display="flex" alignItems="baseline">
        <TextField
            margin="dense"
            id={name}
            label={name}
            required={required}
            type="text"
            value={value}
            onChange={event => onChangeValue(event.target.value)}
            fullWidth
        />
        <Box>
            <IconButton
                edge="end"
                aria-label="refresh"
                size="medium"
                onClick={() => onChangeValue(new Realm.BSON.ObjectId().toHexString())}
            >
                <RefreshIcon
                    fontSize="medium"
                    color="primary"
                />
            </IconButton>
        </Box>
    </Box>;
};

export default ObjectId;
