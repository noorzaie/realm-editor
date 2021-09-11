import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Realm from 'realm';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControlLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import 'src/styles/schemaForm.css';
import { REALM_PROPERTY_TYPES } from 'src/utils/constants';

export type FieldType = {
    name: string;
    type: Realm.PropertyType;
    objectType: string;
    property: string;
    optional: boolean;
    indexed: boolean;
    mapTo: string;
    listTypeItems: string[];
    linkingObjectProperties: string[];
};

interface PropTypes {
    schemaName: string;
    fields: FieldType[];
    primaryKey: string;
    onSchemaNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ItemModifierPropTypes {
    onFieldChange: (index: number, name: keyof FieldType, value: string | boolean) => void;
    onPrimaryKeyChange: (fieldName: string, checked: boolean) => void;
    onAddRowButtonClick: (index: number) => void;
    onDeleteRowButtonClick: (index: number) => void;
}

interface ItemPropTypes extends FieldType {
    index: number;
    primaryKey: string;
}

const Item: React.FC<ItemPropTypes & ItemModifierPropTypes> = React.memo(({ name, type, objectType, listTypeItems, linkingObjectProperties, property, mapTo, indexed, optional, index, primaryKey, onFieldChange, onPrimaryKeyChange, onAddRowButtonClick, onDeleteRowButtonClick }) => (
    <div
        className="row"
    >
        <TextField
            className="inputWrapper"
            label="Field Name"
            value={name}
            size="small"
            variant="outlined"
            onChange={event => onFieldChange(index, 'name', event.target.value)}
        />

        <FormControl
            className="inputWrapper"
            size="small"
            variant="outlined"
        >
            <Select
                onChange={event => onFieldChange(index, 'type', event.target.value as Realm.PropertyType)}
                value={type}
                displayEmpty
            >
                <MenuItem value="">
                    Type
                </MenuItem>
                {
                    REALM_PROPERTY_TYPES.map((propertyType, typeIndex) =>
                        <MenuItem
                            key={typeIndex}
                            value={propertyType}
                        >
                            { propertyType }
                        </MenuItem>
                    )
                }
            </Select>
        </FormControl>

        <FormControl
            className="inputWrapper"
            size="small"
            variant="outlined"
        >
            <Select
                onChange={event => onFieldChange(index, 'objectType', event.target.value as Realm.PropertyType)}
                value={objectType}
                disabled={!(type === 'list' || type === 'linkingObjects')}
                displayEmpty
            >
                <MenuItem value="">
                    Object Type
                </MenuItem>
                {
                    listTypeItems.map((item, objectTypeIndex) =>
                        <MenuItem
                            key={objectTypeIndex}
                            value={item}
                        >
                            { item }
                        </MenuItem>
                    )
                }
            </Select>
        </FormControl>

        <FormControl
            className="inputWrapper"
            size="small"
            variant="outlined"
        >
            <Select
                onChange={event => onFieldChange(index, 'property', event.target.value as string)}
                value={property}
                disabled={type !== 'linkingObjects'}
                displayEmpty
            >
                <MenuItem value="">
                    Property
                </MenuItem>
                {
                    linkingObjectProperties.map((item, propertyIndex) =>
                        <MenuItem
                            key={propertyIndex}
                            value={item}
                        >
                            { item }
                        </MenuItem>
                    )
                }
            </Select>
        </FormControl>

        <TextField
            className="inputWrapper"
            label="Map To"
            value={mapTo}
            size="small"
            variant="outlined"
            onChange={event => onFieldChange(index, 'mapTo', event.target.value)}
        />

        <FormControlLabel
            control={
                <Checkbox
                    checked={indexed}
                    onChange={event => onFieldChange(index, 'indexed', event.target.checked)}
                    // value={name}
                    color="primary"
                />
            }
            label="Indexed"
        />

        <FormControlLabel
            control={
                <Checkbox
                    checked={optional}
                    onChange={event => onFieldChange(index, 'optional', event.target.checked)}
                    // value={name}
                    color="primary"
                />
            }
            label="Optional"
        />

        <FormControlLabel
            control={
                <Checkbox
                    checked={primaryKey !== '' && primaryKey === name}
                    onChange={event => onPrimaryKeyChange(name, event.target.checked)}
                    // value={name}
                    color="primary"
                />
            }
            label="Primary Key"
        />

        {
            <div
                className="center"
            >
                <IconButton
                    size="small"
                    onClick={() => onAddRowButtonClick(index)}
                >
                    <PlusIcon/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onDeleteRowButtonClick(index)}
                >
                    <DeleteIcon
                        color="error"
                    />
                </IconButton>
            </div>
        }
    </div>
));

const SchemaForm: React.FC<PropTypes & ItemModifierPropTypes> = ({ schemaName, fields, primaryKey, onSchemaNameChange, onFieldChange, onPrimaryKeyChange, onAddRowButtonClick, onDeleteRowButtonClick }) => {
    return <div>
        <div
            className="row"
        >
            <TextField
                className="inputWrapper"
                label="Schema Name"
                value={schemaName}
                size="small"
                variant="outlined"
                onChange={onSchemaNameChange}
            />
        </div>
        {
            fields.map(({ name, type, objectType, listTypeItems, linkingObjectProperties, property, mapTo, indexed, optional }, index) => {
                return <Item
                    key={index}
                    name={name}
                    type={type}
                    objectType={objectType}
                    listTypeItems={listTypeItems}
                    linkingObjectProperties={linkingObjectProperties}
                    property={property}
                    mapTo={mapTo}
                    indexed={indexed}
                    optional={optional}
                    primaryKey={primaryKey}
                    index={index}
                    onFieldChange={onFieldChange}
                    onPrimaryKeyChange={onPrimaryKeyChange}
                    onAddRowButtonClick={onAddRowButtonClick}
                    onDeleteRowButtonClick={onDeleteRowButtonClick}
                />;
            })
        }
    </div>;
};

export default SchemaForm;
