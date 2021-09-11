import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ObjectType } from 'src/types/genericTypes';
import DataRowForm from 'src/components/DataTable/Forms/DataRowForm';
import { RootState } from 'src/store';

const mapState = (state: RootState) => ({
    columns: state.table.columns,
    primaryKey: state.table.primaryKey
});

const connector = connect(mapState, null, null, { forwardRef: true });
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface PropTypes {
    data: ObjectType;
    isForEdit: boolean;
}

interface StateTypes {
    currentData: ObjectType;
}

export class DataRowFormContainer extends React.Component<PropTypes & ReduxPropTypes, StateTypes> {
    state = {
        currentData: {}
    };

    componentDidMount() {
        const { isForEdit, columns, data } = this.props;

        if (!isForEdit) {
            const defaultValues: ObjectType = {};
            for (const [ name, { type } ] of Object.entries(columns)) {
                switch (type) {
                    case 'int':
                    case 'float':
                    case 'double':
                    case 'decimal128':
                        defaultValues[name] = 0;
                        break;
                    case 'bool':
                        defaultValues[name] = false;
                        break;
                    case 'string':
                    case 'objectId':
                    case 'uuid':
                    case 'mixed':
                        defaultValues[name] = '';
                        break;
                    case 'date':
                        defaultValues[name] = new Date();
                        break;
                    case 'data':
                        defaultValues[name] = '';
                }
            }
            this.setState({
                currentData: defaultValues
            });
        } else {
            this.setState({
                currentData: { ...data }
            });
        }
    }

    getData = (): ObjectType => {
        const data: ObjectType = { ...this.state.currentData };
        if (this.props.isForEdit && this.props.primaryKey) { // Primary key is not editable
            delete data[this.props.primaryKey];
        }
        return data;
    }

    handleFieldChange = (field: string, value: unknown): void => {
        if ((this.props.columns[field] as Realm.PropertiesTypes).type === 'objectId') {
            try {
                value = new Realm.BSON.ObjectId(value as string);
            } catch (e) {}
        } else if ((this.props.columns[field] as Realm.PropertiesTypes).type === 'uuid') {
            try {
                value = new Realm.BSON.UUID(value as string);
            } catch (e) {}
        } else if ((this.props.columns[field] as Realm.PropertiesTypes).type === 'decimal128') {
            value = new Realm.BSON.Decimal128(`${value}`);
        }
        this.setState({
            currentData: {
                ...this.state.currentData,
                [field]: value
            }
        });
    };

    render() {
        const { columns, primaryKey, isForEdit } = this.props;
        const { currentData } = this.state;

        return Object.keys(currentData).length > 0 ? <DataRowForm
            fields={columns}
            data={currentData}
            primaryKey={primaryKey}
            isForEdit={isForEdit}
            onFieldChange={this.handleFieldChange}
        /> : <></>;
    }
}

export default connector(DataRowFormContainer);
