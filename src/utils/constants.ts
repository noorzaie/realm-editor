import * as electron from 'electron';
import { DataExportTypes, SchemaExportTypes } from 'src/types/genericTypes';

export const DATA_PATH: string = (electron.app || electron.remote.app).getPath('userData') + '/data';

export const DRAWER_WIDTH = 250;

export const REALM_PRIMITIVE_TYPES = [ 'bool', 'int', 'decimal128', 'objectId', 'uuid', 'mixed', 'double', 'float', 'string', 'date', 'data' ];

export const SORTABLE_TYPES = [ 'bool', 'int', 'decimal128', 'float', 'double', 'objectId', 'uuid', 'mixed', 'string', 'date' ];

export const LANGUAGE_PREFIXES = { 'C#': 'cs', Java: 'java', Kotlin: 'kt', JavaScript: 'js', Swift: 'swift', TypeScript: 'ts' };

export const PAGINATION_OPTIONS = [ 10, 15, 25 ];

export const REALM_PROPERTY_TYPES: Realm.PropertyType[] = [ 'bool', 'int', 'float', 'decimal128', 'uuid', 'mixed', 'double', 'objectId', 'string', 'data', 'date', 'list', 'linkingObjects' ];

export const DATA_EXPORT_TYPES: DataExportTypes[] = [ 'JSON', 'XLSX', 'Realm' ];

export const SCHEMA_EXPORT_TYPES: SchemaExportTypes[] = [ 'JSON', 'Realm Schema', 'Realm', 'Java', 'Kotlin', 'JavaScript', 'Swift', 'TypeScript', 'XLSX' ];
