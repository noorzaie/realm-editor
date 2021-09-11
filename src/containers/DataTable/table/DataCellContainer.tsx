import React from 'react';
import Realm from 'realm';
import { connect, ConnectedProps } from 'react-redux';
import { format } from 'date-fns';
import fileType from 'file-type';
import DataCell from 'src/components/DataTable/table/DataCell';
import { formatBytes } from 'src/utils/fileUitls';
import { isDataTypePrimitive } from 'src/utils/dbUtils';
import DB from 'src/lib/db/DB';
import { resetTable, pushBreadCrumbItem, setColumns, setMode } from 'src/store/table';
import { setCurrentCollection } from 'src/store/database';
import { RootState } from 'src/store';

const mapState = (state: RootState) => ({
    mode: state.table.mode
});

const mapDispatch = {
    resetTable,
    setMode,
    setColumns,
    setCurrentCollection,
    pushBreadCrumbItem
};

const connector = connect(mapState, mapDispatch);
type ReduxPropTypes = ConnectedProps<typeof connector>;

interface PropTypes {
    type: Realm.PropertyType;
    data: any;
    field: string;
    objectType: Realm.PropertyType | undefined;
    onObjectCellClick: (field: string) => void;
}

interface StateTypes {
    value: string;
    isWide: boolean;
    isNested: boolean;
    isPrimitive: boolean;
    isList: boolean;
    isFile: boolean;
    mime: fileType.MimeType | undefined;
    fileUrl: string;
}

class DataCellContainer extends React.Component<PropTypes & ReduxPropTypes, StateTypes> {
    state = {
        value: '',
        isWide: false,
        isNested: false,
        isPrimitive: true,
        isList: false,
        isFile: false,
        mime: undefined,
        fileUrl: ''
    }

    private DBInstance = DB.getInstance();

    componentDidMount() {
        const { type, data, objectType, field } = this.props;

        let value = '';
        let isWide = false;
        let isNested = false;
        let isPrimitive = true;
        let isList = false;
        let isFile = false;
        let extension = '';
        let mime: fileType.MimeType | undefined;

        switch (type) {
            case 'bool':
                value = data ? 'true' : 'false';
                break;
            case 'int':
            case 'float':
            case 'double':
                value = data;
                break;
            case 'string':
                value = data && data.length > 30 ? data.substr(0, 30) + ' ...' : data;
                isWide = true;
                break;
            case 'date':
                value = data ? format(data, 'yyyy/mm/dd H:mm') : data;
                isWide = true;
                break;
            case 'data':
                fileType.fromBuffer(new Uint8Array(data))
                    .then(fileSignature => {
                        if (fileSignature !== undefined) {
                            extension = `.${fileSignature.ext}`;
                            mime = fileSignature.mime;
                        }
                        value = data ? `file (${formatBytes(data.byteLength)})` : '';
                        isWide = true;
                        isFile = true;
                        this.setState({
                            mime,
                            value,
                            isWide,
                            isFile,
                            fileUrl: `${field}-${Date.now()}${extension}`
                        });
                    });
                break;
            case 'list':
                value = `list of ${objectType}`;
                isWide = true;
                isNested = true;
                isList = true;
                if (objectType !== undefined && isDataTypePrimitive(objectType)) {
                    // list of primitives
                } else {
                    // list of relations
                    isPrimitive = false;
                }
                break;
            case 'linkingObjects':
                value = objectType as string;
                isWide = true;
                isNested = true;
                isPrimitive = false;
                isList = true;
                break;
            case 'object':
                value = objectType as string;
                isWide = true;
                isNested = true;
                isPrimitive = false;
                break;
            default:
                value = data;
                break;
        }

        this.setState({
            value,
            isWide,
            isNested,
            isPrimitive,
            isList
        });
    }

    handleObjectClick = (event: React.MouseEvent) => {
        const { isNested, isFile, isList, isPrimitive } = this.state;
        const { data, field, mode, objectType, resetTable, pushBreadCrumbItem, setMode, setCurrentCollection, onObjectCellClick } = this.props;

        if (isNested && mode === 'create') { // dont allow to open relation of relation
            event.stopPropagation();
            const collectionName = isPrimitive ? field : objectType as string;
            const mode = isList ? 'add-list' : 'add-single';

            this.DBInstance.init(isPrimitive ? 'primitive' : isList ? 'list' : 'object', collectionName, data, true, mode, objectType);

            onObjectCellClick(field);
            resetTable();
            pushBreadCrumbItem(collectionName);

            if (!isPrimitive) {
                setMode(mode);
                setCurrentCollection(collectionName);
            } else {
                const columns = this.DBInstance.getColumns();
                this.props.setColumns(columns);
            }
        } else if (isFile) {
            event.stopPropagation();
        }
    }

    render() {
        const { data } = this.props;
        const { isWide, isNested, isFile, isPrimitive, isList, value, fileUrl, mime } = this.state;

        return <DataCell
            value={value}
            isWide={isWide}
            isNested={isNested}
            isFile={isFile}
            isPrimitive={isPrimitive}
            isList={isList}
            fileUrl={fileUrl}
            data={data}
            mime={mime}
            onObjectClick={this.handleObjectClick}
        />;
    }
}

export default connector(DataCellContainer);
