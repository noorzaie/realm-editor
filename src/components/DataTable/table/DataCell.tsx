import TableCell from '@material-ui/core/TableCell';
import React from 'react';
import CallMade from '@material-ui/icons/CallMade';
import Link from '@material-ui/core/Link';
import fileType from 'file-type';
import 'src/styles/dataCell.css';

export interface PropTypes {
    data: any;
    value: string;
    isWide: boolean;
    isNested: boolean;
    isPrimitive: boolean;
    isList: boolean;
    isFile: boolean;
    mime: fileType.MimeType | undefined;
    fileUrl: string;
    onObjectClick: (event: React.MouseEvent) => void;
}

const DataCell: React.FC<PropTypes> = (props: PropTypes) => {
    const { isWide, isNested, isFile, value, fileUrl, data, mime, onObjectClick } = props;

    return <TableCell
        align="center"
        className={`root ${isWide ? 'string' : 'number'} ${(isNested || isFile) && 'link'}`}
        onClick={onObjectClick}
    >
        {
            isFile
                ? <Link
                    download={fileUrl}
                    href={window.URL.createObjectURL(new Blob([ new Uint8Array(data) ], { type: mime }))}
                    color="inherit"
                >
                    {value}
                </Link>
                : `${data != null ? value : 'null'}`
        }
        {isNested && <CallMade fontSize='inherit' />}
    </TableCell>;
};

export default DataCell;
