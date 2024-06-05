import { UserTable } from './tableRender.js';
import { CarTable } from './tableRender.js';

export class TableFactory {
    static createTable(type) {
        switch (type) {
            case 'users':
                return new UserTable();
            case 'cars':
                return new CarTable();
            default:
                throw new Error('Unknown table type');
        }
    }
}
