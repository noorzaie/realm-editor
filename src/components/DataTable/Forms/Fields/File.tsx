import React from 'react';
import Button from '@material-ui/core/Button';
import 'src/styles/fileInput.css';

interface PropTypes {
    name: string;
    required: boolean;
    onChangeValue: (value: ArrayBuffer) => void;
}

const File: React.FC<PropTypes> = ({ name, required, onChangeValue }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            const reader = new FileReader();
            reader.onload = function() {
                onChangeValue(this.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(event.target.files[0]);
        }
    };

    return (
        <React.Fragment>
            <input
                id="contained-button-file"
                multiple
                type="file"
                required={required}
                className="fileInput"
                onChange={handleChange}
            />
            <label htmlFor="contained-button-file">
                <Button
                    variant="contained"
                    component="span"
                    className="fileButton"
                >
                    {name}
                </Button>
            </label>
        </React.Fragment>
    );
};

export default File;
