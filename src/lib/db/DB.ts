import Realm, { ObjectSchema, ObjectSchemaProperty, PropertiesTypes } from 'realm';
import fs from 'fs';
import { DATA_PATH } from 'src/utils/constants';
import {
    DataRowsType, DataTableModeType,
    DBResultsType,
    OrderType,
    ResultsColumnsType,
    ResultsType,
    RowsPerPgeType
} from 'src/types/dbTypes';
import PrimitiveListResults from './PrimitiveListResults';
import ListResults from './ListResults';
import ObjectResults from './ObjectResults';
import { ObjectType, RenamedColumnsType } from 'src/types/genericTypes';
import { isDataTypePrimitive } from 'src/utils/dbUtils';

interface MigrationCallbackType {
    method: (oldRealm: Realm, newRealm: Realm, ...args: any[]) => void;
    args: any[];
}

class DB {
    private static instance: DB;
    private realmInstance: Realm;
    private results: ResultsType;
    private databaseName = '';

    constructor() {
        DB.instance = this;
    }

    static getInstance(): DB {
        if (DB.instance === undefined) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    public open = (databaseName: string, schema: ObjectSchema[] | undefined = undefined, version: number | undefined = undefined, migrationCallbacks: MigrationCallbackType[] = []): void => {
        this.close();
        this.realmInstance = new Realm({
            path: `${DATA_PATH}/${databaseName}`,
            schema,
            schemaVersion: version,
            migration: (oldRealm, newRealm) => {
                for (const callback of migrationCallbacks) {
                    callback.method(oldRealm, newRealm, ...callback.args);
                }
            }
        });
        this.databaseName = databaseName;
    };

    public init = (dataType: DBResultsType, collectionName: string, dataSet: Realm.Results<any> | null = null, forward = false, mode: DataTableModeType = 'create', primitiveType: Realm.PropertyType | undefined = undefined, fieldName = ''): void => {
        const parent = forward ? this.results : undefined;
        let columns = {};
        if (dataType === 'primitive') {
            this.results = new PrimitiveListResults(parent as ListResults, this.databaseName, collectionName, dataSet, fieldName, mode);
            columns = {
                [collectionName]: {
                    type: primitiveType
                }
            };
        } else if (dataType === 'list') {
            if (!dataSet && collectionName) {
                dataSet = this.realmInstance.objects(collectionName);
            }
            this.results = new ListResults(parent as ListResults, this.databaseName, collectionName, dataSet, fieldName, mode);
            columns = this.getResultsColumns(collectionName);
        } else if (dataType === 'object') {
            this.results = new ObjectResults(parent as ListResults, this.databaseName, collectionName, dataSet, fieldName, mode);
            columns = this.getResultsColumns(collectionName);
        }
        this.results.setColumns(columns);
    };

    public setWorkingRow = (row: ObjectType, field: string): void => {
        this.results.setWorkingRow(row, field);
    };

    public getData = (collectionName: string, filter = '', page = 0, rowsPerPage: RowsPerPgeType, orderBy?: string, order?: OrderType): DataRowsType => {
        this.results.setParams(filter, order, orderBy, rowsPerPage, page);
        return this.results.getData();
    };

    public getResultsCount = (): number => {
        return this.results.getCount();
    };

    private getResultsColumns = (collectionName: string): Realm.PropertiesTypes => {
        const schema = this.realmInstance.schema.find(schema => schema.name === collectionName);
        return schema ? schema.properties : {};
    };

    public getColumns = (): ResultsColumnsType => {
        return this.results.columns;
    };

    public getCollections = (databaseName: string): string[] => {
        /* const realmInstance = new Realm({
            path: `${dataPath}/${databaseName}`
        }); */

        const schema = this.realmInstance.schema.map(({ name }) => name);

        // realmInstance.close();
        return schema;
    };

    public getDatabaseSchema = (databaseName: string): Realm.ObjectSchema[] => {
        const realmInstance = new Realm({
            path: `${DATA_PATH}/${databaseName}`
        });

        const schema = realmInstance.schema;

        if (databaseName !== this.databaseName) {
            realmInstance.close();
        }

        return schema;
    }

    public getPrimaryKey = (collectionName: string): string | undefined => {
        const row = this.realmInstance.schema.find(schema => schema.name === collectionName) as ObjectSchema;
        return row ? row.primaryKey : undefined;
    };

    public createRow = (data: ObjectType): void => {
        this.realmInstance.write(() => {
            if (this.results instanceof PrimitiveListResults) {
                this.results.createRow(data);
            } else {
                this.realmInstance.create(this.results.collectionName, data);
            }
        });
    };

    public updateRow = (updates: ObjectType, data: ObjectType, index: number): void => {
        this.realmInstance.write(() => {
            (this.results as ListResults).updateRow(updates, data, index);
        });
    };

    public deleteRows = (rows: number[], isRelation = false): void => {
        this.realmInstance.write(() => {
            if (isRelation) {
                (this.results as ListResults).deleteRelationRow(rows);
            } else {
                (this.results as ListResults).deleteRow(rows, this.realmInstance);
            }
        });
    };

    addRelationRow = (rows: ObjectType[]): void => {
        this.realmInstance.write(() => {
            this.results.parent.addRelationRow(rows);
        });
    };

    popRelationHistory = (count: number): { filter: string; columns: ResultsColumnsType; orderBy: string | undefined; page: number; rowsPerPage: RowsPerPgeType; order: OrderType | undefined, mode: DataTableModeType } => {
        for (let i = 0; i < count; i++) {
            this.results = this.results.parent;
        }

        return {
            order: this.results.order,
            orderBy: this.results.orderBy,
            rowsPerPage: this.results.rowsPerPage,
            page: this.results.page,
            columns: this.results.columns,
            filter: this.results.filter,
            mode: this.results.mode
        };
    }

    getCollectionFields = (collectionName: string, primitives: boolean): string[] => {
        let fields: string[] = [];
        this.realmInstance.schema.map(schema => {
            if (schema.name === collectionName) {
                fields = Object.entries(schema.properties)
                    .filter(([ , property ]) => primitives ? isDataTypePrimitive((property as Realm.ObjectSchemaProperty).type) : true)
                    .map(([ field ]) => field);
            }
        });
        return fields;
    }

    getFieldType = (collectionName: string, fieldName: string): string => {
        let type = '';
        this.realmInstance.schema.map(schema => {
            if (schema.name === collectionName) {
                type = (schema.properties[fieldName] as ObjectSchemaProperty).type;
            }
        });
        return type;
    }

    private renameMigrationCallback(oldRealm: Realm, newRealm: Realm): void {
        const oldObjectNames = oldRealm.schema.map(schema => schema.name);
        const newObjectNames = newRealm.schema.map(schema => schema.name);
        let oldObjectName;
        let newObjectName: string;
        oldObjectNames.forEach(name => {
            if (!newObjectNames.includes(name)) {
                oldObjectName = name;
            }
        });

        if (oldObjectName) {
            newObjectNames.forEach(name => {
                if (!oldObjectNames.includes(name)) {
                    newObjectName = name;
                }
            });

            // TODO if a collection that is used in an object field is renamed, this won't work!
            oldRealm.objects(oldObjectName).forEach(obj => {
                newRealm.create(newObjectName, obj);
            });
            newRealm.deleteModel(oldObjectName);
        }
    }

    private renameColumnMigrationCallback(oldRealm: Realm, newRealm: Realm, oldCollectionName: string, newCollectionName: string, columnMapping: RenamedColumnsType): void {
        const newCollectionData: Realm.Results<any> = newRealm.objects(newCollectionName);
        const oldCollectionData: Realm.Results<any> = oldRealm.objects(oldCollectionName);
        newCollectionData.forEach((obj, index) => {
            for (const mapping of columnMapping) {
                if (mapping.old !== mapping.current) {
                    const value = oldCollectionData[index][mapping.old as keyof Realm.Object];
                    if (value !== undefined) {
                        obj[mapping.current as keyof Realm.Object] = value;
                    }
                }
            }
        });
    }

    public updateSchema = (databaseName: string, collectionName: string, newCollectionName: string, schema: Realm.ObjectSchema[], renamedColumns: RenamedColumnsType = []): void => {
        const version = Math.max(0, Realm.schemaVersion(`${DATA_PATH}/${databaseName}`)) + 1; // at start version is -1 and causes some problems
        if (databaseName === this.databaseName) {
            this.close();
        }

        const migrationCallbacks = [];
        if (collectionName !== newCollectionName) {
            migrationCallbacks.push({ method: this.renameMigrationCallback, args: [] });
        }
        if (renamedColumns.length > 0) {
            migrationCallbacks.push({ method: this.renameColumnMigrationCallback, args: [ collectionName, newCollectionName, renamedColumns ] });
        }

        this.open(
            databaseName,
            schema,
            version,
            migrationCallbacks
        );
        // this.close();
    }

    public deleteCollection = (databaseName: string, collectionName: string): void => {
        if (this.realmInstance === undefined) {
            this.open(databaseName);
        }

        this.realmInstance.write(() => {
            this.realmInstance.deleteModel(collectionName);
        });
    }

    public createDatabase = (databaseName: string, schema: ObjectSchema[] | undefined = undefined, path?: string): void => {
        const newDatabase = new Realm({
            path: path || `${DATA_PATH}/${databaseName}`,
            schema
        });
        newDatabase.close();
    }

    public deleteDatabase = (databaseName: string): void => {
        if (databaseName === this.databaseName) {
            this.close();
        }
        fs.unlinkSync(`${DATA_PATH}/${databaseName}`);
    }

    getTemporaryInstance = (databaseName: string): Realm => {
        let realmInstance;
        if (this.realmInstance && this.realmInstance.path === `${DATA_PATH}/${databaseName}`) {
            realmInstance = this.realmInstance;
        } else {
            realmInstance = new Realm({
                path: `${DATA_PATH}/${databaseName}`
            });
        }
        return realmInstance;
    }

    static getCollectionColumns = (instance: Realm, collectionName: string): PropertiesTypes => {
        return (instance.schema.find(schema => schema.name === collectionName) as ObjectSchema).properties;
    }

    static getCollectionSchema = (instance: Realm, collectionName: string): ObjectSchema => {
        return instance.schema.find(schema => schema.name === collectionName) as ObjectSchema;
    }

    static getCollectionData = (instance: Realm, collectionName: string): Realm.Results<Realm.Object> => {
        return instance.objects(collectionName);
    }

    static writeDataOnInstance = (instance: Realm, collectionName: string, data: Realm.Results<Realm.Object>): void => {
        instance.write(() => {
            for (const row of data) {
                instance.create(collectionName, row);
            }
        });
    }

    public close = (): void => {
        if (this.realmInstance) {
            this.realmInstance.close();
        }
    }
}

export default DB;
