import Results from './Results';

class ObjectResults extends Results {
    public getData(): Realm.Object[] {
        return this.data ? [ this.data as unknown as Realm.Object ] : [];
    }

    public getCount(): number {
        return this.data ? 1 : 0;
    }

    /* public updateRow(updates) {
        for (const field in [ ...updates ]) {
            this.data[field] = updates[field];
        }
    } */

    public addRelationRow(data: Realm.Object[]): void {
        this.data = data[0];
        this.workingRow[this.workingField] = data[0];
        // (this.parent.data as Realm.Results<any>)[this.rowIndex as number][this.workingField] = data[0];
    }

    public deleteRelationRow(): void {
        this.workingRow[this.workingField] = null;
        this.data = null;
    }
}

export default ObjectResults;
