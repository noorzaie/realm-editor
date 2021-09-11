import { DATA_PATH } from 'src/utils/constants';
import fs from 'fs';

export const getRealmFiles = (): string[] => {
    if (!fs.existsSync(DATA_PATH)) {
        fs.mkdirSync(DATA_PATH);
    }
    return fs.readdirSync(DATA_PATH).filter(file => file.match(/.*\.(realm)$/ig));
};

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};
