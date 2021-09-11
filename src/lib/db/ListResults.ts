import Results from './Results';
import { ObjectType } from 'src/types/genericTypes';

class ListResults extends Results {
    public getData(): Realm.Results<Realm.Object> {
        if (this.order && this.orderBy) {
            this.sorted();
        }
        const filteredData = this.getFilteredData();
        return super.getPageData(filteredData as unknown as any[]) as Realm.Results<Realm.Object>;
    }

    private getFilteredData() {
        if (this.data && this.filter) {
            return (this.data as Realm.Results<Realm.Object>).filtered(this.filter);
        } else {
            return this.data;
        }
    }

    private sorted() {
        this.data = (this.data as Realm.Results<Realm.Object>).sorted(this.orderBy as string, this.order === 'desc');
    }

    public getCount(): number {
        return this.data ? (this.data as Realm.Results<Realm.Object>).length : 0;
    }

    public addRelationRow(rows: ObjectType[]): void {
        rows.map(row => {
            (this.data as Realm.List<any>).push(row);
        });
    }

    public deleteRow(rows: number[], realmInstance: Realm): void {
        rows = rows.sort((a, b) => b - a);
        const data = this.getFilteredData() as Realm.List<any>;
        const startIndex = this.page * this.rowsPerPage;
        for (const row of rows) {
            realmInstance.delete(data[startIndex + row]);
        }
    }

    public deleteRelationRow(rows: number[]): void {
        rows = rows.sort((a, b) => b - a);
        const data = this.getFilteredData() as Realm.List<any>;
        const startIndex = this.page * this.rowsPerPage;
        for (const row of rows) {
            data.splice(startIndex + row, 1);
        }
    }
}

export default ListResults;
