import Results from './Results';
import { DataTypes } from 'src/types/dbTypes';
import Realm from 'realm';
import { ObjectType } from 'src/types/genericTypes';

class PrimitiveListResults extends Results {
    public getData(): Realm.List<DataTypes> {
        if (this.order && this.orderBy) {
            this.sorted();
        }
        const filteredData = this.getFilteredData();
        const data = super.getPageData(filteredData as unknown as any[]) as unknown as Realm.List<DataTypes>;

        return data.map(x => ({ [this.workingField]: x })) as unknown as Realm.List<DataTypes>;
    }

    private getFilteredData(): Realm.List<DataTypes> {
        if (this.data && this.filter) {
            return (this.data as Realm.List<DataTypes>).filtered(this.filter) as unknown as Realm.List<DataTypes>;
        } else {
            return this.data as Realm.List<DataTypes>;
        }
    }

    private sorted() {
        this.data = (this.data as Realm.List<DataTypes>).sorted(this.order === 'asc') as unknown as Realm.List<DataTypes>;
    }

    public getCount(): number {
        return this.data ? (this.data as Realm.List<any>).length : 0;
    }

    public updateRow(updates: ObjectType, _data: ObjectType, index: number): void {
        const data = this.getFilteredData();
        const startIndex = this.page * this.rowsPerPage;
        data[startIndex + index] = updates[Object.keys(this.columns)[0]];
    }

    public createRow(data: {[x: string]: DataTypes}): void {
        if (!this.data) {
            this.data = [] as unknown as Realm.List<DataTypes>;
        }
        (this.data as Realm.List<DataTypes>).push(data[this.workingField]);
    }

    public deleteRow(rows: number[]): void {
        rows = rows.sort((a, b) => b - a);
        const data = this.getFilteredData();
        const startIndex = this.page * this.rowsPerPage;
        for (const row of rows) {
            data.splice(startIndex + row, 1);
        }
    }
}

export default PrimitiveListResults;
