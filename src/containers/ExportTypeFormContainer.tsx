import React from 'react';
import { DataExportTypes, ExportTypes, SchemaExportTypes } from 'src/types/genericTypes';
import ExportTypeForm from 'src/components/ExportTypeForm';
import { DATA_EXPORT_TYPES, SCHEMA_EXPORT_TYPES } from 'src/utils/constants';

interface PropTypes {
    type: ExportTypes;
}

interface StateTypes {
    value: DataExportTypes | SchemaExportTypes;
}

class ExportTypeFormContainer extends React.Component<PropTypes, StateTypes> {
    state = {
        value: 'JSON' as const
    };

    handleValueChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            value: event.target.value as DataExportTypes | SchemaExportTypes
        });
    }

    getType = (): DataExportTypes | SchemaExportTypes => {
        return this.state.value;
    }

    render() {
        const { type } = this.props;
        const { value } = this.state;
        const items = type === 'data' ? DATA_EXPORT_TYPES : type === 'schema' ? SCHEMA_EXPORT_TYPES.filter(item => item !== 'Realm') : SCHEMA_EXPORT_TYPES;

        return <ExportTypeForm
            items={items}
            value={value}
            onValueChange={this.handleValueChange}
        />;
    }
}

export default ExportTypeFormContainer;
