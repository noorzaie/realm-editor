import React from 'react';
import { ObjectSchemaProperty } from 'realm';
import { isDataTypePrimitive } from 'src/utils/dbUtils';
import { getRandomNumber } from 'src/utils/helperMethods';
import SchemaForm, { FieldType } from 'src/components/SchemaForm';
import { REALM_PROPERTY_TYPES } from 'src/utils/constants';
import { RenamedColumnsType } from 'src/types/genericTypes';

type PropTypes = {
    schema: Realm.ObjectSchema,
    otherSchemas: Realm.ObjectSchema[];
};

type StateTypes = {
    fields: FieldType[]
    primaryKey: string;
    schemaName: string;
};

class SchemaFormContainer extends React.Component<PropTypes, StateTypes> {
    state = {
        fields: [],
        primaryKey: '',
        schemaName: this.props.schema.name
    };

    renamedColumns: RenamedColumnsType = [];

    componentDidMount(): void {
        const { schema } = this.props;
        const fields: FieldType[] = [];

        Object.entries(schema.properties).map(([ name, options ]) => {
            const listTypeItems = this.getListTypeItems((typeof options === 'string' ? options : (options as ObjectSchemaProperty).type) === 'list');
            const linkingObjectProperties = this.getLinkingObjectProperties(typeof options === 'string' ? options : (options as ObjectSchemaProperty).objectType as string);

            this.renamedColumns.push({
                old: name,
                current: name
            });

            fields.push({
                name,
                type: '',
                objectType: '',
                property: '',
                optional: false,
                indexed: false,
                mapTo: '',
                listTypeItems,
                linkingObjectProperties,
                ...JSON.parse(JSON.stringify(options))
            });
        });

        if (fields.length === 0) {
            fields.push({
                name: '',
                type: '',
                objectType: '',
                property: '',
                optional: false,
                indexed: false,
                mapTo: '',
                listTypeItems: [],
                linkingObjectProperties: []
            });

            this.renamedColumns.push({
                old: '',
                current: ''
            });
        }

        this.setState({
            fields,
            primaryKey: schema.primaryKey || ''
        });
    }

    handleFieldChange = (index: number, field: keyof FieldType, value: string | boolean): void => {
        let updatePrimaryKey = false;
        const dependedChanges: Partial<FieldType> = {};
        this.setState(prevState => {
            if (field === 'name') {
                this.renamedColumns[index].current = value as string;
                dependedChanges.mapTo = value as string;
                if (this.state.primaryKey === prevState.fields[index].name) {
                    updatePrimaryKey = true;
                }
            } else if (field === 'type') {
                dependedChanges.listTypeItems = this.getListTypeItems(value === 'list');
                dependedChanges.objectType = '';
            } else if (field === 'objectType') {
                dependedChanges.linkingObjectProperties = this.getLinkingObjectProperties(value as string);
            }
            return {
                fields: [
                    ...prevState.fields.slice(0, index),
                    {
                        ...prevState.fields[index],
                        [field]: value,
                        ...dependedChanges
                    },
                    ...prevState.fields.slice(index + 1)
                ]
            };
        }, () => {
            if (updatePrimaryKey) {
                this.handlePrimaryKeyChange(value as string, true);
            }
        });
    };

    handlePrimaryKeyChange = (fieldName: string, checked: boolean): void => {
        fieldName = checked ? fieldName : '';
        this.setState({
            primaryKey: fieldName
        });
    };

    handleSchemaNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            schemaName: event.target.value
        });
    };

    getListTypeItems = (includePrimitives: boolean): string[] => {
        let items: string[] = this.props.otherSchemas.map(schema => schema.name);
        if (includePrimitives) {
            items = [ ...items, ...REALM_PROPERTY_TYPES ];
        }
        return items;
    };

    getLinkingObjectProperties = (objectType: string): string[] => {
        const properties: string[] = [];

        for (const schema of this.props.otherSchemas) {
            if (schema.name === objectType) {
                Object.entries(schema.properties).map(([ name, property ]) => {
                    property = property as Realm.ObjectSchemaProperty;
                    if (
                        (property.type === 'list' && !isDataTypePrimitive(property.objectType as string)) ||
                        (property.type !== 'list' && !isDataTypePrimitive(property.type))
                    ) {
                        properties.push(name);
                    }
                });
            }
        }

        return properties;
    };

    handleAddRowButtonClick = (index: number): void => {
        const fieldName = `field_${getRandomNumber()}`;
        this.renamedColumns.push({
            old: fieldName,
            current: fieldName
        });

        this.setState(prevState => {
            return {
                fields: [
                    ...prevState.fields.slice(0, index + 1),
                    {
                        name: fieldName,
                        type: '',
                        objectType: '',
                        property: '',
                        optional: false,
                        indexed: false,
                        mapTo: fieldName,
                        listTypeItems: [],
                        linkingObjectProperties: []
                    },
                    ...prevState.fields.slice(index + 1)
                ]
            };
        });
    };

    handleDeleteRowButtonClick = (index: number): void => {
        this.renamedColumns.splice(index, 1);
        this.setState(prevState => {
            const newFields = [ ...prevState.fields ];
            newFields.splice(index, 1);
            return {
                fields: newFields
            };
        });
    }

    getSchema = (): { schema: Realm.ObjectSchema; renamedColumns: RenamedColumnsType } => {
        const schema: Realm.ObjectSchema = {
            name: this.state.schemaName,
            properties: {}
        };

        if (this.state.primaryKey) {
            schema.primaryKey = this.state.primaryKey;
        }

        this.state.fields.map((field: FieldType) => {
            schema.properties[field.name] = { ...field, default: '' };
        });
        return {
            schema,
            renamedColumns: this.renamedColumns.filter(col => col.old !== col.current)
        };
    };

    render(): React.ReactNode {
        const { primaryKey, fields, schemaName } = this.state;

        return <SchemaForm
            primaryKey={primaryKey}
            fields={fields}
            schemaName={schemaName}
            onAddRowButtonClick={this.handleAddRowButtonClick}
            onFieldChange={this.handleFieldChange}
            onPrimaryKeyChange={this.handlePrimaryKeyChange}
            onSchemaNameChange={this.handleSchemaNameChange}
            onDeleteRowButtonClick={this.handleDeleteRowButtonClick}
        />;
    }
}

export default SchemaFormContainer;
