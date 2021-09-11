import React from 'react';
import { ObjectType } from 'src/types/genericTypes';
import { ResultsColumnsType } from 'src/types/dbTypes';
import Bool from './Fields/Bool';
import Number from './Fields/Number';
import DateTime from './Fields/DateTime';
import Text from './Fields/Text';
import File from './Fields/File';
import ObjectId from './Fields/ObjectId';
import UUID from './Fields/UUID';

interface PropTypes {
    data: ObjectType;
    fields: ResultsColumnsType;
    isForEdit: boolean;
    primaryKey: string | undefined;
    onFieldChange: (field: string, value: unknown) => void;
}

const DataRowForm: React.FC<PropTypes> = ({ fields, data, onFieldChange, isForEdit, primaryKey }) => {
    return <div>
        {
            Object.entries(fields).map(([ name, { type, optional } ], index) => {
                switch (type) {
                    case 'int':
                    case 'float':
                    case 'double':
                        return <Number key={index} name={name} required={!optional} value={data[name]} disabled={isForEdit && primaryKey === name} onChangeValue={(value) => onFieldChange(name, value)}/>;
                    case 'decimal128':
                        return <Number key={index} name={name} required={!optional} value={+data[name]} disabled={isForEdit && primaryKey === name} onChangeValue={(value) => onFieldChange(name, value)}/>;
                    case 'bool':
                        return <Bool key={index} name={name} required={!optional} value={data[name]} onChangeValue={(value) => onFieldChange(name, value)}/>;
                    case 'string':
                    case 'mixed':
                        return <Text key={index} name={name} required={!optional} value={data[name]} disabled={isForEdit && primaryKey === name} onChangeValue={(value) => onFieldChange(name, value)}/>;
                    case 'objectId':
                        return <ObjectId key={index} name={name} required={!optional} value={data[name]} onChangeValue={(value) => onFieldChange(name, value)}/>;
                    case 'uuid':
                        return <UUID key={index} name={name} required={!optional} value={data[name]} onChangeValue={(value) => onFieldChange(name, value)}/>;
                    case 'data':
                        return <div key={index}>
                            <File name={name} required={!optional} onChangeValue={(value) => onFieldChange(name, value)} />
                        </div>;
                    case 'date':
                        return <DateTime key={index} name={name} required={!optional} value={data[name]} disabled={isForEdit && primaryKey === name} onChangeValue={(value) => onFieldChange(name, value)}/>;
                    case 'list':
                    case 'linkingObjects':
                    case 'object':
                        return '';
                    default:
                        return '';
                }
            })
        }
    </div>;
};

export default DataRowForm;
