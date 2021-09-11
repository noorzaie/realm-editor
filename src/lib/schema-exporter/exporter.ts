import XLSX, { WorkBook } from 'xlsx';
import fs from 'fs';
import { remote } from 'electron';
import Realm, { ObjectSchema, ObjectSchemaProperty, PropertiesTypes } from 'realm';
import DB from 'src/lib/db/DB';
import { Language, SchemaExporter } from './realm-studio';
import { LANGUAGE_PREFIXES } from 'src/utils/constants';
import store from 'src/store';
import { addNotification } from 'src/store/notification';
import { ShowSnackbarMsgType } from 'src/types/notificationTypes';

const dialog = remote.dialog;

const showMessage: ShowSnackbarMsgType = (variant, message) => {
    store.dispatch(addNotification({ message, variant }));
};

const saveExcel = (workBook: WorkBook, fileName: string) => {
    const path = dialog.showSaveDialogSync({ defaultPath: `${fileName}.xlsx` });
    if (path) {
        try {
            XLSX.writeFile(workBook, path);
            showMessage('success', 'Saved successfully');
        } catch (e) {
            showMessage('error', e.message);
        }
    }
};

const exportSchemaToRealm = (instance: Realm, collectionName: string, databaseName: string) => {
    const schema: ObjectSchema[] = collectionName ? [ DB.getCollectionSchema(instance, collectionName) ] : instance.schema;
    const path = dialog.showSaveDialogSync({ defaultPath: collectionName ? `${collectionName}.realm` : databaseName });
    if (path) {
        const newDatabase = new Realm({ schema, path });
        newDatabase.close();
        showMessage('success', 'Saved successfully.');
    }
};

const exportSchemaToJson = (instance: Realm, collectionName: string, databaseName?: string) => {
    const schema = collectionName ? DB.getCollectionSchema(instance, collectionName) : instance.schema;
    const path = dialog.showSaveDialogSync({ defaultPath: `${collectionName || databaseName}.json` });

    if (path) {
        fs.writeFileSync(path, JSON.stringify(schema));
        showMessage('success', 'Saved successfully.');
    }
};

const exportSchemaToClass = (language: Language, instance: Realm, collectionName: string, databaseName?: string) => {
    const path = dialog.showSaveDialogSync({ defaultPath: collectionName ? `${collectionName}.${LANGUAGE_PREFIXES[language]}` : `${databaseName}-classes` });
    if (path) {
        const exporter = SchemaExporter(language);
        if (collectionName) {
            exporter.exportSchema(DB.getCollectionSchema(instance, collectionName));
        } else {
            exporter.exportAllSchemas(instance);
        }
        exporter.writeFilesToDisk(path);
        showMessage('success', 'Saved successfully.');
    }
};

const exportSchemaToExcel = (instance: Realm, collectionName: string, databaseName?: string) => {
    const columns: (keyof ObjectSchemaProperty)[] = [ 'name', 'type', 'optional', 'indexed', 'mapTo', 'default', 'objectType', 'property' ];
    const newWorkbook = XLSX.utils.book_new();
    if (collectionName) {
        const schema = DB.getCollectionColumns(instance, collectionName);
        const rows = Object.values(schema).map(row => columns.map(col => (row as ObjectSchemaProperty)[col]));
        const worksheet = XLSX.utils.aoa_to_sheet([ columns, ...rows ]);
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, collectionName);
    } else {
        for (const schema of instance.schema) {
            const rows = Object.values(schema.properties).map(row => columns.map(col => (row as ObjectSchemaProperty)[col]));
            const worksheet = XLSX.utils.aoa_to_sheet([ columns, ...rows ]);
            XLSX.utils.book_append_sheet(newWorkbook, worksheet, schema.name);
        }
    }
    saveExcel(newWorkbook, collectionName || databaseName as string);
};

const exportDataToJson = (instance: Realm, collectionName: string, rows: Realm.Results<Realm.Object>) => {
    const path = dialog.showSaveDialogSync({ defaultPath: `${collectionName}.json` });

    if (path) {
        fs.writeFileSync(path, JSON.stringify(rows));
        showMessage('success', 'Saved successfully.');
    }
};

const exportDataToRealm = (instance: Realm, collectionName: string, rows: Realm.Results<Realm.Object>) => {
    const schema = DB.getCollectionSchema(instance, collectionName);
    const path = dialog.showSaveDialogSync({ defaultPath: `${collectionName}.realm` });
    if (path) {
        // remove old realm file if exists
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        const newDatabase = new Realm({ schema: [ schema ], path });
        DB.writeDataOnInstance(newDatabase, collectionName, rows);
        newDatabase.close();
        showMessage('success', 'Saved successfully.');
    }
};

const exportDatabase = (instance: Realm, databaseName: string) => {
    const path = dialog.showSaveDialogSync({ defaultPath: databaseName });
    if (path) {
        fs.copyFileSync(instance.path, path);
        showMessage('success', 'Saved successfully.');
    }
};

export const exportDataToXlsx = (columns: PropertiesTypes, rawData: Realm.Results<Realm.Object>, fileName: string) => {
    const rows = rawData.map(row => {
        return Object.entries(columns).map(([ name ]) => {
            return row[name as keyof Realm.Object];
        });
    });

    const data = [
        Object.keys(columns),
        ...rows
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, fileName);

    saveExcel(newWorkbook, fileName);
};

export const exportCollection = (databaseName: string, collectionName: string, exportType: string, rows?: Realm.Results<Realm.Object>): void => {
    const RealmInstance = DB.getInstance().getTemporaryInstance(databaseName);
    rows = rows || DB.getCollectionData(RealmInstance, collectionName);
    switch (exportType) {
        case 'XLSX':
            exportDataToXlsx(
                DB.getCollectionColumns(RealmInstance, collectionName),
                rows,
                collectionName
            );
            break;
        case 'JSON':
            exportDataToJson(RealmInstance, collectionName, rows);
            break;
        case 'Realm':
            exportDataToRealm(RealmInstance, collectionName, rows);
            break;
    }
};

export const exportSchema = (databaseName: string, collectionName: string, exportType: string): void => {
    const RealmInstance = DB.getInstance().getTemporaryInstance(databaseName);
    switch (exportType) {
        case 'XLSX':
            exportSchemaToExcel(RealmInstance, collectionName, databaseName);
            break;
        case 'JSON':
            exportSchemaToJson(RealmInstance, collectionName, databaseName);
            break;
        case 'Realm Schema':
            exportSchemaToRealm(RealmInstance, collectionName, databaseName);
            break;
        case 'Realm':
            exportDatabase(RealmInstance, databaseName);
            break;
        default:
            exportSchemaToClass(exportType as Language, RealmInstance, collectionName, databaseName);
            break;
    }
};
